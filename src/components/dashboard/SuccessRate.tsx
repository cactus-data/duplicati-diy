import { LineChart } from 'lucide-react';

interface SuccessRateProps {
  rate: number;
}

export function SuccessRate({ rate }: SuccessRateProps) {
  const percentage = Math.round(rate * 100);
  
  // SVG arc calculation
  const width = 200;
  const height = 100;
  const thickness = 16;
  const radius = 80;
  
  // Calculate the end angle based on the percentage
  const angle = (percentage / 100) * Math.PI;
  
  // Calculate end point of the arc
  const endX = width / 2 + radius * Math.cos(Math.PI - angle);
  const endY = height - (radius * Math.sin(angle));
  
  // Create the arc path
  const arcPath = `
    M ${width / 2 - radius} ${height}
    A ${radius} ${radius} 0 0 1 ${endX} ${endY}
  `;

  // Create the background arc path
  const backgroundArc = `
    M ${width / 2 - radius} ${height}
    A ${radius} ${radius} 0 0 1 ${width / 2 + radius} ${height}
  `;

  return (
    <div className="bg-gray-900 rounded-lg p-6 border border-gray-800">
      <div className="flex flex-col items-center">
        <div className="flex items-center space-x-2 mb-4 self-start">
          <LineChart className="w-5 h-5 text-blue-500" />
          <h3 className="text-lg font-medium text-white">Success rate</h3>
        </div>
        <p className="text-gray-400 text-sm self-start mb-4">
          Quickly see the overall success rate of your backups. A visual indicator of system reliability.
        </p>
        <div className="relative">
          <svg width={width} height={height} className="relative">
            {/* Background arc */}
            <path
              d={backgroundArc}
              fill="none"
              stroke="#374151"
              strokeWidth={thickness}
              strokeLinecap="round"
              className="opacity-25"
            />
            {/* Foreground arc */}
            <path
              d={arcPath}
              fill="none"
              stroke="#3B82F6"
              strokeWidth={thickness}
              strokeLinecap="round"
            />
          </svg>
          <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2">
            <span className="text-4xl font-bold text-white">{percentage}%</span>
          </div>
        </div>
      </div>
    </div>
  );
}
