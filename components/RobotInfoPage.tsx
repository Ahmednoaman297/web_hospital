
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Hospital, User, ArrowRight, Info, ArrowLeft, ChevronDown, ChevronUp } from 'lucide-react';

interface RobotInfoPageProps {
  user: string;
  onProceedToControl: () => void;
  onLogout: () => void;
  onGoBack: () => void;
}

export const RobotInfoPage = ({ user, onProceedToControl, onLogout, onGoBack }: RobotInfoPageProps) => {
  const [showFeatures, setShowFeatures] = useState(false);

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
              <h1 className="text-2xl font-bold text-cyan-100">Hospital Robot System</h1>
              <p className="text-slate-400">Robot Information & Control Access</p>
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

      {/* Main Content */}
      <div className="max-w-4xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Robot Information Card */}
          <Card className="bg-slate-800/60 backdrop-blur-xl border border-cyan-500/20 shadow-2xl hover:shadow-cyan-500/10 transition-all duration-300">
            <CardHeader>
              <CardTitle className="text-cyan-100 flex items-center space-x-2">
                <Info className="w-6 h-6 text-cyan-400" />
                <span>Robot Information</span>
              </CardTitle>
              <CardDescription className="text-slate-400">
                Learn about our autonomous hospital robot
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Robot Image Placeholder */}
              <div className="w-full h-48 bg-gradient-to-br from-cyan-500/10 to-blue-500/10 rounded-lg border border-cyan-500/20 flex items-center justify-center">
                <div className="text-center">
                  <Hospital className="w-16 h-16 text-cyan-400 mx-auto mb-2" />
                  <p className="text-cyan-200 text-sm">Hospital Robot Model HR-2024</p>
                </div>
              </div>
              
              {/* Robot Description */}
              <div className="space-y-4 text-slate-300">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-cyan-200">Features:</h3>
                  <Button
                    onClick={() => setShowFeatures(!showFeatures)}
                    variant="ghost"
                    size="sm"
                    className="text-cyan-200 hover:bg-cyan-500/10"
                  >
                    {showFeatures ? (
                      <>
                        Hide <ChevronUp className="w-4 h-4 ml-1" />
                      </>
                    ) : (
                      <>
                        Show <ChevronDown className="w-4 h-4 ml-1" />
                      </>
                    )}
                  </Button>
                </div>
                
                {showFeatures && (
                  <div className="space-y-4 transition-all duration-300 ease-in-out">
                    <div className="space-y-2 text-sm">
                      <li className="flex items-start space-x-2">
                        <span className="w-1.5 h-1.5 bg-cyan-400 rounded-full mt-2 flex-shrink-0"></span>
                        <span>Autonomous navigation with 6-DOF precision control</span>
                      </li>
                      <li className="flex items-start space-x-2">
                        <span className="w-1.5 h-1.5 bg-cyan-400 rounded-full mt-2 flex-shrink-0"></span>
                        <span>Advanced obstacle detection and avoidance</span>
                      </li>
                      <li className="flex items-start space-x-2">
                        <span className="w-1.5 h-1.5 bg-cyan-400 rounded-full mt-2 flex-shrink-0"></span>
                        <span>Real-time coordinate positioning system</span>
                      </li>
                      <li className="flex items-start space-x-2">
                        <span className="w-1.5 h-1.5 bg-cyan-400 rounded-full mt-2 flex-shrink-0"></span>
                        <span>24/7 operational capability with status monitoring</span>
                      </li>
                      <li className="flex items-start space-x-2">
                        <span className="w-1.5 h-1.5 bg-cyan-400 rounded-full mt-2 flex-shrink-0"></span>
                        <span>Voice command integration and feedback system</span>
                      </li>
                      <li className="flex items-start space-x-2">
                        <span className="w-1.5 h-1.5 bg-cyan-400 rounded-full mt-2 flex-shrink-0"></span>
                        <span>Emergency response protocols and safety features</span>
                      </li>
                    </div>
                    
                    <div className="p-3 bg-cyan-500/10 rounded-lg border border-cyan-500/20">
                      <p className="text-sm text-cyan-200">
                        This robot is designed specifically for hospital environments, 
                        providing precise movement control for various medical assistance tasks 
                        including patient transport, medication delivery, and equipment management.
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Robot Control Access Card */}
          <Card className="bg-slate-800/60 backdrop-blur-xl border border-green-500/20 shadow-2xl hover:shadow-green-500/10 transition-all duration-300">
            <CardHeader>
              <CardTitle className="text-green-100 flex items-center space-x-2">
                <ArrowRight className="w-6 h-6 text-green-400" />
                <span>Robot Control</span>
              </CardTitle>
              <CardDescription className="text-slate-400">
                Access the robot control dashboard
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="text-center space-y-4">
                <div className="w-24 h-24 bg-gradient-to-br from-green-500/20 to-blue-500/20 rounded-full flex items-center justify-center mx-auto border border-green-500/30">
                  <Hospital className="w-12 h-12 text-green-400" />
                </div>
                
                <div className="space-y-2">
                  <h3 className="text-lg font-semibold text-green-200">Control Dashboard</h3>
                  <p className="text-slate-300 text-sm">
                    Access the main control interface to send movement commands and monitor robot status.
                  </p>
                </div>
                
                <div className="space-y-3 text-sm text-slate-400">
                  <div className="flex items-center justify-between p-2 bg-green-500/10 rounded border border-green-500/20">
                    <span>Coordinate Control</span>
                    <span className="text-green-400">✓</span>
                  </div>
                  <div className="flex items-center justify-between p-2 bg-green-500/10 rounded border border-green-500/20">
                    <span>Real-time Status</span>
                    <span className="text-green-400">✓</span>
                  </div>
                  <div className="flex items-center justify-between p-2 bg-green-500/10 rounded border border-green-500/20">
                    <span>Task Monitoring</span>
                    <span className="text-green-400">✓</span>
                  </div>
                </div>
              </div>
              
              <Button 
                onClick={onProceedToControl}
                className="w-full bg-green-600 hover:bg-green-700 text-white border-0 transition-all duration-300 transform hover:scale-105"
                size="lg"
              >
                <ArrowRight className="w-5 h-5 mr-2" />
                Proceed to Robot Control
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* System Overview */}
        <div className="mt-8">
          <Card className="bg-slate-800/60 backdrop-blur-xl border border-cyan-500/20 shadow-2xl">
            <CardHeader>
              <CardTitle className="text-cyan-100">System Overview</CardTitle>
              <CardDescription className="text-slate-400">Current system status and capabilities</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-center">
                <div className="p-4 bg-green-500/10 rounded-lg border border-green-500/20">
                  <div className="text-2xl font-bold text-green-400">Online</div>
                  <div className="text-sm text-slate-400">System Status</div>
                </div>
                <div className="p-4 bg-blue-500/10 rounded-lg border border-blue-500/20">
                  <div className="text-2xl font-bold text-blue-400">1</div>
                  <div className="text-sm text-slate-400">Available Robots</div>
                </div>
                <div className="p-4 bg-purple-500/10 rounded-lg border border-purple-500/20">
                  <div className="text-2xl font-bold text-purple-400">6-DOF</div>
                  <div className="text-sm text-slate-400">Movement Control</div>
                </div>
                <div className="p-4 bg-orange-500/10 rounded-lg border border-orange-500/20">
                  <div className="text-2xl font-bold text-orange-400">24/7</div>
                  <div className="text-sm text-slate-400">Availability</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};
