import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Users, 
  ShoppingBag, 
  MessageSquare, 
  DollarSign,
  Settings,
  TrendingUp
} from 'lucide-react';
import DashboardLayout from '@/components/DashboardLayout';
import { useAdminOrders, useUpdateOrderStatus } from '@/hooks/useAdminOrders';
import { useAdminTickets, useCreateAdminReply, useUpdateTicketStatus } from '@/hooks/useAdminTickets';
import { useToast } from '@/hooks/use-toast';
import AdminStatsManager from '@/components/AdminStatsManager';

const Admin = () => {
  const { data: orders = [] } = useAdminOrders();
  const { data: tickets = [] } = useAdminTickets();
  const updateOrderStatus = useUpdateOrderStatus();
  const updateTicketStatus = useUpdateTicketStatus();
  const createReply = useCreateAdminReply();
  const { toast } = useToast();

  const [replyMessages, setReplyMessages] = useState<Record<string, string>>({});

  const stats = [
    {
      title: 'Total Orders',
      value: orders.length.toString(),
      description: 'All orders',
      icon: <ShoppingBag className="w-4 h-4" />,
      color: 'text-blue-500',
      bgColor: 'bg-blue-500/10'
    },
    {
      title: 'Pending Orders',
      value: orders.filter(order => order.status === 'pending').length.toString(),
      description: 'Awaiting processing',
      icon: <ShoppingBag className="w-4 h-4" />,
      color: 'text-orange-500',
      bgColor: 'bg-orange-500/10'
    },
    {
      title: 'Total Revenue',
      value: `$${orders.reduce((sum, order) => sum + Number(order.total_cost), 0).toFixed(2)}`,
      description: 'Total earnings',
      icon: <DollarSign className="w-4 h-4" />,
      color: 'text-green-500',
      bgColor: 'bg-green-500/10'
    },
    {
      title: 'Support Tickets',
      value: tickets.length.toString(),
      description: 'Total tickets',
      icon: <MessageSquare className="w-4 h-4" />,
      color: 'text-purple-500',
      bgColor: 'bg-purple-500/10'
    }
  ];

  const handleOrderStatusUpdate = async (orderId: string, newStatus: string) => {
    try {
      await updateOrderStatus.mutateAsync({ orderId, status: newStatus });
      toast({
        title: 'Status Updated',
        description: 'Order status has been updated successfully.',
      });
    } catch (error: any) {
      toast({
        title: 'Update Failed',
        description: error.message || 'Failed to update order status.',
        variant: 'destructive',
      });
    }
  };

  const handleTicketReply = async (ticketId: string) => {
    const message = replyMessages[ticketId];
    if (!message?.trim()) return;

    try {
      await createReply.mutateAsync({ ticket_id: ticketId, message });
      setReplyMessages(prev => ({ ...prev, [ticketId]: '' }));
      toast({
        title: 'Reply Sent',
        description: 'Your reply has been sent successfully.',
      });
    } catch (error: any) {
      toast({
        title: 'Reply Failed',
        description: error.message || 'Failed to send reply.',
        variant: 'destructive',
      });
    }
  };

  const handleTicketStatusUpdate = async (ticketId: string, newStatus: string) => {
    try {
      await updateTicketStatus.mutateAsync({ ticketId, status: newStatus });
      toast({
        title: 'Status Updated',
        description: 'Ticket status has been updated successfully.',
      });
    } catch (error: any) {
      toast({
        title: 'Update Failed',
        description: error.message || 'Failed to update ticket status.',
        variant: 'destructive',
      });
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Admin Dashboard</h1>
            <p className="text-muted-foreground mt-2">
              Manage orders, tickets, and system settings.
            </p>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, index) => (
            <Card key={index} className="glass-card border-0">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
                <div className={`p-2 rounded-lg ${stat.bgColor}`}>
                  <div className={stat.color}>
                    {stat.icon}
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stat.value}</div>
                <p className="text-xs text-muted-foreground">{stat.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        <Tabs defaultValue="orders" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="orders">Orders Management</TabsTrigger>
            <TabsTrigger value="tickets">Support Tickets</TabsTrigger>
            <TabsTrigger value="settings">Frontend Settings</TabsTrigger>
          </TabsList>

          <TabsContent value="orders" className="space-y-6">
            <Card className="glass-card border-0">
              <CardHeader>
                <CardTitle>Orders Management</CardTitle>
                <CardDescription>Manage and update order statuses</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {orders.map((order) => (
                    <div key={order.id} className="p-4 border rounded-lg space-y-3">
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="font-medium">{order.services?.name}</h4>
                          <p className="text-sm text-muted-foreground">
                            Customer: {order.profile?.full_name || order.profile?.email}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="font-medium">${Number(order.total_cost).toFixed(2)}</p>
                          <p className="text-sm text-muted-foreground">
                            Qty: {order.quantity.toLocaleString()}
                          </p>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-4">
                        <Badge variant={
                          order.status === 'completed' ? 'default' :
                          order.status === 'processing' ? 'secondary' : 'outline'
                        }>
                          {order.status}
                        </Badge>
                        
                        <Select
                          value={order.status}
                          onValueChange={(value) => handleOrderStatusUpdate(order.id, value)}
                        >
                          <SelectTrigger className="w-40">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="pending">Pending</SelectItem>
                            <SelectItem value="processing">Processing</SelectItem>
                            <SelectItem value="completed">Completed</SelectItem>
                            <SelectItem value="cancelled">Cancelled</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      
                      <p className="text-sm">
                        <strong>Link:</strong> {order.link}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        Created: {new Date(order.created_at).toLocaleDateString()}
                      </p>
                    </div>
                  ))}

                  {orders.length === 0 && (
                    <div className="text-center py-8 text-muted-foreground">
                      No orders found.
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="tickets" className="space-y-6">
            <Card className="glass-card border-0">
              <CardHeader>
                <CardTitle>Support Tickets</CardTitle>
                <CardDescription>Manage customer support requests</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {tickets.map((ticket) => (
                    <div key={ticket.id} className="p-4 border rounded-lg space-y-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="font-medium">{ticket.subject}</h4>
                          <p className="text-sm text-muted-foreground">
                            From: {ticket.profile?.full_name || ticket.profile?.email}
                          </p>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge variant={
                            ticket.status === 'closed' ? 'default' :
                            ticket.status === 'in_progress' ? 'secondary' : 'outline'
                          }>
                            {ticket.status.replace('_', ' ')}
                          </Badge>
                          <Select
                            value={ticket.status}
                            onValueChange={(value) => handleTicketStatusUpdate(ticket.id, value)}
                          >
                            <SelectTrigger className="w-32">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="open">Open</SelectItem>
                              <SelectItem value="in_progress">In Progress</SelectItem>
                              <SelectItem value="closed">Closed</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                      
                      <div className="bg-accent/50 p-3 rounded">
                        <p className="text-sm">{ticket.message}</p>
                      </div>

                      {ticket.support_replies && ticket.support_replies.length > 0 && (
                        <div className="space-y-2">
                          <h5 className="font-medium text-sm">Replies:</h5>
                          {ticket.support_replies.map((reply: any) => (
                            <div key={reply.id} className={`p-3 rounded text-sm ${
                              reply.is_admin ? 'bg-blue-50 ml-4' : 'bg-gray-50'
                            }`}>
                              <p>{reply.message}</p>
                              <p className="text-xs text-muted-foreground mt-1">
                                {reply.is_admin ? 'Admin' : 'Customer'} • {new Date(reply.created_at).toLocaleDateString()}
                              </p>
                            </div>
                          ))}
                        </div>
                      )}

                      <div className="space-y-2">
                        <Label htmlFor={`reply-${ticket.id}`}>Admin Reply</Label>
                        <Textarea
                          id={`reply-${ticket.id}`}
                          placeholder="Type your reply..."
                          value={replyMessages[ticket.id] || ''}
                          onChange={(e) => setReplyMessages(prev => ({
                            ...prev,
                            [ticket.id]: e.target.value
                          }))}
                        />
                        <Button
                          onClick={() => handleTicketReply(ticket.id)}
                          disabled={!replyMessages[ticket.id]?.trim()}
                          size="sm"
                        >
                          Send Reply
                        </Button>
                      </div>
                    </div>
                  ))}

                  {tickets.length === 0 && (
                    <div className="text-center py-8 text-muted-foreground">
                      No support tickets found.
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="settings" className="space-y-6">
            <AdminStatsManager />
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
};

export default Admin;
