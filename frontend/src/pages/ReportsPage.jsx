import { useEffect, useState } from 'react';
import api from '../services/api';

export default function ReportsPage() {
  const [finance, setFinance] = useState(null);
  const [sales, setSales] = useState([]);
  useEffect(() => {
    api.get('/reports/finance').then((r) => setFinance(r.data.data));
    api.get('/reports/sales').then((r) => setSales(r.data.data));
  }, []);

  return <div className="grid two">
    <div className="card"><h3>Financial Report</h3>{finance && <ul><li>Income: ${finance.totalIncome}</li><li>Expense: ${finance.totalExpense}</li><li>Net: ${finance.netProfit}</li></ul>}<a href="http://localhost:5000/api/reports/sales-export" target="_blank">Export Sales Excel</a></div>
    <div className="card"><h3>Sales Report</h3><table><tbody>{sales.map((s)=><tr key={s.id}><td>{s.title}</td><td>{s.status}</td><td>${s.selling_price}</td></tr>)}</tbody></table></div>
  </div>;
}
