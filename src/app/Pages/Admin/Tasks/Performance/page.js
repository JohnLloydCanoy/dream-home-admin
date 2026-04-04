"use client";

export default function PerformancePage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-extrabold text-[#002147]">Team Performance</h1>
        <p className="text-gray-600">Analytics on task completion rates and efficiency.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm text-center">
          <p className="text-xs font-bold text-gray-400 uppercase">Completion Rate</p>
          <h2 className="text-4xl font-black text-emerald-600 mt-2">92%</h2>
        </div>
        <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm text-center">
          <p className="text-xs font-bold text-gray-400 uppercase">Avg. Resolution Time</p>
          <h2 className="text-4xl font-black text-blue-600 mt-2">4.2h</h2>
        </div>
        <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm text-center">
          <p className="text-xs font-bold text-gray-400 uppercase">Overdue Tasks</p>
          <h2 className="text-4xl font-black text-red-600 mt-2">3</h2>
        </div>
      </div>
      
      <div className="h-64 bg-white rounded-xl border border-dashed border-gray-200 flex items-center justify-center">
        <p className="text-gray-400 italic">Task efficiency chart placeholder...</p>
      </div>
    </div>
  );
}