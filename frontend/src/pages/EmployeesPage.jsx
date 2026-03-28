import { useEffect, useState } from 'react';
import api from '../services/api';

export default function EmployeesPage() {
  const [items, setItems] = useState([]);
  const [form, setForm] = useState({ name: '', email: '', role: 'Staff', password: '' });
  const load = () => api.get('/employees').then((r) => setItems(r.data.data));
  useEffect(load, []);

  return <div className="grid two">
    <form className="card form" onSubmit={async (e)=>{e.preventDefault(); await api.post('/employees', form); load();}}>
      <h3>Create Employee</h3>
      {['name','email','password'].map((k)=><input key={k} placeholder={k} value={form[k]} onChange={(e)=>setForm({...form,[k]:e.target.value})} />)}
      <select value={form.role} onChange={(e)=>setForm({...form, role:e.target.value})}>{['Admin','Manager','Staff'].map((r)=><option key={r}>{r}</option>)}</select>
      <button>Create</button>
    </form>
    <div className="card"><h3>Employees</h3><table><tbody>{items.map((u)=><tr key={u.id}><td>{u.name}</td><td>{u.role}</td><td>{u.email}</td></tr>)}</tbody></table></div>
  </div>;
}
