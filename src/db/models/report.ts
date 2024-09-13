"use strict";

const ReportModel = (sequelize: any, DataTypes: any) => {
  const report = sequelize.define(
    "reports",
    {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER,
      },
      //  complaints made by users against other users
      reporterId: { type: DataTypes.INTEGER, allowNull: false },
      reportedId: { type: DataTypes.INTEGER, allowNull: false },
      reason: { type: DataTypes.STRING, allowNull: false },
      description: { type: DataTypes.STRING, allowNull: false },
      status: {
        type: DataTypes.ENUM,
        values: ["pending", "resolved"],
        defaultValue: "pending",
      },
      resolverId: { type: DataTypes.INTEGER, allowNull: true },
      resolvedAt: { type: DataTypes.DATE, allowNull: true },
    },
    {
      freezeTableName: true,
      underscored: false,
      timestamps: true,
      tableName: "reports",
      modelName: "reports",
    }
  );
  report.associate = (models: any) => {
    //   associations can be defined here
    report.belongsTo(models.users, {
      foreignKey: "reporterId",
      as: "reporter",
    });
    report.belongsTo(models.users, {
      foreignKey: "reportedId",
      as: "reportedUser",
    });
    report.belongsTo(models.users, {
      foreignKey: "resolverId",
      as: "resolvedByUser",
    });
  };
  return report;
};

export default ReportModel;
