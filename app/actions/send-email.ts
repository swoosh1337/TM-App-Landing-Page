'use server'

export async function sendEmail(formData: FormData) {
  if (!process.env.RESEND_API_KEY) {
    console.error('RESEND_API_KEY is not set')
    return { success: false, error: 'Configuration error' }
  }

  const email = formData.get('email')
  const message = formData.get('message')

  if (!email || !message) {
    return { success: false, error: 'Missing required fields' }
  }

  try {
    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.RESEND_API_KEY}`,
      },
      body: JSON.stringify({
        from: 'TM App <onboarding@resend.dev>',
        to: 'tazigrigolia@gmail.com',
        subject: 'New Contact Form Submission',
        text: `New message from ${email}:\n\n${message}`,
        reply_to: email as string,
      }),
    })

    const data = await response.json()

    if (!response.ok) {
      throw new Error(data.message || 'Failed to send email')
    }

    return { success: true }
  } catch (error) {
    console.error('Error sending email:', error)
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Failed to send email'
    }
  }
} 