import { Resend } from "resend";

interface MailContent {
	email: string;
	subject: string;
	name: string;
	message: string;
}
const corsHeaders = {
	"Access-Control-Allow-Origin": "*",
	"Access-Control-Allow-Methods": "POST",
	"Access-Control-Allow-Headers": "Content-Type",
	"Content-Type": "application/json",
  };
  
const isValidEmail = (email: string): boolean => {
	const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
	return emailRegex.test(email);
};

const hasRequiredFields = (body: MailContent): boolean => {
	return Boolean(body.email  && body.name && body.subject && body.message);
};
  
const sendEmail = async (resend: Resend, body: MailContent) => {
	try {
	  const sendResend = await resend.emails.send({
		from: "form-submissions@alvaroluquecu.com",
		to: "alvaroluquecu@gmail.com",
		subject: body.subject,
		html: `
		  <h2>New Form Submission</h2>
		  <p><strong>Name:</strong> ${body.name}</p>
		  <p><strong>Email:</strong> ${body.email}</p>
		  <p><strong>Message:</strong></p>
		  <p>${body.message}</p>
		`,
	  });
  
	  if (sendResend.error) {
		throw new Error('Message failed to send');
	  }
	  return { success: true, message: 'Message successfully sent!' };
	} catch (error) {
	  console.error('Error sending email:', error);
	  return { success: false, message: `An error occurred while sending the message: ${error}` };
	}
  };
  
  
export default {
	async fetch(request, env: any, ctx): Promise<Response> {
		const resend = new Resend(env.RESEND_API_KEY);
		const origin = request.headers.get('Origin');

		if (origin !== env.ACCEPTED_HOST) {
			return new Response(
			JSON.stringify({
				error: "Client host not accepted",
				message: `Origin "${origin}" is not among the accepted ones.`,
			}),
			{ status: 403, headers: corsHeaders }
			);
		}
	
		if (request.method !== "POST") {
			return new Response(
			JSON.stringify({ error: "Method Not Allowed", message: "Only POST is accepted" }),
			{ status: 405, headers: corsHeaders }
			);
		}

		const requestURL = new URL(request.url);
		if (requestURL.pathname !== "/api/email") {
			return new Response(
			JSON.stringify({ error: "Not Found", message: "Endpoint does not exist" }),
			{ status: 404, headers: corsHeaders }
			);
		}
	
		let body: MailContent;
		try {
			body = await request.json();
		} catch (error) {
			return new Response(
			JSON.stringify({ error: "Invalid JSON", message: "Could not parse request body" }),
			{ status: 400, headers: corsHeaders }
			);
		}

		if (!hasRequiredFields(body)) {
			return new Response(
			JSON.stringify({
				error: "Missing fields",
				message: "Fields required: 'name', 'email', 'message', 'subject'",
			}),
			{ status: 400, headers: corsHeaders }
			);
		}
	
		if (!isValidEmail(body.email)) {
			return new Response(
			JSON.stringify({ message: `Please enter a valid email address.` }),
			{ status: 400, statusText: "Invalid Email", headers: corsHeaders }
			);
		}
	
		const emailResult = await sendEmail(resend, body);
	
		if (emailResult.success) {
			return new Response(
			JSON.stringify({ message: emailResult.message }),
			{ status: 200, statusText: "OK", headers: corsHeaders }
			);
		}
	
		return new Response(
			JSON.stringify({ message: emailResult.message }),
			{ status: 500, statusText: "Internal Server Error", headers: corsHeaders }
		);
	},
		
} satisfies ExportedHandler<Env>;
