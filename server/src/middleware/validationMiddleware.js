/**
 * Middleware to validate incoming request body against a specified DTO.
 * Attaches the validated and sanitized body to `req.validatedBody`.
 */
const validate = (DtoClass) => {
  return (req, res, next) => {
    try {
      const dtoInstance = new DtoClass(req.body);
      const validatedData = dtoInstance.validate();
      req.validatedBody = validatedData;
      next();
    } catch (error) {
      return res.status(error.status || 400).json({
        status: "error",
        message: error.message,
      });
    }
  };
};

module.exports = {
  validate,
};
