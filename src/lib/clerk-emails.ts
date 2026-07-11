// Locales for each email template type.
// Add new languages by extending the map for each template.

type EmailStrings = {
  preheader: string;
  heading: string;
  body: string;
  cta?: string;
  caption?: string;
  security?: string;
  footer: string;
};

const LOCALES: Record<string, Record<string, EmailStrings>> = {

  // ---- PT ----
  pt: {
    email_link_sign_in: {
      preheader: "Link de acesso para Faro",
      heading: "Link de acesso",
      body: "Clica no botão abaixo para iniciares sessão na tua conta Faro.",
      cta: "Iniciar sessão",
      caption: "Este link expira em {ttl} minutos.",
      security: "Pedido de {from} às {at}.",
      footer: "A equipa Faro",
    },
    email_link_sign_up: {
      preheader: "Confirma o teu email na Faro",
      heading: "Bem-vindo à Faro",
      body: "Clica no botão abaixo para confirmares o teu email e ativares a tua conta. A tua jornada está prestes a começar.",
      cta: "Ativar conta",
      caption: "Este link expira em {ttl} minutos.",
      security: "Pedido de {from} às {at}.",
      footer: "A equipa Faro",
    },
    email_link_verify_email: {
      preheader: "Verifica o teu email na Faro",
      heading: "Confirma o teu email",
      body: "Clica no botão abaixo para verificares o teu endereço de email e manteres a tua conta segura.",
      cta: "Verificar email",
      caption: "Este link expira em {ttl} minutos.",
      security: "Pedido de {from} às {at}.",
      footer: "A equipa Faro",
    },
    invitation: {
      preheader: "Convidaram-te para a Faro",
      heading: "Convite",
      body: "Convidou-te para aprender idiomas na Faro. Desafia os teus amigos e constrói a tua streak diária.",
      cta: "Aceitar convite",
      caption: "Se não conheces o remetente, ignora este email.",
      footer: "A equipa Faro",
    },
    verification_code: {
      preheader: "Código de verificação Faro",
      heading: "Código de verificação",
      body: "Usa o código abaixo para verificares o teu email na Faro.",
      caption: "Este código expira em 10 minutos. Não o partilhes com ninguém.",
      security: "Pedido de {from} às {at}.",
      footer: "A equipa Faro",
    },
    account_locked: {
      preheader: "Conta bloqueada por segurança",
      heading: "Conta bloqueada",
      body: "A tua conta foi temporariamente bloqueada devido a múltiplas tentativas de acesso falhadas.",
      caption: "Redefine a tua password ou aguarda alguns minutos. Se não reconheces esta atividade, contacta o suporte.",
      security: "Tentativas de {from} às {at}.",
      footer: "A equipa Faro",
    },
    password_changed: {
      preheader: "Password alterada com sucesso",
      heading: "Password alterada",
      body: "A tua password foi alterada com sucesso. Se foste tu, ignora este email.",
      caption: "Se não reconheces esta alteração, recupera o acesso à tua conta imediatamente.",
      security: "Alteração de {from} às {at}.",
      footer: "A equipa Faro",
    },
    password_removed: {
      preheader: "Password removida da tua conta",
      heading: "Password removida",
      body: "A password da tua conta foi removida. Passaste a usar autenticação sem password (magic links ou redes sociais).",
      caption: "Se não fizeste esta alteração, adiciona uma nova password nas definições da tua conta.",
      security: "Alteração de {from} às {at}.",
      footer: "A equipa Faro",
    },
    primary_email_address_changed: {
      preheader: "Email principal alterado",
      heading: "Email atualizado",
      body: "O email principal da tua conta foi alterado para:",
      caption: "Se não fizeste esta alteração, contacta o suporte imediatamente.",
      security: "Alteração de {from} às {at}.",
      footer: "A equipa Faro",
    },
    reset_password_code: {
      preheader: "Código de redefinição de password Faro",
      heading: "Redefinir password",
      body: "Usa o código abaixo para redefinires a tua password na Faro.",
      caption: "Este código expira em 10 minutos. Se não pediste redefinição, ignora este email.",
      security: "Pedido de {from} às {at}.",
      footer: "A equipa Faro",
    },
    sign_in_from_new_device: {
      preheader: "Novo acesso detetado na tua conta",
      heading: "Novo dispositivo",
      body: "Detetámos um novo acesso à tua conta a partir de um dispositivo ou localização diferente do habitual.",
      caption: "Se foste tu, não precisas de fazer nada. Se não reconheces esta atividade, altera a tua password.",
      security: "Acesso de {from} às {at}.",
      footer: "A equipa Faro",
    },
  },

  // ---- EN ----
  en: {
    email_link_sign_in: {
      preheader: "Sign-in link for Faro",
      heading: "Sign-in link",
      body: "Click the button below to sign in to your Faro account.",
      cta: "Sign in",
      caption: "This link expires in {ttl} minutes.",
      security: "Request from {from} at {at}.",
      footer: "The Faro team",
    },
    email_link_sign_up: {
      preheader: "Confirm your email on Faro",
      heading: "Welcome to Faro",
      body: "Click the button below to confirm your email and activate your account. Your journey is about to begin.",
      cta: "Activate account",
      caption: "This link expires in {ttl} minutes.",
      security: "Request from {from} at {at}.",
      footer: "The Faro team",
    },
    email_link_verify_email: {
      preheader: "Verify your email on Faro",
      heading: "Verify your email",
      body: "Click the button below to verify your email address and keep your account secure.",
      cta: "Verify email",
      caption: "This link expires in {ttl} minutes.",
      security: "Request from {from} at {at}.",
      footer: "The Faro team",
    },
    invitation: {
      preheader: "You've been invited to Faro",
      heading: "Invitation",
      body: "Invited you to learn languages on Faro. Challenge your friends and build your daily streak.",
      cta: "Accept invitation",
      caption: "If you don't know the sender, ignore this email.",
      footer: "The Faro team",
    },
    verification_code: {
      preheader: "Faro verification code",
      heading: "Verification code",
      body: "Use the code below to verify your email on Faro.",
      caption: "This code expires in 10 minutes. Do not share it with anyone.",
      security: "Request from {from} at {at}.",
      footer: "The Faro team",
    },
    account_locked: {
      preheader: "Account locked for security",
      heading: "Account locked",
      body: "Your account has been temporarily locked due to multiple failed login attempts.",
      caption: "Reset your password or wait a few minutes. If you don't recognize this activity, contact support.",
      security: "Attempts from {from} at {at}.",
      footer: "The Faro team",
    },
    password_changed: {
      preheader: "Password changed successfully",
      heading: "Password changed",
      body: "Your password has been changed successfully. If it was you, ignore this email.",
      caption: "If you don't recognize this change, secure your account immediately.",
      security: "Change from {from} at {at}.",
      footer: "The Faro team",
    },
    password_removed: {
      preheader: "Password removed from your account",
      heading: "Password removed",
      body: "Your account password has been removed. You now use passwordless authentication (magic links or social login).",
      caption: "If you didn't make this change, add a new password in your account settings.",
      security: "Change from {from} at {at}.",
      footer: "The Faro team",
    },
    primary_email_address_changed: {
      preheader: "Primary email changed",
      heading: "Email updated",
      body: "Your primary email has been changed to:",
      caption: "If you didn't make this change, contact support immediately.",
      security: "Change from {from} at {at}.",
      footer: "The Faro team",
    },
    reset_password_code: {
      preheader: "Faro password reset code",
      heading: "Reset password",
      body: "Use the code below to reset your password on Faro.",
      caption: "This code expires in 10 minutes. If you didn't request this, ignore this email.",
      security: "Request from {from} at {at}.",
      footer: "The Faro team",
    },
    sign_in_from_new_device: {
      preheader: "New sign-in detected on your account",
      heading: "New device",
      body: "We detected a new sign-in to your account from an unfamiliar device or location.",
      caption: "If it was you, you're all set. If you don't recognize this activity, change your password.",
      security: "Access from {from} at {at}.",
      footer: "The Faro team",
    },
  },
};

