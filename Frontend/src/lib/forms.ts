/**
 * Form submissions: the enquiry, alert subscriptions and job applications.
 *
 * NOT YET CONNECTED. There is no backend yet (`server/` is empty). Set
 * NEXT_PUBLIC_FORMS_ENDPOINT to a URL that accepts a JSON POST of
 * `{ form, fields }` (or multipart for applications) and returns 2xx.
 *
 * Without an endpoint, development pretends to succeed so the confirmation
 * states can be reviewed; production refuses, so visitors see an honest error
 * rather than a message silently dropped.
 */

const ENDPOINT = process.env.NEXT_PUBLIC_FORMS_ENDPOINT;

export type FormName = "enquiry" | "subscribe" | "application";

export async function submitForm(form: FormName, fields: Record<string, string>, file?: File | null) {
  if (!ENDPOINT) {
    if (process.env.NODE_ENV === "production") {
      throw new Error("The form endpoint is not configured.");
    }
    console.info(`[forms] "${form}" not sent: no endpoint is configured.`, fields);
    await new Promise((resolve) => setTimeout(resolve, 700));
    return;
  }

  let response: Response;
  if (file) {
    const body = new FormData();
    body.set("form", form);
    Object.entries(fields).forEach(([key, value]) => body.set(key, value));
    body.set("file", file);
    response = await fetch(ENDPOINT, { method: "POST", body });
  } else {
    response = await fetch(ENDPOINT, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ form, fields }),
    });
  }
  if (!response.ok) throw new Error(`Form endpoint answered ${response.status}.`);
}

export const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
