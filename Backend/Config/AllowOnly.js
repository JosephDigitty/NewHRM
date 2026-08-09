export const allowOnly = (allowed) => (req, res, next) => {
  const extraFields = Object.keys(req.body).filter(
    (key) => !allowed.includes(key)
  );

  if (extraFields.length > 0) {
    return res.status(400).json({
      success: false,
      message: `Unexpected field(s): ${extraFields.join(", ")}`,
    });
  }

  next();
};
