import { Router } from 'express';
import { UserRoutes } from '../modules/User/user.route';
import { AuthRoutes } from '../modules/Auth/auth.route';



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
//   {
//     path: '/purchase',
//     route: PurchaseRoutes,
//   },
 
//   {
//     path: '/payment',
//     route: PaymentRoutes,
//   },
];

moduleRoutes.forEach((route) => router.use(route.path, route.route));

export default router;
 