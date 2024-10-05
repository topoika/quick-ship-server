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
      withdrawn: {
        type: Sequelize.BOOLEAN,
        allowNull: true,
        defaultValue: false,
      },
      paymentId: {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: {
          model: "payments",
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
      refundAmount: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: true,
      },
      paymentDate: {
        type: Sequelize.DATE,
        allowNull: true,
        defaultValue: Sequelize.NOW,
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
      mpesaReceiptNumber: {
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
