// modules/Order/order.routes.ts
import { Router } from "express";
import { OrderController } from "./order.controller";
import auth from "../../middlewares/auth";
import optionalAuth from "../../middlewares/optionalAuth";

const router = Router();

// Both guest & logged-in user can place order (optional authentication)
router.post("/create-order", optionalAuth, OrderController.createOrder);

// Logged-in users can see their own orders (required authentication)
router.get("/", auth(), OrderController.getOrders);

// Get order by id (auth required)
router.get("/:id", auth(), OrderController.getOrderById);

export const OrderRoutes = router;