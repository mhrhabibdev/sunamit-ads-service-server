// modules/Order/order.controller.ts
import { Request, Response } from "express";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { OrderService } from "./order.service";
import { guestOrderSchema, userOrderSchema } from "./order.velidation";


export const OrderController = {
  createOrder: catchAsync(async (req: Request, res: Response) => {
    console.log("🔍 Debug - req.user:", req?.user);
    // console.log("🔍 Debug - Authorization header:", req.headers.authorization);

    const userId = req.user?.id;
    // console.log(req.body);
    // console.log("user");
    console.log("🔍 Debug - Extracted userId:", userId);

    let validatedData: any;

    if (userId) {
      console.log("✅ Processing as logged-in user");
      // Logged-in user order
      validatedData = userOrderSchema.parse(req.body);
      validatedData.userId = userId; // Add userId to validated data
    } else {
      // console.log("🕶️ Processing as guest user");
      // Guest order
      validatedData = guestOrderSchema.parse(req.body);
    }

    const result = await OrderService.createOrder(validatedData);

    sendResponse(res, {
      statusCode: 201,
      success: true,
      message: userId ? "Order placed successfully!" : "Guest order placed successfully!",
      data: result,
    });
  }),

  getOrders: catchAsync(async (req: Request, res: Response) => {
    console.log("🔍 Debug - getOrders req.user:", req.user);
    
    const userId = req.user?.id;
    const result = await OrderService.getOrders(userId);

    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: "Orders retrieved successfully!",
      data: result,
    });
  }),

  getOrderById: catchAsync(async (req: Request, res: Response) => {
    const { id } = req.params;
    const result = await OrderService.getOrderById(id);

    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: "Order details retrieved successfully!",
      data: result,
    });
  }),
};