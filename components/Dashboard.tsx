import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { RobotStatus } from '@/components/RobotStatus';
import { RobotRequestForm } from '@/components/RobotRequestForm';
import { Hospital, User, ArrowLeft } from 'lucide-react';
import { useRobotSocket } from '@/hooks/useRobotSocket';
import { BatteryHealth } from '@/components/BatteryHealth';

interface DashboardProps {
  user: string;
  onLogout: () => void;
  onGoBack: () => void;
}

export type RobotState = 'idle' | 'active' | 'busy';

export const Dashboard = ({ user, onLogout, onGoBack }: DashboardProps) => {
  const { status: robotStatus, currentLocation } = useRobotSocket();
  const [isSending, setIsSending] = useState(false);
  const { toast } = useToast();

  const handleRobotRequest = (coordinates: {
    x: number;
    y: number;
    floor: number;
    yaw: number;
    room?: string;
  }) => {
    (async () => {
      try {
        setIsSending(true);

        // 1) send request to your backend
        const res = await fetch('http://localhost:3001/api/robot-request', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(coordinates)
        });
        if (!res.ok) throw new Error('Failed to send robot request');

        // 2) immediate feedback
        const newLoc = {
          floor: coordinates.floor,
          room: coordinates.room || 'Unknown',
          x: coordinates.x,
          y: coordinates.y,
          yaw: coordinates.yaw
        };
        toast({
          title: "Robot Request Sent",
          description: `Moving In Floor ${newLoc.floor}${coordinates.room ? `, to ${coordinates.room}` : ''}`
        });

        // 3) restore idle after 20s (or listen for a real callback later)
        setTimeout(() => {
          toast({
            title: "Robot Task Complete",
            description: `Robot has arrived at ${newLoc.room} on Floor ${newLoc.floor}`
          });
          setIsSending(false);
        }, 20000);

      } catch (err: any) {
        toast({ title: "Error", description: err.message, variant: "destructive" });
        setIsSending(false);
      }
    })();
  };

  return (
    <div className="min-h-screen p-4 lg:p-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between bg-slate-800/60 backdrop-blur-xl rounded-xl p-6 shadow-2xl border border-cyan-500/20">
          <div className="flex items-center space-x-4">
            <Button
              onClick={onGoBack}
              variant="outline"
              size="sm"
              className="border-cyan-500/30 text-cyan-200 hover:bg-cyan-500/10 hover:border-cyan-400"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>
            <div className="w-12 h-12 bg-cyan-500/20 rounded-full flex items-center justify-center border border-cyan-500/30">
              <Hospital className="w-6 h-6 text-cyan-400" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-cyan-100">Hospital Robot Control</h1>
              <p className="text-slate-400">Autonomous robot coordination system</p>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2 text-cyan-200">
              <User className="w-5 h-5" />
              <span className="font-medium">{user}</span>
            </div>
            <Button
              onClick={onLogout}
              variant="outline"
              className="border-cyan-500/30 text-cyan-200 hover:bg-cyan-500/10 hover:border-cyan-400"
            >
              Sign Out
            </Button>
          </div>
        </div>
      </div>

      {/* Current Location Display */}
      <div className="mb-6">
        <Card className="bg-slate-800/60 backdrop-blur-xl border border-blue-500/20 shadow-xl">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-3 h-3 bg-blue-400 rounded-full animate-pulse"></div>
                <span className="text-blue-200 font-medium">Current Location:</span>
              </div>
              <div className="text-blue-100">
                Floor {currentLocation.floor} - {currentLocation.room}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Robot Status + Battery Health */}
        <div className="lg:col-span-1 space-y-4">
          <RobotStatus status={robotStatus} currentLocation={currentLocation} />
          <BatteryHealth percentage={90} voltage={12.6} temperature={36} />
        </div>

        {/* Robot Request Form */}
        <div className="lg:col-span-2">
          <RobotRequestForm
            onRequest={handleRobotRequest}
            disabled={robotStatus === 'busy' || isSending}
          />
        </div>
      </div>

      {/* System Information */}
      <div className="mt-6">
        <Card className="bg-slate-800/60 backdrop-blur-xl border border-cyan-500/20 shadow-2xl">
          <CardHeader>
            <CardTitle className="text-cyan-100">System Information</CardTitle>
            <CardDescription className="text-slate-400">Current robot coordination system status</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
              <div className="p-4 bg-green-500/10 rounded-lg border border-green-500/20">
                <div className="text-2xl font-bold text-green-400">Online</div>
                <div className="text-sm text-slate-400">System Status</div>
              </div>
              <div className="p-4 bg-blue-500/10 rounded-lg border border-blue-500/20">
                <div className="text-2xl font-bold text-blue-400">1</div>
                <div className="text-sm text-slate-400">Active Robots</div>
              </div>
              <div className="p-4 bg-purple-500/10 rounded-lg border border-purple-500/20">
                <div className="text-2xl font-bold text-purple-400">24/7</div>
                <div className="text-sm text-slate-400">Availability</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
