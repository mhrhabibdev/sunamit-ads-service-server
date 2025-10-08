import { Router } from "express";
import { AdServiceController } from "./adservice.controller";
import { validationRequest } from "../../middlewares/validationRequest";
import { AdValidation } from "./adservice.validation";

const router = Router();

router.post(
  "/create-adservice",
  validationRequest(AdValidation.createAdServiceValidation),
  AdServiceController.createAdService
);

router.get("/", AdServiceController.getAdAllServices);

router.get("/:id", AdServiceController.getAdServiceById);

router.patch(
  "/:id",
  validationRequest(AdValidation.updateAdServiceValidation),
  AdServiceController.updateAdService
);

router.delete("/:id", AdServiceController.deleteAdService);

export const AdServiceRoutes = router;
