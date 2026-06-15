import { resend } from "./resend";
import { getBaseUrl } from "./env";
import { User } from "@/generated/prisma/client";

export async function sendVerificationEmail(user: User, token: string) {
  const verifyUrl = `${getBaseUrl()}/verify-email?token=${token}`;

  const domain = process.env.DOMAIN;

  try {
    const response = await resend.emails.send({
      from: `verify@${domain}`,
      to: user.email,
      subject: "Zweryfikuj swój e-mail",
      html: `
        <div>
          <h2>Weryfikacja adresu e-mail</h2>
          <p>Kliknij w link, aby zweryfikować konto:</p>
          <a href="${verifyUrl}">${verifyUrl}</a><br/>
          <p>Jeśli to nie Ty zakładałeś konto, zignoruj tę wiadomość.</p>
        </div>
      `,
      //react:
    });

    if (response.error) {
      throw new Error(
        `Failed to send an email: ${response.error.name} ${response.error.message}.`,
      );
    }
  } catch (err) {
    throw err;
  }
}
