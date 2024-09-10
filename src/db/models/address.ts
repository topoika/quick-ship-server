"use strict";

const AddressModel = (sequelize: any, DataTypes: any) => {
  const address = sequelize.define(
    "addresses",
    {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER,
      },

      country: { type: DataTypes.STRING, allowNull: true },
      state: { type: DataTypes.STRING, allowNull: true },
      address: { type: DataTypes.STRING, allowNull: true },
      nameAddress: { type: DataTypes.STRING, allowNull: true },
      city: { type: DataTypes.STRING, allowNull: true },
      latitude: { type: DataTypes.DOUBLE, allowNull: true },
      longitude: {
        type: DataTypes.DOUBLE,
        allowNull: true,
      },
    },
    {
      freezeTableName: true,
      underscored: false,
      timestamps: true,
      tableName: "addresses",
      modelName: "addresses",
    }
  );
  address.associate = (models: any) => {
    //   // associations can be defined here
  };
  return address;
};

export default AddressModel;
