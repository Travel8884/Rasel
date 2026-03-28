const state = { token: localStorage.getItem('token'), user: JSON.parse(localStorage.getItem('user') || 'null') };
const loginView = document.getElementById('loginView');
const appView = document.getElementById('appView');
const mainContent = document.getElementById('mainContent');
const menu = document.getElementById('menu');

const api = async (path, opts = {}) => {
  const res = await fetch(`/api${path}`, {
    ...opts,
    headers: {
      'Content-Type': 'application/json',
      ...(state.token ? { Authorization: `Bearer ${state.token}` } : {}),
      ...(opts.headers || {})
    }
  });
  if (!res.ok) throw new Error((await res.json()).message || 'API error');
  if (res.headers.get('content-type')?.includes('application/json')) return res.json();
  return res;
};

const setAuthUI = () => {
  const isLogged = !!state.token;
  loginView.classList.toggle('d-none', isLogged);
  appView.classList.toggle('d-none', !isLogged);
  if (isLogged) loadView('dashboard');
};

document.getElementById('loginForm').addEventListener('submit', async (e) => {
  e.preventDefault();
  const form = new FormData(e.target);
  try {
    const data = await api('/auth/login', { method: 'POST', body: JSON.stringify(Object.fromEntries(form)) });
    state.token = data.token; state.user = data.user;
    localStorage.setItem('token', data.token); localStorage.setItem('user', JSON.stringify(data.user));
    setAuthUI();
  } catch (err) { alert(err.message); }
});

document.getElementById('logoutBtn').onclick = () => { localStorage.clear(); state.token = null; state.user = null; setAuthUI(); };
document.getElementById('themeBtn').onclick = async () => {
  const html = document.documentElement;
  const dark = html.dataset.theme !== 'dark';
  html.dataset.theme = dark ? 'dark' : 'light';
  try {
    const s = await api('/settings');
    await api('/settings', { method: 'PUT', body: JSON.stringify({ ...s, dark_mode: dark }) });
  } catch {}
};

menu.addEventListener('click', (e) => {
  if (e.target.dataset.view) {
    [...menu.querySelectorAll('button')].forEach((b) => b.classList.remove('active'));
    e.target.classList.add('active');
    loadView(e.target.dataset.view);
  }
});

const table = (headers, rows) => `<div class='table-wrap'><div class='table-responsive'><table class='table table-sm'>
<thead><tr>${headers.map((h) => `<th>${h}</th>`).join('')}</tr></thead><tbody>${rows.join('')}</tbody></table></div></div>`;

