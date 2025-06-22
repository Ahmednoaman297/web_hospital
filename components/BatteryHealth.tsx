import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Thermometer, PlugZap, BatteryFull } from 'lucide-react';
import clsx from 'clsx';

type BatteryHealthProps = {
  percentage: number;
  voltage: number;
  temperature: number;
};

export function BatteryHealth({ percentage, voltage, temperature }: BatteryHealthProps) {
  const getStatus = () => {
    if (percentage > 80) return { label: 'Good', color: 'green' };
    if (percentage > 50) return { label: 'Warning', color: 'yellow' };
    return { label: 'Critical', color: 'red' };
  };

  const status = getStatus();

  const progressColor = clsx({
    'bg-green-500': percentage > 80,
    'bg-yellow-400': percentage <= 80 && percentage > 50,
    'bg-red-500': percentage <= 50,
  });

  return (
    <Card className="bg-slate-800/60 backdrop-blur-xl shadow-2xl rounded-xl border border-blue-500/20">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg font-semibold text-cyan-100">
          <BatteryFull className="w-5 h-5 text-cyan-100" />
          Battery Health
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4 text-blue-100">
        {/* Charge Bar */}
        <div>
          <p className="text-sm text-slate-300">Charge</p>
          <div className="w-full h-3 bg-slate-700 rounded-full overflow-hidden mt-1">
            <div
              className={clsx('h-3 rounded-full transition-all duration-300', progressColor)}
              style={{ width: `${percentage}%` }}
            ></div>
          </div>
          <p className="text-sm mt-1 text-slate-200">{percentage}%</p>
        </div>

        {/* Voltage + Temp */}
        {/* <div className="flex justify-between text-sm text-slate-300">
          <span>
            <PlugZap className="inline w-4 h-4 mr-1" />
            Voltage: {voltage} V
          </span>
          <span>
            <Thermometer className="inline w-4 h-4 mr-1" />
            Temp: {temperature} °C
          </span>
        </div> */}

        {/* Status */}
        <div className="flex items-center gap-2 text-sm">
          <span
            className={clsx('w-2 h-2 rounded-full', {
              'bg-green-500': status.color === 'green',
              'bg-yellow-400': status.color === 'yellow',
              'bg-red-500': status.color === 'red',
            })}
          ></span>
          <span className="text-slate-200">
            Status: <span className={`text-${status.color}-400 font-medium`}>{status.label}</span>
          </span>
        </div>
      </CardContent>
    </Card>
  );
}
