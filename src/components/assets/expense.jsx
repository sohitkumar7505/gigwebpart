import React from "react";
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from "recharts";
import rawData from "./data";

const transformed = rawData.map(d => ({
  date: d.date,
  petrol: d.expenseCategory.petrol,
  toll: d.expenseCategory.toll,
  maintenance: d.expenseCategory.maintenance,
  misc: d.expenseCategory.misc
}));

function ExpenseCategoryChart() {
  return (
    <div className="bg-white p-4 rounded-xl shadow mb-8">
      <h3 className="text-xl font-semibold mb-4 text-center">Category-wise Expenses</h3>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={transformed}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="date" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Line type="monotone" dataKey="petrol" stroke="#F59E0B" name="Petrol" />
          <Line type="monotone" dataKey="toll" stroke="#8B5CF6" name="Toll" />
          <Line type="monotone" dataKey="maintenance" stroke="#EC4899" name="Maintenance" />
          <Line type="monotone" dataKey="misc" stroke="#6B7280" name="Miscellaneous" />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

export default ExpenseCategoryChart;
