import { Op } from "sequelize";
import db from "../../db/models";
import Logger from "../../logger";
import { validateUser } from "../middlewares/auth.middleware";
import catchAsync from "../utils/catchAsync";
import { Coordinate, getCoordinateRange } from "./data.attributes";

/**
 * @route POST /trips/create
 */
const createTrip = catchAsync(async (req: any, res) => {
  const user = await validateUser(req.user.id);
  const transaction = await db.sequelize.transaction();
  try {
    let body = req.body;
    const departureAddress = await db.addresses.create(body.departureAddress, {
      transaction,
    });
    const destinationAddress = await db.addresses.create(
      body.destinationAddress,
      {
        transaction,
      }
    );
    let tripJson = {
      ...body,
      departureAddressId: departureAddress.id,
      destinationAddressId: destinationAddress.id,
      postManId: user.id,
    };

    const trip = await db.trips.create(tripJson, {
      transaction,
    });
    await transaction.commit();
    return res.status(201).json({
      status: 201,
      success: true,
      message: "Trip created successfully",
      data: trip,
    });
  } catch (error: any) {
    await transaction.rollback();
    return res.status(500).json({
      status: 500,
      success: false,
      message: error.message,
      error: error.message,
    });
  }
});

/**
 * @route PUT /trips/edit
 */
const editTrip = catchAsync(async (req: any, res) => {
  const tripId = req.query.id;
  const user = await validateUser(req.user.id);
  const transaction = await db.sequelize.transaction();
  const editTrip = await db.trips.findOne({
    where: { id: tripId },
  });
  if (!editTrip) {
    return res.status(404).json({
      status: 404,
      success: false,
      message: "Trip not found",
      error: "Trip not found",
    });
  }

  if (editTrip.postManId !== user.id) {
    return res.status(403).json({
      status: 403,
      success: false,
      message: "You are not authorized to edit this trip",
      error: "You are not authorized to edit this trip",
    });
  }
  try {
    let body = req.body;
    await db.addresses.update(body.departureAddress, {
      where: { id: editTrip.departureAddressId },
      transaction,
    });
    await db.addresses.update(body.destinationAddress, {
      where: { id: editTrip.destinationAddressId },
      transaction,
    });
    await db.trips.update(body, {
      where: { id: tripId },
      transaction,
    });
    await transaction.commit();
    return res.status(200).json({
      status: 200,
      success: true,
      message: "Trip updated successfully",
    });
  } catch (error: any) {
    await transaction.rollback();
    return res.status(500).json({
      status: 500,
      success: false,
      message: error.message,
      error: error.message,
    });
  }
});

/**
 * @route DELETE /trips/delete
 */
const deleteTrip = catchAsync(async (req: any, res) => {
  const tripId = req.query.id;
  const user = await validateUser(req.user.id);
  const transaction = await db.sequelize.transaction();
  const deleteTrip = await db.trips.findOne({
    where: { id: tripId },
  });
  if (!deleteTrip) {
    return res.status(404).json({
      status: 404,
      success: false,
      message: "Trip not found",
      error: "Trip not found",
    });
  }

  if (deleteTrip.postManId !== user.id) {
    return res.status(403).json({
      status: 403,
      success: false,
      message: "You are not authorized to delete this trip",
      error: "You are not authorized to delete this trip",
    });
  }

  try {
    await db.trips.destroy({
      where: { id: tripId },
      transaction,
    });
    await db.addresses.destroy({
      where: { id: deleteTrip.departureAddressId },
      transaction,
    });
    await db.addresses.destroy({
      where: { id: deleteTrip.destinationAddressId },
      transaction,
    });
    await transaction.commit();
    return res.status(200).json({
      status: 200,
      success: true,
      message: "Trip deleted successfully",
    });
  } catch (error: any) {
    await transaction.rollback();
    return res.status(500).json({
      status: 500,
      success: false,
      message: error.message,
      error: error.message,
    });
  }
});
/**
 * @route GET /trips/my-trips
 */
