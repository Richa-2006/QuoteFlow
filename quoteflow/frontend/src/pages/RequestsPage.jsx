import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/dashboard/Navbar';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';


export default function RequestsPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [requests, setRequests] = useState([]);
  const [loading, setLoading]   = useState(true);

  useEffect(() => {
    const url = user.role === 'vendor' ? '/requests/incoming' : '/requests';
    api.get(url).then(({ data }) => { setRequests(data); setLoading(false); });
  }, [user.role]);

  const handleCreateQuote = (reqId) => {
    navigate(`/vendor/quotes?reqId=${reqId}`);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="max-w-5xl mx-auto px-6 py-8">
        <h1 className="text-2xl font-bold text-primary mb-6">
          {user.role === 'vendor' ? 'Incoming Requests' : 'My Requests'}
        </h1>

        {loading ? <p className="text-gray-400">Loading...</p> :
         requests.length === 0 ? <p className="text-gray-400">No requests yet.</p> : (
          <div className="space-y-4">
            {requests.map(r => (
              <div key={r._id} className="bg-white rounded-xl border shadow-sm p-5">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="font-medium text-gray-800">
                      {user.role === 'vendor'
                        ? `From: ${r.clientId?.name} (${r.clientId?.email})`
                        : `To: ${r.vendorId?.businessName || r.vendorId?.name}`}
                    </p>
                    {r.description && <p className="text-gray-500 text-sm mt-1">{r.description}</p>}
                    {r.budget && <p className="text-sm text-gray-600 mt-1">Budget: ₹{r.budget}</p>}
                  </div>
                  <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                    r.status === 'pending' ? 'bg-orange-100 text-orange-700' :
                    r.status === 'quoted'  ? 'bg-blue-100 text-blue-700' :
                    'bg-gray-100 text-gray-600'
                  }`}>{r.status}</span>
                </div>

                <div className="mt-3">
                  <p className="text-xs text-gray-500 font-medium mb-1">Items:</p>
                  <div className="flex flex-wrap gap-2">
                    {r.items.map((item, i) => (
                      <span key={i} className="text-xs bg-gray-100 px-2 py-0.5 rounded">
                        {item.name} × {item.quantity} {item.unit}
                      </span>
                    ))}
                  </div>
                </div>

                {user.role === 'vendor' && r.status === 'pending' && (
                  <button
                    onClick={() => handleCreateQuote(r._id)}
                    className="mt-4 bg-primary text-white text-sm px-4 py-1.5 rounded-lg hover:bg-blue-900 transition">
                    Create Quote
                  </button>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
