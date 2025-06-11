
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { CheckCircle, Clock, AlertCircle, XCircle, Loader2 } from 'lucide-react';

interface OrderStatusTrackerProps {
  status: string;
  className?: string;
}

const OrderStatusTracker = ({ status, className = '' }: OrderStatusTrackerProps) => {
  const getStatusInfo = (status: string) => {
    switch (status.toLowerCase()) {
      case 'pending':
        return {
          icon: <Clock className="w-4 h-4" />,
          color: 'bg-yellow-500/10 text-yellow-600 border-yellow-500/20',
          progress: 25,
          message: 'Order received and being processed'
        };
      case 'processing':
        return {
          icon: <Loader2 className="w-4 h-4 animate-spin" />,
          color: 'bg-blue-500/10 text-blue-600 border-blue-500/20',
          progress: 75,
          message: 'Order is being delivered'
        };
      case 'success':
      case 'completed':
        return {
          icon: <CheckCircle className="w-4 h-4" />,
          color: 'bg-green-500/10 text-green-600 border-green-500/20',
          progress: 100,
          message: 'Order completed successfully'
        };
      case 'cancelled':
        return {
          icon: <XCircle className="w-4 h-4" />,
          color: 'bg-red-500/10 text-red-600 border-red-500/20',
          progress: 0,
          message: 'Order was cancelled'
        };
      default:
        return {
          icon: <AlertCircle className="w-4 h-4" />,
          color: 'bg-gray-500/10 text-gray-600 border-gray-500/20',
          progress: 0,
          message: 'Unknown status'
        };
    }
  };

  const statusInfo = getStatusInfo(status);

  return (
    <div className={`space-y-3 ${className}`}>
      <div className="flex items-center justify-between">
        <Badge className={`${statusInfo.color} flex items-center gap-2`}>
          {statusInfo.icon}
          {status.charAt(0).toUpperCase() + status.slice(1)}
        </Badge>
        <span className="text-xs text-gray-500">{statusInfo.progress}%</span>
      </div>
      <Progress value={statusInfo.progress} className="h-2" />
      <p className="text-xs text-gray-600">{statusInfo.message}</p>
    </div>
  );
};

export default OrderStatusTracker;
