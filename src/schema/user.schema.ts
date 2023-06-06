import Joi from 'joi'

export const userSchema = Joi.object({
  status: {
    isActive: Joi.boolean().default(false),
    isSuspended: Joi.boolean().default(false),
  },
  fullName: {
    firstName: Joi.string().required(),
    lastName: Joi.string().required(),
  },
  email: Joi.string().email().required(),
  password: Joi.string().required(),
  phoneNumber: Joi.string().required(),
  role: Joi.object({
    isCustomer: Joi.boolean(),
    isSubscriber: Joi.boolean(),
    isAdmin: Joi.boolean(),
    isFreelancer: Joi.boolean(),
  }),
})

export const loginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required(),
})
