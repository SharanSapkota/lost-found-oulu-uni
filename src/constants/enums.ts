
export const Role = {
  SUPER_ADMIN: "SUPER_ADMIN",
  ADMIN: "ADMIN",
} as const;

export const EventType = {
  UNIVERSITY: "UNIVERSITY",
  FESTIVAL: "FESTIVAL",
  CONFERENCE: "CONFERENCE",
  SPORTS: "SPORTS",
  OTHER: "OTHER",
} as const;

export const EventStatus = {
  ACTIVE: "ACTIVE",
  EXPIRED: "EXPIRED",
  ARCHIVED: "ARCHIVED",
} as const;

export const Category = {
  ELECTRONICS: "ELECTRONICS",
  CLOTHING: "CLOTHING",
  DOCUMENTS: "DOCUMENTS",
  ACCESSORIES: "ACCESSORIES",
  OTHER: "OTHER",
} as const;

export const ItemStatus = {
  UNCLAIMED: "UNCLAIMED",
  CLAIMED: "CLAIMED",
  REUNITED: "REUNITED",
  EXPIRED: "EXPIRED",
} as const;

export const ClaimStatus = {
  PENDING: "PENDING",
  APPROVED: "APPROVED",
  REJECTED: "REJECTED",
} as const;

export const NotificationType = {
  CLAIM_SUBMITTED: "CLAIM_SUBMITTED",
  CLAIM_APPROVED: "CLAIM_APPROVED",
  CLAIM_REJECTED: "CLAIM_REJECTED",
} as const;

export const NotificationStatus = {
  PENDING: "PENDING",
  SENT: "SENT",
  FAILED: "FAILED",
} as const;


export type RoleType = typeof Role[keyof typeof Role];
export type EventTypeType = typeof EventType[keyof typeof EventType];
export type EventStatusType = typeof EventStatus[keyof typeof EventStatus];
export type CategoryType = typeof Category[keyof typeof Category];
export type ItemStatusType = typeof ItemStatus[keyof typeof ItemStatus];
export type ClaimStatusType = typeof ClaimStatus[keyof typeof ClaimStatus];
export type NotificationTypeType = typeof NotificationType[keyof typeof NotificationType];
export type NotificationStatusType = typeof NotificationStatus[keyof typeof NotificationStatus];