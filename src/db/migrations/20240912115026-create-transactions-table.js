"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable("transactions", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      type: {
        type: Sequelize.ENUM,
        values: ["payment", "refund", "withdrawal"],
        defaultValue: "payment",
      },
      status: {
        type: Sequelize.ENUM,
        values: ["active", "disputed", "refunded"],
        defaultValue: "active",
      },
      withdrawn: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
      userId: {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: {
          model: "users",
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "SET NULL",
      },
      paidAmount: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: false,
      },
      commissionAmount: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: false,
      },
      netAmount: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: false,
      },
      tipAmount: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: true,
      },
      refundAmount: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: true,
      },
      totalPayOutAmount: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: false,
      },
      paymentDate: {
        type: Sequelize.DATE,
        allowNull: true,
      },
      refundDate: {
        type: Sequelize.DATE,
        allowNull: true,
      },
      disputeDate: {
        type: Sequelize.DATE,
        allowNull: true,
      },
      disputeReason: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      disputeResolvedDate: {
        type: Sequelize.DATE,
        allowNull: true,
      },
      disputeResolvedBy: {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: {
          model: "users",
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "SET NULL",
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW,
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW,
      },
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable("transactions");
  },
};
