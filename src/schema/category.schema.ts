import Joi from 'joi';

export const categorySchemaValidation = Joi.object({
  status: Joi.object({
    isPublished: Joi.boolean(),
    isApproved: Joi.boolean(),
    isCollection: Joi.boolean(),
    isNew: Joi.boolean(),
    isExclusive: Joi.boolean(),
    isFeatured: Joi.boolean(),
  }),
  name: Joi.string().required(),
  theme: Joi.string().required(),
  image: Joi.string(),
  description: Joi.string().required(),
  slug: Joi.string().required(),
  type: Joi.string().required(),
});

export const categorySearchSchemaValidation = Joi.object({
  isExclusive: Joi.boolean(),
  isNew: Joi.boolean(),
  isFeatured: Joi.boolean(),
});
