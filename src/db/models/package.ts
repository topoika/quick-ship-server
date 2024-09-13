"use strict";

const PackageModel = (sequelize: any, DataTypes: any) => {
  const shipPackage = sequelize.define(
    "packages",
    {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER,
      },
      shipperId: { type: DataTypes.INTEGER, allowNull: false },
      name: { type: DataTypes.STRING, allowNull: false },
      description: { type: DataTypes.STRING, allowNull: true },
      dimLength: {
        type: DataTypes.DOUBLE,
        allowNull: true,
        defaultValue: null,
      },
      dimWidth: { type: DataTypes.DOUBLE, allowNull: true, defaultValue: null },
      dimHeight: {
        type: DataTypes.DOUBLE,
        allowNull: true,
        defaultValue: null,
      },
      weight: { type: DataTypes.DOUBLE, allowNull: true, defaultValue: 0 },
      value: { type: DataTypes.DOUBLE, allowNull: true, defaultValue: 0 },
      approximateValue: {
        type: DataTypes.DOUBLE,
        allowNull: true,
        defaultValue: 0,
      },
      insurance: {
        type: DataTypes.BOOLEAN,
        allowNull: true,
        defaultValue: false,
      },
      packBySender: {
        type: DataTypes.BOOLEAN,
        allowNull: true,
        defaultValue: true,
      },
      dateOfShipment: { type: DataTypes.STRING, allowNull: true },
      sourceAddressId: { type: DataTypes.INTEGER, allowNull: true },
      destinationAddressId: { type: DataTypes.INTEGER, allowNull: true },
      status: {
        type: DataTypes.ENUM,
        values: ["pending", "accepted", "paid", "picked", "delivered"],
        defaultValue: "pending",
      },
      postManNote: { type: DataTypes.STRING, allowNull: true },

      //reciever details
      recieverName: { type: DataTypes.STRING, allowNull: true },
      recieverPhone: { type: DataTypes.STRING, allowNull: true },
      recieverAltPhone: { type: DataTypes.STRING, allowNull: true },
    },
    {
      freezeTableName: true,
      underscored: false,
      timestamps: true,
      tableName: "packages",
      modelName: "packages",
    }
  );
  shipPackage.associate = (models: any) => {
    shipPackage.belongsTo(models.users, {
      foreignKey: "shipperId",
      as: "shipper",
    });
    shipPackage.belongsTo(models.addresses, {
      foreignKey: "sourceAddressId",
      as: "sourceAddress",
    });
    shipPackage.belongsTo(models.addresses, {
      foreignKey: "destinationAddressId",
      as: "destinationAddress",
    });
  };
  return shipPackage;
};

export default PackageModel;
