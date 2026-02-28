interface Env {
  RESEND_API_KEY: string;
  CONTACT_EMAIL: string;
}

export const onRequestPost: PagesFunction<Env> = async (context) => {
  const formData = await context.request.formData();
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

  const res = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${context.env.RESEND_API_KEY}`,
    },
    body: JSON.stringify({
      from: 'web@neustudio.es',
      to: context.env.CONTACT_EMAIL,
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

  return new Response(JSON.stringify({ error: 'Error enviando email' }), {
    status: 500,
    headers: { 'Content-Type': 'application/json' },
  });
};
