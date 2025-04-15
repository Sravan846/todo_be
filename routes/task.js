const express = require("express");
const router = express.Router();
const taskController = require("../controller/taskController");
const auth = require("../middleware/auth");
const multer = require("multer");
const { body, validationResult } = require("express-validator");
const { validateTask, validateRequest } = require("../middleware/validation");

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads/"),
  filename: (req, file, cb) => cb(null, Date.now() + "-" + file.originalname),
});
const upload = multer({
  storage,
  limits: { fileSize: 2 * 1024 * 1024 }, // 2MB limit
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith("image/")) {
      cb(null, true);
    } else {
      cb(new Error("Only images are allowed"));
    }
  },
});

router.post(
  "/",
  auth,
  upload.single("image"),
  validateTask,
  validateRequest,
  taskController.createTask
);
router.get("/", auth, taskController.getTasks);
router.put(
  "/:id",
  auth,
  upload.single("image"),
  validateTask,
  validateRequest,
  taskController.updateTask
);
router.delete("/:id", auth, taskController.deleteTask);

module.exports = router;
