import db from "../../db/models";
import Logger from "../../logger";
import { validateUser } from "../middlewares/auth.middleware";
import catchAsync from "../utils/catchAsync";
import deleteFile from "../utils/delete.files";

/**
 * @route POST /packages/create
 */
const createPackage = catchAsync(async (req: any, res) => {
  const user = await validateUser(req.user.id);
  const transaction = await db.sequelize.transaction();

  try {
    const {
      name,
      description,
      dimLength,
      dimWidth,
      dimHeight,
      weight,
      value,
      approximateValue,
      insurance,
      packBySender,
      dateOfShipment,
      postManNote,
      recieverName,
      recieverPhone,
      recieverAltPhone,
    } = req.body;

    const sourceAddress = await db.addresses.create(
      JSON.parse(req.body.sourceAddress),
      {
        transaction,
      }
    );
    const destinationAddress = await db.addresses.create(
      JSON.parse(req.body.destinationAddress),
      {
        transaction,
      }
    );

    // Extract uploaded image filenames
    let imagesArray = req.files.map((file: any) => file.filename);

    // create package
    let myPackage = await db.packages.create(
      {
        shipperId: user.id,
        name,
        description,
        dimLength,
        dimWidth,
        dimHeight,
        weight,
        value,
        approximateValue,
        insurance,
        packBySender,
        dateOfShipment,
        postManNote,
        recieverName,
        recieverPhone,
        recieverAltPhone,
        sourceAddressId: sourceAddress.id,
        destinationAddressId: destinationAddress.id,
      },
      { transaction }
    );

    // create package images
    await db.package_images.bulkCreate(
      imagesArray.map((url: any) => ({
        packageId: myPackage.id,
        url,
      })),
      { transaction }
    );

    await transaction.commit();
    // send results
    return res.status(201).json({
      status: 201,
      success: true,
      message: "Package created successfully",
      data: myPackage,
    });
  } catch (error: any) {
    Logger.error(error.message);
    await transaction.rollback();
    return res.status(400).json({
      status: 400,
      success: false,

      message: "Error creating package",
      error: error.message,
    });
  }
});
/**
 * @route PUT /packages/edit
 */
const editPackage = catchAsync(async (req: any, res) => {
  const packageId = req.query.id;
  const user = await validateUser(req.user.id);
  const transaction = await db.sequelize.transaction();
  const editPack = await db.packages.findOne({
    where: { id: packageId },
  });
  if (!editPack) {
    return res.status(404).json({
      status: 404,
      success: false,
      message: "Package not found",
      error: "Package not found",
    });
  }

  if (editPack.shipperId !== user.id) {
    return res.status(403).json({
      status: 403,
      success: false,
      message: "You are not authorized to edit this package",
      error: "You are not authorized to edit this package",
    });
  }

  try {
    const {
      name,
      description,
      dimLength,
      dimWidth,
      dimHeight,
      weight,
      value,
      approximateValue,
      insurance,
      packBySender,
      dateOfShipment,
      postManNote,
      recieverName,
      recieverPhone,
      recieverAltPhone,
    } = req.body;

    let source = JSON.parse(req.body.sourceAddress);
    let destination = JSON.parse(req.body.destinationAddress);

    // update source address
    let sourceAddress = await db.addresses.update(source, {
      where: { id: source.id },
      transaction,
    });
    let destinationAddress = await db.addresses.update(destination, {
      where: { id: destination.id },
      transaction,
    });

    // Extract uploaded image filenames
    let imagesArray = req.files.map((file: any) => file.filename);

    // create package
    editPack.shipperId = user.id;
    editPack.name = name;
    editPack.description = description;
    editPack.dimLength = dimLength;
    editPack.dimWidth = dimWidth;
    editPack.dimHeight = dimHeight;
    editPack.weight = weight;
    editPack.value = value;
    editPack.approximateValue = approximateValue;
    editPack.insurance = insurance;
    editPack.packBySender = packBySender;
    editPack.dateOfShipment = dateOfShipment;
    editPack.postManNote = postManNote;
    editPack.recieverName = recieverName;
    editPack.recieverPhone = recieverPhone;
    editPack.recieverAltPhone = recieverAltPhone;
    editPack.sourceAddressId = sourceAddress.id;
    editPack.destinationAddressId = destinationAddress.id;

    editPack.save({ transaction });

    await transaction.commit();
    // send results
    return res.status(201).json({
      status: 201,
      success: true,
      message: "Package updated successfully",
      data: editPack,
    });
  } catch (error: any) {
    Logger.error(error.message);
    await transaction.rollback();
    return res.status(400).json({
      status: 400,
      success: false,
      message: "Error updating package",
      error: error.message,
    });
  }
});
/**
 * @route DELETE /packages/delete
 */
