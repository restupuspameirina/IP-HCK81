function errorHandler(err, req, res, next) {
  switch (err.name) {
    case "SequelizeValidationError":
    case "SequelizeUniqueConstraintError":
      res.status(400).json({ message: err.errors[0].message });
      return;

    case "BadRequest":
      res.status(400).json({ message: err.message });
      return;

    case "Unauthorized":
      res.status(401).json({ message: err.message });
      return;

    case "InvalidToken":
      res.status(401).json({ message: err.message });
      return;

    case "JsonWebTokenError":
      res.status(401).json({ message: "Invalid token" });
      return;

    case "NotFound":
      res.status(404).json({ message: err.message });
      return;

    default:
      res.status(500).json({ message: "Internal Server Error" });
      return;
  }
}

module.exports = errorHandler;
