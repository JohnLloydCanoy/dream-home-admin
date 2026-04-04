"use client";

export default function RolesPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-extrabold text-[#002147]">Roles & Permissions</h1>
        <p className="text-gray-600">Define what each staff category can see and do.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {['Administrator', 'Manager', 'Supervisor'].map((role) => (
            <div key={role} className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
                <h3 className="font-bold text-blue-600">{role}</h3>
                <ul className="mt-4 space-y-2">
                    <li className="text-xs text-gray-500 flex items-center gap-2">✓ Create/Edit Properties</li>
                    <li className="text-xs text-gray-500 flex items-center gap-2">✓ Manage Financials</li>
                    <li className={`text-xs flex items-center gap-2 ${role === 'Administrator' ? 'text-gray-500' : 'text-gray-300 italic'}`}>
                        {role === 'Administrator' ? '✓' : '✗'} Delete Users
                    </li>
                </ul>
            </div>
        ))}
      </div>
    </div>
  );
}