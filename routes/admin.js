const express = require("express");
const router = express.Router();
const adminController = require("../controller/userController");
const auth = require("../middleware/auth");

const isAdmin = (req, res, next) => {
  if (req.user.role !== "admin")
    return res.status(403).json({ message: "Admin access required" });
  next();
};

router.get("/users", auth, isAdmin, adminController.getUsers);
router.put("/users/:id/block", auth, isAdmin, adminController.blockUser);

module.exports = router;
