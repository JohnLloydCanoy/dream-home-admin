"use client";

export default function AuditLogsPage() {
  const logs = [
    { id: 1, user: "Nitro (Admin)", action: "Enrolled New Staff", target: "S0092", time: "10 mins ago" },
    { id: 2, user: "Nitro (Admin)", action: "Updated Property Pricing", target: "P1022", time: "1 hour ago" },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-extrabold text-[#002147]">System Activity Logs</h1>
        <p className="text-gray-600">Track every administrative action for security and compliance.</p>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-4 bg-gray-50 border-b border-gray-100 flex justify-between items-center">
            <span className="text-xs font-bold text-gray-500 uppercase">Recent Sessions</span>
            <button className="text-xs text-blue-600 font-bold hover:underline">Export CSV</button>
        </div>
        <div className="divide-y divide-gray-50">
          {logs.map((log) => (
            <div key={log.id} className="p-4 flex justify-between items-center hover:bg-gray-50/30 transition">
              <div className="flex gap-4 items-center">
                <div className="h-8 w-8 rounded bg-gray-100 flex items-center justify-center text-gray-400 text-xs font-bold">#{log.id}</div>
                <div>
                  <p className="text-sm font-bold text-gray-800">{log.action}</p>
                  <p className="text-xs text-gray-500">By {log.user} on {log.target}</p>
                </div>
              </div>
              <span className="text-xs text-gray-400 font-medium italic">{log.time}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}