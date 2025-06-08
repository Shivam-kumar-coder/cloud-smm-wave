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

const Support = () => {
  const [subject, setSubject] = useState('');
  const [priority, setPriority] = useState('');
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const tickets = [
    {
      id: '#TICK001',
      subject: 'Order not starting',
      priority: 'High',
      status: 'Open',
      createdAt: '2024-01-17 14:30',
      lastReply: '2024-01-17 15:45',
      messages: 3
    },
    {
      id: '#TICK002',
      subject: 'Payment issue',
      priority: 'Medium',
      status: 'In Progress',
      createdAt: '2024-01-16 09:15',
      lastReply: '2024-01-16 16:20',
      messages: 5
    },
    {
      id: '#TICK003',
      subject: 'Account verification',
      priority: 'Low',
      status: 'Resolved',
      createdAt: '2024-01-15 11:20',
      lastReply: '2024-01-15 18:30',
      messages: 2
    }
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Simulate ticket creation
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast({
        title: 'Ticket Created Successfully!',
        description: 'Our support team will get back to you within 24 hours.',
      });
      
      // Reset form
      setSubject('');
      setPriority('');
      setMessage('');
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to create ticket. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Open':
        return <AlertCircle className="w-4 h-4" />;
      case 'In Progress':
        return <Clock className="w-4 h-4" />;
      case 'Resolved':
        return <CheckCircle className="w-4 h-4" />;
      default:
        return <HelpCircle className="w-4 h-4" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Open':
        return 'bg-red-500/10 text-red-500 border-red-500/20';
      case 'In Progress':
        return 'bg-blue-500/10 text-blue-500 border-blue-500/20';
      case 'Resolved':
        return 'bg-green-500/10 text-green-500 border-green-500/20';
      default:
        return 'bg-gray-500/10 text-gray-500 border-gray-500/20';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'High':
        return 'bg-red-500/10 text-red-500 border-red-500/20';
      case 'Medium':
        return 'bg-orange-500/10 text-orange-500 border-orange-500/20';
      case 'Low':
        return 'bg-green-500/10 text-green-500 border-green-500/20';
      default:
        return 'bg-gray-500/10 text-gray-500 border-gray-500/20';
    }
  };

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
                  disabled={!subject || !priority || !message || isLoading}
                >
                  {isLoading ? (
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
                <div
                  key={ticket.id}
                  className="flex items-center justify-between p-4 rounded-lg bg-accent/50 hover:bg-accent/70 transition-colors"
                >
                  <div className="flex items-center gap-4">
                    <div className="p-2 rounded-lg bg-background">
                      {getStatusIcon(ticket.status)}
                    </div>
                    <div>
                      <h4 className="font-medium">{ticket.subject}</h4>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <span>Ticket {ticket.id}</span>
                        <span>•</span>
                        <span>{ticket.messages} messages</span>
                        <span>•</span>
                        <span>Last reply: {ticket.lastReply}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className={getPriorityColor(ticket.priority)}>
                      {ticket.priority}
                    </Badge>
                    <Badge variant="outline" className={getStatusColor(ticket.status)}>
                      {ticket.status}
                    </Badge>
                    <Button variant="outline" size="sm">
                      View
                    </Button>
                  </div>
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
