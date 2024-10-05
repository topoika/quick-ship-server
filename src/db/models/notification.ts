"use strict";

const NotificationModel = (sequelize: any, DataTypes: any) => {
  const notification = sequelize.define(
    "notifications",
    {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER,
      },
      userId: { type: DataTypes.INTEGER, allowNull: true },
      title: { type: DataTypes.STRING, allowNull: true },
      body: { type: DataTypes.STRING, allowNull: true },
      type: { type: DataTypes.STRING, allowNull: true },
      senderId: { type: DataTypes.INTEGER, allowNull: true },
      itemId: { type: DataTypes.INTEGER, allowNull: true },
      isSent: { type: DataTypes.BOOLEAN, allowNull: true, defaultValue: false },
    },
    {
      freezeTableName: true,
      underscored: false,
      timestamps: true,
      tableName: "notifications",
      modelName: "notifications",
    }
  );
  notification.associate = (models: any) => {
    //   associations can be defined here
    notification.belongsTo(models.users, {
      foreignKey: "senderId",
      as: "sender",
      onDelete: "CASCADE",
    });
  };
  return notification;
};

export default NotificationModel;
