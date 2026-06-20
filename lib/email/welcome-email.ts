export type WelcomeEmailInput = {
  email: string;
  fullName: string;
  city?: string;
  neighborhood?: string;
};

export function welcomeEmailSubject(firstName: string) {
  return firstName ? `Welcome to BloomBay, ${firstName}` : "Welcome to BloomBay";
}

export function welcomeEmailHtml(input: WelcomeEmailInput) {
  const firstName = input.fullName.trim().split(/\s+/)[0] || "there";
  const place =
    input.neighborhood && input.city
      ? `${input.neighborhood}, ${input.city}`
      : input.city || input.neighborhood || "your city";

  const appUrl =
    process.env.NEXT_PUBLIC_APP_URL ??
    process.env.NEXT_PUBLIC_SUPABASE_URL?.replace(".supabase.co", "") ??
    "http://127.0.0.1:3000";

  const homeHref = `${appUrl.replace(/\/$/, "")}/member/home`;

  return `<!DOCTYPE html>
<html lang="en">
  <body style="margin:0;padding:0;background:#fff5f7;font-family:Georgia,'Times New Roman',serif;color:#1a0514;">
    <table width="100%" cellpadding="0" cellspacing="0" role="presentation">
      <tr>
        <td align="center" style="padding:32px 16px;">
          <table width="100%" style="max-width:520px;background:#ffffff;border-radius:16px;overflow:hidden;border:1px solid #ffb7ce;">
            <tr>
              <td style="padding:28px 28px 12px;background:linear-gradient(160deg,#ff0055,#ffb7ce);color:#ffffff;">
                <p style="margin:0 0 8px;font-size:11px;letter-spacing:0.2em;text-transform:uppercase;opacity:0.9;">BloomBay</p>
                <h1 style="margin:0;font-size:28px;font-weight:500;line-height:1.2;">You're in, ${firstName}.</h1>
              </td>
            </tr>
            <tr>
              <td style="padding:28px;">
                <p style="margin:0 0 16px;font-size:16px;line-height:1.6;">
                  Welcome to BloomBay — women meeting women IRL in ${place}.
                </p>
                <p style="margin:0 0 24px;font-size:16px;line-height:1.6;">
                  Open seats, clubs, and tonight in the city are waiting for you.
                </p>
                <p style="margin:0 0 28px;">
                  <a href="${homeHref}" style="display:inline-block;background:#ff0055;color:#ffffff;text-decoration:none;padding:14px 22px;border-radius:999px;font-size:15px;font-weight:600;">
                    Enter BloomBay →
                  </a>
                </p>
                <p style="margin:0;font-size:13px;line-height:1.5;color:#8a7a82;">
                  If you didn't create this account, you can ignore this email.
                </p>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>`;
}

export function welcomeEmailText(input: WelcomeEmailInput) {
  const firstName = input.fullName.trim().split(/\s+/)[0] || "there";
  const place =
    input.neighborhood && input.city
      ? `${input.neighborhood}, ${input.city}`
      : input.city || input.neighborhood || "your city";

  return `Welcome to BloomBay, ${firstName}.

You're in — women meeting women IRL in ${place}.

Enter BloomBay: ${process.env.NEXT_PUBLIC_APP_URL ?? "http://127.0.0.1:3000"}/member/home

If you didn't create this account, you can ignore this email.`;
}
