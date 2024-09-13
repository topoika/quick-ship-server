"use strict";

const ReviewModel = (sequelize: any, DataTypes: any) => {
  const review = sequelize.define(
    "reviews",
    {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER,
      },
      userId: { type: DataTypes.INTEGER, allowNull: false },
      rating: { type: DataTypes.INTEGER, allowNull: false },
      review: { type: DataTypes.STRING, allowNull: true },
      tipAmount: {
        type: DataTypes.DOUBLE,
        allowNull: true,
        defaultValue: null,
      },
    },
    {
      freezeTableName: true,
      underscored: false,
      timestamps: true,
      tableName: "reviews",
      modelName: "reviews",
    }
  );
  review.associate = (models: any) => {
    //   associations can be defined here
  };
  return review;
};

export default ReviewModel;