const getMyTrips = catchAsync(async (req: any, res) => {
  const user = await validateUser(req.user.id);
  try {
    const trips = await db.trips.findAll({
      where: { postManId: user.id },
      include: [
        { model: db.addresses, as: "departure" },
        { model: db.addresses, as: "destination" },
        {
          model: db.users,
          as: "postman",
        },
      ],
    });
    return res.status(200).json({
      status: 200,
      success: true,
      data: trips,
    });
  } catch (error: any) {
    Logger.error(error.message);

    return res.status(500).json({
      status: 500,
      success: false,
      message: error.message,
      error: error.message,
    });
  }
});

/**
 * @route GET /trips/details
 * @description Get trip details
 */
const getTripDetails = catchAsync(async (req: any, res) => {
  const tripId = req.query.id;
  try {
    const trip = await db.trips.findOne({
      where: { id: tripId },
      include: [
        { model: db.addresses, as: "departure" },
        { model: db.addresses, as: "destination" },
        {
          model: db.users,
          as: "postman",
          attributes: {
            include: [
              [
                db.Sequelize.fn(
                  "COUNT",
                  db.Sequelize.col("postman.reviews.id")
                ),
                "reviewCount",
              ],
              [
                db.Sequelize.fn(
                  "AVG",
                  db.Sequelize.col("postman.reviews.rating")
                ),
                "averageRating",
              ],
            ],
          },
          include: [
            {
              model: db.reviews,
              as: "reviews",
              attributes: [],
              required: false,
            },
          ],
        },
      ],
      group: ["postman.id"],
    });
    if (!trip) {
      return res.status(404).json({
        status: 404,
        success: false,
        message: "Trip not found",
        error: "Trip not found",
      });
    }
    return res.status(200).json({
      status: 200,
      success: true,
      data: trip,
    });
  } catch (error: any) {
    Logger.error(error.message);
    return res.status(500).json({
      status: 500,
      success: false,
      message: error.message,
      error: error.message,
    });
  }
});

/**
 * @route POST /trips/route-trips
 * @description Get trip that goes through a particular route using coordinates of addresses and a radius of env.RANGE
 */
const getRouteTrips = catchAsync(async (req: any, res) => {
  await validateUser(req.user.id);
  const departure: Coordinate = req.body.departure;
  const destination: Coordinate = req.body.destination;
  const departureRange = getCoordinateRange(departure);
  const destinationRange = getCoordinateRange(destination);
  const currentTimePlusOneHour = new Date(Date.now() + 60 * 60 * 1000);
  try {
    const trips = await db.trips.findAll({
      where: {
        status: "active",
        postManId: {
          [Op.ne]: req.user.id,
        },
      },
      include: [
        {
          model: db.addresses,
          as: "departure",
          where: {
            dateAndTime: {
              [Op.gte]: currentTimePlusOneHour,
            },
            latitude: {
              [Op.and]: {
                [Op.gte]: departureRange.minLatitude,
                [Op.lte]: departureRange.maxLatitude,
              },
            },
            longitude: {
              [Op.and]: {
                [Op.gte]: departureRange.minLongitude,
                [Op.lte]: departureRange.maxLongitude,
              },
            },
          },
        },
        {
          model: db.addresses,
          as: "destination",
          where: {
            latitude: {
              [Op.and]: {
                [Op.gte]: destinationRange.minLatitude,
                [Op.lte]: destinationRange.maxLatitude,
              },
            },
            longitude: {
              [Op.and]: {
                [Op.gte]: destinationRange.minLongitude,
                [Op.lte]: destinationRange.maxLongitude,
              },
            },
          },
        },
        {
          model: db.users,
          as: "postman",
        },
      ],
    });
    return res.status(200).json({
      status: 200,
      success: true,
      data: trips,
      message: "Route trips fetched successfully",
    });
  } catch (error: any) {
    Logger.error(error.message);
    return res.status(500).json({
      status: 500,
      success: false,
      message: error.message,
      error: error.message,
    });
  }
});

export {
  createTrip,
  editTrip,
  deleteTrip,
  getMyTrips,
  getTripDetails,
  getRouteTrips,
};
