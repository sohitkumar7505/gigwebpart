import React, { useState } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend } from 'recharts';

const FinancialReportDashboard = () => {
  const [report, setReport] = useState(null);
  const [selectedDate, setSelectedDate] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

  const fetchReport = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setReport(null);

    try {
      const res = await fetch(`http://localhost:3000/report?date=${selectedDate}`);
      const data = await res.json();

      if (res.ok) {
        setReport(data.report);
      } else {
        setError(data.message || 'No report found');
      }
    } catch (err) {
      setError('Something went wrong while fetching report.');
    } finally {
      setLoading(false);
    }
  };

  const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, index, name }) => {
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * Math.PI / 180);
    const y = cy + radius * Math.sin(-midAngle * Math.PI / 180);
    return (
      <text x={x} y={y} fill="white" textAnchor="middle" dominantBaseline="central">
        {name}
      </text>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">Financial Report</h1>

        {/* Date Input Form */}
        <form onSubmit={fetchReport} className="flex flex-col sm:flex-row gap-4 mb-8">
          <input
            type="date"
            required
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="border border-gray-300 rounded-md px-4 py-2 text-gray-700"
          />
          <button
            type="submit"
            className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition"
          >
            Fetch Report
          </button>
        </form>

        {/* Loading / Error */}
        {loading && <p className="text-blue-600">Loading report...</p>}
        {error && <p className="text-red-600">{error}</p>}

        {/* Show Report Only if Available */}
        {report && (
          <>
            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-blue-500">
                <h2 className="text-gray-500 text-sm font-medium">Total Earnings</h2>
                <p className="text-3xl font-bold text-gray-800 mt-2">₹{report.totalEarnings.toLocaleString()}</p>
              </div>
              <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-red-500">
                <h2 className="text-gray-500 text-sm font-medium">Total Expenses</h2>
                <p className="text-3xl font-bold text-gray-800 mt-2">₹{report.totalExpenses.toLocaleString()}</p>
              </div>
              <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-green-500">
                <h2 className="text-gray-500 text-sm font-medium">Balance</h2>
                <p className="text-3xl font-bold text-gray-800 mt-2">₹{report.balance.toLocaleString()}</p>
              </div>
            </div>

            {/* Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Earnings Pie Chart */}
              <div className="bg-white rounded-xl shadow-md p-6">
                <h2 className="text-xl font-semibold text-gray-700 mb-4">Earnings Distribution</h2>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={report.earnings.map(item => ({
                          name: item.platform,
                          value: item.amount,
                          percentage: ((item.amount / report.totalEarnings) * 100).toFixed(1) + '%'
                        }))}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={renderCustomizedLabel}
                        outerRadius={80}
                        dataKey="value"
                      >
                        {report.earnings.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Legend layout="vertical" align="right" verticalAlign="middle" />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Expenses Pie Chart */}
              <div className="bg-white rounded-xl shadow-md p-6">
                <h2 className="text-xl font-semibold text-gray-700 mb-4">Expenses Distribution</h2>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={report.expenses.map(item => ({
                          name: item.type,
                          value: item.amount,
                          percentage: ((item.amount / report.totalExpenses) * 100).toFixed(1) + '%'
                        }))}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={renderCustomizedLabel}
                        outerRadius={80}
                        dataKey="value"
                      >
                        {report.expenses.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[(index + 2) % COLORS.length]} />
                        ))}
                      </Pie>
                      <Legend layout="vertical" align="right" verticalAlign="middle" />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>

            {/* Tables */}
            <div className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Earnings Table */}
              <div className="bg-white rounded-xl shadow-md p-6">
                <h2 className="text-xl font-semibold text-gray-700 mb-4">Earnings Breakdown</h2>
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Platform</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Amount</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Percentage</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {report.earnings.map((item) => (
                        <tr key={item._id}>
                          <td className="px-6 py-4 text-sm font-medium text-gray-900">{item.platform}</td>
                          <td className="px-6 py-4 text-sm text-gray-500">₹{item.amount.toLocaleString()}</td>
                          <td className="px-6 py-4 text-sm text-gray-500">
                            {((item.amount / report.totalEarnings) * 100).toFixed(1)}%
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Expenses Table */}
              <div className="bg-white rounded-xl shadow-md p-6">
                <h2 className="text-xl font-semibold text-gray-700 mb-4">Expenses Breakdown</h2>
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Category</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Amount</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Percentage</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {report.expenses.map((item) => (
                        <tr key={item._id}>
                          <td className="px-6 py-4 text-sm font-medium text-gray-900">{item.type}</td>
                          <td className="px-6 py-4 text-sm text-gray-500">₹{item.amount.toLocaleString()}</td>
                          <td className="px-6 py-4 text-sm text-gray-500">
                            {((item.amount / report.totalExpenses) * 100).toFixed(1)}%
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default FinancialReportDashboard;
