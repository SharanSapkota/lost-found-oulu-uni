import { Router } from "express";
import { itemController } from "../controllers/item.controller";
import { authenticate } from "../middleware/auth.middleware";
import { requireAdmin } from "../middleware/role.middleware";
import { requireEventScope } from "../middleware/eventScope.middleware";
import { validate } from "../middleware/validate.middleware";
import { uploadItemSchema, updateItemSchema } from "../schemas/item.schema";
import { upload } from "../middleware/upload.middleware";

const router = Router();

router.get("/public/:slug", itemController.getItemsByEvent);
router.get("/:id", itemController.getItemById);
router.post("/public/:slug/upload", upload.single("file"), itemController.uploadItem);

router.get("/event/:eventId", authenticate, requireAdmin, requireEventScope, itemController.getItemsByEvent);
router.patch("/:id/reunite", authenticate, requireAdmin, itemController.markAsReunited);
router.patch("/:id", authenticate, requireAdmin, validate(updateItemSchema), itemController.editItem);
router.delete("/:id", authenticate, requireAdmin, itemController.deleteItem);

export default router;