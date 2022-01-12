const createError = require("http-errors");
const express = require("express");
const router = express.Router();

router.use((req, res, next) => {
  next(createError(404));
});

router.use((err, req, res, next) => {
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  res.status(err.status || 500);
  res.render("admin/error");
});

module.exports = router;
