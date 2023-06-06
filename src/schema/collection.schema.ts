import Joi from "joi";

export const collectionSchema = Joi.object({
  collectionId: Joi.string().required(),
  isCategory: Joi.boolean().required(),
  type: Joi.string().required(),
});

export const collectionGetSchema = Joi.object({
  isCategory: Joi.boolean().required(),
});
