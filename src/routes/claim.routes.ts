import { Router } from "express";
import { claimController } from "../controllers/claim.controller";
import { authenticate } from "../middleware/auth.middleware";
import { requireAdmin } from "../middleware/role.middleware";
import { requireEventScope } from "../middleware/eventScope.middleware";
import { validate } from "../middleware/validate.middleware";
import { submitClaimSchema, reviewClaimSchema } from "../schemas/claim.schema";

const router = Router();

// Public — submit a claim
router.post("/item/:itemId", validate(submitClaimSchema), claimController.submitClaim);

// Admin + super admin
router.get("/event/:eventId", authenticate, requireAdmin, requireEventScope, claimController.getClaimsByEvent);
router.get("/item/:itemId", authenticate, requireAdmin, claimController.getClaimsByItem);
router.get("/:id", authenticate, requireAdmin, claimController.getClaimById);
router.patch("/:id/approve", authenticate, requireAdmin, validate(reviewClaimSchema), claimController.approveClaim);
router.patch("/:id/reject", authenticate, requireAdmin, validate(reviewClaimSchema), claimController.rejectClaim);

export default router;