import { Request, Response } from "express";
import { claimService } from "../services/claim.service";

export const claimController = {

  getClaimsByEvent: async (req: Request, res: Response) => {
    try {
      const { eventId } = req.params;
      const { status } = req.query;
      const claims = await claimService.getClaimsByEvent(eventId, {
        status: status,
      });
      return res.status(200).json(claims);
    } catch (error: any) {
      return res.status(500).json({ message: error.message });
    }
  },

  getClaimById: async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const claim = await claimService.getClaimById(id);
    return res.status(200).json(claim);
  } catch (error: any) {
    return res.status(404).json({ message: error.message });
  }
},

getClaimsByItem: async (req: Request, res: Response) => {
  try {
    const { itemId } = req.params;
    const claims = await claimService.getClaimsByItem(itemId);
    return res.status(200).json(claims);
  } catch (error: any) {
    return res.status(500).json({ message: error.message });
  }
},

  submitClaim: async (req: Request, res: Response) => {
    try {
      const { itemId } = req.params;
      const claim = await claimService.submitClaim(itemId, req.body);
      return res.status(201).json(claim);
    } catch (error: any) {
      return res.status(400).json({ message: error.message });
    }
  },

approveClaim: async (req: any, res: Response) => {
  try {
    const { id } = req.params;
    // const { adminNote } = req.body;
    const adminNote = 'Approve'
    const adminEmail = req.user!.email;
    
    const claim = await claimService.approveClaim(id, adminNote, adminEmail);
    return res.status(200).json(claim);
  } catch (error: any) {
    return res.status(400).json({ message: error.message });
  }
},

  rejectClaim: async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const { adminNote } = req.body;
      const claim = await claimService.rejectClaim(id, adminNote);
      return res.status(200).json(claim);
    } catch (error: any) {
      return res.status(400).json({ message: error.message });
    }
  },

};