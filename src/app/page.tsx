'use client';

import { useState, useMemo } from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  ReferenceDot,
} from 'recharts';

export default function BreakEvenPage() {
  const [fixedCosts, setFixedCosts] = useState<number>(1000);
  const [variableCost, setVariableCost] = useState<number>(10);
  const [sellingPrice, setSellingPrice] = useState<number>(25);

  const breakEvenQuantity = useMemo(() => {
    if (sellingPrice <= variableCost) return Infinity; // Prevent divide by zero or negative break-even
    return Math.ceil(fixedCosts / (sellingPrice - variableCost));
  }, [fixedCosts, variableCost, sellingPrice]);

  const chartData = useMemo(() => {
    const data = [];
    // Generate data points up to 2x the break-even point, or at least 100 units if infinite
    const maxQty = breakEvenQuantity === Infinity ? 100 : Math.max(breakEvenQuantity * 2, 50);
    const step = Math.ceil(maxQty / 20);

    for (let i = 0; i <= maxQty; i += step) {
      data.push({
        quantity: i,
        revenue: i * sellingPrice,
        totalCost: fixedCosts + (i * variableCost),
      });
    }
    return data;
  }, [fixedCosts, variableCost, sellingPrice, breakEvenQuantity]);

  const isValidBreakEven = breakEvenQuantity !== Infinity && breakEvenQuantity > 0;

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">Break-Even & Pricing Calculator</h1>
      <p className="text-gray-600">
        Adjust the inputs to see how many units you need to sell to cover your costs.
      </p>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Controls */}
        <div className="col-span-1 bg-white p-6 rounded-lg shadow-sm border border-gray-100 space-y-6">
          <div>
            <label htmlFor="fixed-costs" className="block text-sm font-medium text-gray-700 mb-1">
              Total Fixed Costs ($)
            </label>
            <input
              id="fixed-costs"
              type="number"
              min="0"
              value={fixedCosts}
              onChange={(e) => setFixedCosts(Number(e.target.value))}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2 border text-black"
            />
            <p className="mt-1 text-xs text-gray-500">e.g., Rent, equipment, insurance</p>
          </div>

          <div>
            <label htmlFor="variable-cost" className="block text-sm font-medium text-gray-700 mb-1">
              Variable Cost per Unit ($)
            </label>
            <input
              id="variable-cost"
              type="number"
              min="0"
              value={variableCost}
              onChange={(e) => setVariableCost(Number(e.target.value))}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2 border text-black"
            />
            <p className="mt-1 text-xs text-gray-500">Cost to produce one item</p>
          </div>

          <div>
            <label htmlFor="selling-price" className="block text-sm font-medium text-gray-700 mb-1">
              Selling Price per Unit ($)
            </label>
            <input
              id="selling-price"
              type="number"
              min="0"
              value={sellingPrice}
              onChange={(e) => setSellingPrice(Number(e.target.value))}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2 border text-black"
            />
          </div>

          <div className="pt-4 border-t border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Results</h3>
            {isValidBreakEven ? (
              <div className="bg-blue-50 p-4 rounded-md border border-blue-100">
                <p className="text-sm text-blue-900 mb-1">Break-Even Quantity:</p>
                <p className="text-3xl font-bold text-blue-700">{breakEvenQuantity} units</p>
                <p className="mt-2 text-sm text-blue-800">
                  Revenue needed: ${(breakEvenQuantity * sellingPrice).toLocaleString()}
                </p>
                <div className="mt-4 pt-4 border-t border-blue-200">
                  <p className="text-sm font-medium text-blue-900">Analysis:</p>
                  <p className="text-sm text-blue-800 mt-1">
                    {breakEvenQuantity < 100
                      ? "Highly achievable! This is a very reasonable break-even target."
                      : breakEvenQuantity < 1000
                      ? "Doable. This requires a solid sales strategy but is within reach."
                      : "Challenging. You will need high volume sales to reach this target. Re-evaluate your costs if possible."}
                  </p>
                </div>
              </div>
            ) : (
              <div className="bg-red-50 p-4 rounded-md border border-red-100">
                <p className="text-sm text-red-900 font-medium">Impossible</p>
                <p className="text-sm text-red-800">
                  Your selling price must be greater than your variable cost to ever break even.
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Chart */}
        <div className="col-span-1 lg:col-span-2 bg-white p-6 rounded-lg shadow-sm border border-gray-100 h-[500px] flex flex-col">
          <h2 className="text-lg font-semibold mb-4 text-gray-900">Revenue vs. Costs</h2>
          <div className="flex-1 w-full min-h-0">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={chartData}
                margin={{ top: 20, right: 30, left: 40, bottom: 20 }}
              >
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis
                  dataKey="quantity"
                  label={{ value: 'Units Sold', position: 'bottom', offset: 0 }}
                />
                <YAxis
                  tickFormatter={(value) => `$${value}`}
                  label={{ value: 'Amount ($)', angle: -90, position: 'insideLeft', offset: -25 }}
                />
                <Tooltip
                  formatter={(value) => {
                    if (value === undefined || Array.isArray(value)) return ['', ''];
                    const num = typeof value === 'number' ? value : Number(value);
                    return [`$${num.toFixed(2)}`, ''];
                  }}
                  labelFormatter={(label) => `Quantity: ${label}`}
                />
                <Legend verticalAlign="top" height={36}/>
                <Line
                  type="monotone"
                  dataKey="totalCost"
                  name="Total Costs"
                  stroke="#EF4444"
                  strokeWidth={2}
                  dot={false}
                />
                <Line
                  type="monotone"
                  dataKey="revenue"
                  name="Total Revenue"
                  stroke="#10B981"
                  strokeWidth={2}
                  dot={false}
                />
                {isValidBreakEven && (
                  <ReferenceDot
                    x={breakEvenQuantity}
                    y={breakEvenQuantity * sellingPrice}
                    r={6}
                    fill="#3B82F6"
                    stroke="white"
                    strokeWidth={2}
                    label={{ position: 'top', value: 'Break-Even', fill: '#3B82F6', fontSize: 12, fontWeight: 'bold' }}
                  />
                )}
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}
