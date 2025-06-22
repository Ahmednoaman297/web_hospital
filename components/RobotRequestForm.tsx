
import { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { useToast } from '@/hooks/use-toast';
import { MapPin, ZoomIn, ZoomOut, Home } from 'lucide-react';

interface RobotRequestFormProps {
  onRequest: (coordinates: {
    x: number;
    y: number;
    floor: number;
    yaw: number;
    room?: string;
  }) => void;
  disabled: boolean;
  currentLocation?: {
    x: number;
    y: number;
    floor: number;
    yaw: number;
    room: string;
  };
}

export const RobotRequestForm = ({ onRequest, disabled, currentLocation }: RobotRequestFormProps) => {
  const [coordinates, setCoordinates] = useState({
    x: 0,
    y: 0,
    floor: 1,
    yaw: 0,
    room: '',
  });
  const [selectedMapPosition, setSelectedMapPosition] = useState<{x: number, y: number} | null>(null);
  const [zoomLevel, setZoomLevel] = useState<number[]>([100]);
  const { toast } = useToast();
  const imgRef = useRef<HTMLImageElement | null>(null);

  // Update map position when currentLocation changes (robot moves)
  const homePosition = { x: 0.2, y: 2.6, floor: 1, yaw: 0, room: 'home' };

  useEffect(() => {
    if (currentLocation) {
      setSelectedMapPosition({ x: currentLocation.x, y: currentLocation.y });
      setCoordinates({
        x:currentLocation.x ,
        y:  currentLocation.y ,
        floor: currentLocation.floor,
        yaw: currentLocation.yaw,
        room: currentLocation.room,
      });
    }
  }, [currentLocation]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (disabled) {
      toast({
        title: "Robot Busy",
        description: "Please wait for the current task to complete.",
        variant: "destructive",
      });
      return;
    }

    // Update map position when sending coordinates
    setSelectedMapPosition({ x: coordinates.x, y: coordinates.y });

    onRequest({
      x: coordinates.x ,
      y: coordinates.y ,
      floor: coordinates.floor,
      yaw: coordinates.yaw,
      room: coordinates.room,
    });
  };

  const handleInputChange = (field: string, value: string) => {
    const numValue = parseFloat(value) || 0;
    setCoordinates(prev => ({
      ...prev,
      [field]: numValue
    }));
    
     if (field === 'x' || field === 'y') {
      setSelectedMapPosition((prev) => ({
        x: field === 'x' ? numValue : prev?.x ?? 0,
        y: field === 'y' ? numValue : prev?.y ?? 0
      }));
    }
  };

  const handleMapClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (disabled) return;
    if (!imgRef.current) return;

    const resolution = 0.05; // meters per pixel (as per YAML file)
    const origin = [-15.4, -13.8]; // Origin of the map in meters (from YAML)
    const rect = imgRef.current.getBoundingClientRect();

    // Get the actual image size dynamically
    const mapImage = e.currentTarget.querySelector("img");
    const imgWidth = mapImage ? mapImage.naturalWidth : 670;  // Default to 670 if image is not found
    const imgHeight = mapImage ? mapImage.naturalHeight : 596; // Default to 596 if image is not found

    // Calculate the mouse position relative to the map container
    const xRatio = (e.clientX - rect.left) / rect.width;
    const yRatio = (e.clientY - rect.top) / rect.height;
    const x = xRatio * 20 - 10;
    const y = yRatio * 20 - 10;
    
    setSelectedMapPosition({ x, y });
    setCoordinates(prev => ({
      ...prev,
      x: Math.round(x * 10) / 10,
      y: Math.round(y * 10) / 10
    }));
    
    toast({
      title: "Position Selected",
      description: `Coordinates: (${Math.round(x * 10) / 10}, ${Math.round(y * 10) / 10})`,
    });
  };

  const setPreset = (presetName: string) => {
    const presets = {
      '101': { x: 2, y: 0.81, floor: 1, yaw: 62, room: 'Room No 101' },
      '102': { x: 0, y: 0, floor: 1, yaw: 0, room: 'Room No 102' },
      '103': { x: 2.3, y: -0.5, floor:1, yaw: 0, room: 'Room No 103' },
      '104': { x: -3, y: -7, floor: 3, yaw: 270, room: 'Room No 104' },
      '105': { x: 4, y: -2, floor: 1, yaw: 0, room: 'Room No 105' },
      '106': { x: -6, y: 8, floor: 1, yaw: 45, room: 'Room No 106' },
    };
    
    const preset = presets[presetName as keyof typeof presets];
    
    if (preset) {
      // Just update the UI with the preset room values (but don't apply any transformations yet)
      setCoordinates(preset);
      setSelectedMapPosition({ x: preset.x, y: preset.y });

      toast({
        title: "Preset Loaded",
        description: `Robot set to Room ${presetName}`,
      });

      // Apply the adjustments for x, y, and yaw when sending the request
      onRequest({
        x: applyCoordinateAdjustments(preset.x, presetName, 'x'),
        y: applyCoordinateAdjustments(preset.y, presetName, 'y'),
        floor: preset.floor,
        yaw: applyCoordinateAdjustments(preset.yaw, presetName, 'yaw'),
        room: preset.room,
      });
    }
  };

  // Helper function to apply adjustments based on the room
  const applyCoordinateAdjustments = (coordinate: number, presetName: string, coordinateType: string): number => {
    switch (presetName) {
      case '101':
        return coordinateType === 'x' ? coordinate - 0.492 :
               coordinateType === 'y' ? coordinate - 0.0 :
               coordinateType === 'yaw' ? coordinate - 61.579 : coordinate;
      case '102':
        return coordinateType === 'x' ? coordinate - 0.2 :
               coordinateType === 'y' ? coordinate - 0.3 :
               coordinateType === 'yaw' ? coordinate - 30 : coordinate;
      case '103':
        return coordinateType === 'x' ? coordinate + 0.42 :
               coordinateType === 'y' ? coordinate - 5.77 :
               coordinateType === 'yaw' ? coordinate - 146.296  : coordinate;
      case '104':
        return coordinateType === 'x' ? coordinate -0 :
               coordinateType === 'y' ? coordinate - 0 :
               coordinateType === 'yaw' ? coordinate -0 : coordinate;
      case '105':
        return coordinateType === 'x' ? coordinate - 0.3 :
               coordinateType === 'y' ? coordinate - 0.2 :
               coordinateType === 'yaw' ? coordinate - 15 : coordinate;
      case '106':
        return coordinateType === 'x' ? coordinate - 0.4 :
               coordinateType === 'y' ? coordinate - 0.3 :
               coordinateType === 'yaw' ? coordinate - 10 : coordinate;
      // case 'home':
      //   return coordinateType === 'x' ? coordinate - 0.4 :
      //          coordinateType === 'y' ? coordinate - 0.3 :
      //          coordinateType === 'yaw' ? coordinate - 10 : coordinate;
      default:
        return coordinate; // No adjustments if no match
    }
  };


  const goHome = () => {
    // Apply the adjustments for home coordinates
    const adjustedX = applyCoordinateAdjustments(homePosition.x, 'home', 'x');
    const adjustedY = applyCoordinateAdjustments(homePosition.y, 'home', 'y');
    const adjustedYaw = applyCoordinateAdjustments(homePosition.yaw, 'home', 'yaw');

    const adjustedHomePosition = { x: adjustedX, y: adjustedY, floor: homePosition.floor, yaw: adjustedYaw, room: homePosition.room };
    
    setCoordinates(adjustedHomePosition);
    setSelectedMapPosition({ x: adjustedHomePosition.x, y: adjustedHomePosition.y });
    
    toast({
      title: "Home Position Set",
      description: "Robot set to home position (0, 0)",
    });

    // Send the adjusted values to the backend
    onRequest({
      x: adjustedHomePosition.x-0.992,
      y: adjustedHomePosition.y+1.61,
      floor: adjustedHomePosition.floor,
      yaw: adjustedHomePosition.yaw+123.561,
      room: adjustedHomePosition.room,
    });
  };
  const handleZoomIn = () =>
    setZoomLevel((prev) => [Math.min(prev[0] + 25, 200)]);
  const handleZoomOut = () =>
    setZoomLevel((prev) => [Math.max(prev[0] - 25, 50)]);

  return (
    <Card className="bg-slate-800/60 backdrop-blur-xl border border-cyan-500/20 shadow-2xl">
      <CardHeader>
        <CardTitle className="text-cyan-100">Robot Control</CardTitle>
        <CardDescription className="text-slate-400">
          Send movement commands to the robot
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Interactive Map */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-cyan-200 flex items-center">
                <MapPin className="w-5 h-5 mr-2" />
                Hospital Map - Click to Select Position
              </h3>
              
              {/* Zoom Controls */}
              <div className="flex items-center space-x-3">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={handleZoomOut}
                  disabled={disabled || zoomLevel[0] <= 50}
                  className="border-cyan-500/30 text-cyan-200 hover:bg-cyan-500/10 p-2"
                >
                  <ZoomOut className="w-4 h-4" />
                </Button>
                
                <div className="w-24">
                  <Slider
                    value={zoomLevel}
                    onValueChange={setZoomLevel}
                    min={50}
                    max={200}
                    step={25}
                    disabled={disabled}
                    className="w-full"
                  />
                </div>
                
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={handleZoomIn}
                  disabled={disabled || zoomLevel[0] >= 200}
                  className="border-cyan-500/30 text-cyan-200 hover:bg-cyan-500/10 p-2"
                >
                  <ZoomIn className="w-4 h-4" />
                </Button>
                
                <span className="text-xs text-cyan-300 min-w-[3rem]">
                  {zoomLevel[0]}%
                </span>
              </div>
            </div>
            
            <div className="relative w-[570px] h-[400px] mx-auto overflow-hidden rounded-lg border border-cyan-500/20 cursor-crosshair" onClick={handleMapClick}>
              {/* Map image, centered and scalable */}
              <img
                ref={imgRef}
                src="/uploads/Map.png"
                alt="Hospital Map"
                draggable={false}
                className="absolute top-1/2 left-1/2 select-none"
                style={{
                  transform: `translate(-50%, -50%) scale(${zoomLevel[0]/ 100})`,
                  transformOrigin: 'right top',
                  transition: 'transform 0.2s ease-in-out',
                }}
              />
              {/* Grid overlay */}
              <div className="absolute inset-0 opacity-20">
                {[...Array(11)].map((_, i) => (
                  <div key={`v-${i}`} className="absolute h-full w-px bg-cyan-400" style={{ left: `${i * 10}%` }} />
                ))}
                {[...Array(11)].map((_, i) => (
                  <div key={`h-${i}`} className="absolute w-full h-px bg-cyan-400" style={{ top: `${i * 10}%` }} />
                ))}
              </div>
              
              {/* Room indicators positioned based on the floor plan */}
              <div className="absolute top-4 left-6 w-3 h-3 bg-red-500 rounded-full opacity-90 shadow-lg border border-white" title="Emergency" />
              <div className="absolute top-6 right-8 w-3 h-3 bg-blue-500 rounded-full opacity-90 shadow-lg border border-white" title="Surgery" />
              <div className="absolute bottom-8 left-4 w-3 h-3 bg-green-500 rounded-full opacity-90 shadow-lg border border-white" title="ICU" />
              <div className="absolute bottom-6 right-6 w-3 h-3 bg-purple-500 rounded-full opacity-90 shadow-lg border border-white" title="Pharmacy" />
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-4 h-4 bg-yellow-500 rounded-full opacity-90 shadow-lg border border-white" title="Reception (Home)" />
              
              {/* Selected position with orientation arrow */}
              {selectedMapPosition && (
                <div 
                  className="absolute transform -translate-x-1/2 -translate-y-1/2 transition-all duration-700 ease-in-out"
                  style={{ 
                    left: `${((selectedMapPosition.x + 10) / 20) * 100}%`,
                    top: `${((selectedMapPosition.y + 10) / 20) * 100}%`
                  }}
                >
                  {/* Robot position indicator */}
                  <div className="w-5 h-5 bg-cyan-400 rounded-full border-2 border-white animate-pulse shadow-lg" />
                  
                  {/* Orientation arrow */}
                  <div 
                    className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-10 h-10 pointer-events-none"
                    style={{ 
                      transform: `translate(-50%, -50%) rotate(${coordinates.yaw}deg)` 
                    }}
                  >
                    <svg 
                      width="40" 
                      height="40" 
                      viewBox="0 0 40 40" 
                      className="text-cyan-300 drop-shadow-lg"
                    >
                      <path 
                        d="M20 6 L26 18 L20 14 L14 18 Z" 
                        fill="currentColor" 
                        stroke="white" 
                        strokeWidth="2"
                      />
                    </svg>
                  </div>
                </div>
              )}
              
              <div className="absolute bottom-1 right-1 text-xs text-cyan-300 bg-slate-800/80 px-2 py-1 rounded">
                Click to set position
              </div>
            </div>
          </div>

          {/* Position Controls */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-cyan-200">Position (meters)</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="x" className="text-cyan-200">X</Label>
                <Input
                  id="x"
                  type="number"
                  step="0.1"
                  value={coordinates.x}
                  onChange={(e) => handleInputChange('x', e.target.value)}
                  className="bg-slate-700/50 border-slate-600 text-cyan-100"
                  disabled={disabled}
                />
              </div>
              <div>
                <Label htmlFor="y" className="text-cyan-200">Y</Label>
                <Input
                  id="y"
                  type="number"
                  step="0.1"
                  value={coordinates.y}
                  onChange={(e) => handleInputChange('y', e.target.value)}
                  className="bg-slate-700/50 border-slate-600 text-cyan-100"
                  disabled={disabled}
                />
              </div>
            </div>
          </div>

          {/* Floor and Orientation Controls */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-cyan-200">Floor & Orientation</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="floor" className="text-cyan-200">Floor Number</Label>
                <Input
                  id="floor"
                  type="number"
                  min="1"
                  max="10"
                  value={coordinates.floor}
                  onChange={(e) => handleInputChange('floor', e.target.value)}
                  className="bg-slate-700/50 border-slate-600 text-cyan-100"
                  disabled={disabled}
                />
              </div>
              <div>
                <Label htmlFor="yaw" className="text-cyan-200">Yaw (degrees)</Label>
                <Input
                  id="yaw"
                  type="number"
                  step="1"
                  min="-180"
                  max="180"
                  value={coordinates.yaw}
                  onChange={(e) => handleInputChange('yaw', e.target.value)}
                  className="bg-slate-700/50 border-slate-600 text-cyan-100"
                  disabled={disabled}
                />
              </div>
            </div>
          </div>

          {/* Home Button */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-cyan-200">Quick Actions</h3>
            <Button
              type="button"
              variant="outline"
              onClick={goHome}
              disabled={disabled}
              className="w-full border-cyan-500/30 text-black-200 hover:bg-yellow-500/10 flex items-center justify-center space-x-2"
            >
              <Home className="w-5 h-5" />
              <span>Go Home</span>
            </Button>
          </div>

          {/* Preset Buttons */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-cyan-200">Room No :</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setPreset('101')}
                disabled={disabled}
                className="border-cyan-500/30 text-black-200 hover:bg-cyan-500/10"
              >
                101
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => setPreset('102')}
                disabled={disabled}
                className="border-cyan-500/30 text-black-200 hover:bg-cyan-500/10"
              >
                102
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => setPreset('103')}
                disabled={disabled}
                className="border-cyan-500/30 text-black-200 hover:bg-cyan-500/10"
              >
                103
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => setPreset('104')}
                disabled={disabled}
                className="border-cyan-500/30 text-black-200 hover:bg-cyan-500/10"
              >
                104
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => setPreset('105')}
                disabled={disabled}
                className="border-cyan-500/30 text-black-200 hover:bg-cyan-500/10"
              >
                105
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => setPreset('106')}
                disabled={disabled}
                className="border-cyan-500/30 text-black-200 hover:bg-cyan-500/10"
              >
                106
              </Button>
            </div>
          </div>

          {/* Submit Button */}
          <Button
            type="submit"
            disabled={disabled}
            className="w-full bg-cyan-600 hover:bg-cyan-700 text-white border-0 transition-all duration-300"
            size="lg"
          >
            {disabled ? 'Robot Busy...' : 'Send Robot Command'}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};
