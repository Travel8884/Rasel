import { useEffect, useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, LineChart, Line, CartesianGrid } from 'recharts';
import api from '../services/api';

export default function DashboardPage() {
  const [data, setData] = useState(null);
  useEffect(() => { api.get('/dashboard').then((r) => setData(r.data.data)); }, []);
  if (!data) return <p>Loading...</p>;

  const s = data.summary;
  return (
    <>
      <div className="grid cards">
        <div className="card"><h4>Total Sales</h4><p>${Number(s.total_sales).toFixed(2)}</p></div>
        <div className="card"><h4>Due Amount</h4><p>${Number(s.due_amount).toFixed(2)}</p></div>
        <div className="card"><h4>Profit</h4><p>${Number(s.gross_profit).toFixed(2)}</p></div>
        <div className="card"><h4>Bookings</h4><p>{s.total_bookings}</p></div>
      </div>
      <div className="grid charts">
        <div className="card h300">
          <h3>Monthly Income</h3>
          <ResponsiveContainer width="100%" height="85%">
            <BarChart data={data.monthlyIncome}><XAxis dataKey="month" /><YAxis /><Tooltip /><Bar dataKey="income" fill="#5b7cfa" /></BarChart>
          </ResponsiveContainer>
        </div>
        <div className="card h300">
          <h3>Monthly Expense</h3>
          <ResponsiveContainer width="100%" height="85%">
            <LineChart data={data.monthlyExpense}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="month" /><YAxis /><Tooltip /><Line type="monotone" dataKey="expense" stroke="#f46f52" /></LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </>
  );
}
