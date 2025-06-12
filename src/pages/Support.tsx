
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { MessageSquare, Clock, CheckCircle, AlertCircle } from 'lucide-react';
import DashboardLayout from '@/components/DashboardLayout';
import { useSupportTickets, useCreateSupportTicket, useCreateSupportReply } from '@/hooks/useSupportTickets';
import { useToast } from '@/hooks/use-toast';

const Support = () => {
  const { data: tickets = [] } = useSupportTickets();
  const createTicket = useCreateSupportTicket();
  const createReply = useCreateSupportReply();
  const { toast } = useToast();

  const [isCreating, setIsCreating] = useState(false);
  const [ticketForm, setTicketForm] = useState({
    subject: '',
    message: '',
    priority: 'medium'
  });
  const [replyMessages, setReplyMessages] = useState<Record<string, string>>({});

  const handleCreateTicket = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      await createTicket.mutateAsync(ticketForm);
      setTicketForm({ subject: '', message: '', priority: 'medium' });
      setIsCreating(false);
      toast({
        title: 'Ticket Created',
        description: 'Your support ticket has been created successfully.',
      });
    } catch (error: any) {
      toast({
        title: 'Creation Failed',
        description: error.message || 'Failed to create support ticket.',
        variant: 'destructive',
      });
    }
  };

  const handleReply = async (ticketId: string) => {
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

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'open':
        return <AlertCircle className="w-4 h-4" />;
      case 'in_progress':
        return <Clock className="w-4 h-4" />;
      case 'closed':
        return <CheckCircle className="w-4 h-4" />;
      default:
        return <MessageSquare className="w-4 h-4" />;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'bg-red-100 text-red-800';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800';
      case 'low':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Support Center</h1>
            <p className="text-muted-foreground mt-2">
              Get help with your orders, payments, and any questions.
            </p>
          </div>
          <Button 
            onClick={() => setIsCreating(true)} 
            className="gradient-primary"
          >
            <MessageSquare className="w-4 h-4 mr-2" />
            New Ticket
          </Button>
        </div>

        {/* Create Ticket Form */}
        {isCreating && (
          <Card className="glass-card border-0">
            <CardHeader>
              <CardTitle>Create Support Ticket</CardTitle>
              <CardDescription>
                Describe your issue and we'll help you resolve it quickly.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleCreateTicket} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="subject">Subject</Label>
                    <Input
                      id="subject"
                      value={ticketForm.subject}
                      onChange={(e) => setTicketForm(prev => ({ ...prev, subject: e.target.value }))}
                      placeholder="Brief description of your issue"
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="priority">Priority</Label>
                    <Select
                      value={ticketForm.priority}
                      onValueChange={(value) => setTicketForm(prev => ({ ...prev, priority: value }))}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="low">Low</SelectItem>
                        <SelectItem value="medium">Medium</SelectItem>
                        <SelectItem value="high">High</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="message">Message</Label>
                  <Textarea
                    id="message"
                    value={ticketForm.message}
                    onChange={(e) => setTicketForm(prev => ({ ...prev, message: e.target.value }))}
                    placeholder="Provide detailed information about your issue..."
                    rows={4}
                    required
                  />
                </div>
                
                <div className="flex gap-2">
                  <Button 
                    type="submit" 
                    disabled={createTicket.isPending}
                    className="gradient-primary"
                  >
                    {createTicket.isPending ? 'Creating...' : 'Create Ticket'}
                  </Button>
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={() => setIsCreating(false)}
                  >
                    Cancel
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        )}

        {/* Support Tickets List */}
        <div className="space-y-6">
          {tickets.map((ticket) => (
            <Card key={ticket.id} className="glass-card border-0">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    {getStatusIcon(ticket.status)}
                    <div>
                      <CardTitle className="text-lg">{ticket.subject}</CardTitle>
                      <CardDescription>
                        Created {new Date(ticket.created_at).toLocaleDateString()}
                      </CardDescription>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge className={getPriorityColor(ticket.priority)}>
                      {ticket.priority}
                    </Badge>
                    <Badge variant={
                      ticket.status === 'closed' ? 'default' :
                      ticket.status === 'in_progress' ? 'secondary' : 'outline'
                    }>
                      {ticket.status.replace('_', ' ')}
                    </Badge>
                  </div>
                </div>
              </CardHeader>
              
              <CardContent className="space-y-4">
                <div className="bg-accent/50 p-4 rounded-lg">
                  <p className="text-sm">{ticket.message}</p>
                </div>

                {/* Replies */}
                {ticket.support_replies && ticket.support_replies.length > 0 && (
                  <div className="space-y-3">
                    <h4 className="font-medium text-sm">Replies</h4>
                    {ticket.support_replies.map((reply: any) => (
                      <div 
                        key={reply.id} 
                        className={`p-3 rounded-lg text-sm ${
                          reply.is_admin 
                            ? 'bg-blue-50 border-l-4 border-blue-500' 
                            : 'bg-gray-50 border-l-4 border-gray-300'
                        }`}
                      >
                        <p>{reply.message}</p>
                        <p className="text-xs text-muted-foreground mt-2">
                          {reply.is_admin ? 'Support Team' : 'You'} • {new Date(reply.created_at).toLocaleDateString()}
                        </p>
                      </div>
                    ))}
                  </div>
                )}

                {/* Reply Form */}
                {ticket.status !== 'closed' && (
                  <div className="space-y-2 pt-4 border-t">
                    <Label htmlFor={`reply-${ticket.id}`}>Add Reply</Label>
                    <Textarea
                      id={`reply-${ticket.id}`}
                      placeholder="Type your reply..."
                      value={replyMessages[ticket.id] || ''}
                      onChange={(e) => setReplyMessages(prev => ({
                        ...prev,
                        [ticket.id]: e.target.value
                      }))}
                      rows={3}
                    />
                    <Button
                      onClick={() => handleReply(ticket.id)}
                      disabled={!replyMessages[ticket.id]?.trim() || createReply.isPending}
                      size="sm"
                      className="gradient-primary"
                    >
                      Send Reply
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}

          {tickets.length === 0 && !isCreating && (
            <Card className="glass-card border-0">
              <CardContent className="text-center py-12">
                <MessageSquare className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No Support Tickets</h3>
                <p className="text-gray-500 mb-4">
                  You haven't created any support tickets yet.
                </p>
                <Button 
                  onClick={() => setIsCreating(true)} 
                  className="gradient-primary"
                >
                  Create Your First Ticket
                </Button>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Support;
