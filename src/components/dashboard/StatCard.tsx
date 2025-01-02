import { LucideIcon } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon?: LucideIcon;
  className?: string;
}

export function StatCard({ title, value, subtitle, icon: Icon, className = '' }: StatCardProps) {
  return (
    <div className={`bg-[#1C1C1C] rounded-lg p-6 ${className}`}>
      <div className="flex justify-between items-start">
        <div>
          <h3 className="text-gray-400 text-sm font-medium mb-1">{title}</h3>
          <div className="text-white text-3xl font-semibold">{value}</div>
          {subtitle && (
            <p className="text-gray-400 text-sm mt-2">{subtitle}</p>
          )}
        </div>
        {Icon && (
          <div className="bg-blue-600/20 p-3 rounded-lg">
            <Icon className="w-6 h-6 text-blue-500" />
          </div>
        )}
      </div>
    </div>
  );
}
