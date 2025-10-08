import { Router } from 'express';
import { UserRoutes } from '../modules/User/user.route';
import { AuthRoutes } from '../modules/Auth/auth.route';
import { AdServiceRoutes } from '../modules/adservice/adservice.route';
import { OrderRoutes } from '../modules/order/order.route';



const router = Router();

const moduleRoutes: { path: string; route: Router }[] = [
  {
    path: '/user',
    route: UserRoutes,
  },
  {
    path: '/auth',
    route: AuthRoutes,
  },
  {
    path: '/adservice',
    route: AdServiceRoutes,
  },
  {
    path: '/order',
    route: OrderRoutes,
  },
 
//   {
//     path: '/payment',
//     route: PaymentRoutes,
//   },
];

moduleRoutes.forEach((route) => router.use(route.path, route.route));

export default router;
 