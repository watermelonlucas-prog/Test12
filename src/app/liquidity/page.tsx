'use client';

import { useState, useMemo } from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';

export default function LiquidityPage() {
  const [cash, setCash] = useState<number>(10000);
  const [accountsReceivable, setAccountsReceivable] = useState<number>(5000);
  const [currentLiabilities, setCurrentLiabilities] = useState<number>(8000);

  const { quickRatio, workingCapital, liquidAssets } = useMemo(() => {
    const liquid = cash + accountsReceivable;
    const ratio = currentLiabilities > 0 ? liquid / currentLiabilities : Infinity;
    const capital = liquid - currentLiabilities;
    return { quickRatio: ratio, workingCapital: capital, liquidAssets: liquid };
  }, [cash, accountsReceivable, currentLiabilities]);

  const chartData = useMemo(() => [
    { name: 'Liquid Assets', amount: liquidAssets },
    { name: 'Current Liabilities', amount: currentLiabilities },
  ], [liquidAssets, currentLiabilities]);

  const isHealthy = quickRatio >= 1.0;

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">Working Capital & Quick Ratio</h1>
      <p className="text-gray-600">
        Measure whether you have enough short-term assets to cover immediate debts.
      </p>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Controls */}
        <div className="col-span-1 bg-white p-6 rounded-lg shadow-sm border border-gray-100 space-y-6">
          <div>
            <label htmlFor="cash" className="block text-sm font-medium text-gray-700 mb-1">
              Cash ($)
            </label>
            <input
              id="cash"
              type="number"
              min="0"
              value={cash}
              onChange={(e) => setCash(Number(e.target.value))}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2 border text-black"
            />
          </div>

          <div>
            <label htmlFor="accounts-receivable" className="block text-sm font-medium text-gray-700 mb-1">
              Accounts Receivable ($)
            </label>
            <input
              id="accounts-receivable"
              type="number"
              min="0"
              value={accountsReceivable}
              onChange={(e) => setAccountsReceivable(Number(e.target.value))}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2 border text-black"
            />
          </div>

          <div>
            <label htmlFor="current-liabilities" className="block text-sm font-medium text-gray-700 mb-1">
              Current Liabilities ($)
            </label>
            <input
              id="current-liabilities"
              type="number"
              min="0"
              value={currentLiabilities}
              onChange={(e) => setCurrentLiabilities(Number(e.target.value))}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2 border text-black"
            />
          </div>

          <div className="pt-4 border-t border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Results</h3>
            <div className={`p-4 rounded-md border ${isHealthy ? 'bg-blue-50 border-blue-100' : 'bg-red-50 border-red-100'}`}>
              <div className="mb-4">
                <p className={`text-sm mb-1 ${isHealthy ? 'text-blue-900' : 'text-red-900'}`}>Quick Ratio:</p>
                <p className={`text-3xl font-bold ${isHealthy ? 'text-blue-700' : 'text-red-700'}`}>
                  {quickRatio === Infinity ? '∞' : quickRatio.toFixed(2)}
                </p>
                {!isHealthy && (
                  <p className="mt-1 text-sm font-bold text-red-800 flex items-center gap-1">
                    <span className="text-xl">⚠️</span> Warning: Ratio is below 1.0!
                  </p>
                )}
              </div>
              <div className="pt-4 border-t border-opacity-20 border-gray-500">
                <p className={`text-sm mb-1 ${isHealthy ? 'text-blue-900' : 'text-red-900'}`}>Working Capital:</p>
                <p className={`text-xl font-bold ${isHealthy ? 'text-blue-700' : 'text-red-700'}`}>
                  ${workingCapital.toLocaleString()}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Chart */}
        <div className="col-span-1 lg:col-span-2 bg-white p-6 rounded-lg shadow-sm border border-gray-100 h-[500px] flex flex-col">
          <h2 className="text-lg font-semibold mb-4 text-gray-900">Assets vs. Liabilities</h2>
          <div className="flex-1 w-full min-h-0">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="name" />
                <YAxis tickFormatter={(value) => `$${value}`} />
                <Tooltip formatter={(value: any) => value === undefined ? '' : `$${Number(value).toLocaleString()}`} />
                <Bar dataKey="amount" fill="#3B82F6" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}