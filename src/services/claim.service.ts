import { claimRepository } from "../repositories/claim.repository";
import { itemRepository } from "../repositories/item.repository";
import { notificationRepository } from "../repositories/notification.repository";
import { NotificationType, ClaimStatus, ItemStatus } from "../constants/enums";
import { generatePickupCode } from "../utils/pickupCode";
import { emailService } from "./email.service";

export const claimService = {

  getClaimsByEvent: async (eventId: any, filters?: { status?: any }) => {
    return claimRepository.findAllByEvent(eventId, filters);
  },
  
getClaimById: async (id: any) => {
    return claimRepository.findById(id);
  },

  getClaimsByItem: async (itemId: any) => {
    return claimRepository.findAllByItem(itemId);
  },

  submitClaim: async (itemId: any, data: {
    claimerName: string;
    claimerContact: string;
    ownershipProof: string;
  }) => {
    const item = await itemRepository.findById(itemId);
    if (!item) throw new Error("Item not found");
    if (item.status === ItemStatus.REUNITED) throw new Error("Item has already been reunited");
    if (item.status === ItemStatus.EXPIRED) throw new Error("Item has expired");

    const claim = await claimRepository.create({ ...data, itemId });

    // Log notification (actual sending handled separately)
    await notificationRepository.create({
      type: NotificationType.CLAIM_SUBMITTED,
      recipient: data.claimerContact,
      message: `Your claim for "${item.name}" has been submitted and is under review.`,
      claimId: claim.id,
    });

    return claim;
  },


approveClaim: async (claimId: string, adminNote?: string, adminEmail?: string) => {
  const claim = await claimRepository.findById(claimId);
  if (!claim) throw new Error("Claim not found");
  if (claim.status !== "PENDING") throw new Error("Claim is no longer pending");

  const alreadyApproved = await claimRepository.hasApprovedClaim(claim.itemId);
  if (alreadyApproved) throw new Error("This item already has an approved claim");

  const pickupCode = generatePickupCode();

  const updated = await claimRepository.updateStatus(
    claimId,
    "APPROVED",
    adminNote,
    pickupCode
  );

  await itemRepository.updateStatus(claim.itemId, "CLAIMED");

  const isEmail = claim.claimerContact.includes("@");

  if (isEmail) {
    await emailService.sendPickupCode({
      to: claim.claimerContact,
      claimerName: claim.claimerName,
      itemName: claim.item.name,
      pickupCode,
      eventName: claim.item.event.name,
    });
  }

  await notificationRepository.create({
    type: "CLAIM_APPROVED",
    recipient: claim.claimerContact,
    message: `Your claim for "${claim.item.name}" has been approved. Pickup code: ${pickupCode}`,
    claimId: claim.id,
  });

   if (adminEmail) {
    await emailService.sendClaimNotificationToAdmin({
      to: adminEmail,
      claimerName: claim.claimerName,
      itemName: claim.item.name,
      pickupCode,
    });
  }


  return updated;
},

  rejectClaim: async (claimId: any, adminNote?: string) => {
    const claim = await claimRepository.findById(claimId);
    if (!claim) throw new Error("Claim not found");
    if (claim.status !== ClaimStatus.PENDING) throw new Error("Claim is no longer pending");

    const updated = await claimRepository.updateStatus(claimId, ClaimStatus.REJECTED, adminNote);

    // Log notification
    await notificationRepository.create({
      type: NotificationType.CLAIM_REJECTED,
      recipient: claim.claimerContact,
      message: `Your claim for "${claim.item.name}" was not approved. Please contact the event team for more information.`,
      claimId: claim.id,
    });

    return updated;
  },

};