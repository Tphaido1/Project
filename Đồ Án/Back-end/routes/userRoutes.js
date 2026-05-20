import express from "express";
import { protect, admin } from "../middleware/authMiddleware.js";
import { getUsers, updateUser, deleteUser } from "../controllers/userController.js";

const router = express.Router();

router.get("/", protect, admin, getUsers);
router.put("/:id", protect, admin, updateUser);
router.delete("/:id", protect, admin, deleteUser);

export default router;
