import { claimRepository } from "../repositories/claim.repository";
import { itemRepository } from "../repositories/item.repository";
import { notificationRepository } from "../repositories/notification.repository";
import { NotificationType, ClaimStatus, ItemStatus } from "../constants/enums";
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

  approveClaim: async (claimId: any, adminNote?: string) => {
  const claim = await claimRepository.findById(claimId);
  if (!claim) throw new Error("Claim not found");
  if (claim.status !== ClaimStatus.PENDING) throw new Error("Claim is no longer pending");

  const alreadyApproved = await claimRepository.hasApprovedClaim(claim.itemId);
  if (alreadyApproved) throw new Error("This item already has an approved claim");

  const updated = await claimRepository.updateStatus(claimId, ClaimStatus.APPROVED, adminNote);
  await itemRepository.updateStatus(claim.itemId, ItemStatus.CLAIMED);

  await notificationRepository.create({
    type: NotificationType.CLAIM_APPROVED,
    recipient: claim.claimerContact,
    message: `Your claim for "${claim.item.name}" has been approved. Please come to collect it.`,
    claimId: claim.id,
  });

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