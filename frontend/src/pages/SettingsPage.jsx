import { useEffect, useState } from 'react';
import api from '../services/api';

export default function SettingsPage() {
  const [form, setForm] = useState({ company_name: '', company_address: '', currency: 'USD', dark_mode: 'false' });
  useEffect(() => { api.get('/settings').then((r) => setForm({ ...form, ...r.data.data })); }, []);

  return <form className="card form" onSubmit={async (e)=>{e.preventDefault(); await api.put('/settings', form); alert('Saved');}}>
    <h3>Company Settings</h3>
    <input placeholder="Company Name" value={form.company_name || ''} onChange={(e)=>setForm({...form, company_name:e.target.value})} />
    <input placeholder="Company Address" value={form.company_address || ''} onChange={(e)=>setForm({...form, company_address:e.target.value})} />
    <input placeholder="Currency" value={form.currency || ''} onChange={(e)=>setForm({...form, currency:e.target.value})} />
    <select value={form.dark_mode || 'false'} onChange={(e)=>{document.body.classList.toggle('dark', e.target.value==='true'); setForm({...form, dark_mode:e.target.value});}}><option value="false">Light</option><option value="true">Dark</option></select>
    <button>Save Settings</button>
  </form>;
}
