import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function RegisterPage() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [form, setForm]   = useState({ name: '', email: '', password: '', role: 'client', businessName: '', category: '', description: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const user = await register(form);
      navigate(user.role === 'vendor' ? '/vendor/dashboard' : '/client/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-10">
      <div className="bg-white rounded-2xl shadow-md p-8 w-full max-w-lg">
        <h1 className="text-2xl font-bold text-primary mb-1">Create account</h1>
        <p className="text-gray-500 text-sm mb-6">Join QuoteFlow as a vendor or client</p>

        {error && <div className="bg-red-50 text-red-600 text-sm p-3 rounded mb-4">{error}</div>}

        {/* Role toggle */}
        <div className="flex rounded-lg border overflow-hidden mb-6">
          {['client', 'vendor'].map(r => (
            <button
              key={r} type="button"
              onClick={() => setForm({ ...form, role: r })}
              className={`flex-1 py-2 text-sm font-medium capitalize transition ${form.role === r ? 'bg-primary text-white' : 'text-gray-600 hover:bg-gray-50'}`}
            >
              {r}
            </button>
          ))}
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Full Name</label>
            <input type="text" required
              className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
              value={form.name} onChange={e => setForm({ ...form, name: e.target.value })}
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Email</label>
            <input type="email" required
              className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
              value={form.email} onChange={e => setForm({ ...form, email: e.target.value })}
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Password</label>
            <input type="password" required minLength={6}
              className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
              value={form.password} onChange={e => setForm({ ...form, password: e.target.value })}
            />
          </div>

          {form.role === 'vendor' && (
            <>
              <div>
                <label className="block text-sm font-medium mb-1">Business Name</label>
                <input type="text"
                  className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                  value={form.businessName} onChange={e => setForm({ ...form, businessName: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Category</label>
                <input type="text" placeholder="e.g. Web Development, Design, Consulting"
                  className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                  value={form.category} onChange={e => setForm({ ...form, category: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Business Description</label>
                <textarea rows={3}
                  className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                  value={form.description} onChange={e => setForm({ ...form, description: e.target.value })}
                />
              </div>
            </>
          )}

          <button type="submit" disabled={loading}
            className="w-full bg-primary text-white py-2 rounded-lg font-medium hover:bg-blue-900 transition disabled:opacity-60"
          >
            {loading ? 'Creating account...' : 'Register'}
          </button>
        </form>

        <p className="text-center text-sm text-gray-500 mt-6">
          Already have an account?{' '}
          <Link to="/login" className="text-primary font-medium hover:underline">Sign in</Link>
        </p>
      </div>
    </div>
  );
}
