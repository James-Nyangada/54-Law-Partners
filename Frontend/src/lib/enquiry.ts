export interface Enquiry {
  name: string;
  email: string;
  organisation: string;
  matter: string;
}

/**
 * Sends a contact enquiry.
 *
 * NOT YET CONNECTED. There is no backend yet (the `server/` folder is empty).
 * In development this pretends to succeed so the confirmation can be reviewed.
 * In production it refuses, so the form shows an error pointing people to the
 * firm's email rather than silently dropping their message.
 *
 * To connect: replace the body with a POST to the firm's endpoint or an email
 * service, and throw on any non-success response.
 */
export async function submitEnquiry(enquiry: Enquiry): Promise<void> {
  if (process.env.NODE_ENV === "production") {
    throw new Error("The enquiry endpoint is not configured.");
  }
  console.info("[enquiry] Not sent: no backend is connected yet.", enquiry);
  await new Promise((resolve) => setTimeout(resolve, 600));
}
