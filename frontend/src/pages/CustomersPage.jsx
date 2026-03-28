import { useEffect, useState } from 'react';
import api from '../services/api';

export default function CustomersPage() {
  const [items, setItems] = useState([]);
  const [form, setForm] = useState({ name: '', email: '', phone: '', passport_no: '', nid_no: '', address: '' });
  const load = () => api.get('/customers').then((r) => setItems(r.data.data));
  useEffect(load, []);

  const submit = async (e) => {
    e.preventDefault();
    await api.post('/customers', form);
    setForm({ name: '', email: '', phone: '', passport_no: '', nid_no: '', address: '' });
    load();
  };

  return <div className="grid two">
    <form onSubmit={submit} className="card form">
      <h3>Add Customer</h3>
      {Object.keys(form).map((k) => <input key={k} placeholder={k} value={form[k]} onChange={(e) => setForm({ ...form, [k]: e.target.value })} />)}
      <button>Add</button>
    </form>
    <div className="card">
      <h3>Customers</h3>
      <table><thead><tr><th>Name</th><th>Passport/NID</th><th>Contact</th></tr></thead><tbody>
        {items.map((c) => <tr key={c.id}><td>{c.name}</td><td>{c.passport_no} / {c.nid_no}</td><td>{c.phone}</td></tr>)}
      </tbody></table>
    </div>
  </div>;
}
