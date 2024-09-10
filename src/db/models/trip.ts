"use strict";

const TripModel = (sequelize: any, DataTypes: any) => {
  const trip = sequelize.define(
    "trips",
    {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER,
      },
      postManId: { type: DataTypes.INTEGER, allowNull: false },
    },
    {
      freezeTableName: true,
      underscored: false,
      timestamps: true,
      tableName: "trips",
      modelName: "trips",
    }
  );
  trip.associate = (models: any) => {
    // associations can be defined here
    trip.belongsTo(models.users, {
      foreignKey: "postManId",
      as: "postMan",
    });
  };
  return trip;
};

export default TripModel;
