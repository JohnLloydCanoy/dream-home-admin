"use client";

export default function CreateTaskPage() {
  return (
    <div className="max-w-3xl space-y-6">
      <div>
        <h1 className="text-3xl font-extrabold text-[#002147]">Assign New Task</h1>
        <p className="text-gray-600">Create a new workflow item for your staff members.</p>
      </div>

      <form className="bg-white p-8 rounded-xl shadow-sm border border-gray-100 space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1">
            <label className="text-xs font-bold text-gray-700 uppercase">Task Title</label>
            <input type="text" className="w-full p-2.5 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 outline-none" placeholder="e.g. Inspect Branch 3" />
          </div>
          <div className="space-y-1">
            <label className="text-xs font-bold text-gray-700 uppercase">Assign To Staff</label>
            <select className="w-full p-2.5 border border-gray-300 rounded-md outline-none">
              <option>Select Staff Member</option>
              <option>John Doe</option>
              <option>Jane Smith</option>
            </select>
          </div>
        </div>

        <div className="space-y-1">
          <label className="text-xs font-bold text-gray-700 uppercase">Task Description</label>
          <textarea rows="4" className="w-full p-2.5 border border-gray-300 rounded-md outline-none" placeholder="Describe the requirements..."></textarea>
        </div>

        <div className="flex justify-end gap-3 pt-4">
          <button type="button" className="px-6 py-2 text-sm font-bold text-gray-500 hover:text-gray-700">Cancel</button>
          <button type="submit" className="px-6 py-2 bg-[#002147] text-white rounded-md font-bold text-sm hover:bg-[#001833] transition">
            Create Task
          </button>
        </div>
      </form>
    </div>
  );
}