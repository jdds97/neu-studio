import type { APIRoute } from 'astro';

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

  // Access Cloudflare env vars via locals.runtime
  const runtime = (locals as any).runtime;
  const resendKey = runtime?.env?.RESEND_API_KEY;
  const contactEmail = runtime?.env?.CONTACT_EMAIL;

  if (!resendKey || !contactEmail) {
    console.error('Missing env vars:', {
      hasRuntime: !!runtime,
      hasEnv: !!runtime?.env,
      hasResendKey: !!resendKey,
      hasContactEmail: !!contactEmail,
      envKeys: runtime?.env ? Object.keys(runtime.env).filter((k: string) => !k.startsWith('__')) : 'no env',
    });
    return new Response(JSON.stringify({ error: 'Configuracion de email no disponible. Contacta por WhatsApp.' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  try {
    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${resendKey}`,
      },
      body: JSON.stringify({
        from: 'Neu Studio <info@send.neustudio.es>',
        to: contactEmail,
        subject: `Contacto web: ${name}`,
        html: `<h2>Nuevo mensaje desde la web</h2>
          <p><strong>Nombre:</strong> ${name}</p>
          <p><strong>Email:</strong> ${email}</p>
          <p><strong>Telefono:</strong> ${phone || 'No proporcionado'}</p>
          <p><strong>Mensaje:</strong></p>
          <p>${message}</p>`,
      }),
    });

    if (res.ok) {
      return new Response(JSON.stringify({ success: true }), {
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const errorData = await res.text();
    console.error('Resend error:', res.status, errorData);
    return new Response(JSON.stringify({ error: 'Error enviando email', details: errorData }), {
      status: 500,
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
