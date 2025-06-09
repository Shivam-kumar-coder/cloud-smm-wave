
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { MessageSquare, Plus, Clock, CheckCircle, AlertCircle, HelpCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import DashboardLayout from '@/components/DashboardLayout';
import { useSupportTickets, useCreateSupportTicket, useCreateSupportReply } from '@/hooks/useSupportTickets';
import { format } from 'date-fns';

const Support = () => {
  const [subject, setSubject] = useState('');
  const [priority, setPriority] = useState('medium');
  const [message, setMessage] = useState('');
  const [replyingToTicket, setReplyingToTicket] = useState<string | null>(null);
  const [replyMessage, setReplyMessage] = useState('');
  const { toast } = useToast();
  
  const { data: tickets = [], isLoading } = useSupportTickets();
  const createTicket = useCreateSupportTicket();
  const createReply = useCreateSupportReply();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      await createTicket.mutateAsync({
        subject,
        message,
        priority,
      });
      
      toast({
        title: 'Ticket Created Successfully!',
        description: 'Our support team will get back to you within 24 hours.',
      });
      
      // Reset form
      setSubject('');
      setMessage('');
      setPriority('medium');
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || 'Failed to create ticket.',
        variant: 'destructive',
      });
    }
  };

  const handleSendReply = async (ticketId: string) => {
    if (!replyMessage.trim()) return;

    try {
      await createReply.mutateAsync({
        ticket_id: ticketId,
        message: replyMessage,
      });
      
      setReplyMessage('');
      setReplyingToTicket(null);
      
      toast({
        title: 'Reply Sent',
        description: 'Your reply has been sent.',
      });
    } catch (error: any) {
      toast({
        title: 'Error',
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
        return <HelpCircle className="w-4 h-4" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'open':
        return 'bg-red-500/10 text-red-500 border-red-500/20';
      case 'in_progress':
        return 'bg-blue-500/10 text-blue-500 border-blue-500/20';
      case 'closed':
        return 'bg-green-500/10 text-green-500 border-green-500/20';
      default:
        return 'bg-gray-500/10 text-gray-500 border-gray-500/20';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'bg-red-500/10 text-red-500 border-red-500/20';
      case 'medium':
        return 'bg-orange-500/10 text-orange-500 border-orange-500/20';
      case 'low':
        return 'bg-green-500/10 text-green-500 border-green-500/20';
      default:
        return 'bg-gray-500/10 text-gray-500 border-gray-500/20';
    }
  };

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold mb-2">Support Center</h1>
          <p className="text-muted-foreground">
            Get help with your orders, account, or any other questions you may have.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Create New Ticket */}
          <Card className="glass-card border-0">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Plus className="w-5 h-5" />
                Create New Ticket
              </CardTitle>
              <CardDescription>
                Describe your issue and our support team will help you resolve it.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="subject">Subject</Label>
                  <Input
                    id="subject"
                    placeholder="Briefly describe your issue"
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="priority">Priority</Label>
                  <Select value={priority} onValueChange={setPriority}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select priority level" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="low">Low - General questions</SelectItem>
                      <SelectItem value="medium">Medium - Order issues</SelectItem>
                      <SelectItem value="high">High - Urgent payment/account issues</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="message">Message</Label>
                  <Textarea
                    id="message"
                    placeholder="Provide detailed information about your issue..."
                    rows={6}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    required
                  />
                </div>

                <Button
                  type="submit"
                  className="w-full gradient-primary hover:scale-105 transition-transform duration-200"
                  disabled={!subject || !message || createTicket.isPending}
                >
                  {createTicket.isPending ? (
                    'Creating Ticket...'
                  ) : (
                    <>
                      <MessageSquare className="w-4 h-4 mr-2" />
                      Create Ticket
                    </>
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* Quick Help */}
          <Card className="glass-card border-0">
            <CardHeader>
              <CardTitle>Quick Help</CardTitle>
              <CardDescription>Common questions and answers</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="p-4 rounded-lg bg-accent/50">
                <h4 className="font-medium mb-2">How long do orders take to start?</h4>
                <p className="text-sm text-muted-foreground">
                  Most orders start within 0-6 hours. Some premium services may take up to 24 hours.
                </p>
              </div>
              <div className="p-4 rounded-lg bg-accent/50">
                <h4 className="font-medium mb-2">What payment methods do you accept?</h4>
                <p className="text-sm text-muted-foreground">
                  We accept PayPal, Credit/Debit cards, Cryptocurrency, and Bank transfers.
                </p>
              </div>
              <div className="p-4 rounded-lg bg-accent/50">
                <h4 className="font-medium mb-2">Do you offer refunds?</h4>
                <p className="text-sm text-muted-foreground">
                  Yes, we offer refunds for orders that don't start within 24 hours or fail to deliver.
                </p>
              </div>
              <div className="p-4 rounded-lg bg-accent/50">
                <h4 className="font-medium mb-2">Is my account information secure?</h4>
                <p className="text-sm text-muted-foreground">
                  Yes, we use industry-standard encryption to protect your data and never store passwords.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Existing Tickets */}
        <Card className="glass-card border-0">
          <CardHeader>
            <CardTitle>Your Support Tickets</CardTitle>
            <CardDescription>Track the status of your support requests</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {tickets.map((ticket) => (
                <div key={ticket.id} className="p-4 rounded-lg bg-accent/50">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h4 className="font-medium">{ticket.subject}</h4>
                      <p className="text-sm text-muted-foreground">
                        Created: {format(new Date(ticket.created_at), 'MMM dd, yyyy HH:mm')}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className={getPriorityColor(ticket.priority)}>
                        {ticket.priority}
                      </Badge>
                      <Badge variant="outline" className={getStatusColor(ticket.status)}>
                        {ticket.status?.replace('_', ' ')}
                      </Badge>
                    </div>
                  </div>

                  <div className="bg-white p-3 rounded-lg mb-4">
                    <p className="text-gray-700">{ticket.message}</p>
                  </div>

                  {ticket.support_replies && ticket.support_replies.length > 0 && (
                    <div className="space-y-2 mb-4">
                      <h4 className="font-medium text-sm">Conversation:</h4>
                      {ticket.support_replies.map((reply: any) => (
                        <div key={reply.id} className={`p-3 rounded-lg ${reply.is_admin ? 'bg-blue-50 ml-4' : 'bg-gray-100 mr-4'}`}>
                          <div className="flex justify-between items-start mb-2">
                            <span className="text-sm font-medium">
                              {reply.is_admin ? 'Support Team' : 'You'}
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

                  {ticket.status !== 'closed' && (
                    <>
                      {replyingToTicket === ticket.id ? (
                        <div className="space-y-3">
                          <Textarea
                            placeholder="Type your reply..."
                            value={replyMessage}
                            onChange={(e) => setReplyMessage(e.target.value)}
                            rows={3}
                          />
                          <div className="flex gap-2">
                            <Button onClick={() => handleSendReply(ticket.id)} size="sm" disabled={createReply.isPending}>
                              {createReply.isPending ? 'Sending...' : 'Send Reply'}
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
                    </>
                  )}
                </div>
              ))}

              {tickets.length === 0 && (
                <div className="text-center py-8 text-muted-foreground">
                  No support tickets yet. Create one above if you need help!
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default Support;
