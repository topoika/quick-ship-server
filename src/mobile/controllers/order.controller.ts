import db from "../../db/models";
import Logger from "../../logger";
import { validateUser } from "../middlewares/auth.middleware";
import catchAsync from "../utils/catchAsync";
import {
  packageRelatedModels,
  tripRelatedModels,
  walletAtr,
} from "./data.attributes";
import { initiateSTKPush } from "./mpesa.controller";

/**
 * @route POST /orders/create
 * @description endpoint to create order, create payment and send stk push
 */
const createOrder = catchAsync(async (req: any, res) => {
  const user = await validateUser(req.user.id);
  const { requestId, phone } = req.body;
  const transaction = await db.sequelize.transaction();
  const request = await db.requests.findOne({
    where: { id: requestId },
  });

  if (!request) {
    return res.status(404).json({
      status: 404,
      success: false,
      message: "Request not found",
      error: "Request not found",
    });
  }
  try {
    const data = await initiateSTKPush(phone, 1);
    let payment = await db.payments.create(
      {
        postManId: request.userId,
        shipperId: user.id,
        referenceNumber: data.CheckoutRequestID,
        amount: request.postageFee,
        mpesaNumber: phone,
        status: "pending",
      },
      { transaction }
    );
    const order = await db.orders.create(
      {
        postManId: request.userId,
        shipperId: user.id,
        paymentId: payment.id,
        tripId: request.tripId,
        requestId: request.id,
        packageId: request.packageId,
        status: "pending",
      },
      { transaction }
    );
    await db.notifications.create(
      {
        userId: request.userId,
        title: "New Order",
        body: `You have a new order for your trip`,
        type: "order",
        senderId: user.id,
        itemId: order.id,
      },
      { transaction }
    );
    await transaction.commit();
    res.status(201).json({
      status: 201,
      success: true,
      message: "Order created successfully",
      data: order,
    });
  } catch (error: any) {
    Logger.error(error.message);
    await transaction.rollback();
    return res.status(400).json({
      status: 400,
      success: false,
      message: "Error creating order",
      error: error.message,
    });
  }
});
/**
 * @route POST /orders/retry-payment
 * @description endpoint to retry payment for order
 */
const retryPayment = catchAsync(async (req: any, res) => {
  const user = await validateUser(req.user.id);
  const { orderId, phone } = req.body;
  const transaction = await db.sequelize.transaction();
  const order = await db.orders.findOne({
    where: { id: orderId },
  });

  if (!order) {
    return res.status(404).json({
      status: 404,
      success: false,
      message: "Order not found",
      error: "Order not found",
    });
  }
  const oldPayment = await db.payments.findOne({
    where: { id: order.paymentId },
  });
  try {
    const data = await initiateSTKPush(phone, 1);
    let payment = await db.payments.create(
      {
        postManId: order.postManId,
        shipperId: user.id,
        referenceNumber: data.CheckoutRequestID,
        amount: oldPayment.amount,
        mpesaNumber: phone,
        status: "pending",
      },
      { transaction }
    );
    order.paymentId = payment.id;
    oldPayment.destroy({ transaction });
    await order.save({ transaction });
    await transaction.commit();
    res.status(201).json({
      status: 201,
      success: true,
      message: "Payment created successfully",
      data: payment,
    });
  } catch (error: any) {
    Logger.error(error.message);
    await transaction.rollback();
    return res.status(400).json({
      status: 400,
      success: false,
      message: "Error creating payment",
      error: error.message,
    });
  }
});

/**
 * @route GET /orders/get-my-orders
 * @description endpoint get user orders
 */
const getMyOrders = catchAsync(async (req: any, res) => {
  const user = await validateUser(req.user.id);
  const orders = await db.orders.findAll({
    where: { postManId: user.id },
    include: [
      {
        model: db.packages,
        as: "package",
        include: packageRelatedModels,
      },
      {
        model: db.reviews,
        as: "review",
      },
      {
        model: db.payments,
        as: "payment",
      },
    ],
  });
  res.status(200).json({
    status: 200,
    success: true,
    message: "Orders fetched successfully",
    data: orders,
  });
});
/**
 * @route GET /orders/get-shipments
 * @description endpoint get user shipments
 */
