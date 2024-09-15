"use strict";

const PackageImageModel = (sequelize: any, DataTypes: any) => {
  const packageImage = sequelize.define(
    "package_images",
    {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER,
      },
      packageId: { type: DataTypes.INTEGER, allowNull: true },
      url: { type: DataTypes.STRING, allowNull: true },
    },
    {
      freezeTableName: true,
      underscored: false,
      timestamps: false,
      tableName: "package_images",
      modelName: "package_images",
    }
  );
  packageImage.associate = (models: any) => {
    //   associations can be defined here
    packageImage.belongsTo(models.packages, {
      foreignKey: "packageId",
      as: "package",
    });
  };
  return packageImage;
};

export default PackageImageModel;
