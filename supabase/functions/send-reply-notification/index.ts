
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "npm:resend@2.0.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

interface ReplyNotificationRequest {
  ticketId: string;
  userEmail: string;
  userName?: string;
  subject: string;
  replyMessage: string;
  isFromAdmin: boolean;
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
      replyMessage, 
      isFromAdmin 
    }: ReplyNotificationRequest = await req.json();

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

    const fromEmail = isFromAdmin ? "SMM Kings Support <support@smmkings.com>" : "SMM Kings <noreply@smmkings.com>";
    const toEmail = isFromAdmin ? [userEmail] : ["admin@smmkings.com"]; // Replace with actual admin email
    const emailSubject = isFromAdmin 
      ? `Reply to your support ticket - ${subject}` 
      : `New reply from user - ${subject}`;

    const emailResponse = await resend.emails.send({
      from: fromEmail,
      to: toEmail,
      subject: emailSubject,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h1 style="color: #2563eb; margin-bottom: 24px;">
            ${isFromAdmin ? 'Support Team Reply' : 'New User Reply'}
          </h1>
          
          <div style="background-color: #f8fafc; padding: 20px; border-radius: 8px; margin-bottom: 24px;">
            <h2 style="margin-top: 0; color: #1e293b;">Ticket Details</h2>
            <p><strong>Ticket ID:</strong> #${ticketId.slice(0, 8)}</p>
            <p><strong>Subject:</strong> ${subject}</p>
            ${isFromAdmin 
              ? `<p><strong>Dear ${userName || 'User'},</strong></p>` 
              : `<p><strong>From:</strong> ${userName || 'User'} (${userEmail})</p>`
            }
            <p><strong>Date:</strong> ${new Date().toLocaleString()}</p>
          </div>

          <div style="background-color: #ffffff; padding: 20px; border: 1px solid #e2e8f0; border-radius: 8px; margin-bottom: 24px;">
            <h3 style="margin-top: 0; color: #1e293b;">
              ${isFromAdmin ? 'Our Support Team wrote:' : 'User replied:'}
            </h3>
            <p style="line-height: 1.6; color: #374151;">${replyMessage}</p>
          </div>

          <div style="margin-top: 32px; padding-top: 20px; border-top: 1px solid #e2e8f0; text-align: center; color: #64748b;">
            ${isFromAdmin 
              ? `<p>If you need further assistance, please reply to this email or contact our support team.</p>
                 <p>Thank you for choosing SMM Kings!</p>`
              : `<p>Please respond to this ticket through the admin panel.</p>`
            }
            <p>This notification was sent automatically from SMM Kings.</p>
          </div>
        </div>
      `,
    });

    console.log("Reply notification email sent successfully:", emailResponse);

    return new Response(JSON.stringify(emailResponse), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        ...corsHeaders,
      },
    });
  } catch (error: any) {
    console.error("Error in send-reply-notification function:", error);
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
