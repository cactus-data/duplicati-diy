import { useState } from 'react';
import { Link2, ZoomIn, ZoomOut, Hand, Home, Menu } from 'lucide-react';
import { formatBytes } from '../../utils/format';
import type { BackupWithReport } from '../../hooks/useBackups';

interface StorageGraphProps {
  backups: BackupWithReport[];
}

export function StorageGraph({ backups }: StorageGraphProps) {
  const [period, setPeriod] = useState('7');
  const [hoveredPoint, setHoveredPoint] = useState<{
    date: Date;
    storage: number;
  } | null>(null);

  // Process backup data to create time series
  const processBackupData = () => {
    // Create a map to store daily storage values
    const dailyData = new Map<string, number>();
    
    // Get the date range based on selected period
    const endDate = new Date();
    const startDate = new Date();
    startDate.setDate(endDate.getDate() - parseInt(period));
    
    // Initialize all days in the range with 0
    for (let d = new Date(startDate); d <= endDate; d.setDate(d.getDate() + 1)) {
      dailyData.set(d.toISOString().split('T')[0], 0);
    }

    // Fill in actual backup data
    backups.forEach(backup => {
      (backup.history || []).forEach(report => {
        const date = new Date(report.end_time);
        const dateKey = date.toISOString().split('T')[0];
        const storageGB = Number(report.size_of_opened_files) / (1024 * 1024 * 1024);
        
        if (dailyData.has(dateKey)) {
          const currentStorage = dailyData.get(dateKey) || 0;
          dailyData.set(dateKey, Math.max(currentStorage, storageGB));
        }
      });
    });
    
    // Convert to array and sort by date
    return Array.from(dailyData.entries())
      .map(([date, storage]) => ({
        date: new Date(date),
        storage: Number(storage.toFixed(2))
      }))
      .sort((a, b) => a.date.getTime() - b.date.getTime());
  };

  const dataPoints = processBackupData();
  
  // Find the last non-zero storage value
  const latestStorage = [...dataPoints]
    .reverse()
    .find(point => point.storage > 0)?.storage || 0;
    
  const formattedTotal = formatBytes(latestStorage * 1024 * 1024 * 1024);

  // Graph dimensions
  const width = 600;
  const height = 240;
  const padding = { top: 20, right: 20, bottom: 30, left: 50 };
  const graphWidth = width - padding.left - padding.right;
  const graphHeight = height - padding.top - padding.bottom;

  const filteredDataPoints = dataPoints;

  // Calculate scales
  const minStorage = 0;
  const maxStorage = Math.max(10, Math.ceil(Math.max(...filteredDataPoints.map(d => d.storage))));
  const storageRange = maxStorage - minStorage;
  
  // Generate y-axis ticks with whole numbers
  const tickCount = 5;
  const yAxisTicks = Array.from({ length: tickCount }, (_, i) => {
    return Math.round(maxStorage - (storageRange * i / (tickCount - 1)));
  }).filter(value => !isNaN(value) && isFinite(value));

  const yScale = (value: number) => 
    graphHeight - ((value - minStorage) / (maxStorage - minStorage)) * graphHeight;

  // Generate path for the line
  const linePath = filteredDataPoints.map((point, i) => {
    const x = (i / (filteredDataPoints.length - 1)) * graphWidth;
    const y = yScale(point.storage);
    return `${i === 0 ? 'M' : 'L'} ${x} ${y}`;
  }).join(' ');

  // Generate path for the gradient area
  const areaPath = `
    ${linePath}
    L ${graphWidth} ${graphHeight}
    L 0 ${graphHeight}
    Z
  `;

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-medium text-white">
          Backup insights
        </h2>
        <select
          value={period}
          onChange={(e) => setPeriod(e.target.value)}
          className="bg-black/20 text-white rounded-lg px-3 py-1.5 text-sm border border-white/10"
        >
          <option value="7">Last 7 days</option>
          <option value="30">Last 30 days</option>
          <option value="90">Last 90 days</option>
        </select>
      </div>

      <div className="mb-6">
        <h3 className="text-gray-400 text-lg mb-1">Total storage used</h3>
        <p className="text-4xl font-bold text-white">{formattedTotal}</p>
      </div>

      <div className="relative">
        <svg width={width} height={height} className="overflow-visible">
          <defs>
            <linearGradient id="areaGradient" x1="0" x2="0" y1="0" y2="1">
              <stop offset="0%" stopColor="#3B82F6" stopOpacity="0.3" />
              <stop offset="100%" stopColor="#3B82F6" stopOpacity="0.05" />
            </linearGradient>
          </defs>

          <g transform={`translate(${padding.left}, ${padding.top})`}>
            {/* Y-axis grid lines and labels */}
            {yAxisTicks.map((value) => (
              <g key={`y-axis-${value}`} transform={`translate(0, ${yScale(value)})`}>
                <line
                  x1={0}
                  x2={graphWidth}
                  stroke="rgba(255,255,255,0.1)"
                  strokeWidth={1}
                />
                <text
                  x={-10}
                  y={4}
                  textAnchor="end"
                  className="text-xs fill-gray-400"
                >
                  {value} GB
                </text>
              </g>
            ))}

            {/* Area under the line */}
            <path
              d={areaPath}
              fill="url(#areaGradient)"
            />

            {/* Line */}
            <path
              d={linePath}
              fill="none"
              stroke="#3B82F6"
              strokeWidth={3}
            />

            {/* Data points */}
            {filteredDataPoints.map((point, i) => {
              const x = (i / (filteredDataPoints.length - 1)) * graphWidth;
              const y = yScale(point.storage);
              return (
                <g key={`point-${point.date.getTime()}`}>
                  <circle
                    cx={x}
                    cy={y}
                    r={5}
                    fill="#3B82F6"
                    stroke="#1F2937"
                    strokeWidth={2}
                    className="cursor-pointer"
                    onMouseEnter={() => setHoveredPoint({
                      date: point.date,
                      storage: point.storage,
                    })}
                    onMouseLeave={() => setHoveredPoint(null)}
                  />
                </g>
              );
            })}

            {/* X-axis dates */}
            {filteredDataPoints.map((point, i) => {
              const x = (i / (filteredDataPoints.length - 1)) * graphWidth;
              return (
                <g key={`x-axis-${point.date.getTime()}`}>
                  <text
                    x={x}
                    y={graphHeight + 20}
                    textAnchor="middle"
                    className="text-xs fill-gray-400"
                  >
                    {i === 0 || i === filteredDataPoints.length - 1 || i % Math.ceil(filteredDataPoints.length / 7) === 0
                      ? point.date.toLocaleDateString('en-US', { 
                          day: '2-digit',
                          month: 'short'
                        })
                      : ''}
                  </text>
                </g>
              );
            })}
          </g>
        </svg>

        {/* Tooltip */}
        {hoveredPoint && (
          <div
            className="absolute pointer-events-none bg-black/90 backdrop-blur-sm rounded px-3 py-2 shadow-xl text-sm"
            style={{
              left: '50%',
              top: '10%',
              transform: 'translateX(-50%)',
            }}
          >
            <div className="text-gray-400">
              {hoveredPoint.date.toLocaleDateString('en-US', {
                day: '2-digit',
                month: 'short',
                year: 'numeric'
              })}
            </div>
            <div className="text-white font-medium">
              Storage:{' '}
              <span className="text-blue-400">
                {hoveredPoint.storage.toFixed(2)} GB
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
