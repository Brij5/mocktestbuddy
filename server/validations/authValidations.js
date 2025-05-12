import Joi from 'joi';

// Common password requirements
const passwordValidation = Joi.string()
  .min(8)
  .required()
  .pattern(
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/
  )
  .messages({
    'string.pattern.base':
      'Password must contain at least 1 uppercase letter, 1 lowercase letter, 1 number, and 1 special character',
    'string.min': 'Password must be at least 8 characters long',
    'any.required': 'Password is required',
  });

// Register validation schema
export const registerSchema = Joi.object({
  name: Joi.string().min(2).max(50).required().messages({
    'string.empty': 'Name is required',
    'string.min': 'Name must be at least 2 characters long',
    'string.max': 'Name cannot be longer than 50 characters',
  }),
  email: Joi.string().email().required().messages({
    'string.email': 'Please provide a valid email',
    'string.empty': 'Email is required',
  }),
  password: passwordValidation,
  confirmPassword: Joi.string()
    .valid(Joi.ref('password'))
    .required()
    .messages({
      'any.only': 'Passwords do not match',
      'any.required': 'Please confirm your password',
    }),
});

// Login validation schema
export const loginSchema = Joi.object({
  email: Joi.string().email().required().messages({
    'string.email': 'Please provide a valid email',
    'string.empty': 'Email is required',
  }),
  password: Joi.string().required().messages({
    'string.empty': 'Password is required',
  }),
});

// Forgot password validation schema
export const forgotPasswordSchema = Joi.object({
  email: Joi.string().email().required().messages({
    'string.email': 'Please provide a valid email',
    'string.empty': 'Email is required',
  }),
});

// Reset password validation schema
export const resetPasswordSchema = Joi.object({
  password: passwordValidation,
  confirmPassword: Joi.string()
    .valid(Joi.ref('password'))
    .required()
    .messages({
      'any.only': 'Passwords do not match',
      'any.required': 'Please confirm your password',
    }),
});
