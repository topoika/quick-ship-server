"use strict";

const TripModel = (sequelize: any, DataTypes: any) => {
  const trip = sequelize.define(
    "trips",
    {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER,
      },
      postManId: { type: DataTypes.INTEGER, allowNull: false },
      travelMethodId: { type: DataTypes.INTEGER, allowNull: false },
      vehicleIdentity: { type: DataTypes.STRING, allowNull: true },
      licenseNumber: { type: DataTypes.STRING, allowNull: true },
      travelRole: {
        type: DataTypes.STRING,
        allowNull: true,
        defaultValue: "driver",
      },
      allowRequest: {
        type: DataTypes.BOOLEAN,
        allowNull: true,
        defaultValue: true,
      },
      status: {
        type: DataTypes.ENUM,
        values: ["active", "started", "completed", "cancelled"],
        defaultValue: "active",
      },
      departureAddressId: { type: DataTypes.INTEGER, allowNull: true },
      destinationAddressId: { type: DataTypes.INTEGER, allowNull: true },
      guideToMeetingPoint: { type: DataTypes.STRING, allowNull: true },
      packagePreference: {
        type: DataTypes.STRING,
        values: ["small", "medium", "large", "extra-large"],
        defaultValue: "small",
      },
      postageFee: { type: DataTypes.DOUBLE, allowNull: true, defaultValue: 0 },
    },
    {
      freezeTableName: true,
      underscored: false,
      timestamps: true,
      tableName: "trips",
      modelName: "trips",
    }
  );
  trip.associate = (models: any) => {
    //  associations can be defined here
    trip.belongsTo(models.addresses, {
      foreignKey: "departureAddressId",
      as: "departure",
    });
    trip.belongsTo(models.addresses, {
      foreignKey: "destinationAddressId",
      as: "destination",
    });
    trip.belongsTo(models.users, {
      foreignKey: "postManId",
      as: "postman",
    });
  };
  return trip;
};

export default TripModel;

