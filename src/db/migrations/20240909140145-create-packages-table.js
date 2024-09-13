"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable("packages", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      shipperId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: "users",
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
      },
      name: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      description: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      dimLength: {
        type: Sequelize.DOUBLE,
        allowNull: true,
        defaultValue: 0,
      },
      dimWidth: {
        type: Sequelize.DOUBLE,
        allowNull: true,
        defaultValue: 0,
      },
      dimHeight: {
        type: Sequelize.DOUBLE,
        allowNull: true,
        defaultValue: 0,
      },
      weight: {
        type: Sequelize.DOUBLE,
        allowNull: true,
        defaultValue: 0,
      },
      value: {
        type: Sequelize.DOUBLE,
        allowNull: true,
        defaultValue: 0,
      },
      approximateValue: {
        type: Sequelize.DOUBLE,
        allowNull: true,
        defaultValue: 0,
      },
      insurance: {
        type: Sequelize.BOOLEAN,
        allowNull: true,
        defaultValue: false,
      },
      packBySender: {
        type: Sequelize.BOOLEAN,
        allowNull: true,
        defaultValue: true,
      },
      dateOfShipment: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      postManNote: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      recieverName: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      recieverPhone: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      recieverAltPhone: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      sourceAddressId: {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: {
          model: "addresses",
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "RESTRICT",
      },
      destinationAddressId: {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: {
          model: "addresses",
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "RESTRICT",
      },
      status: {
        type: Sequelize.ENUM(
          "pending",
          "accepted",
          "paid",
          "picked",
          "delivered"
        ),
        defaultValue: "pending",
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
    await queryInterface.dropTable("packages");
  },
};
