import Joi from "joi/lib";

const loginValidator = Joi.object().keys({
  id: Joi.number().allow(null).optional(),
  authToken: Joi.string().allow(null).optional(),
  name: Joi.string().allow(null).optional(),
  userName: Joi.string().allow(null).optional(),
  email: Joi.string().required(),
  bio: Joi.string().allow(null).optional(),
  mobileNumber: Joi.string().allow(null).optional(),
  deviceToken: Joi.string().allow(null).optional(),
  firebaseUID: Joi.string().allow(null).optional(),
  imageUrl: Joi.string().allow(null).optional(),
  signInMethod: Joi.string().allow(null).optional(),
  verified: Joi.boolean().allow(null).optional(),
  isOnline: Joi.boolean().allow(null).optional(),
  isDeleted: Joi.boolean().allow(null).optional(),
  isBlocked: Joi.boolean().allow(null).optional(),
  password: Joi.string().required(),
});
const registerValidator = Joi.object().keys({
  authToken: Joi.string().allow(null).optional(),
  userName: Joi.string().allow(null).optional(),
  email: Joi.string().required(),
  bio: Joi.string().allow(null).optional(),
  mobileNumber: Joi.string().allow(null).optional(),
  deviceToken: Joi.string().allow(null).optional(),
  firebaseUID: Joi.string().allow(null).optional(),
  imageUrl: Joi.string().allow(null).optional(),
  signInMethod: Joi.string().allow(null).optional(),
  verified: Joi.boolean().allow(null).optional(),
  isOnline: Joi.boolean().allow(null).optional(),
  isDeleted: Joi.boolean().allow(null).optional(),
  isBlocked: Joi.boolean().allow(null).optional(),
  password: Joi.string().required(),
});

export { registerValidator, loginValidator };
