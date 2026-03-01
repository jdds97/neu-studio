import type { APIRoute } from 'astro';

const BRAND = {
  blue: '#2A2AEE',
  dark: '#1A1A1A',
  gray: '#737373',
  border: '#E5E5E5',
  bg: '#FAFAFA',
};

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function buildStudioEmail(name: string, email: string, phone: string, message: string): string {
  return `<!DOCTYPE html>
<html lang="es">
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1.0"></head>
<body style="margin:0;padding:0;background-color:${BRAND.bg};font-family:Arial,Helvetica,sans-serif;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:${BRAND.bg};">
    <tr><td align="center" style="padding:40px 20px;">
      <table role="presentation" width="600" cellpadding="0" cellspacing="0" style="background-color:#ffffff;border-radius:8px;overflow:hidden;box-shadow:0 2px 8px rgba(0,0,0,0.06);">
        <!-- Header -->
        <tr>
          <td style="background-color:${BRAND.dark};padding:32px 40px;text-align:center;">
            <h1 style="margin:0;font-size:22px;font-weight:700;color:#ffffff;letter-spacing:4px;">NEU STUDIO</h1>
          </td>
        </tr>
        <!-- Blue accent line -->
        <tr><td style="background-color:${BRAND.blue};height:3px;font-size:0;line-height:0;">&nbsp;</td></tr>
        <!-- Content -->
        <tr>
          <td style="padding:36px 40px;">
            <p style="margin:0 0 6px;font-size:11px;text-transform:uppercase;letter-spacing:2px;color:${BRAND.gray};">Nuevo mensaje</p>
            <h2 style="margin:0 0 28px;font-size:20px;color:${BRAND.dark};font-weight:600;">Formulario de contacto</h2>

            <!-- Info grid -->
            <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:28px;">
              <tr>
                <td style="padding:14px 16px;background-color:${BRAND.bg};border-left:3px solid ${BRAND.blue};margin-bottom:2px;">
                  <p style="margin:0 0 2px;font-size:10px;text-transform:uppercase;letter-spacing:1.5px;color:${BRAND.gray};">Nombre</p>
                  <p style="margin:0;font-size:15px;color:${BRAND.dark};font-weight:500;">${escapeHtml(name)}</p>
                </td>
              </tr>
              <tr><td style="height:2px;"></td></tr>
              <tr>
                <td style="padding:14px 16px;background-color:${BRAND.bg};border-left:3px solid ${BRAND.blue};">
                  <p style="margin:0 0 2px;font-size:10px;text-transform:uppercase;letter-spacing:1.5px;color:${BRAND.gray};">Email</p>
                  <p style="margin:0;font-size:15px;color:${BRAND.dark};">
                    <a href="mailto:${escapeHtml(email)}" style="color:${BRAND.blue};text-decoration:none;">${escapeHtml(email)}</a>
                  </p>
                </td>
              </tr>
              <tr><td style="height:2px;"></td></tr>
              <tr>
                <td style="padding:14px 16px;background-color:${BRAND.bg};border-left:3px solid ${BRAND.blue};">
                  <p style="margin:0 0 2px;font-size:10px;text-transform:uppercase;letter-spacing:1.5px;color:${BRAND.gray};">Telefono</p>
                  <p style="margin:0;font-size:15px;color:${BRAND.dark};">${phone ? `<a href="tel:${escapeHtml(phone)}" style="color:${BRAND.blue};text-decoration:none;">${escapeHtml(phone)}</a>` : '<span style="color:#B0B0B0;font-style:italic;">No proporcionado</span>'}</p>
                </td>
              </tr>
            </table>

            <!-- Message -->
            <p style="margin:0 0 8px;font-size:10px;text-transform:uppercase;letter-spacing:1.5px;color:${BRAND.gray};">Mensaje</p>
            <div style="padding:20px;background-color:${BRAND.bg};border-radius:6px;border:1px solid ${BRAND.border};">
              <p style="margin:0;font-size:14px;line-height:1.7;color:${BRAND.dark};white-space:pre-wrap;">${escapeHtml(message)}</p>
            </div>

            <!-- Quick actions -->
            <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin-top:28px;">
              <tr>
                <td align="center" style="padding:0 4px;">
                  <a href="mailto:${escapeHtml(email)}?subject=Re: Tu consulta en Neu Studio" style="display:inline-block;padding:12px 28px;background-color:${BRAND.blue};color:#ffffff;font-size:13px;font-weight:600;text-decoration:none;border-radius:4px;letter-spacing:0.5px;">Responder por email</a>
                </td>
                <td align="center" style="padding:0 4px;">
                  <a href="https://wa.me/${phone ? phone.replace(/[^0-9]/g, '') : '34695149305'}" style="display:inline-block;padding:12px 28px;background-color:#25D366;color:#ffffff;font-size:13px;font-weight:600;text-decoration:none;border-radius:4px;letter-spacing:0.5px;">WhatsApp</a>
                </td>
              </tr>
            </table>
          </td>
        </tr>
        <!-- Footer -->
        <tr>
          <td style="padding:20px 40px;border-top:1px solid ${BRAND.border};text-align:center;">
            <p style="margin:0;font-size:11px;color:${BRAND.gray};">Enviado desde el formulario de <a href="https://neustudio.es/contacto" style="color:${BRAND.blue};text-decoration:none;">neustudio.es</a></p>
          </td>
        </tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`;
}

