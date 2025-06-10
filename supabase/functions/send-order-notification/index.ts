
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "npm:resend@2.0.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

interface OrderNotificationRequest {
  orderId: string;
  userName: string;
  userEmail: string;
  serviceName: string;
  quantity: number;
  totalCost: number;
  link: string;
}

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { 
      orderId, 
      userName, 
      userEmail, 
      serviceName, 
      quantity, 
      totalCost,
      link 
    }: OrderNotificationRequest = await req.json();

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

    const emailResponse = await resend.emails.send({
      from: "SMM Kings <orders@smmkings.com>",
      to: ["admin@smmkings.com"], // Replace with actual admin email
      subject: `New Order Received - #${orderId.slice(0, 8)}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h1 style="color: #2563eb; margin-bottom: 24px;">New Order Notification</h1>
          
          <div style="background-color: #f8fafc; padding: 20px; border-radius: 8px; margin-bottom: 24px;">
            <h2 style="margin-top: 0; color: #1e293b;">Order Details</h2>
            <p><strong>Order ID:</strong> #${orderId.slice(0, 8)}</p>
            <p><strong>Service:</strong> ${serviceName}</p>
            <p><strong>Quantity:</strong> ${quantity.toLocaleString()}</p>
            <p><strong>Total Amount:</strong> ₹${totalCost}</p>
            <p><strong>Target Link:</strong> <a href="${link}" target="_blank">${link}</a></p>
            <p><strong>Date:</strong> ${new Date().toLocaleString()}</p>
          </div>

          <div style="background-color: #f1f5f9; padding: 20px; border-radius: 8px; margin-bottom: 24px;">
            <h2 style="margin-top: 0; color: #1e293b;">Customer Information</h2>
            <p><strong>Name:</strong> ${userName}</p>
            <p><strong>Email:</strong> ${userEmail}</p>
          </div>

          <div style="margin-top: 32px; padding-top: 20px; border-top: 1px solid #e2e8f0; text-align: center; color: #64748b;">
            <p>Please process this order through the admin panel.</p>
            <p>This notification was sent automatically from SMM Kings.</p>
          </div>
        </div>
      `,
    });

    console.log("Order notification email sent successfully:", emailResponse);

    return new Response(JSON.stringify(emailResponse), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        ...corsHeaders,
      },
    });
  } catch (error: any) {
    console.error("Error in send-order-notification function:", error);
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
