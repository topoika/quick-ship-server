"use strict";

const UserModel = (sequelize: any, DataTypes: any) => {
  const user = sequelize.define(
    "users",
    {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER,
      },
      name: { type: DataTypes.STRING },
      phone: { type: DataTypes.STRING, unique: true },
      image: { type: DataTypes.STRING, allowNull: true },
      verificationFront: { type: DataTypes.STRING, allowNull: true },
      verificationBack: { type: DataTypes.STRING, allowNull: true },
      email: { type: DataTypes.STRING, unique: true },
      idNumber: { type: DataTypes.STRING, unique: true, allowNull: true },
      otp: { type: DataTypes.STRING, defaultValue: null },
      bio: { type: DataTypes.STRING, allowNull: true },
      role: {
        type: DataTypes.STRING,
        defaultValue: "user",
        allowNull: true,
      },
      walletId: { type: DataTypes.INTEGER, allowNull: true },
      password: {
        type: DataTypes.STRING,
        allowNull: true,
        defaultValue: null,
      },
      passwordResetExpires: {
        type: DataTypes.DATE,
        allowNull: true,
        defaultValue: null,
      },
      signInMethodVerified: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
        allowNull: true,
      },
      verified: { type: DataTypes.BOOLEAN, defaultValue: false, allNull: true },
      signInMethod: {
        type: DataTypes.STRING,
        defaultValue: "email",
        allowNull: true,
      },
      isOnline: { type: DataTypes.BOOLEAN, defaultValue: false },
      isDeleted: { type: DataTypes.BOOLEAN, defaultValue: false },
      isBlocked: { type: DataTypes.BOOLEAN, defaultValue: false },
    },
    {
      freezeTableName: true,
      underscored: false,
      timestamps: true,
      tableName: "users",
      modelName: "users",
    }
  );
  user.associate = (models: any) => {
    user.hasOne(models.wallets, {
      foreignKey: "id",
      sourceKey: "walletId",
      as: "wallet",
    });

    // reviews
    user.hasMany(models.reviews, {
      foreignKey: "userId",
      as: "reviews",
    });
  };
  return user;
};

export default UserModel;
