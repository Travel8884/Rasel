import { useState } from 'react';
import { useAuth } from '../context/AuthContext';

export default function LoginPage() {
  const { login } = useAuth();
  const [email, setEmail] = useState('admin@travelpro.com');
  const [password, setPassword] = useState('Admin@123');

  const submit = async (e) => {
    e.preventDefault();
    await login(email, password);
    window.location.href = '/';
  };

  return (
    <div className="login-wrap">
      <form className="card" onSubmit={submit}>
        <h2>TravelPro Login</h2>
        <input value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" />
        <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" />
        <button>Sign In</button>
      </form>
    </div>
  );
}
