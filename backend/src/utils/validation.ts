import Joi from "joi";

export const userSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().min(8).required(),
  firstName: Joi.string().min(2).max(50).required(),
  lastName: Joi.string().min(2).max(50).required(),
});

export const loginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required(),
});

export const fileUploadSchema = Joi.object({
  fileName: Joi.string().required(),
  fileType: Joi.string().required(),
});

export const transcriptionSchema = Joi.object({
  transcription_name: Joi.string().min(1).max(100).required(),
  file_key: Joi.string().required(),
});

export const validateInput = <T>(schema: Joi.ObjectSchema, data: any): T => {
  const { error, value } = schema.validate(data);
  if (error) {
    throw new Error(`Validation error: ${error.details[0].message}`);
  }
  return value as T;
};