function buildClientEmail(name: string): string {
  return `<!DOCTYPE html>
<html lang="es">
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1.0"></head>
<body style="margin:0;padding:0;background-color:${BRAND.bg};font-family:Arial,Helvetica,sans-serif;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:${BRAND.bg};">
    <tr><td align="center" style="padding:40px 20px;">
      <table role="presentation" width="600" cellpadding="0" cellspacing="0" style="background-color:#ffffff;border-radius:8px;overflow:hidden;box-shadow:0 2px 8px rgba(0,0,0,0.06);">
        <!-- Header -->
        <tr>
          <td style="background-color:${BRAND.dark};padding:32px 40px;text-align:center;">
            <h1 style="margin:0;font-size:22px;font-weight:700;color:#ffffff;letter-spacing:4px;">NEU STUDIO</h1>
          </td>
        </tr>
        <!-- Blue accent line -->
        <tr><td style="background-color:${BRAND.blue};height:3px;font-size:0;line-height:0;">&nbsp;</td></tr>
        <!-- Content -->
        <tr>
          <td style="padding:36px 40px;">
            <h2 style="margin:0 0 20px;font-size:20px;color:${BRAND.dark};font-weight:600;">Hemos recibido tu mensaje</h2>
            <p style="margin:0 0 16px;font-size:14px;line-height:1.7;color:${BRAND.gray};">
              Hola <strong style="color:${BRAND.dark};">${escapeHtml(name)}</strong>,
            </p>
            <p style="margin:0 0 16px;font-size:14px;line-height:1.7;color:${BRAND.gray};">
              Gracias por contactar con Neu Studio. Hemos recibido tu consulta y te responderemos lo antes posible.
            </p>
            <p style="margin:0 0 28px;font-size:14px;line-height:1.7;color:${BRAND.gray};">
              Si necesitas una respuesta mas rapida, puedes escribirnos directamente por WhatsApp:
            </p>
            <table role="presentation" cellpadding="0" cellspacing="0" style="margin:0 auto;">
              <tr>
                <td align="center">
                  <a href="https://wa.me/34695149305?text=Hola,%20me%20gustaria%20pedir%20informacion" style="display:inline-block;padding:14px 32px;background-color:#25D366;color:#ffffff;font-size:14px;font-weight:600;text-decoration:none;border-radius:4px;letter-spacing:0.5px;">Escribenos por WhatsApp</a>
                </td>
              </tr>
            </table>
          </td>
        </tr>
        <!-- Info -->
        <tr>
          <td style="padding:0 40px 32px;">
            <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:${BRAND.bg};border-radius:6px;padding:20px;">
              <tr>
                <td style="padding:20px;">
                  <p style="margin:0 0 8px;font-size:10px;text-transform:uppercase;letter-spacing:1.5px;color:${BRAND.gray};">Donde estamos</p>
                  <p style="margin:0 0 4px;font-size:13px;color:${BRAND.dark};">Av. de Espana, 110L</p>
                  <p style="margin:0 0 12px;font-size:13px;color:${BRAND.dark};">41704 Dos Hermanas, Sevilla</p>
                  <p style="margin:0 0 8px;font-size:10px;text-transform:uppercase;letter-spacing:1.5px;color:${BRAND.gray};">Horario</p>
                  <p style="margin:0 0 12px;font-size:13px;color:${BRAND.dark};">Lunes a Sabado: 10:00 - 20:00</p>
                  <p style="margin:0 0 8px;font-size:10px;text-transform:uppercase;letter-spacing:1.5px;color:${BRAND.gray};">Siguenos</p>
                  <p style="margin:0;font-size:13px;">
                    <a href="https://instagram.com/neu.studio_" style="color:${BRAND.blue};text-decoration:none;">Instagram</a>
                    &nbsp;&middot;&nbsp;
                    <a href="https://tiktok.com/@neu.studio_" style="color:${BRAND.blue};text-decoration:none;">TikTok</a>
                  </p>
                </td>
              </tr>
            </table>
          </td>
        </tr>
        <!-- Footer -->
        <tr>
          <td style="padding:20px 40px;border-top:1px solid ${BRAND.border};text-align:center;">
            <p style="margin:0;font-size:11px;color:${BRAND.gray};">
              <a href="https://neustudio.es" style="color:${BRAND.blue};text-decoration:none;font-weight:600;">neustudio.es</a>
              &nbsp;&middot;&nbsp; +34 695 149 305
              &nbsp;&middot;&nbsp; info@neustudio.es
            </p>
          </td>
        </tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`;
}