async function loadView(view) {
  if (view === 'dashboard') {
    const data = await api('/dashboard');
    mainContent.innerHTML = `<h4 class='mb-3'>Dashboard</h4><div class='row g-3'>
      ${[['Total Sales',data.summary.total_sales],['Due Amount',data.summary.due_amount],['Profit',data.summary.gross_profit],['Bookings',data.summary.total_bookings]]
        .map(([k,v])=>`<div class='col-md-3'><div class='card card-stat p-3'><small>${k}</small><h5>${v}</h5></div></div>`).join('')}
      <div class='col-12'><div class='card card-stat p-3'><canvas id='incomeChart'></canvas></div></div></div>`;
    new Chart(document.getElementById('incomeChart'), { type:'line', data:{ labels:data.monthly.map(m=>m.month), datasets:[{label:'Income', data:data.monthly.map(m=>m.income)}, {label:'Cost', data:data.monthly.map(m=>m.costs)}] } });
  }

  if (view === 'customers') {
    const list = await api('/customers');
    mainContent.innerHTML = `<h4>Customers</h4>
      <form id='customerForm' class='form-card mb-3 row g-2'>
      <div class='col-md-4'><input name='full_name' class='form-control' placeholder='Full Name' required></div>
      <div class='col-md-3'><input name='email' class='form-control' placeholder='Email'></div>
      <div class='col-md-2'><input name='phone' class='form-control' placeholder='Phone' required></div>
      <div class='col-md-2'><input name='passport_no' class='form-control' placeholder='Passport'></div>
      <div class='col-md-2'><input name='nid_no' class='form-control' placeholder='NID'></div>
      <div class='col-md-4'><input name='address' class='form-control' placeholder='Address'></div>
      <div class='col-md-2'><button class='btn btn-primary w-100'>Save</button></div></form>
      <input id='customerSearch' class='form-control mb-2' placeholder='Search customer...'>
      <div id='customerTable'></div>`;
    const render = (term='') => {
      const filtered = list.filter(c=>`${c.full_name} ${c.phone} ${c.passport_no||''}`.toLowerCase().includes(term.toLowerCase()));
      document.getElementById('customerTable').innerHTML = table(['ID','Name','Phone','Passport','NID','Action'], filtered.map(c =>
      `<tr><td>${c.id}</td><td>${c.full_name}</td><td>${c.phone}</td><td>${c.passport_no||''}</td><td>${c.nid_no||''}</td><td><button class='btn btn-sm btn-danger' data-del='${c.id}'>Delete</button></td></tr>`));
    };
    render();
    document.getElementById('customerSearch').oninput = (e)=>render(e.target.value);
    document.getElementById('customerForm').onsubmit = async (e) => { e.preventDefault(); await api('/customers', { method:'POST', body: JSON.stringify(Object.fromEntries(new FormData(e.target))) }); loadView('customers'); };
    document.getElementById('customerTable').onclick = async (e)=>{ if(e.target.dataset.del){await api(`/customers/${e.target.dataset.del}`,{method:'DELETE'}); loadView('customers'); }};
  }

  if (view === 'bookings') {
    const [customers, bookings] = await Promise.all([api('/customers'), api('/bookings')]);
    mainContent.innerHTML = `<h4>Bookings</h4>
      <form id='bookingForm' class='form-card mb-3 row g-2'>
      <div class='col-md-2'><select name='customer_id' class='form-select'>${customers.map(c=>`<option value='${c.id}'>${c.full_name}</option>`)}</select></div>
      <div class='col-md-2'><select name='booking_type' class='form-select'><option>flight</option><option>hotel</option><option>package</option><option>visa</option></select></div>
      <div class='col-md-2'><input name='destination' class='form-control' placeholder='Destination' required></div>
      <div class='col-md-2'><input type='date' name='travel_date' class='form-control' required></div>
      <div class='col-md-1'><input type='number' step='0.01' name='amount' class='form-control' placeholder='Sale'></div>
      <div class='col-md-1'><input type='number' step='0.01' name='cost' class='form-control' placeholder='Cost'></div>
      <div class='col-md-2'><select name='status' class='form-select'><option>pending</option><option>confirmed</option><option>completed</option></select></div>
      <div class='col-md-12'><input name='notes' class='form-control' placeholder='Notes'></div>
      <div class='col-md-2'><button class='btn btn-primary w-100'>Create</button></div></form>
      ${table(['Invoice','Customer','Type','Destination','Amount','Due','Status','Actions'], bookings.map(b=>`<tr><td>${b.id}</td><td>${b.customer_name}</td><td>${b.booking_type}</td><td>${b.destination}</td><td>${b.amount}</td><td>${b.due_amount}</td><td>
      <select data-status='${b.id}' class='form-select form-select-sm'><option ${b.status==='pending'?'selected':''}>pending</option><option ${b.status==='confirmed'?'selected':''}>confirmed</option><option ${b.status==='completed'?'selected':''}>completed</option></select></td>
      <td><a class='btn btn-sm btn-outline-secondary' href='/api/invoice/${b.id}/pdf' target='_blank'>Invoice PDF</a></td></tr>`))}`;
    document.getElementById('bookingForm').onsubmit = async (e) => { e.preventDefault(); await api('/bookings', { method:'POST', body: JSON.stringify(Object.fromEntries(new FormData(e.target))) }); loadView('bookings'); };
    mainContent.querySelectorAll('select[data-status]').forEach((el)=>el.onchange = async ()=>{ await api(`/bookings/${el.dataset.status}/status`, {method:'PATCH', body: JSON.stringify({status:el.value})}); });
  }

  if (view === 'accounting') {
    const [payments, expenses, bookings] = await Promise.all([api('/payments'), api('/expenses'), api('/bookings')]);
    mainContent.innerHTML = `<h4>Accounting</h4>
    <div class='row g-3'><div class='col-md-6'>
    <form id='paymentForm' class='form-card mb-3 row g-2'>
    <h6>Record Payment</h6>
    <div class='col-md-4'><select name='booking_id' class='form-select'>${bookings.map(b=>`<option value='${b.id}'>#${b.id} ${b.customer_name}</option>`)}</select></div>
    <div class='col-md-3'><select name='payment_method' class='form-select'><option>cash</option><option>bank</option><option>mobile</option></select></div>
    <div class='col-md-3'><input name='amount' type='number' step='0.01' class='form-control' required></div>
    <div class='col-md-2'><input name='payment_date' type='date' class='form-control' required></div>
    <div class='col-md-6'><input name='reference' class='form-control' placeholder='Reference'></div>
    <div class='col-md-3'><button class='btn btn-success w-100'>Save</button></div></form>
    ${table(['ID','Booking','Method','Amount','Date'], payments.map(p=>`<tr><td>${p.id}</td><td>${p.booking_id}</td><td>${p.payment_method}</td><td>${p.amount}</td><td>${String(p.payment_date).slice(0,10)}</td></tr>`))}
    </div><div class='col-md-6'>
    <form id='expenseForm' class='form-card mb-3 row g-2'><h6>Add Expense</h6>
    <div class='col-md-4'><input name='category' class='form-control' placeholder='Category' required></div>
    <div class='col-md-3'><input type='number' step='0.01' name='amount' class='form-control' required></div>
    <div class='col-md-3'><input type='date' name='expense_date' class='form-control' required></div>
    <div class='col-md-12'><input name='note' class='form-control' placeholder='Note'></div>
    <div class='col-md-4'><button class='btn btn-warning w-100'>Add</button></div></form>
    ${table(['ID','Category','Amount','Date'], expenses.map(x=>`<tr><td>${x.id}</td><td>${x.category}</td><td>${x.amount}</td><td>${String(x.expense_date).slice(0,10)}</td></tr>`))}</div></div>`;
    document.getElementById('paymentForm').onsubmit = async (e) => { e.preventDefault(); await api('/payments', {method:'POST', body: JSON.stringify(Object.fromEntries(new FormData(e.target)))}); loadView('accounting'); };
    document.getElementById('expenseForm').onsubmit = async (e) => { e.preventDefault(); await api('/expenses', {method:'POST', body: JSON.stringify(Object.fromEntries(new FormData(e.target)))}); loadView('accounting'); };
  }

  if (view === 'employees') {
    const data = await api('/employees');
    mainContent.innerHTML = `<h4>Employee Management</h4>
      <form id='employeeForm' class='form-card mb-3 row g-2'>
      <div class='col-md-3'><input name='full_name' class='form-control' placeholder='Name' required></div>
      <div class='col-md-3'><input name='email' type='email' class='form-control' placeholder='Email' required></div>
      <div class='col-md-2'><input name='phone' class='form-control' placeholder='Phone' required></div>
      <div class='col-md-2'><select name='role' class='form-select'><option>admin</option><option>manager</option><option>staff</option></select></div>
      <div class='col-md-2'><input name='password' type='password' class='form-control' placeholder='Password' required></div>
      <div class='col-md-2'><button class='btn btn-primary w-100'>Create</button></div>
      </form>
      ${table(['ID','Name','Email','Role'], data.map(e=>`<tr><td>${e.id}</td><td>${e.full_name}</td><td>${e.email}</td><td>${e.role}</td></tr>`))}`;
    document.getElementById('employeeForm').onsubmit = async (e) => { e.preventDefault(); await api('/employees', {method:'POST', body: JSON.stringify(Object.fromEntries(new FormData(e.target)))}); loadView('employees'); };
  }

  if (view === 'reports') {
    mainContent.innerHTML = `<h4>Reports</h4><div class='form-card row g-2 mb-3'>
    <div class='col-md-3'><input id='from' type='date' class='form-control'></div>
    <div class='col-md-3'><input id='to' type='date' class='form-control'></div>
    <div class='col-md-2'><button id='runReport' class='btn btn-primary w-100'>Run</button></div>
    <div class='col-md-2'><button id='exportXlsx' class='btn btn-success w-100'>Export Excel</button></div>
    <div class='col-md-2'><a class='btn btn-secondary w-100' href='/api/backup' target='_blank'>Backup SQL</a></div></div><div id='reportResult'></div>`;
    document.getElementById('runReport').onclick = async () => {
      const q = `?from=${from.value}&to=${to.value}`;
      const [sales, fin] = await Promise.all([api(`/reports/sales${q}`), api(`/reports/financial${q}`)]);
      document.getElementById('reportResult').innerHTML = `<div class='card card-stat p-3 mb-2'>Income: ${fin.income} | Expenses: ${fin.expenses} | Profit: ${fin.profit}</div>` +
        table(['ID','Type','Destination','Amount','Status'], sales.map(s=>`<tr><td>${s.id}</td><td>${s.booking_type}</td><td>${s.destination}</td><td>${s.amount}</td><td>${s.status}</td></tr>`));
    };
    document.getElementById('exportXlsx').onclick = () => { window.open(`/api/reports/sales/export?from=${from.value}&to=${to.value}`, '_blank'); };
  }

  if (view === 'notifications') {
    const data = await api('/notifications');
    mainContent.innerHTML = `<h4>Notifications</h4>${table(['Title','Message','Date'], data.map(n=>`<tr><td>${n.title}</td><td>${n.message}</td><td>${String(n.created_at).slice(0,19).replace('T',' ')}</td></tr>`))}`;
  }

  if (view === 'settings') {
    const data = await api('/settings');
    document.documentElement.dataset.theme = data.dark_mode ? 'dark' : 'light';
    mainContent.innerHTML = `<h4>Settings</h4><form id='settingsForm' class='form-card row g-2'>
      <div class='col-md-4'><input name='company_name' class='form-control' value='${data.company_name}' required></div>
      <div class='col-md-4'><input name='company_address' class='form-control' value='${data.company_address}' required></div>
      <div class='col-md-2'><input name='company_logo' class='form-control' value='${data.company_logo || ''}'></div>
      <div class='col-md-2'><input name='currency' class='form-control' value='${data.currency}' required></div>
      <div class='col-md-2 form-check'><input class='form-check-input' type='checkbox' name='dark_mode' ${data.dark_mode ? 'checked' : ''}><label class='form-check-label'>Dark Mode</label></div>
      <div class='col-md-2'><button class='btn btn-primary w-100'>Save</button></div></form>`;
    document.getElementById('settingsForm').onsubmit = async (e) => {
      e.preventDefault();
      const f = Object.fromEntries(new FormData(e.target));
      f.dark_mode = !!e.target.dark_mode.checked;
      await api('/settings', {method:'PUT', body: JSON.stringify(f)});
      alert('Settings saved');
    };
  }
}

setAuthUI();
