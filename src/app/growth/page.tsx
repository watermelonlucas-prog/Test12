'use client';

import { useState, useMemo } from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

export default function GrowthPage() {
  const [prevMonthRev, setPrevMonthRev] = useState<number>(15000);
  const [currMonthRev, setCurrMonthRev] = useState<number>(18000);

  const { momGrowth, isPositive } = useMemo(() => {
    if (prevMonthRev === 0) return { momGrowth: currMonthRev > 0 ? Infinity : 0, isPositive: currMonthRev > 0 };

    const growth = ((currMonthRev - prevMonthRev) / prevMonthRev) * 100;
    return { momGrowth: growth, isPositive: growth >= 0 };
  }, [prevMonthRev, currMonthRev]);

  const chartData = useMemo(() => [
    { name: 'Previous Month', revenue: prevMonthRev },
    { name: 'Current Month', revenue: currMonthRev },
  ], [prevMonthRev, currMonthRev]);

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">Month-over-Month (MoM) Growth Rate</h1>
      <p className="text-gray-600">
        Automatically computes the percentage growth in revenue or cash flow compared to the previous month.
      </p>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Controls */}
        <div className="col-span-1 bg-white p-6 rounded-lg shadow-sm border border-gray-100 space-y-6">
          <div>
            <label htmlFor="prev-month" className="block text-sm font-medium text-gray-700 mb-1">
              Previous Month Revenue ($)
            </label>
            <input
              id="prev-month"
              type="number"
              min="0"
              value={prevMonthRev}
              onChange={(e) => setPrevMonthRev(Number(e.target.value))}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2 border text-black"
            />
          </div>

          <div>
            <label htmlFor="curr-month" className="block text-sm font-medium text-gray-700 mb-1">
              Current Month Revenue ($)
            </label>
            <input
              id="curr-month"
              type="number"
              min="0"
              value={currMonthRev}
              onChange={(e) => setCurrMonthRev(Number(e.target.value))}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2 border text-black"
            />
          </div>

          <div className="pt-4 border-t border-gray-200 flex flex-col items-center justify-center space-y-4">
            <h3 className="text-lg font-semibold text-gray-900 w-full text-left">Growth Metric</h3>

            <div className={`px-6 py-4 rounded-full border-2 flex items-center justify-center space-x-3
              ${momGrowth === Infinity ? 'bg-green-100 border-green-300 text-green-800' :
                isPositive ? 'bg-green-100 border-green-300 text-green-800' : 'bg-red-100 border-red-300 text-red-800'}`}>
              <span className="text-3xl font-black">
                {momGrowth === Infinity ? '∞' : `${isPositive ? '+' : ''}${momGrowth.toFixed(1)}%`}
              </span>
              {momGrowth !== Infinity && (
                <span className="text-3xl">
                  {isPositive ? '📈' : '📉'}
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Chart */}
        <div className="col-span-1 lg:col-span-2 bg-white p-6 rounded-lg shadow-sm border border-gray-100 h-[500px] flex flex-col">
          <h2 className="text-lg font-semibold mb-4 text-gray-900">Revenue Comparison</h2>
          <div className="flex-1 w-full min-h-0">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="name" />
                <YAxis tickFormatter={(value) => `$${value}`} />
                <Tooltip formatter={(value: any) => value === undefined ? '' : `$${Number(value).toLocaleString()}`} />
                <Bar dataKey="revenue" fill="#8B5CF6" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}