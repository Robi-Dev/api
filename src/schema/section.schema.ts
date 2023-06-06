import Joi from "joi";

export const sectionSchema = Joi.object({
  status: Joi.object({
    isPublished: Joi.boolean(),
    isApproved: Joi.boolean(),
    isDeleted: Joi.boolean(),
    isCollection: Joi.boolean(),
    isNew: Joi.boolean(),
    isFeatured: Joi.boolean(),
    isExclusive: Joi.boolean(),
  }),
  theme: Joi.string().required(),
  category: Joi.string().required(),
  sectionName: Joi.string().required(),
  previewImg: Joi.string().dataUri(),
  description: Joi.string().required(),
  instruction: Joi.string(),
  credit: Joi.string(),
  requirements: Joi.string(),
  tags: Joi.array().items(Joi.string()),
  htmlHtml: Joi.string().required(),
  htmlCss: Joi.string().empty(""),
  htmlJs: Joi.string().empty(""),
  reactHtml: Joi.string().empty(""),
  reactCss: Joi.string().empty(""),
  reactJs: Joi.string().empty(""),
  vueHtml: Joi.string().empty(""),
  vueCss: Joi.string().empty(""),
  vueJs: Joi.string().empty(""),
  angularHtml: Joi.string().empty(""),
  angularCss: Joi.string().empty(""),
  angularJs: Joi.string().empty(""),
});
