import { Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, HardDrive, Archive, Settings, HelpCircle, Info, Rocket } from 'lucide-react';
import { useThemeStore } from '../../stores/useThemeStore';

export function Sidebar() {
  const location = useLocation();
  const { isDarkMode, toggleTheme } = useThemeStore();

  const navigation = [
    { name: 'Dashboard', href: '/', icon: LayoutDashboard },
    { name: 'Machines', href: '/machines', icon: HardDrive },
    { name: 'Backups', href: '/backups', icon: Archive },
    { name: 'Settings', href: '/settings', icon: Settings },
  ];

  const isActive = (path: string) => {
    if (path === '/') {
      return location.pathname === '/';
    }
    return location.pathname.startsWith(path);
  };

  return (
    <div className="flex flex-col h-full bg-gray-900 w-64 text-gray-300">
      <div className="p-4 border-b border-gray-800">
        <Link to="/" className="flex items-center space-x-2">
          <div className="bg-blue-500 p-2 rounded">
            <Archive className="w-5 h-5 text-white" />
          </div>
          <span className="text-xl font-semibold text-white">duplicati</span>
        </Link>
      </div>

      <nav className="flex-1 p-4">
        <ul className="space-y-1">
          {navigation.map((item) => {
            const Icon = item.icon;
            return (
              <li key={item.name}>
                <Link
                  to={item.href}
                  className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition-colors ${
                    isActive(item.href)
                      ? 'bg-gray-800 text-white'
                      : 'text-gray-400 hover:bg-gray-800/50 hover:text-white'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span>{item.name}</span>
                </Link>
              </li>
            );
          })}
        </ul>

        <div className="mt-8">
          <h3 className="px-3 text-xs font-semibold text-gray-400 uppercase tracking-wider">
            Support
          </h3>
          <ul className="mt-2 space-y-1">
            <li>
              <Link
                to="/get-started"
                className="flex items-center space-x-2 px-3 py-2 text-gray-400 hover:bg-gray-800/50 hover:text-white rounded-lg transition-colors"
              >
                <Rocket className="w-5 h-5" />
                <span>Get started</span>
              </Link>
            </li>
            <li>
              <button
                className="w-full flex items-center space-x-2 px-3 py-2 text-gray-400 hover:bg-gray-800/50 hover:text-white rounded-lg transition-colors"
              >
                <HelpCircle className="w-5 h-5" />
                <span>Support</span>
              </button>
            </li>
            <li>
              <button
                onClick={toggleTheme}
                className="w-full flex items-center space-x-2 px-3 py-2 text-gray-400 hover:bg-gray-800/50 hover:text-white rounded-lg transition-colors"
              >
                <Info className="w-5 h-5" />
                <span>About</span>
              </button>
            </li>
          </ul>
        </div>
      </nav>
    </div>
  );
}
