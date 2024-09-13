"use strict";

const FAQModel = (sequelize: any, DataTypes: any) => {
  const faq = sequelize.define(
    "faqs",
    {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER,
      },
      question: { type: DataTypes.STRING, allowNull: true },
      description: { type: DataTypes.STRING, allowNull: true },
    },
    {
      freezeTableName: true,
      underscored: false,
      timestamps: true,
      tableName: "faqs",
      modelName: "faqs",
    }
  );
  faq.associate = (models: any) => {
    //   associations can be defined here
  };
  return faq;
};

export default FAQModel;
