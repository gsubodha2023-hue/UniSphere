const express = require("express");
const router = express.Router();
const { logSession, getAnalytics } = require("../controllers/pomodoroController");
const { protect } = require("../middleware/authMiddleware");

router.use(protect);

router.post("/", logSession);
router.get("/analytics", getAnalytics);

module.exports = router;
