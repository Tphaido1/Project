import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import { protect, admin } from "../middleware/authMiddleware.js";
import {
  createOrder,
  getUserOrders,
  getOrderById,
  getAllOrders,
  updateOrderStatus,
} from "../controllers/orderController.js";

const router = express.Router();

router.post("/", protect, createOrder);
router.get("/myorders", protect, getUserOrders);
router.get("/", protect, admin, getAllOrders);
router.get("/:id", protect, getOrderById);
router.put("/:id/status", protect, admin, updateOrderStatus);

export default router;