const getShipments = catchAsync(async (req: any, res) => {
  const user = await validateUser(req.user.id);
  const orders = await db.orders.findAll({
    where: { shipperId: user.id },
    include: [
      {
        model: db.trips,
        as: "trip",
        include: tripRelatedModels,
      },
      {
        model: db.reviews,
        as: "review",
      },
      {
        model: db.payments,
        as: "payment",
      },
    ],
  });
  res.status(200).json({
    status: 200,
    success: true,
    message: "Shipments fetched successfully",
    data: orders,
  });
});

/**
 * @route PUT /orders/cancel-order
 * @description endpoint to cancel order
 */
const cancelOrder = catchAsync(async (req: any, res) => {
  const user = await validateUser(req.user.id);
  const id = req.query.id;
  const order = await db.orders.findByPk(id);
  if (!order) {
    return res.status(404).json({
      status: 404,
      success: false,
      message: "Order not found",
      error: "Order not found",
    });
  }
  if (
    order.status == "collected" ||
    order.status == "started" ||
    order.status == "completed"
  ) {
    return res.status(400).json({
      status: 400,
      success: false,
      message: "Order cannot be cancelled",
      error: "Order cannot be cancelled",
    });
  }

  order.status = "cancelled";
  await order.save();
  res.status(200).json({
    status: 200,
    success: true,
    message: "Order cancelled successfully",
  });
});

/**
 * @route PUT /orders/update-status
 * @description endpoint to cancel order
 */
const updateOrderStatus = catchAsync(async (req: any, res) => {
  const user = await validateUser(req.user.id);
  const { id, status } = req.body;
  const walletId = user.walletId;
  const order = await db.orders.findByPk(id);
  if (!order) {
    return res.status(404).json({
      status: 404,
      success: false,
      message: "Order not found",
      error: "Order not found",
    });
  }
  if (order.status == "cancelled") {
    return res.status(400).json({
      status: 400,
      success: false,
      message: "Order already cancelled",
      error: "Order already cancelled",
    });
  }
  if (order.status == "completed") {
    return res.status(400).json({
      status: 400,
      success: false,
      message: "Order already completed",
      error: "Order already completed",
    });
  }

  if (status === "started") {
    const wallet = await db.wallets.findOne({
      where: { id: walletId },
      attributes: walletAtr,
    });
    wallet.activeOrders += 1;
    await wallet.save();
  }

  if (status === "completed") {
    const payment = await db.payments.findOne({
      where: { id: order.paymentId },
    });
    const wallet = await db.wallets.findOne({
      where: { id: walletId },
      attributes: walletAtr,
    });
    await db.transactions.create({
      paymentId: payment.id,
      paidAmount: payment.amount,
      commissionAmount: payment.amount * 0.1,
      netAmount: payment.amount * 0.9,
      mpesaReceiptNumber: payment.mpesaReceiptNumber,
      paymentDate: new Date(),
    });
    wallet.completedOrders += 1;
    wallet.activeOrders -= 1;
    await wallet.save();
  }

  order.status = status;
  await order.save();
  res.status(200).json({
    status: 200,
    success: true,
    message: "Order status updated successfully",
  });
});
/**
 * @route POST /orders/add-review
 * @description endpoint to add a review to an order
 */
const addReview = catchAsync(async (req: any, res) => {
  const user = await validateUser(req.user.id);
  const { orderId, rating } = req.body;
  const order = await db.orders.findByPk(orderId);
  if (!order) {
    return res.status(404).json({
      status: 404,
      success: false,
      message: "Order not found",
      error: "Order not found",
    });
  }
  if (order.status !== "completed") {
    return res.status(400).json({
      status: 400,
      success: false,
      message: "Order not completed",
      error: "Order not completed",
    });
  }
  if (order.reviewId) {
    return res.status(400).json({
      status: 400,
      success: false,
      message: "Review already added",
      error: "Review already added",
    });
  }
  const reviewData = await db.reviews.create({
    userId: order.postManId,
    orderId: order.id,
    rating,
    review: "Coming Soon...",
  });
  order.reviewId = reviewData.id;
  await order.save();
  res.status(201).json({
    status: 201,
    success: true,
    message: "Review added successfully",
    data: reviewData,
  });
});

export {
  createOrder,
  retryPayment,
  getMyOrders,
  getShipments,
  cancelOrder,
  updateOrderStatus,
  addReview,
};
