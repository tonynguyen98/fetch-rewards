const express = require("express");

const router = express.Router();

// ping-pong api test
router.get("/ping", (_, res) => {
  res.status(200).send("pong");
});

module.exports = router;
