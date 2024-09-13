"use strict";

const FeedModel = (sequelize: any, DataTypes: any) => {
  const feed = sequelize.define(
    "feeds",
    {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER,
      },
      title: { type: DataTypes.STRING, allowNull: false },
      image: { type: DataTypes.STRING, allowNull: true },
      body: { type: DataTypes.STRING, allowNull: true },
      writerId: { type: DataTypes.INTEGER, allowNull: false },
    },
    {
      freezeTableName: true,
      underscored: false,
      timestamps: true,
      tableName: "feeds",
      modelName: "feeds",
    }
  );
  feed.associate = (models: any) => {
    feed.belongsTo(models.users, {
      foreignKey: "writerId",
      as: "writer",
    });
  };
  return feed;
};

export default FeedModel;
