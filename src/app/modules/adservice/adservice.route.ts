import { Router } from "express";
import { AdServiceController } from "./adservice.controller";



const router = Router();

router.post("/",AdServiceController.createAdService);
router.get("/", AdServiceController.getAdAllServices);
router.get("/:id", AdServiceController.getAdServiceById);
router.patch("/:id", AdServiceController.updateAdService);
router.delete("/:id", AdServiceController.deleteAdService);

export const AdServiceRoutes = router;
