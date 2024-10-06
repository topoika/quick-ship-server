import db from "../../db/models";

interface Coordinate {
  latitude: number;
  longitude: number;
}

const getCoordinateRange = (center: Coordinate, rangeKm: number = 10) => {
  const earthRadiusKm = 6371;
  const latRange = (rangeKm / earthRadiusKm) * (180 / Math.PI);
  const lonRange =
    ((rangeKm / earthRadiusKm) * (180 / Math.PI)) /
    Math.cos(center.latitude * (Math.PI / 180));
  return {
    minLatitude: center.latitude - latRange,
    maxLatitude: center.latitude + latRange,
    minLongitude: center.longitude - lonRange,
    maxLongitude: center.longitude + lonRange,
  };
};

const addressAtr = [
  "id",
  "country",
  "state",
  "address",
  "nameAddress",
  "city",
  "latitude",
  "longitude",
  "meetingPoint",
  "dateAndTime",
];

const userAtr = [
  "id",
  "name",
  "phone",
  "image",
  "email",
  "bio",
  "verified",
  "signInMethod",
  "isOnline",
  "isDeleted",
  "isBlocked",
  "createdAt",
];
const walletAtr = [
  "id",
  "availableForWithdrawal",
  "earningsForMonth",
  "successScore",
  "earningsAllTime",
  "completedOrders",
  "activeOrders",
];
const packageRelatedModels = [
  {
    model: db.addresses,
    as: "sourceAddress",
    attributes: addressAtr,
  },
  {
    model: db.users,
    as: "shipper",
    attributes: userAtr,
  },
  {
    model: db.addresses,
    as: "destinationAddress",
    attributes: addressAtr,
  },
  {
    model: db.package_images,
    as: "images",
  },
];

const tripRelatedModels = [
  { model: db.addresses, as: "departure", attributes: addressAtr },
  { model: db.addresses, as: "destination", attributes: addressAtr },
  {
    model: db.users,
    as: "postman",
    attributes: userAtr,
  },
];
export {
  Coordinate,
  getCoordinateRange,
  userAtr,
  walletAtr,
  packageRelatedModels,
  tripRelatedModels,
};