const deletePackage = catchAsync(async (req: any, res) => {
  const packageId = req.query.id;
  const user = await validateUser(req.user.id);
  const transaction = await db.sequelize.transaction();
  const deletePack = await db.packages.findOne({
    where: { id: packageId },
  });
  if (!deletePack) {
    return res.status(404).json({
      status: 404,
      success: false,

      message: "Package not found",
      error: "Package not found",
    });
  }

  if (deletePack.shipperId !== user.id) {
    return res.status(403).json({
      status: 403,
      success: false,

      message: "You are not authorized to delete this package",
      error: "You are not authorized to delete this package",
    });
  }

  try {
    const images = await db.package_images.findAll({
      where: { packageId },
    });
    // delete addresses
    await db.addresses.destroy({
      where: { id: deletePack.sourceAddressId },
      transaction,
    });
    await db.addresses.destroy({
      where: { id: deletePack.destinationAddressId },
      transaction,
    });
    await db.packages.destroy({
      where: { id: packageId },
      transaction,
    });

    for (let image of images) {
      deleteFile(`media/${image.url}`);
      await db.package_images.destroy({
        where: { id: image.id },
        transaction,
      });
    }

    await transaction.commit();
    // send results
    return res.status(200).json({
      status: 200,
      success: true,
      message: "Package deleted successfully",
    });
  } catch (error: any) {
    Logger.error(error.message);
    await transaction.rollback();
    return res.status(400).json({
      status: 400,
      success: false,
      message: "Error deleting package",
      error: error.message,
    });
  }
});
/**
 * @route GET /packages/details
 */
const getPackageDetails = catchAsync(async (req: any, res) => {
  await validateUser(req.user.id);
  const packageId = req.query.id;
  try {
    const myPackage = await db.packages.findOne({
      where: { id: packageId },
      include: [
        {
          model: db.addresses,
          as: "sourceAddress",
        },
        {
          model: db.users,
          as: "shipper",
        },
        {
          model: db.addresses,
          as: "destinationAddress",
        },
        {
          model: db.package_images,
          as: "images",
        },
      ],
    });

    if (!myPackage) {
      return res.status(404).json({
        status: 404,
        success: false,

        message: "Package not found",
        error: "Package not found",
      });
    }

    return res.status(200).json({
      status: 200,
      success: true,
      message: "Package details fetched successfully",
      data: myPackage,
    });
  } catch (error: any) {
    Logger.error(error.message);
    return res.status(400).json({
      status: 400,
      success: false,
      message: "Error fetching package",
      error: error.message,
    });
  }
});
/**
 * @route GET /packages/my-packages
 */
const getMyPackages = catchAsync(async (req: any, res) => {
  const user = await validateUser(req.user.id);
  try {
    const myPackages = await db.packages.findAll({
      where: { shipperId: user.id },
      include: [
        {
          model: db.addresses,
          as: "sourceAddress",
        },
        {
          model: db.users,
          as: "shipper",
        },
        {
          model: db.addresses,
          as: "destinationAddress",
        },
        {
          model: db.package_images,
          as: "images",
        },
      ],
    });

    return res.status(200).json({
      status: 200,
      success: true,
      message: "Packages fetched successfully",
      data: myPackages,
    });
  } catch (error: any) {
    Logger.error(error.message);
    return res.status(400).json({
      status: 400,
      success: false,
      message: "Error fetching packages",
      error: error.message,
    });
  }
});

export {
  createPackage,
  getPackageDetails,
  getMyPackages,
  editPackage,
  deletePackage,
};