// Helpers to parameterise
function fill(template: string, vars: Record<string, string>): string {
  return template.replace(/\{(\w+)\}/g, (_, key) => vars[key] ?? `{${key}}`);
}

function wrapLayout(
  heading: string,
  bodyHtml: string,
  preheader: string,
  accentColor: string,
  locale: string,
): string {
  const year = new Date().getFullYear();
  const appName = "Faro";
  const tagline = "A Lighthouse for Language Learners";
  return `<!DOCTYPE html>
<html lang="${locale}">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${heading} — ${appName}</title>
</head>
<body style="margin:0;padding:0;background-color:#f8fafc;font-family:'Nunito','Segoe UI',system-ui,-apple-system,sans-serif;-webkit-font-smoothing:antialiased;">
  <div style="display:none;max-height:0;overflow:hidden;opacity:0;font-size:0;mso-hide:all;">${preheader}</div>
  <table width="100%" border="0" cellpadding="0" cellspacing="0" style="background-color:#f8fafc;padding:40px 16px;">
    <tr>
      <td align="center">
        <table width="100%" border="0" cellpadding="0" cellspacing="0" style="max-width:520px;margin:0 auto;background-color:#ffffff;border-radius:20px;overflow:hidden;border-collapse:separate;">
          <tr>
            <td style="background-color:${accentColor};height:6px;padding:0;font-size:0;line-height:0;">&nbsp;</td>
          </tr>
          <tr>
            <td style="padding:48px 40px 40px;text-align:center;">
              <h1 style="margin:0 0 16px;font-size:26px;line-height:34px;font-weight:800;color:#0f172a;letter-spacing:-0.3px;">${heading}</h1>
              ${bodyHtml}
            </td>
          </tr>
        </table>
        <table width="100%" border="0" cellpadding="0" cellspacing="0" style="max-width:520px;margin:0 auto;">
          <tr>
            <td style="padding:24px 0 40px;text-align:center;">
              <div style="border-top:1px solid #e2e8f0;margin-bottom:16px;"></div>
              <p style="margin:0 0 4px;font-size:12px;color:#94a3b8;">${appName} — ${tagline}</p>
              <p style="margin:0;font-size:12px;color:#94a3b8;">&copy; ${year} ${appName}</p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}

type TemplateVars = {
  action_url?: string;
  magic_link?: string;
  otp_code?: string;
  ttl_minutes?: string;
  requested_from?: string;
  requested_at?: string;
  inviter_name?: string;
  inviter_email?: string;
  user_email_address?: string;
};

function isMagicLinkTemplate(type: string): boolean {
  return ["email_link_sign_in", "email_link_sign_up", "email_link_verify_email"].includes(type);
}

function isCodeTemplate(type: string): boolean {
  return ["verification_code", "reset_password_code"].includes(type);
}

function isSecurityTemplate(type: string): boolean {
  return ["account_locked", "sign_in_from_new_device"].includes(type);
}

export function renderClerkEmail(
  templateType: string,
  locale: string,
  vars: TemplateVars,
): { subject: string; html: string } {
  const lang: string = LOCALES[locale] ? locale : "en";
  const strings: EmailStrings | undefined = LOCALES[lang]?.[templateType];
  if (!strings) {
    throw new Error(`Unknown template type "${templateType}" or locale "${locale}"`);
  }

  const heading = strings.heading;
  const appName = "Faro";
  const accent = isSecurityTemplate(templateType) ? "#ff4b4b" : "#58cc02";

  // Build body parts in order
  const parts: string[] = [];

  // 1. Body text (and code/special blocks)
  if (isCodeTemplate(templateType)) {
    parts.push(`<p style="margin:0 0 28px;font-size:15px;line-height:24px;color:#475569;">${strings.body}</p>`);
    parts.push(`<table border="0" cellpadding="0" cellspacing="0" style="background-color:#f0fdf4;border-radius:16px;margin:0 auto 28px;">
      <tr>
        <td style="padding:24px 40px;font-size:40px;line-height:48px;font-weight:800;color:#58cc02;letter-spacing:4px;text-align:center;">
          ${vars.otp_code ?? "------"}
        </td>
      </tr>
    </table>`);
  } else if (templateType === "invitation") {
    if (vars.inviter_name) {
      parts.push(`<p style="margin:0 0 6px;font-size:15px;line-height:24px;color:#475569;"><strong>${vars.inviter_name}</strong>${vars.inviter_email ? ` (${vars.inviter_email})` : ""}</p>`);
    }
    parts.push(`<p style="margin:0 0 32px;font-size:15px;line-height:24px;color:#475569;">${strings.body}</p>`);
  } else if (templateType === "primary_email_address_changed") {
    parts.push(`<p style="margin:0 0 20px;font-size:15px;line-height:24px;color:#475569;">${strings.body}</p>`);
    parts.push(`<p style="margin:0 0 24px;font-size:18px;line-height:26px;font-weight:700;color:#58cc02;">${vars.user_email_address ?? ""}</p>`);
  } else {
    parts.push(`<p style="margin:0 0 32px;font-size:15px;line-height:24px;color:#475569;">${strings.body}</p>`);
  }

  // 2. CTA button (before caption)
  const hasCta = !isCodeTemplate(templateType) && strings.cta;
  if (hasCta) {
    const link = isMagicLinkTemplate(templateType) ? vars.magic_link : vars.action_url;
    if (link) {
      parts.push(`<div style="margin:32px 0 8px;text-align:center;">
        <a href="${link}" target="_blank" style="display:inline-block;background-color:#58cc02;color:#ffffff!important;font-size:15px;font-weight:700;text-decoration:none;padding:16px 40px;border-radius:16px;text-align:center;">
          ${strings.cta}
        </a>
      </div>`);
    }
  }

  // 3. Caption / secondary text
  if (strings.caption) {
    const caption = fill(strings.caption, {
      ttl: vars.ttl_minutes ?? "10",
      from: vars.requested_from ?? "",
      at: vars.requested_at ?? "",
    });
    parts.push(`<p style="margin:0;font-size:13px;line-height:20px;color:#94a3b8;">${caption}</p>`);
  }

  // 4. Security metadata + divider
  if (strings.security) {
    const sec = fill(strings.security, {
      from: vars.requested_from ?? "",
      at: vars.requested_at ?? "",
    });
    parts.push(`<div style="border-top:1px solid #e2e8f0;margin:32px 0 20px;"></div>`);
    parts.push(`<p style="margin:0 0 4px;font-size:12px;line-height:18px;color:#94a3b8;">${sec}</p>`);
  }

  // 5. Footer signature
  parts.push(`<p style="margin:0;font-size:12px;line-height:18px;color:#94a3b8;">${strings.footer}</p>`);

  const bodyHtml = parts.join("");
  const html = wrapLayout(heading, bodyHtml, strings.preheader, accent, lang);

  // Subject line
  let subject = `${heading} - ${appName}`;
  if (templateType === "verification_code" && vars.otp_code) {
    subject = `${vars.otp_code} e o teu codigo de verificacao ${appName}`;
  } else if (templateType === "reset_password_code" && vars.otp_code) {
    subject = `${vars.otp_code} - codigo de redefinicao de password ${appName}`;
  } else if (templateType === "invitation" && vars.inviter_name) {
    subject = `${vars.inviter_name} convidou-te para ${appName}`;
  } else if (templateType === "primary_email_address_changed") {
    subject = `Email principal alterado - ${appName}`;
  }

  return { subject, html };
}
