"use strict";

const PaymentModel = (sequelize: any, DataTypes: any) => {
  const payment = sequelize.define(
    "payments",
    {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER,
      },
      amount: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: true,
      },
      shipperId: { type: DataTypes.INTEGER, allowNull: false },
      postManId: { type: DataTypes.INTEGER, allowNull: false },
      referenceNumber: { type: DataTypes.STRING, allowNull: true },
      mpesaNumber: { type: DataTypes.STRING, allowNull: true },
      status: {
        type: DataTypes.ENUM,
        values: ["pending", "completed", "cancelled", "failed"],
        defaultValue: "pending",
      },
    },
    {
      freezeTableName: true,
      underscored: false,
      timestamps: true,
      tableName: "payments",
      modelName: "payments",
    }
  );
  payment.associate = (models: any) => {
    //   associations can be defined here
  };
  return payment;
};

export default PaymentModel;
