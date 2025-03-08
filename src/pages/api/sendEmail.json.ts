export const prerender = false;

import type { APIRoute } from "astro";
import { Resend } from "resend";

const resend = new Resend(import.meta.env.RESEND_API_KEY);

export const POST: APIRoute = async ({ request }) => {
  const data = await request.formData();
  
  const name = String(data.get("name"));
  const email = String(data.get("email"));
  const subject = String(data.get("subject"));
  const message = String(data.get("message"));

  
  if (!name || !email || !message || !subject) {
    return new Response(
      JSON.stringify({
        message: `Fill out all fields.`,
      }),
      {
        status: 400,
        statusText: "Missing required fields",
      },
    );
  }

  const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
  if (!emailRegex.test(email)) {
    return new Response(
      JSON.stringify({
        message: `Please enter a valid email address.`,
      }),
      {
        status: 400,
        statusText: "Invalid Email",
      },
    );
  }

  try {
    const sendResend = await resend.emails.send({
      from: "form-submissions@alvaroluquecu.com",
      to: "alvaroluquecu@gmail.com",
      subject: subject,
      html: `
        <h2>New Form Submission</h2>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> <a href="mailto:${email}">${email}</a></p>
        <p><strong>Message:</strong></p>
        <p>${message}</p>
      `,

    });
    console.log(sendResend)
    if (sendResend.error === null) {
      return new Response(
        JSON.stringify({
          message: `Message successfully sent!`,
        }),
        {
          status: 200,
          statusText: "OK",
        },
      );
    } else {
      return new Response(
        JSON.stringify({
          message: `Message failed to send.`,
        }),
        {
          status: 500,
          statusText: "Internal Server Error",
        },
      );
    }
  } catch (error) {
    console.log("Error", error)
    return new Response(
      JSON.stringify({
        message: `An error occurred while sending the message: ${error}`,
      }),
      {
        status: 500,
        statusText: "Internal Server Error",
      },
    );
  }
};