export const POST: APIRoute = async ({ request, locals }) => {
  const formData = await request.formData();
  const name = formData.get('name') as string;
  const email = formData.get('email') as string;
  const phone = formData.get('phone') as string;
  const message = formData.get('message') as string;

  if (!name || !email || !message) {
    return new Response(JSON.stringify({ error: 'Campos obligatorios' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  const runtime = (locals as any).runtime;
  const resendKey = runtime?.env?.RESEND_API_KEY;
  const contactEmail = runtime?.env?.CONTACT_EMAIL;

  if (!resendKey || !contactEmail) {
    return new Response(JSON.stringify({ error: 'Configuracion de email no disponible. Contacta por WhatsApp.' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  try {
    // Email al estudio
    const studioRes = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${resendKey}`,
      },
      body: JSON.stringify({
        from: 'Neu Studio <info@neustudio.es>',
        to: contactEmail,
        reply_to: email,
        subject: `Contacto web: ${name}`,
        html: buildStudioEmail(name, email, phone, message),
      }),
    });

    if (!studioRes.ok) {
      const errorData = await studioRes.text();
      console.error('Resend error:', studioRes.status, errorData);
      return new Response(JSON.stringify({ error: 'Error enviando email' }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // Email de confirmacion al cliente (no bloquea si falla)
    fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${resendKey}`,
      },
      body: JSON.stringify({
        from: 'Neu Studio <info@neustudio.es>',
        to: email,
        subject: 'Hemos recibido tu mensaje - Neu Studio',
        html: buildClientEmail(name),
      }),
    }).catch(() => {});

    return new Response(JSON.stringify({ success: true }), {
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (err) {
    console.error('Contact form error:', err);
    return new Response(JSON.stringify({ error: 'Error interno' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
};
