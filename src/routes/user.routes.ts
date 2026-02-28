import { Router } from "express";
import { userController } from "../controllers/user.controller";
import { authenticate } from "../middleware/auth.middleware";
import { requireSuperAdmin } from "../middleware/role.middleware";
import { validate } from "../middleware/validate.middleware";
import { createAdminSchema, resetPasswordSchema } from "../schemas/user.schema";

const router = Router();

router.use(authenticate, requireSuperAdmin);

router.get("/", userController.getAllAdmins);
router.get("/:id", userController.getAdminById);
router.post("/", validate(createAdminSchema), userController.createAdmin);
router.patch("/:id/deactivate", userController.deactivateAdmin);
router.patch("/:id/activate", userController.activateAdmin);
router.patch("/:id/reassign", userController.reassignAdmin);
router.patch("/:id/reset-password", validate(resetPasswordSchema), userController.resetPassword);

export default router;