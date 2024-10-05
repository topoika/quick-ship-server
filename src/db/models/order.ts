"use strict";

const OrderModel = (sequelize: any, DataTypes: any) => {
  const order = sequelize.define(
    "orders",
    {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER,
      },
      postManId: { type: DataTypes.INTEGER, allowNull: false },
      shipperId: { type: DataTypes.INTEGER, allowNull: false },
      packageId: { type: DataTypes.INTEGER, allowNull: false },
      tripId: { type: DataTypes.INTEGER, allowNull: false },
      requestId: { type: DataTypes.INTEGER, allowNull: false },
      reviewId: { type: DataTypes.INTEGER, allowNull: true },
      paymentId: { type: DataTypes.INTEGER, allowNull: false },
      status: {
        type: DataTypes.ENUM,
        values: [
          "pending",
          "collected",
          "cancelled",
          "postponed",
          "started",
          "completed",
        ],
        defaultValue: "pending",
      },
    },
    {
      freezeTableName: true,
      underscored: false,
      timestamps: true,
      tableName: "orders",
      modelName: "orders",
    }
  );
  order.associate = (models: any) => {
    //   associations can be defined here
    order.belongsTo(models.users, {
      foreignKey: "postManId",
      as: "postMan",
    });
    order.belongsTo(models.users, {
      foreignKey: "shipperId",
      as: "shipper",
    });
    order.belongsTo(models.packages, {
      foreignKey: "packageId",
      as: "package",
    });
    order.belongsTo(models.trips, {
      foreignKey: "tripId",
      as: "trip",
    });
    order.belongsTo(models.requests, {
      foreignKey: "requestId",
      as: "request",
    });
    order.belongsTo(models.reviews, {
      foreignKey: "reviewId",
      as: "review",
    });
    order.belongsTo(models.payments, {
      foreignKey: "paymentId",
      as: "payment",
    });
  };
  return order;
};

export default OrderModel;
