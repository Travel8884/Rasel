import { useEffect, useState } from 'react'
import { api } from './api'

const emptyUser = { email: '', password: '', full_name: '', role: 'staff' }

export default function App() {
  const [token, setToken] = useState(localStorage.getItem('token') || '')
  const [profile, setProfile] = useState(null)
  const [users, setUsers] = useState([])
  const [logs, setLogs] = useState([])
  const [settings, setSettings] = useState({ company_name: '', company_logo_url: '', support_email: '', timezone: 'UTC' })
  const [newUser, setNewUser] = useState(emptyUser)
  const [auth, setAuth] = useState({ email: '', password: '' })
  const [error, setError] = useState('')
  const [message, setMessage] = useState('')

  useEffect(() => {
    if (!token) return
    loadDashboard(token)
  }, [token])

  async function loadDashboard(authToken) {
    try {
      setError('')
      const me = await api.me(authToken)
      setProfile(me)

      const [activity, system] = await Promise.all([api.activityLogs(authToken), api.settings(authToken)])
      setLogs(activity)
      setSettings(system)

      if (me.role === 'admin') {
        const allUsers = await api.users(authToken)
        setUsers(allUsers)
      } else {
        setUsers([])
      }
    } catch (err) {
      setError(err.message)
      logout()
    }
  }

  async function login(e) {
    e.preventDefault()
    try {
      setError('')
      const result = await api.login(auth.email, auth.password)
      localStorage.setItem('token', result.access_token)
      setToken(result.access_token)
    } catch (err) {
      setError(err.message)
    }
  }

  function logout() {
    localStorage.removeItem('token')
    setToken('')
    setProfile(null)
    setUsers([])
    setLogs([])
    setMessage('')
  }

  async function saveSettings(e) {
    e.preventDefault()
    try {
      const updated = await api.updateSettings(token, settings)
      setSettings(updated)
      setMessage('System settings updated successfully.')
    } catch (err) {
      setError(err.message)
    }
  }

  async function createUser(e) {
    e.preventDefault()
    try {
      await api.registerUser(token, newUser)
      setNewUser(emptyUser)
      setUsers(await api.users(token))
      setMessage('User created successfully.')
    } catch (err) {
      setError(err.message)
    }
  }

  async function changeRole(userId, role) {
    try {
      await api.updateRole(token, userId, role)
      setUsers(await api.users(token))
      setMessage('User role updated.')
    } catch (err) {
      setError(err.message)
    }
  }

  if (!token) {
    return (
      <div className="container center">
        <form className="card" onSubmit={login}>
          <h1>Rasel SaaS Login</h1>
          <input placeholder="Email" type="email" value={auth.email} onChange={(e) => setAuth({ ...auth, email: e.target.value })} required />
          <input placeholder="Password" type="password" value={auth.password} onChange={(e) => setAuth({ ...auth, password: e.target.value })} required />
          <button type="submit">Sign in</button>
          <p className="hint">First-time setup: create your first admin via backend `/auth/register`.</p>
          {error && <p className="error">{error}</p>}
        </form>
      </div>
    )
  }

  return (
    <div className="container">
      <header className="toolbar">
        <h1>Rasel Business Control Panel</h1>
        <div>
          <span>{profile?.full_name} ({profile?.role})</span>
          <button onClick={logout}>Logout</button>
        </div>
      </header>

      {error && <p className="error">{error}</p>}
      {message && <p className="success">{message}</p>}

      <section className="grid two">
        <article className="card">
          <h2>System Settings</h2>
          <form onSubmit={saveSettings}>
            <input value={settings.company_name} onChange={(e) => setSettings({ ...settings, company_name: e.target.value })} placeholder="Company name" required />
            <input value={settings.company_logo_url || ''} onChange={(e) => setSettings({ ...settings, company_logo_url: e.target.value })} placeholder="Company logo URL" />
            <input value={settings.support_email} onChange={(e) => setSettings({ ...settings, support_email: e.target.value })} placeholder="Support email" type="email" required />
            <input value={settings.timezone} onChange={(e) => setSettings({ ...settings, timezone: e.target.value })} placeholder="Timezone" required />
            <button disabled={profile?.role !== 'admin'} type="submit">Save settings</button>
          </form>
        </article>

        <article className="card">
          <h2>Activity Logs</h2>
          <div className="list">
            {logs.map((log) => (
              <p key={log.id}>
                <strong>{log.action}</strong> · actor #{log.actor_id ?? 'n/a'} · {new Date(log.created_at).toLocaleString()}
              </p>
            ))}
          </div>
        </article>
      </section>

      {profile?.role === 'admin' && (
        <section className="grid two">
          <article className="card">
            <h2>Create Staff/Admin User</h2>
            <form onSubmit={createUser}>
              <input value={newUser.full_name} onChange={(e) => setNewUser({ ...newUser, full_name: e.target.value })} placeholder="Full name" required />
              <input value={newUser.email} onChange={(e) => setNewUser({ ...newUser, email: e.target.value })} placeholder="Email" type="email" required />
              <input value={newUser.password} onChange={(e) => setNewUser({ ...newUser, password: e.target.value })} placeholder="Password" type="password" required />
              <select value={newUser.role} onChange={(e) => setNewUser({ ...newUser, role: e.target.value })}>
                <option value="staff">Staff</option>
                <option value="admin">Admin</option>
              </select>
              <button type="submit">Create user</button>
            </form>
          </article>

          <article className="card">
            <h2>User Management</h2>
            <div className="list">
              {users.map((u) => (
                <div className="row" key={u.id}>
                  <span>{u.full_name} ({u.email})</span>
                  <select value={u.role} onChange={(e) => changeRole(u.id, e.target.value)}>
                    <option value="staff">staff</option>
                    <option value="admin">admin</option>
                  </select>
                </div>
              ))}
            </div>
          </article>
        </section>
      )}
    </div>
  )
}
