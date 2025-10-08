// modules/Order/order.service.ts
import prisma from "../../shared/prisma";
import { GuestOrderInput, UserOrderInput } from "./order.velidation";


type LoggedInOrder = UserOrderInput & {
  userId: string;
};

type GuestOrder = GuestOrderInput;

type OrderInput = LoggedInOrder | GuestOrder;

export const OrderService = {
  createOrder: async (data: OrderInput) => {
    const quantity = data.quantity || 1;

    // Fetch service
    const service = await prisma.adService.findUnique({
      where: { id: data.serviceId },
    });
    
    if (!service) {
      throw new Error("Service not found");
    }

    const totalPrice = service.price * quantity;

    // Prepare order object
    const orderData: any = {
      serviceId: data.serviceId,
      quantity,
      totalPrice,
    };

    if ("userId" in data) {
      // Logged-in user order
      orderData.userId = data.userId;
    } else {
      // Guest order
      orderData.guestName = data.guestName;
      orderData.guestEmail = data.guestEmail;
      orderData.guestPhone = data.guestPhone;
      orderData.guestLink = data.guestLink || null;
    }

    const result = await prisma.order.create({
      data: orderData,
      include: { 
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          }
        }, 
        service: true 
      },
    });

    return result;
  },

  getOrders: async (userId?: string) => {
    if (userId) {
      // Return orders for specific user
      return prisma.order.findMany({
        where: { userId },
        include: { 
          user: {
            select: {
              id: true,
              name: true,
              email: true,
            }
          }, 
          service: true 
        },
        orderBy: { createdAt: "desc" },
      });
    }

    // Return all orders (for admin or when no user ID provided)
    return prisma.order.findMany({
      include: { 
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          }
        }, 
        service: true 
      },
      orderBy: { createdAt: "desc" },
    });
  },

  getOrderById: async (id: string) => {
    const order = await prisma.order.findUnique({
      where: { id },
      include: { 
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          }
        }, 
        service: true 
      },
    });

    if (!order) {
      throw new Error("Order not found");
    }

    return order;
  },
};