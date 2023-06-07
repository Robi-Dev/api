import Joi from 'joi';

export const themeSchema = Joi.object({
  status: Joi.object({
    isPublished: Joi.boolean(),
    isActive: Joi.boolean(),
    isPrivate: Joi.boolean(),
  }),
  name: Joi.string().required(),
  description: Joi.string().required(),
  icon: Joi.string(),
  slug: Joi.string().required(),
  type: Joi.string().required(),
});
