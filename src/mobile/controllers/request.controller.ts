import db from "../../db/models";
import Logger from "../../logger";
import { validateUser } from "../middlewares/auth.middleware";
import catchAsync from "../utils/catchAsync";
import { packageRelatedModels, tripRelatedModels } from "./data.attributes";
/**
 * @route POST /request/create
 */
const createRequest = catchAsync(async (req: any, res) => {
  const user = await validateUser(req.user.id);
  const transaction = await db.sequelize.transaction();
  const { packageId, tripId } = req.body;

  const trip = await db.trips.findOne({
    where: { id: tripId },
  });

  if (!trip) {
    return res.status(404).json({
      status: 404,
      success: false,
      message: "Trip not found",
      error: "Trip not found",
    });
  }

  try {
    const request = await db.requests.create(
      {
        packageId,
        tripId,
        userId: trip.postManId,
        postageFee: trip.postageFee,
      },
      { transaction }
    );
    await db.notifications.create(
      {
        userId: trip.postManId,
        title: "New Request",
        body: `You have a new request for your package to ${trip.destination}`,
        type: "request",
        senderId: user.id,
        itemId: request.id,
      },
      { transaction }
    );
    await transaction.commit();
    res.status(201).json({
      status: 201,
      success: true,
      message: "Request created successfully",
      data: request,
    });
  } catch (error: any) {
    Logger.error(error.message);
    await transaction.rollback();
    return res.status(400).json({
      status: 400,
      success: false,
      message: "Error creating request",
      error: error.message,
    });
  }
});

/**
 * @route PUT /request/accept?id=
 */
const acceptRequest = catchAsync(async (req: any, res) => {
  const requestId = req.query.id;
  const user = await validateUser(req.user.id);
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

  if (request.userId !== user.id) {
    return res.status(403).json({
      status: 403,
      success: false,
      message: "You are not authorized to accept this request",
      error: "You are not authorized to accept this request",
    });
  }
  try {
    await db.requests.update(
      { status: "accepted" },
      { where: { id: requestId }, transaction }
    );
    await transaction.commit();
    res.status(200).json({
      status: 200,
      success: true,
      message: "Request accepted successfully",
    });
  } catch (error: any) {
    Logger.error(error.message);
    await transaction.rollback();
    return res.status(400).json({
      status: 400,
      success: false,
      message: "Error accepting request",
      error: error.message,
    });
  }
});

/**
 * @route PUT /request/reject?id=
 */
const rejectRequest = catchAsync(async (req: any, res) => {
  const requestId = req.query.id;
  const user = await validateUser(req.user.id);
  const transaction = await db.sequelize.transaction();
  const request = await db.requests.findOne({
    where: { id: requestId },
  });
  console.log(request);

  if (!request) {
    return res.status(404).json({
      status: 404,
      success: false,
      message: "Request not found",
      error: "Request not found",
    });
  }

  if (request.userId !== user.id) {
    return res.status(403).json({
      status: 403,
      success: false,
      message: "You are not authorized to decline this request",
      error: "You are not authorized to decline this request",
    });
  }
  try {
    await db.requests.update(
      { status: "rejected" },
      { where: { id: requestId }, transaction }
    );
    await transaction.commit();
    res.status(200).json({
      status: 200,
      success: true,
      message: "Request declined successfully",
    });
  } catch (error: any) {
    Logger.error(error.message);
    await transaction.rollback();
    return res.status(400).json({
      status: 400,
      success: false,
      message: "Error declining request",
      error: error.message,
    });
  }
});

/**
 * @route DELETE /request/delete?id=
 */
const deleteRequest = catchAsync(async (req: any, res) => {
  const requestId = req.query.id;
  const user = await validateUser(req.user.id);
  const transaction = await db.sequelize.transaction();
  const deleteRequest = await db.requests.findOne({
    where: { id: requestId },
  });
  if (!deleteRequest) {
    return res.status(404).json({
      status: 404,
      success: false,
      message: "Request not found",
      error: "Request not found",
    });
  }

  if (deleteRequest.userId !== user.id) {
    return res.status(403).json({
      status: 403,
      success: false,
      message: "You are not authorized to delete this request",
      error: "You are not authorized to delete this request",
    });
  }

  try {
    await db.requests.destroy({
      where: { id: requestId },
      transaction,
    });

    await transaction.commit();
    res.status(200).json({
      status: 200,
      success: true,
      message: "Request deleted successfully",
    });
  } catch (error: any) {
    Logger.error(error.message);
    await transaction.rollback();
    return res.status(400).json({
      status: 400,
      success: false,
      message: "Error deleting request",
      error: error.message,
    });
  }
});
/**
 * @route GET /request/package-requests?id=
 */
const getMyRequests = catchAsync(async (req: any, res) => {
  const packageId = req.query.id;
  const requests = await db.requests.findAll({
    where: { packageId },
    include: [
      {
        model: db.packages,
        as: "package",
        include: packageRelatedModels,
      },
      {
        model: db.trips,
        as: "trip",
        include: tripRelatedModels,
      },
    ],
    order: [["createdAt", "DESC"]],
  });
  res.status(200).json({
    status: 200,
    success: true,
    message: "Requests retrieved successfully",
    data: requests,
  });
});

/**
 * @route GET /request/details?id=
 */
const getRequestDetails = catchAsync(async (req: any, res) => {
  const requestId = req.query.id;
  const request = await db.requests.findOne({
    where: { id: requestId },
    include: [
      {
        model: db.packages,
        as: "package",
        include: packageRelatedModels,
      },
      {
        model: db.trips,
        as: "trip",
        include: tripRelatedModels,
      },
    ],
  });
  if (!request) {
    return res.status(404).json({
      status: 404,
      success: false,
      message: "Request not found",
      error: "Request not found",
    });
  }
  res.status(200).json({
    status: 200,
    success: true,
    message: "Request retrieved successfully",
    data: request,
  });
});

export {
  deleteRequest,
  createRequest,
  acceptRequest,
  rejectRequest,
  getMyRequests,
  getRequestDetails,
};
