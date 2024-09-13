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
      userId: { type: DataTypes.INTEGER, allowNull: false },
      balance: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: true,
        defaultValue: 0.0,
      },
      status: {
        type: DataTypes.ENUM,
        values: ["active", "inactive"],
        defaultValue: "active",
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
    wallet.belongsTo(models.users, {
      foreignKey: "userId",
      as: "user",
    });
  };
  return wallet;
};

export default WalletModel;
