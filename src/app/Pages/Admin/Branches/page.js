"use client";

export default function BranchOverviewPage() {
  const branches = [
    { id: 'B001', city: 'London', address: '163 Main St', staffCount: 8 },
    { id: 'B002', city: 'Glasgow', address: '22 Deer Dr', staffCount: 5 },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-extrabold text-[#002147]">Branch Overview</h1>
        <p className="text-gray-600">Manage office locations and resource distribution.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {branches.map((branch) => (
          <div key={branch.id} className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm flex justify-between items-center hover:border-blue-200 transition-colors">
            <div>
              <h3 className="text-xl font-bold text-[#002147]">{branch.city}</h3>
              <p className="text-sm text-gray-500">{branch.address}</p>
              <p className="text-xs font-bold text-blue-600 mt-2 uppercase tracking-widest">{branch.id}</p>
            </div>
            <div className="text-right">
              <span className="text-2xl font-black text-gray-800">{branch.staffCount}</span>
              <p className="text-[10px] text-gray-400 uppercase font-bold">Staff Members</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}