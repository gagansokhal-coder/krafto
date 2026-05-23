import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, email, subject, message } = body;

    // Basic validation
    if (!name || !email || !message) {
      return NextResponse.json(
        { error: 'Name, email, and message are required', code: 'VALIDATION_ERROR' },
        { status: 400 }
      );
    }

    // Email format validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Invalid email format', code: 'INVALID_EMAIL' },
        { status: 400 }
      );
    }

    // In production, you'd send an email, store in DB, or push to a CRM.
    // For now, we log and return success.
    console.log('📧 Contact form submission:', { name, email, subject, message });

    return NextResponse.json(
      {
        success: true,
        message: 'Thank you for reaching out. Our concierge team will respond within 24 hours.',
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('POST /api/contact error:', error);
    return NextResponse.json(
      { error: 'Failed to submit contact form', code: 'CONTACT_SUBMIT_ERROR' },
      { status: 500 }
    );
  }
}
