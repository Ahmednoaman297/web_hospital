
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Hospital } from 'lucide-react';
import { RobotState } from '@/components/Dashboard';

interface RobotStatusProps {
  status: RobotState;
  currentLocation: {
    floor: number;
    room: string;
    x: number;
    y: number;
    yaw: number;
  };
}

export const RobotStatus = ({ status, currentLocation }: RobotStatusProps) => {
  const getStatusColor = (status: RobotState) => {
    switch (status) {
      case 'idle':
        return 'green';
      case 'active':
        return 'blue';
      case 'busy':
        return 'orange';
      default:
        return 'gray';
    }
  };

  const getStatusText = (status: RobotState) => {
    switch (status) {
      case 'idle':
        return 'Ready for Commands';
      case 'active':
        return 'Processing Request';
      case 'busy':
        return 'Executing Task';
      default:
        return 'Unknown';
    }
  };

  const color = getStatusColor(status);

  return (
    <Card className="bg-slate-800/60 backdrop-blur-xl border border-cyan-500/20 shadow-2xl">
      <CardHeader>
        <CardTitle className="text-cyan-100">Robot Status</CardTitle>
        <CardDescription className="text-slate-400">Current operational state</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-center">
          <div className={`w-24 h-24 bg-${color}-500/20 rounded-full flex items-center justify-center border border-${color}-500/30 relative`}>
            <Hospital className={`w-12 h-12 text-${color}-400`} />
            <div className={`absolute -top-1 -right-1 w-6 h-6 bg-${color}-500 rounded-full border-2 border-slate-800 animate-pulse`}></div>
          </div>
        </div>
        
        <div className="text-center space-y-2">
          <div className={`text-xl font-bold text-${color}-400 capitalize`}>
            {status}
          </div>
          <div className="text-sm text-slate-300">
            {getStatusText(status)}
          </div>
        </div>
        
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-slate-400">Last Update:</span>
            <span className="text-cyan-200">{new Date().toLocaleTimeString()}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-slate-400">Robot ID:</span>
            <span className="text-cyan-200">HR-001</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-slate-400">Location:</span>
            <span className="text-cyan-200">{currentLocation.room} - Floor {currentLocation.floor}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
