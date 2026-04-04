export default function StaffDirectoryPage() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-extrabold text-[#002147] tracking-tight">
          Staff Directory
        </h1>
        <p className="text-gray-600 mt-1 font-medium">
          Manage and view all registered personnel for DreamHome.
        </p>
      </div>
      
      {/* Placeholder Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-8 text-center flex flex-col items-center">
            <div className="bg-blue-50 p-4 rounded-full mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
            </div>
            <h3 className="text-lg font-bold text-[#002147]">No Staff Data Yet</h3>
            <p className="text-gray-500 max-w-sm mt-2">
                The staff list will appear here once you connect the Django backend API.
            </p>
        </div>
      </div>
    </div>
  );
}