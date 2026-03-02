import { Router } from "express";
import { eventController } from "../controllers/event.controller";
import { authenticate } from "../middleware/auth.middleware";
import { requireSuperAdmin, requireAdmin } from "../middleware/role.middleware";
import { requireEventScope } from "../middleware/eventScope.middleware";
import { validate } from "../middleware/validate.middleware";
import { createEventSchema, updateEventSchema } from "../schemas/event.schema";

const router = Router();

router.get("/public/:slug", eventController.getEventBySlug);

router.get("/", authenticate, requireSuperAdmin, eventController.getAllEvents);
router.post("/", authenticate, requireSuperAdmin, validate(createEventSchema), eventController.createEvent);
router.get("/stats/global", authenticate, requireSuperAdmin, eventController.getGlobalStats);
router.patch("/:id/deactivate", authenticate, requireSuperAdmin, eventController.deactivateEvent);

router.get("/:id/stats", authenticate, requireAdmin, requireEventScope, eventController.getEventStats);
router.patch("/:id", authenticate, requireAdmin, requireEventScope, validate(updateEventSchema), eventController.updateEvent);
router.patch("/:id/config", authenticate, requireAdmin, requireEventScope, eventController.updateEventConfig);

export default router;