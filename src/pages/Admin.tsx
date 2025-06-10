
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Settings, Plus, Edit, Trash2, Shield, AlertCircle, Package, MessageSquare, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import DashboardLayout from '@/components/DashboardLayout';
import { useServices } from '@/hooks/useServices';
import { useAdminOrders, useUpdateOrderStatus } from '@/hooks/useAdminOrders';
import { useAdminTickets, useCreateAdminReply, useUpdateTicketStatus } from '@/hooks/useAdminTickets';
import { supabase } from '@/integrations/supabase/client';
import { useQueryClient } from '@tanstack/react-query';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useUserRole } from '@/hooks/useUserRole';
import { format } from 'date-fns';

const Admin = () => {
  const [isAddServiceOpen, setIsAddServiceOpen] = useState(false);
  const [editingService, setEditingService] = useState<any>(null);
  const [replyingToTicket, setReplyingToTicket] = useState<string | null>(null);
  const [replyMessage, setReplyMessage] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    category: '',
    description: '',
    price_per_1000: '',
    min_quantity: '',
    max_quantity: '',
    is_active: true
  });
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const { data: services = [], isLoading: servicesLoading } = useServices();
  const { data: orders = [], isLoading: ordersLoading } = useAdminOrders();
  const { data: tickets = [], isLoading: ticketsLoading } = useAdminTickets();
  const { data: userRole, isLoading: roleLoading } = useUserRole();
  const updateOrderStatus = useUpdateOrderStatus();
  const createAdminReply = useCreateAdminReply();
  const updateTicketStatus = useUpdateTicketStatus();
  const queryClient = useQueryClient();

  const categories = ['Instagram', 'YouTube', 'TikTok', 'Facebook', 'Twitter', 'Telegram', 'LinkedIn'];

  // Check if user is admin
  if (roleLoading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center min-h-[400px]">
          <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
        </div>
      </DashboardLayout>
    );
  }

  if (userRole !== 'admin') {
    return (
      <DashboardLayout>
        <div className="flex flex-col items-center justify-center min-h-[400px] p-8">
          <div className="text-center max-w-md">
            <Shield className="w-16 h-16 text-red-500 mx-auto mb-4" />
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Access Denied</h1>
            <p className="text-gray-600 mb-4">
              You don't have permission to access the admin panel. This area is restricted to administrators only.
            </p>
            <Button onClick={() => window.history.back()} className="gradient-primary">
              Go Back
            </Button>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  const handleUpdateOrderStatus = async (orderId: string, status: string) => {
    try {
      await updateOrderStatus.mutateAsync({ orderId, status });
      toast({
        title: 'Order Updated',
        description: 'Order status has been updated successfully.',
      });
    } catch (error: any) {
      console.error('Error updating order status:', error);
      toast({
        title: 'Error',
        description: error.message || 'Failed to update order status.',
        variant: 'destructive',
      });
    }
  };

  const handleSendReply = async (ticketId: string) => {
    if (!replyMessage.trim()) return;

    try {
      await createAdminReply.mutateAsync({
        ticket_id: ticketId,
        message: replyMessage,
      });
      
      setReplyMessage('');
      setReplyingToTicket(null);
      
      toast({
        title: 'Reply Sent',
        description: 'Your reply has been sent to the user.',
      });
    } catch (error: any) {
      console.error('Error sending reply:', error);
      toast({
        title: 'Error',
        description: error.message || 'Failed to send reply.',
        variant: 'destructive',
      });
    }
  };

  const handleUpdateTicketStatus = async (ticketId: string, status: string) => {
    try {
      await updateTicketStatus.mutateAsync({ ticketId, status });
      toast({
        title: 'Ticket Updated',
        description: 'Ticket status has been updated successfully.',
      });
    } catch (error: any) {
      console.error('Error updating ticket status:', error);
      toast({
        title: 'Error',
        description: error.message || 'Failed to update ticket status.',
        variant: 'destructive',
      });
    }
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'success':
      case 'completed':
      case 'closed':
        return 'bg-green-500/10 text-green-500 border-green-500/20';
      case 'processing':
      case 'in_progress':
        return 'bg-blue-500/10 text-blue-500 border-blue-500/20';
      case 'pending':
      case 'open':
        return 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20';
      case 'cancelled':
        return 'bg-red-500/10 text-red-500 border-red-500/20';
      default:
        return 'bg-gray-500/10 text-gray-500 border-gray-500/20';
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      category: '',
      description: '',
      price_per_1000: '',
      min_quantity: '',
      max_quantity: '',
      is_active: true
    });
    setEditingService(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const serviceData = {
        ...formData,
        price_per_1000: parseFloat(formData.price_per_1000),
        min_quantity: parseInt(formData.min_quantity) || 100,
        max_quantity: parseInt(formData.max_quantity) || 100000,
      };

      if (editingService) {
        const { error } = await supabase
          .from('services')
          .update(serviceData)
          .eq('id', editingService.id);
        
        if (error) throw error;
        
        toast({
          title: 'Service Updated',
          description: 'Service has been updated successfully.',
        });
      } else {
        const { error } = await supabase
          .from('services')
          .insert(serviceData);
        
        if (error) throw error;
        
        toast({
          title: 'Service Added',
          description: 'New service has been added successfully.',
        });
      }

      queryClient.invalidateQueries({ queryKey: ['services'] });
      resetForm();
      setIsAddServiceOpen(false);
    } catch (error: any) {
      console.error('Error saving service:', error);
      toast({
        title: 'Error',
        description: error.message || 'Failed to save service.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleEdit = (service: any) => {
    setFormData({
      name: service.name,
      category: service.category,
      description: service.description || '',
      price_per_1000: service.price_per_1000.toString(),
      min_quantity: service.min_quantity.toString(),
      max_quantity: service.max_quantity.toString(),
      is_active: service.is_active
    });
    setEditingService(service);
    setIsAddServiceOpen(true);
  };

  const handleDelete = async (serviceId: string) => {
    if (!confirm('Are you sure you want to delete this service?')) return;

    try {
      const { error } = await supabase
        .from('services')
        .delete()
        .eq('id', serviceId);
      
      if (error) throw error;
      
      toast({
        title: 'Service Deleted',
        description: 'Service has been deleted successfully.',
      });
      
      queryClient.invalidateQueries({ queryKey: ['services'] });
    } catch (error: any) {
      console.error('Error deleting service:', error);
      toast({
        title: 'Error',
        description: error.message || 'Failed to delete service.',
        variant: 'destructive',
      });
    }
  };

  const toggleServiceStatus = async (serviceId: string, currentStatus: boolean) => {
    try {
      const { error } = await supabase
        .from('services')
        .update({ is_active: !currentStatus })
        .eq('id', serviceId);
      
      if (error) throw error;
      
      queryClient.invalidateQueries({ queryKey: ['services'] });
    } catch (error: any) {
      console.error('Error updating service status:', error);
      toast({
        title: 'Error',
        description: error.message || 'Failed to update service status.',
        variant: 'destructive',
      });
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-8 p-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2 flex items-center gap-2">
              <Settings className="w-8 h-8 text-blue-600" />
              Admin Panel
            </h1>
            <p className="text-gray-600">
              Manage services, orders, tickets, and system settings.
            </p>
          </div>
        </div>

        {/* Admin Access Notice */}
        <Card className="light-card border-blue-200 bg-blue-50">
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <AlertCircle className="w-5 h-5 text-blue-600" />
              <span className="text-blue-800 font-medium">Admin Access Granted</span>
            </div>
          </CardContent>
        </Card>

        <Tabs defaultValue="orders" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="orders">Orders ({orders.length})</TabsTrigger>
            <TabsTrigger value="tickets">Support Tickets ({tickets.length})</TabsTrigger>
            <TabsTrigger value="services">Services ({services.length})</TabsTrigger>
          </TabsList>

          <TabsContent value="orders" className="space-y-6">
            <Card className="light-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Package className="w-5 h-5" />
                  Order Management
                </CardTitle>
                <CardDescription>View and manage all user orders</CardDescription>
              </CardHeader>
              <CardContent>
                {ordersLoading ? (
                  <div className="flex items-center justify-center py-8">
                    <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
                  </div>
                ) : orders.length > 0 ? (
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Order ID</TableHead>
                          <TableHead>User</TableHead>
                          <TableHead>Service</TableHead>
                          <TableHead>Quantity</TableHead>
                          <TableHead>Amount</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead>Date</TableHead>
                          <TableHead>Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {orders.map((order) => (
                          <TableRow key={order.id}>
                            <TableCell className="font-medium">
                              #{order.id.slice(0, 8)}
                            </TableCell>
                            <TableCell>
                              <div>
                                <div className="font-medium">
                                  {order.profiles?.full_name || 'Unknown User'}
                                </div>
                                <div className="text-sm text-gray-500">
                                  {order.profiles?.email || 'No email'}
                                </div>
                              </div>
                            </TableCell>
                            <TableCell>
                              <div>
                                <div className="font-medium">
                                  {order.services?.name || 'Unknown Service'}
                                </div>
                                <div className="text-sm text-gray-500">
                                  {order.services?.category || 'Unknown Category'}
                                </div>
                              </div>
                            </TableCell>
                            <TableCell>{order.quantity?.toLocaleString() || 0}</TableCell>
                            <TableCell>₹{order.total_cost || 0}</TableCell>
                            <TableCell>
                              <Badge className={getStatusColor(order.status || 'pending')}>
                                {(order.status || 'pending').charAt(0).toUpperCase() + (order.status || 'pending').slice(1)}
                              </Badge>
                            </TableCell>
                            <TableCell>
                              {format(new Date(order.created_at), 'MMM dd, yyyy')}
                            </TableCell>
                            <TableCell>
                              <Select 
                                value={order.status || 'pending'} 
                                onValueChange={(status) => handleUpdateOrderStatus(order.id, status)}
                                disabled={updateOrderStatus.isPending}
                              >
                                <SelectTrigger className="w-32">
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="pending">Pending</SelectItem>
                                  <SelectItem value="processing">Processing</SelectItem>
                                  <SelectItem value="success">Success</SelectItem>
                                  <SelectItem value="cancelled">Cancelled</SelectItem>
                                </SelectContent>
                              </Select>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    <Package className="w-12 h-12 mx-auto mb-4 opacity-50" />
                    <p>No orders found</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="tickets" className="space-y-6">
            <Card className="light-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MessageSquare className="w-5 h-5" />
                  Support Tickets
                </CardTitle>
                <CardDescription>View and respond to user support tickets</CardDescription>
              </CardHeader>
              <CardContent>
                {ticketsLoading ? (
                  <div className="flex items-center justify-center py-8">
                    <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
                  </div>
                ) : (
                  <div className="space-y-4">
                    {tickets.map((ticket) => (
                      <div key={ticket.id} className="p-4 rounded-xl bg-gray-50 border border-gray-200">
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex-1">
                            <h3 className="font-medium text-gray-900">{ticket.subject}</h3>
                            <p className="text-sm text-gray-600">
                              From: {ticket.profiles?.full_name || 'Unknown User'} ({ticket.profiles?.email || 'No email'})
                            </p>
                            <p className="text-sm text-gray-500">
                              {format(new Date(ticket.created_at), 'MMM dd, HH:mm')}
                            </p>
                          </div>
                          <div className="flex items-center gap-2">
                            <Badge className={getStatusColor(ticket.status || 'open')}>
                              {(ticket.status || 'open').charAt(0).toUpperCase() + (ticket.status || 'open').slice(1)}
                            </Badge>
                            <Select 
                              value={ticket.status || 'open'} 
                              onValueChange={(status) => handleUpdateTicketStatus(ticket.id, status)}
                              disabled={updateTicketStatus.isPending}
                            >
                              <SelectTrigger className="w-24">
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
                        
                        <div className="bg-white p-3 rounded-lg mb-4">
                          <p className="text-gray-700">{ticket.message}</p>
                        </div>

                        {ticket.support_replies && ticket.support_replies.length > 0 && (
                          <div className="space-y-2 mb-4">
                            <h4 className="font-medium text-sm">Replies:</h4>
                            {ticket.support_replies.map((reply: any) => (
                              <div key={reply.id} className={`p-3 rounded-lg ${reply.is_admin ? 'bg-blue-50 ml-4' : 'bg-gray-100 mr-4'}`}>
                                <div className="flex justify-between items-start mb-2">
                                  <span className="text-sm font-medium">
                                    {reply.is_admin ? 'Admin' : (reply.profiles?.full_name || 'User')}
                                  </span>
                                  <span className="text-xs text-gray-500">
                                    {format(new Date(reply.created_at), 'MMM dd, HH:mm')}
                                  </span>
                                </div>
                                <p className="text-sm">{reply.message}</p>
                              </div>
                            ))}
                          </div>
                        )}

                        {replyingToTicket === ticket.id ? (
                          <div className="space-y-3">
                            <Textarea
                              placeholder="Type your reply..."
                              value={replyMessage}
                              onChange={(e) => setReplyMessage(e.target.value)}
                              rows={3}
                            />
                            <div className="flex gap-2">
                              <Button 
                                onClick={() => handleSendReply(ticket.id)} 
                                size="sm"
                                disabled={createAdminReply.isPending || !replyMessage.trim()}
                              >
                                {createAdminReply.isPending ? (
                                  <>
                                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                    Sending...
                                  </>
                                ) : (
                                  'Send Reply'
                                )}
                              </Button>
                              <Button variant="outline" onClick={() => setReplyingToTicket(null)} size="sm">
                                Cancel
                              </Button>
                            </div>
                          </div>
                        ) : (
                          <Button onClick={() => setReplyingToTicket(ticket.id)} size="sm" variant="outline">
                            Reply
                          </Button>
                        )}
                      </div>
                    ))}
                    {tickets.length === 0 && (
                      <div className="text-center py-8 text-gray-500">
                        <MessageSquare className="w-12 h-12 mx-auto mb-4 opacity-50" />
                        <p>No support tickets found</p>
                      </div>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="services" className="space-y-6">
            <div className="flex justify-end">
              <Dialog open={isAddServiceOpen} onOpenChange={(open) => {
                setIsAddServiceOpen(open);
                if (!open) resetForm();
              }}>
                <DialogTrigger asChild>
                  <Button className="gradient-primary rounded-xl">
                    <Plus className="w-4 h-4 mr-2" />
                    Add Service
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-md">
                  <DialogHeader>
                    <DialogTitle>{editingService ? 'Edit Service' : 'Add New Service'}</DialogTitle>
                    <DialogDescription>
                      {editingService ? 'Update service details and pricing.' : 'Create a new SMM service with pricing details.'}
                    </DialogDescription>
                  </DialogHeader>
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Service Name</Label>
                      <Input
                        id="name"
                        placeholder="e.g., Instagram Followers"
                        value={formData.name}
                        onChange={(e) => setFormData({...formData, name: e.target.value})}
                        required
                        className="rounded-xl"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="category">Category</Label>
                      <Select value={formData.category} onValueChange={(value) => setFormData({...formData, category: value})}>
                        <SelectTrigger className="rounded-xl">
                          <SelectValue placeholder="Select category" />
                        </SelectTrigger>
                        <SelectContent>
                          {categories.map((cat) => (
                            <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="description">Description</Label>
                      <Textarea
                        id="description"
                        placeholder="Service description..."
                        value={formData.description}
                        onChange={(e) => setFormData({...formData, description: e.target.value})}
                        className="rounded-xl"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="price">Price per 1000 (₹)</Label>
                        <Input
                          id="price"
                          type="number"
                          step="0.01"
                          placeholder="0.00"
                          value={formData.price_per_1000}
                          onChange={(e) => setFormData({...formData, price_per_1000: e.target.value})}
                          required
                          className="rounded-xl"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="active">Active</Label>
                        <div className="flex items-center space-x-2 pt-2">
                          <Switch
                            id="active"
                            checked={formData.is_active}
                            onCheckedChange={(checked) => setFormData({...formData, is_active: checked})}
                          />
                          <Label htmlFor="active">{formData.is_active ? 'Active' : 'Inactive'}</Label>
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="min">Min Quantity</Label>
                        <Input
                          id="min"
                          type="number"
                          placeholder="100"
                          value={formData.min_quantity}
                          onChange={(e) => setFormData({...formData, min_quantity: e.target.value})}
                          className="rounded-xl"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="max">Max Quantity</Label>
                        <Input
                          id="max"
                          type="number"
                          placeholder="100000"
                          value={formData.max_quantity}
                          onChange={(e) => setFormData({...formData, max_quantity: e.target.value})}
                          className="rounded-xl"
                        />
                      </div>
                    </div>

                    <Button type="submit" className="w-full gradient-primary rounded-xl" disabled={isLoading}>
                      {isLoading ? 'Saving...' : editingService ? 'Update Service' : 'Add Service'}
                    </Button>
                  </form>
                </DialogContent>
              </Dialog>
            </div>

            {/* Services Management */}
            <div className="space-y-4">
              {servicesLoading ? (
                <div className="flex items-center justify-center py-8">
                  <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
                </div>
              ) : (
                services.map((service) => (
                  <div key={service.id} className="flex items-center justify-between p-4 rounded-xl bg-gray-50 border border-gray-200">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="font-medium text-gray-900">{service.name}</h3>
                        <Badge variant={service.is_active ? "default" : "secondary"} className="rounded-full">
                          {service.is_active ? 'Active' : 'Inactive'}
                        </Badge>
                        <Badge variant="outline" className="rounded-full">{service.category}</Badge>
                      </div>
                      <p className="text-sm text-gray-600">{service.description}</p>
                      <div className="flex items-center gap-4 mt-2 text-sm text-gray-500">
                        <span>₹{service.price_per_1000}/1k</span>
                        <span>Min: {service.min_quantity}</span>
                        <span>Max: {service.max_quantity}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Switch
                        checked={service.is_active}
                        onCheckedChange={() => toggleServiceStatus(service.id, service.is_active)}
                      />
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleEdit(service)}
                        className="rounded-lg"
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDelete(service.id)}
                        className="rounded-lg hover:bg-red-50 hover:border-red-200"
                      >
                        <Trash2 className="w-4 h-4 text-red-500" />
                      </Button>
                    </div>
                  </div>
                ))
              )}
              {services.length === 0 && !servicesLoading && (
                <div className="text-center py-8 text-gray-500">
                  <Settings className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <p>No services found</p>
                  <p className="text-sm">Add your first service to get started</p>
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
};

export default Admin;
