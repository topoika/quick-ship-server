"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable("trips", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      postManId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: "users",
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
      },
      travelMethodId: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      vehicleIdentity: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      licenseNumber: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      travelRole: {
        type: Sequelize.STRING,
        allowNull: true,
        defaultValue: "driver",
      },
      allowRequest: {
        type: Sequelize.BOOLEAN,
        allowNull: true,
        defaultValue: true,
      },
      status: {
        type: Sequelize.ENUM,
        values: ["pending", "started", "completed", "cancelled"],
        defaultValue: "pending",
      },
      departureAddressId: {
        type: Sequelize.INTEGER,
        allowNull: true,
      },
      destinationAddressId: {
        type: Sequelize.INTEGER,
        allowNull: true,
      },
      guideToMeetingPoint: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      packagePreference: {
        type: Sequelize.STRING,
        allowNull: true,
        values: ["small", "medium", "large", "extra-large"],
        defaultValue: "small",
      },
      postageFee: {
        type: Sequelize.DOUBLE,
        allowNull: true,
        defaultValue: 0,
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
      },
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable("trips");
  },
};
