import { useEffect, useState } from 'react';
import api from '../services/api';

export default function AccountingPage() {
  const [bookings, setBookings] = useState([]);
  const [pay, setPay] = useState({ booking_id: '', amount: '', method: 'Cash', note: '' });
  const [exp, setExp] = useState({ category: '', amount: '', expense_date: '', note: '' });

  useEffect(() => { api.get('/bookings').then((r) => setBookings(r.data.data)); }, []);

  return <div className="grid two">
    <form className="card form" onSubmit={async (e)=>{e.preventDefault(); await api.post('/payments', pay); alert('Payment recorded');}}>
      <h3>Record Payment</h3>
      <select value={pay.booking_id} onChange={(e)=>setPay({...pay, booking_id:e.target.value})}><option value="">Booking</option>{bookings.map((b)=><option key={b.id} value={b.id}>{b.title}</option>)}</select>
      <input placeholder="Amount" value={pay.amount} onChange={(e)=>setPay({...pay, amount:e.target.value})} />
      <select value={pay.method} onChange={(e)=>setPay({...pay, method:e.target.value})}>{['Cash','Bank','Mobile Banking'].map((m)=><option key={m}>{m}</option>)}</select>
      <input placeholder="Note" value={pay.note} onChange={(e)=>setPay({...pay, note:e.target.value})} />
      <button>Save Payment</button>
    </form>

    <form className="card form" onSubmit={async (e)=>{e.preventDefault(); await api.post('/expenses', exp); alert('Expense recorded');}}>
      <h3>Record Expense</h3>
      <input placeholder="Category" value={exp.category} onChange={(e)=>setExp({...exp, category:e.target.value})} />
      <input placeholder="Amount" value={exp.amount} onChange={(e)=>setExp({...exp, amount:e.target.value})} />
      <input type="date" value={exp.expense_date} onChange={(e)=>setExp({...exp, expense_date:e.target.value})} />
      <input placeholder="Note" value={exp.note} onChange={(e)=>setExp({...exp, note:e.target.value})} />
      <button>Save Expense</button>
    </form>
  </div>;
}
