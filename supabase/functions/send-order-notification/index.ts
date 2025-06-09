
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "npm:resend@2.0.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

interface OrderNotificationRequest {
  order: {
    id: string;
    user_email: string;
    service_name: string;
    quantity: number;
    amount: number;
    link: string;
  };
}

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { order }: OrderNotificationRequest = await req.json();

    const adminEmails = [
      "innocentboy9472@gmail.com",
      "raj.kr01001@gmail.com"
    ];

    const emailResponse = await resend.emails.send({
      from: "SMM Kings <orders@smmkings.com>",
      to: adminEmails,
      subject: `New Order Placed - ${order.service_name}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background-color: #f9fafb; padding: 20px;">
          <div style="background-color: white; border-radius: 12px; padding: 30px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
            <h1 style="color: #1f2937; font-size: 24px; margin-bottom: 20px; border-bottom: 2px solid #3b82f6; padding-bottom: 10px;">
              🚀 New Order Alert
            </h1>
            
            <div style="background-color: #eff6ff; border-left: 4px solid #3b82f6; padding: 15px; margin: 20px 0; border-radius: 4px;">
              <p style="color: #1e40af; margin: 0; font-weight: bold;">Order ID: ${order.id}</p>
            </div>

            <div style="display: grid; gap: 15px; margin: 25px 0;">
              <div style="display: flex; justify-content: space-between; padding: 10px; background-color: #f9fafb; border-radius: 6px;">
                <span style="font-weight: bold; color: #374151;">Customer Email:</span>
                <span style="color: #6b7280;">${order.user_email}</span>
              </div>
              
              <div style="display: flex; justify-content: space-between; padding: 10px; background-color: #f9fafb; border-radius: 6px;">
                <span style="font-weight: bold; color: #374151;">Service:</span>
                <span style="color: #6b7280;">${order.service_name}</span>
              </div>
              
              <div style="display: flex; justify-content: space-between; padding: 10px; background-color: #f9fafb; border-radius: 6px;">
                <span style="font-weight: bold; color: #374151;">Quantity:</span>
                <span style="color: #6b7280;">${order.quantity.toLocaleString()}</span>
              </div>
              
              <div style="display: flex; justify-content: space-between; padding: 10px; background-color: #f9fafb; border-radius: 6px;">
                <span style="font-weight: bold; color: #374151;">Amount:</span>
                <span style="color: #059669; font-weight: bold;">₹${order.amount.toFixed(2)}</span>
              </div>
              
              <div style="display: flex; justify-content: space-between; padding: 10px; background-color: #f9fafb; border-radius: 6px;">
                <span style="font-weight: bold; color: #374151;">Target Link:</span>
                <span style="color: #6b7280; word-break: break-all;">${order.link}</span>
              </div>
            </div>

            <div style="background-color: #fef3c7; border: 1px solid #f59e0b; border-radius: 8px; padding: 15px; margin: 20px 0;">
              <p style="color: #92400e; margin: 0; font-weight: bold;">⚡ Action Required</p>
              <p style="color: #92400e; margin: 5px 0 0 0; font-size: 14px;">
                Please process this order and update the status in the admin panel.
              </p>
            </div>

            <p style="color: #6b7280; font-size: 14px; margin-top: 30px; text-align: center; border-top: 1px solid #e5e7eb; padding-top: 20px;">
              This is an automated notification from SMM Kings.<br/>
              Order placed at: ${new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })} IST
            </p>
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
