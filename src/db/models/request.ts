"use strict";

const PackageRequestModel = (sequelize: any, DataTypes: any) => {
  const request = sequelize.define(
    "requests",
    {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER,
      },
      tripId: { type: DataTypes.INTEGER, allowNull: false },
      userId: { type: DataTypes.INTEGER, allowNull: false },
      senderId: { type: DataTypes.INTEGER, allowNull: true },
      packageId: { type: DataTypes.INTEGER, allowNull: false },
      postageFee: { type: DataTypes.DOUBLE, allowNull: false },
      status: {
        type: DataTypes.ENUM,
        values: ["pending", "accepted", "rejected", "paid"],
        defaultValue: "pending",
      },
    },
    {
      freezeTableName: true,
      underscored: false,
      timestamps: true,
      tableName: "requests",
      modelName: "requests",
    }
  );
  request.associate = (models: any) => {
    //   associations can be defined here
    request.belongsTo(models.trips, {
      foreignKey: "tripId",
      as: "trip",
    });
    request.belongsTo(models.packages, {
      foreignKey: "packageId",
      as: "package",
    });
  };
  return request;
};

export default PackageRequestModel;
