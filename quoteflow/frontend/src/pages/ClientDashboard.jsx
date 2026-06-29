import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/dashboard/Navbar';
import StatCard from '../components/dashboard/StatCard';
import api from '../api/axios';

export default function ClientDashboard() {
  const [stats, setStats] = useState({ requests: 0, quotesToReview: 0, invoices: 0 });
  const [recentQuotes, setRecentQuotes] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const [reqRes, quoteRes, invRes] = await Promise.all([
        api.get('/requests'),
        api.get('/quotes'),
        api.get('/invoices'),
      ]);
      setStats({
        requests:     reqRes.data.length,
        quotesToReview: quoteRes.data.filter(q => q.status === 'sent').length,
        invoices:     invRes.data.length,
      });
      setRecentQuotes(quoteRes.data.slice(0, 5));
    };
    fetchData();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="max-w-5xl mx-auto px-6 py-8">
        <h1 className="text-2xl font-bold text-primary mb-6">Client Dashboard</h1>

        <div className="grid grid-cols-3 gap-4 mb-8">
          <StatCard label="My Requests"       value={stats.requests}       color="blue" />
          <StatCard label="Quotes to Review"  value={stats.quotesToReview} color="orange" />
          <StatCard label="Invoices"          value={stats.invoices}       color="green" />
        </div>

        <div className="flex gap-4 mb-8">
          <Link to="/client/vendors"
            className="flex-1 bg-primary text-white rounded-xl p-5 hover:bg-blue-900 transition text-center">
            <p className="text-2xl mb-1">🔍</p>
            <p className="font-semibold">Find Vendors</p>
            <p className="text-blue-200 text-xs mt-1">Browse and request quotes</p>
          </Link>
          <Link to="/client/quotes"
            className="flex-1 bg-accent text-white rounded-xl p-5 hover:bg-orange-700 transition text-center">
            <p className="text-2xl mb-1">📄</p>
            <p className="font-semibold">Review Quotes</p>
            <p className="text-orange-100 text-xs mt-1">Approve or request revisions</p>
          </Link>
        </div>

        <div className="bg-white rounded-xl shadow-sm border p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold text-gray-800">Recent Quotes</h2>
            <Link to="/client/quotes" className="text-sm text-primary hover:underline">View all</Link>
          </div>
          {recentQuotes.length === 0 ? (
            <p className="text-gray-400 text-sm">No quotes yet. Find a vendor to get started.</p>
          ) : (
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-gray-500 border-b">
                  <th className="pb-2">Vendor</th>
                  <th className="pb-2">Total</th>
                  <th className="pb-2">Status</th>
                  <th className="pb-2"></th>
                </tr>
              </thead>
              <tbody>
                {recentQuotes.map(q => (
                  <tr key={q._id} className="border-b last:border-0 hover:bg-gray-50">
                    <td className="py-2">{q.vendorId?.businessName || q.vendorId?.name}</td>
                    <td className="py-2">₹{q.totalAmount?.toFixed(2)}</td>
                    <td className="py-2">
                      <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                        q.status === 'sent'     ? 'bg-orange-100 text-orange-700' :
                        q.status === 'approved' ? 'bg-green-100 text-green-700' :
                        q.status === 'revision' ? 'bg-red-100 text-red-700' :
                        'bg-gray-100 text-gray-600'
                      }`}>{q.status}</span>
                    </td>
                    <td className="py-2">
                      <Link to={`/quotes/${q._id}`} className="text-primary text-xs hover:underline">View</Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}
