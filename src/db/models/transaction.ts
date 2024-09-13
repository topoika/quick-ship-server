"use strict";

const TransactionModel = (sequelize: any, DataTypes: any) => {
  const transactionItem = sequelize.define(
    "transactions",
    {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER,
      },
      type: {
        type: DataTypes.ENUM,
        values: ["payment", "refund", "withdrawal"],
        defaultValue: "payment",
      },
      status: {
        type: DataTypes.ENUM,
        values: ["active", "disputed", "refunded"],
        defaultValue: "active",
      },
      withdrawn: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
      userId: { type: DataTypes.INTEGER, allowNull: true },
      paidAmount: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
      },
      commissionAmount: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
      },
      netAmount: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
      },
      tipAmount: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: true,
      },
      refundAmount: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: true,
      },
      totalPayOutAmount: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
      },
      paymentDate: {
        type: DataTypes.DATE,
        allowNull: true,
      },
      refundDate: {
        type: DataTypes.DATE,
        allowNull: true,
      },
      disputeDate: {
        type: DataTypes.DATE,
        allowNull: true,
      },
      disputeReason: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      disputeResolvedDate: {
        type: DataTypes.DATE,
        allowNull: true,
      },
      disputeResolvedBy: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
    },
    {
      freezeTableName: true,
      underscored: false,
      timestamps: true,
      tableName: "transactions",
      modelName: "transactions",
    }
  );
  transactionItem.associate = (models: any) => {
    //   associations can be defined here
    transactionItem.belongsTo(models.users, {
      foreignKey: "userId",
      as: "user",
    });
  };
  return transactionItem;
};

export default TransactionModel;
