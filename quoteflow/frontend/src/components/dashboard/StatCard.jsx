export default function StatCard({ label, value, color = 'blue' }) {
  const colors = {
    blue:   'bg-blue-50 border-blue-200 text-blue-700',
    orange: 'bg-orange-50 border-orange-200 text-orange-700',
    green:  'bg-green-50 border-green-200 text-green-700',
    gray:   'bg-gray-50 border-gray-200 text-gray-700',
  };
  
  return (
    <div className={`border rounded-xl p-5 ${colors[color]}`}>
      <p className="text-sm font-medium opacity-70">{label}</p>
      <p className="text-3xl font-bold mt-1">{value}</p>
    </div>
  );
}
