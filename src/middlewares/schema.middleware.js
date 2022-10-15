import { StatusCodes } from "http-status-codes";

function validateSchema(schema) {
  return (req, res, next) => {
    const validation = schema.validate(req.body, { abortEarly: false });

    if (validation.error) {
      const errors = validation.error.details.map((detail) => detail.message);
      return res.status(StatusCodes.UNPROCESSABLE_ENTITY).send(errors);
    }
    next();
  };
}

export { validateSchema };
