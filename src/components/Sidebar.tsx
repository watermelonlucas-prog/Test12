'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { TrendingUp, Activity, BarChart, TrendingDown, Hourglass, Menu, X } from 'lucide-react';
import clsx from 'clsx';

const navItems = [
  { name: 'Break-Even Analysis', href: '/', icon: TrendingUp },
  { name: 'Liquidity Health', href: '/liquidity', icon: Activity },
  { name: 'Marketing Metrics', href: '/marketing', icon: BarChart },
  { name: 'MoM Growth', href: '/growth', icon: TrendingDown },
  { name: 'Cash Runway', href: '/runway', icon: Hourglass },
];

export function Sidebar() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* Mobile Menu Button */}
      <div className="md:hidden fixed top-0 left-0 right-0 h-16 bg-gray-900 z-20 flex items-center justify-between px-4">
        <h1 className="text-xl font-bold tracking-wider text-white">LedgerLite</h1>
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="text-gray-300 hover:text-white focus:outline-none"
        >
          {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {/* Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-30 md:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div className={clsx(
        "fixed inset-y-0 left-0 z-40 w-64 transform bg-gray-900 text-white transition-transform duration-300 ease-in-out md:static md:translate-x-0 flex flex-col",
        isOpen ? "translate-x-0" : "-translate-x-full"
      )}>
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
                onClick={() => setIsOpen(false)}
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
    </>
  );
}
