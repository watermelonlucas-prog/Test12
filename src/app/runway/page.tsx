'use client';

import { useState, useMemo } from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
} from 'recharts';

export default function RunwayPage() {
  const [cashBalance, setCashBalance] = useState<number>(150000);
  const [burnRate, setBurnRate] = useState<number>(20000);

  const runwayMonths = useMemo(() => {
    if (burnRate <= 0) return Infinity;
    return cashBalance / burnRate;
  }, [cashBalance, burnRate]);

  const chartData = useMemo(() => {
    const data = [];
    if (runwayMonths === Infinity) {
        // Just show a flat line for 12 months
        for (let i = 0; i <= 12; i++) {
            data.push({ month: `Month ${i}`, balance: cashBalance });
        }
    } else {
        // Show depletion up to runwayMonths + 1
        const maxMonths = Math.ceil(runwayMonths) + 1;
        for (let i = 0; i <= maxMonths; i++) {
            data.push({
                month: `M ${i}`,
                balance: Math.max(0, cashBalance - (i * burnRate))
            });
        }
    }
    return data;
  }, [cashBalance, burnRate, runwayMonths]);

  const isLowRunway = runwayMonths < 3 && runwayMonths !== Infinity;

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">Run-Rate & Cash Runway Projections</h1>
      <p className="text-gray-600">
        Calculates how many months you have left before running out of money, based on current monthly burn rate.
      </p>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Controls */}
        <div className="col-span-1 bg-white p-6 rounded-lg shadow-sm border border-gray-100 space-y-6">
          <div>
            <label htmlFor="cash-balance" className="block text-sm font-medium text-gray-700 mb-1">
              Current Cash Balance ($)
            </label>
            <input
              id="cash-balance"
              type="number"
              min="0"
              value={cashBalance}
              onChange={(e) => setCashBalance(Number(e.target.value))}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2 border text-black"
            />
          </div>

          <div>
            <label htmlFor="burn-rate" className="block text-sm font-medium text-gray-700 mb-1">
              Avg. Monthly Burn Rate (Net Loss) ($)
            </label>
            <input
              id="burn-rate"
              type="number"
              min="0"
              value={burnRate}
              onChange={(e) => setBurnRate(Number(e.target.value))}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2 border text-black"
            />
          </div>

          <div className="pt-4 border-t border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Results</h3>

            {isLowRunway && (
              <div className="mb-4 bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded shadow-sm" role="alert">
                <p className="font-bold">CRITICAL WARNING</p>
                <p>Runway has dropped below 3 months. Immediate action required to secure additional funding or reduce burn.</p>
              </div>
            )}

            <div className={`p-4 rounded-md border ${isLowRunway ? 'bg-red-50 border-red-100' : 'bg-blue-50 border-blue-100'}`}>
                <p className={`text-sm mb-1 ${isLowRunway ? 'text-red-900' : 'text-blue-900'}`}>Estimated Runway:</p>
                <p className={`text-3xl font-bold ${isLowRunway ? 'text-red-700' : 'text-blue-700'}`}>
                  {runwayMonths === Infinity ? 'Infinite' : `${runwayMonths.toFixed(1)} months`}
                </p>
            </div>
          </div>
        </div>

        {/* Chart */}
        <div className="col-span-1 lg:col-span-2 bg-white p-6 rounded-lg shadow-sm border border-gray-100 h-[500px] flex flex-col">
          <h2 className="text-lg font-semibold mb-4 text-gray-900">Cash Depletion Over Time</h2>
          <div className="flex-1 w-full min-h-0">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="month" />
                <YAxis tickFormatter={(value) => `$${value}`} />
                <Tooltip formatter={(value: any) => value === undefined ? '' : `$${Number(value).toLocaleString()}`} />
                <ReferenceLine y={0} stroke="red" strokeDasharray="3 3" label="Zero Cash" />
                <Line
                    type="monotone"
                    dataKey="balance"
                    stroke={isLowRunway ? "#EF4444" : "#3B82F6"}
                    strokeWidth={3}
                    dot={{ r: 4 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}