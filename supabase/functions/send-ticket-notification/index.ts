
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "npm:resend@2.0.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

interface TicketNotificationRequest {
  ticketId: string;
  userEmail: string;
  userName?: string;
  subject: string;
  message: string;
  priority: string;
}

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { 
      ticketId, 
      userEmail,
      userName,
      subject, 
      message, 
      priority 
    }: TicketNotificationRequest = await req.json();

    // Check if RESEND_API_KEY is available
    if (!Deno.env.get("RESEND_API_KEY")) {
      console.error("RESEND_API_KEY not found in environment variables");
      return new Response(
        JSON.stringify({ error: "Email service not configured" }),
        {
          status: 500,
          headers: { "Content-Type": "application/json", ...corsHeaders },
        }
      );
    }

    const priorityColor = priority === 'high' ? '#dc2626' : priority === 'medium' ? '#f59e0b' : '#16a34a';

    const emailResponse = await resend.emails.send({
      from: "SMM Kings <support@smmkings.com>",
      to: ["admin@smmkings.com"], // Replace with actual admin email
      subject: `New Support Ticket - ${subject}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h1 style="color: #2563eb; margin-bottom: 24px;">New Support Ticket</h1>
          
          <div style="background-color: #f8fafc; padding: 20px; border-radius: 8px; margin-bottom: 24px;">
            <h2 style="margin-top: 0; color: #1e293b;">Ticket Details</h2>
            <p><strong>Ticket ID:</strong> #${ticketId.slice(0, 8)}</p>
            <p><strong>Subject:</strong> ${subject}</p>
            <p><strong>Priority:</strong> <span style="color: ${priorityColor}; font-weight: bold;">${priority.toUpperCase()}</span></p>
            <p><strong>From:</strong> ${userName || 'Unknown User'} (${userEmail})</p>
            <p><strong>Date:</strong> ${new Date().toLocaleString()}</p>
          </div>

          <div style="background-color: #ffffff; padding: 20px; border: 1px solid #e2e8f0; border-radius: 8px; margin-bottom: 24px;">
            <h3 style="margin-top: 0; color: #1e293b;">Message:</h3>
            <p style="line-height: 1.6; color: #374151;">${message}</p>
          </div>

          <div style="margin-top: 32px; padding-top: 20px; border-top: 1px solid #e2e8f0; text-align: center; color: #64748b;">
            <p>Please respond to this ticket through the admin panel.</p>
            <p>This notification was sent automatically from SMM Kings.</p>
          </div>
        </div>
      `,
    });

    console.log("Ticket notification email sent successfully:", emailResponse);

    return new Response(JSON.stringify(emailResponse), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        ...corsHeaders,
      },
    });
  } catch (error: any) {
    console.error("Error in send-ticket-notification function:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

serve(handler);
