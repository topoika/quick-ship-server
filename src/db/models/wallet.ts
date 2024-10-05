"use strict";

const WalletModel = (sequelize: any, DataTypes: any) => {
  const wallet = sequelize.define(
    "wallets",
    {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER,
      },
      availableForWithdrawal: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: true,
        defaultValue: 0.0,
      },
      earningsForMonth: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: true,
        defaultValue: 0.0,
      },
      successScore: {
        type: DataTypes.DECIMAL(3, 2),
        allowNull: true,
        defaultValue: 0,
      },
      earningsAllTime: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: true,
        defaultValue: 0.0,
      },
      completedOrders: {
        type: DataTypes.INTEGER,
        allowNull: true,
        defaultValue: 0,
      },
      activeOrders: {
        type: DataTypes.INTEGER,
        allowNull: true,
        defaultValue: 0,
      },
    },
    {
      freezeTableName: true,
      underscored: false,
      timestamps: true,
      tableName: "wallets",
      modelName: "wallets",
    }
  );
  wallet.associate = (models: any) => {
    //   associations can be defined here
  };
  return wallet;
};

export default WalletModel;
