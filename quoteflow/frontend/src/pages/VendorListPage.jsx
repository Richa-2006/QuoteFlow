import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/dashboard/Navbar';
import api from '../api/axios';


export default function VendorListPage() {
  const [vendors, setVendors]   = useState([]);
  const [search, setSearch]     = useState('');
  const [category, setCategory] = useState('');
  const [loading, setLoading]   = useState(true);

  const fetchVendors = async () => {
    setLoading(true);
    try {
      const params = {};
      if (search)   params.search   = search;
      if (category) params.category = category;
      const { data } = await api.get('/vendors', { params });
      setVendors(data.vendors);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchVendors(); }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="max-w-5xl mx-auto px-6 py-8">
        <h1 className="text-2xl font-bold text-primary mb-6">Find Vendors</h1>

        <div className="flex gap-3 mb-6">
          <input
            type="text" placeholder="Search by business name..."
            className="flex-1 border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
            value={search} onChange={e => setSearch(e.target.value)}
          />
          <input
            type="text" placeholder="Category..."
            className="w-48 border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
            value={category} onChange={e => setCategory(e.target.value)}
          />
          <button onClick={fetchVendors}
            className="bg-primary text-white px-4 py-2 rounded-lg text-sm hover:bg-blue-900 transition">
            Search
          </button>
        </div>

        {loading ? (
          <p className="text-gray-400">Loading vendors...</p>
        ) : vendors.length === 0 ? (
          <p className="text-gray-400">No vendors found.</p>
        ) : (
          <div className="grid md:grid-cols-2 gap-4">
            {vendors.map(v => (
              <div key={v._id} className="bg-white rounded-xl border shadow-sm p-5 hover:shadow-md transition">
                <div className="flex items-start justify-between">
                  <div>
                    <h2 className="font-semibold text-gray-800">{v.businessName || v.name}</h2>
                    {v.category && (
                      <span className="inline-block mt-1 text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full">
                        {v.category}
                      </span>
                    )}
                  </div>
                </div>
                {v.description && (
                  <p className="text-gray-500 text-sm mt-2 line-clamp-2">{v.description}</p>
                )}
                <Link to={`/client/vendors/${v._id}`}
                  className="mt-4 inline-block bg-primary text-white text-sm px-4 py-1.5 rounded-lg hover:bg-blue-900 transition">
                  View & Request Quote
                </Link>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
