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

export default function MarketingMetricsPage() {
  const [marketingExpenses, setMarketingExpenses] = useState<number>(5000);
  const [newSignups, setNewSignups] = useState<number>(100);
  const [ltv, setLtv] = useState<number>(200);

  const { cac, ltvCacRatio } = useMemo(() => {
    const cost = newSignups > 0 ? marketingExpenses / newSignups : 0;
    const ratio = cost > 0 ? ltv / cost : 0;
    return { cac: cost, ltvCacRatio: ratio };
  }, [marketingExpenses, newSignups, ltv]);

  const chartData = useMemo(() => [
    { name: 'CAC', amount: cac, fill: '#EF4444' },
    { name: 'LTV', amount: ltv, fill: '#10B981' },
  ], [cac, ltv]);

  const ratioPercentage = useMemo(() => {
    // 3:1 is often considered a healthy baseline.
    // We map 0 ratio to 0%, 3 ratio to ~50%, and cap at 100%.
    const maxExpectedRatio = 6;
    return Math.min(100, Math.max(0, (ltvCacRatio / maxExpectedRatio) * 100));
  }, [ltvCacRatio]);

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">Customer Acquisition Cost (CAC) & LTV</h1>
      <p className="text-gray-600">
        Analyze how much money is spent to acquire a paying member versus how much revenue they generate over time.
      </p>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Controls */}
        <div className="col-span-1 bg-white p-6 rounded-lg shadow-sm border border-gray-100 space-y-6">
          <div>
            <label htmlFor="marketing-expenses" className="block text-sm font-medium text-gray-700 mb-1">
              Total Marketing/Promo Expenses ($)
            </label>
            <input
              id="marketing-expenses"
              type="number"
              min="0"
              value={marketingExpenses}
              onChange={(e) => setMarketingExpenses(Number(e.target.value))}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2 border text-black"
            />
          </div>

          <div>
            <label htmlFor="new-signups" className="block text-sm font-medium text-gray-700 mb-1">
              Total New Sign-ups
            </label>
            <input
              id="new-signups"
              type="number"
              min="0"
              value={newSignups}
              onChange={(e) => setNewSignups(Number(e.target.value))}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2 border text-black"
            />
          </div>

          <div>
            <label htmlFor="ltv" className="block text-sm font-medium text-gray-700 mb-1">
              Average Revenue per User / LTV ($)
            </label>
            <input
              id="ltv"
              type="number"
              min="0"
              value={ltv}
              onChange={(e) => setLtv(Number(e.target.value))}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2 border text-black"
            />
          </div>

          <div className="pt-4 border-t border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Results</h3>

            <div className="overflow-hidden rounded-lg border border-gray-200 shadow-sm mb-6">
              <table className="min-w-full divide-y divide-gray-200">
                <tbody className="divide-y divide-gray-200 bg-white">
                  <tr>
                    <td className="whitespace-nowrap px-4 py-3 text-sm font-medium text-gray-900 bg-gray-50">CAC</td>
                    <td className="whitespace-nowrap px-4 py-3 text-sm font-bold text-gray-900 text-right">${cac.toFixed(2)}</td>
                  </tr>
                  <tr>
                    <td className="whitespace-nowrap px-4 py-3 text-sm font-medium text-gray-900 bg-gray-50">LTV</td>
                    <td className="whitespace-nowrap px-4 py-3 text-sm font-bold text-gray-900 text-right">${ltv.toFixed(2)}</td>
                  </tr>
                  <tr>
                    <td className="whitespace-nowrap px-4 py-3 text-sm font-medium text-gray-900 bg-gray-50">LTV:CAC Ratio</td>
                    <td className="whitespace-nowrap px-4 py-3 text-sm font-bold text-blue-600 text-right">
                      {ltvCacRatio.toFixed(2)}:1
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div>
              <div className="flex justify-between text-xs font-medium text-gray-500 mb-1">
                <span>Poor (1:1)</span>
                <span>Good (3:1)</span>
                <span>Great (6:1+)</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2.5">
                <div
                  className={`h-2.5 rounded-full ${ltvCacRatio >= 3 ? 'bg-green-500' : ltvCacRatio >= 1 ? 'bg-yellow-400' : 'bg-red-500'}`}
                  style={{ width: `${ratioPercentage}%` }}
                ></div>
              </div>
            </div>

          </div>
        </div>

        {/* Chart */}
        <div className="col-span-1 lg:col-span-2 bg-white p-6 rounded-lg shadow-sm border border-gray-100 h-[500px] flex flex-col">
          <h2 className="text-lg font-semibold mb-4 text-gray-900">CAC vs. LTV</h2>
          <div className="flex-1 w-full min-h-0">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="name" />
                <YAxis tickFormatter={(value) => `$${value}`} />
                <Tooltip formatter={(value: any) => value === undefined ? '' : `$${Number(value).toFixed(2)}`} />
                <Bar dataKey="amount" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}