import { useEffect, useState } from 'react';
import api from '../services/api';

export default function BookingsPage() {
  const [bookings, setBookings] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [form, setForm] = useState({ customer_id: '', booking_type: 'Flight', title: '', destination: '', travel_date: '', return_date: '', base_cost: 0, selling_price: 0, status: 'Pending', visa_status: 'Not Required' });

  const load = () => api.get('/bookings').then((r) => setBookings(r.data.data));
  useEffect(() => { load(); api.get('/customers').then((r) => setCustomers(r.data.data)); }, []);

  const submit = async (e) => { e.preventDefault(); await api.post('/bookings', form); load(); };

  return <div className="grid two">
    <form onSubmit={submit} className="card form">
      <h3>New Booking</h3>
      <select value={form.customer_id} onChange={(e) => setForm({ ...form, customer_id: e.target.value })}><option value="">Select customer</option>{customers.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}</select>
      <select value={form.booking_type} onChange={(e) => setForm({ ...form, booking_type: e.target.value })}>{['Flight','Hotel','Package','Visa'].map((x) => <option key={x}>{x}</option>)}</select>
      {['title','destination','travel_date','return_date','base_cost','selling_price'].map((k) => <input key={k} type={k.includes('date') ? 'date':'text'} placeholder={k} value={form[k]} onChange={(e) => setForm({ ...form, [k]: e.target.value })} />)}
      <button>Create Booking</button>
    </form>
    <div className="card">
      <h3>Booking List</h3>
      <table><thead><tr><th>Type</th><th>Customer</th><th>Status</th><th>Amount</th></tr></thead><tbody>
      {bookings.map((b)=><tr key={b.id}><td>{b.booking_type}</td><td>{b.customer_name}</td><td>{b.status}</td><td>${b.selling_price}</td></tr>)}
      </tbody></table>
    </div>
  </div>;
}
