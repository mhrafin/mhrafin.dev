import { defineAction, ActionError } from "astro:actions";
import { z } from "astro/zod";
import { Resend } from "resend";
import { RESEND_API_KEY, FROM_EMAIL, TO_EMAIL } from "astro:env/server";

const resend = new Resend(RESEND_API_KEY);

export const server = {
  submitMessage: defineAction({
    accept: "form",
    input: z.object({
      name: z.string().min(2, "Name must be at least 2 characters."),
      email: z.email("Enter a valid email address."),
      message: z
        .string()
        .min(10, "Message must be at least 10 characters.")
        .max(5000, "Message must 5000 characters or fewer."),
      website: z.string().optional(),
      formStart: z.coerce.number().optional(),
    }),
    handler: async (input) => {
      const { website, formStart } = input;

      const tooFast =
        typeof formStart === "number" && Date.now() - formStart < 5000;
      if (website || tooFast) return; // silent swallow: no email, bot sees "success"

      const { name, email, message = "" } = input;

      let result;
      try {
        result = await resend.emails.send({
          from: FROM_EMAIL,
          to: TO_EMAIL,
          subject: `New contact message from ${name}`,
          html: `
            <h2>New contact message</h2>
            <p><strong>Name:</strong> ${name}</p>
            <p><strong>Email:</strong> ${email}</p>
            <h3>Message:</h3>
            <p>${message.replace(/\n/g, "<br>")}</p>
          `,
        });
      } catch {
        throw new ActionError({
          code: "INTERNAL_SERVER_ERROR",
          message:
            "Something went wrong sending your message. Please try again later.",
        });
      }

      if (result.error) {
        throw new ActionError({
          code: "INTERNAL_SERVER_ERROR",
          message:
            "Something went wrong sending your message. Please try again later.",
        });
      }
    },
  }),
};
