import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export const emailService = {

  sendPickupCode: async (data: {
    to: string;
    claimerName: string;
    itemName: string;
    pickupCode: string;
    eventName: string;
  }): Promise<void> => {
    const { to, claimerName, itemName, pickupCode, eventName } = data;

    await resend.emails.send({
      from: process.env.RESEND_FROM_EMAIL!,
      to,
      subject: `Your pickup code for "${itemName}" — OuluFind`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 500px; margin: 0 auto;">
          <h2 style="color: #00529B;">Your Claim Has Been Approved! 🎉</h2>
          
          <p>Hi ${claimerName},</p>
          
          <p>Great news! Your claim for <strong>${itemName}</strong> at 
          <strong>${eventName}</strong> has been approved.</p>
          
          <p>Please bring this pickup code when you come to collect your item:</p>
          
          <div style="
            background: #F0F4FF;
            border: 2px dashed #00529B;
            border-radius: 8px;
            padding: 24px;
            text-align: center;
            margin: 24px 0;
          ">
            <p style="margin: 0; font-size: 14px; color: #666;">Your Pickup Code</p>
            <h1 style="
              margin: 8px 0 0;
              font-size: 36px;
              letter-spacing: 6px;
              color: #00529B;
              font-family: monospace;
            ">${pickupCode}</h1>
          </div>
          
          <p>Show this code to the staff at the lost & found desk to collect your item.</p>
          
          <p style="color: #888; font-size: 13px;">
            If you did not submit this claim, please ignore this email.
          </p>
          
          <hr style="border: none; border-top: 1px solid #eee; margin: 24px 0;" />
          
          <p style="color: #888; font-size: 12px; text-align: center;">
            OuluFind — University of Oulu Lost & Found
          </p>
        </div>
      `,
    });
  },

  sendClaimNotificationToAdmin: async (data: {
    to: string;
    claimerName: string;
    itemName: string;
    pickupCode: string;
  }): Promise<void> => {
    const { to, claimerName, itemName, pickupCode } = data;

    await resend.emails.send({
      from: process.env.RESEND_FROM_EMAIL!,
      to,
      subject: `Claim approved — Pickup code for "${itemName}"`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 500px; margin: 0 auto;">
          <h2 style="color: #00529B;">Claim Approved</h2>
          
          <p>You approved a claim. Here are the details:</p>
          
          <table style="width: 100%; border-collapse: collapse;">
            <tr>
              <td style="padding: 8px; color: #666;">Item</td>
              <td style="padding: 8px;"><strong>${itemName}</strong></td>
            </tr>
            <tr style="background: #f9f9f9;">
              <td style="padding: 8px; color: #666;">Claimer</td>
              <td style="padding: 8px;"><strong>${claimerName}</strong></td>
            </tr>
            <tr>
              <td style="padding: 8px; color: #666;">Pickup Code</td>
              <td style="padding: 8px;">
                <strong style="font-family: monospace; font-size: 20px; 
                letter-spacing: 3px; color: #00529B;">${pickupCode}</strong>
              </td>
            </tr>
          </table>
          
          <p style="margin-top: 24px;">
            When the claimer arrives, verify their pickup code matches 
            <strong>${pickupCode}</strong> before handing over the item.
          </p>
          
          <hr style="border: none; border-top: 1px solid #eee; margin: 24px 0;" />
          
          <p style="color: #888; font-size: 12px; text-align: center;">
            OuluFind — University of Oulu Lost & Found
          </p>
        </div>
      `,
    });
  },

};