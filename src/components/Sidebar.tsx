'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, List, Box, TrendingUp } from 'lucide-react';
import clsx from 'clsx';

const navItems = [
  { name: 'Break-Even Analysis', href: '/', icon: TrendingUp },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <div className="flex h-screen w-64 flex-col bg-gray-900 text-white">
      <div className="flex h-16 items-center justify-center border-b border-gray-800">
        <h1 className="text-xl font-bold tracking-wider">LedgerLite</h1>
      </div>
      <nav className="flex-1 space-y-2 py-4">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.name}
              href={item.href}
              className={clsx(
                'flex items-center space-x-3 px-6 py-3 text-sm font-medium transition-colors',
                isActive
                  ? 'bg-blue-600 text-white'
                  : 'text-gray-300 hover:bg-gray-800 hover:text-white'
              )}
            >
              <Icon className="h-5 w-5" />
              <span>{item.name}</span>
            </Link>
          );
        })}
      </nav>
      <div className="border-t border-gray-800 p-4">
        <p className="text-xs text-gray-500 text-center">
          LedgerLite Automated Engine
        </p>
      </div>
    </div>
  );
}
