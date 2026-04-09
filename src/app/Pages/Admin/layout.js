import ManagementSideBar from "@/components/ui/Navbar";

export default function AdminLayout({ children }) {
  return (
    <div className="flex min-h-screen bg-[#f0f2f5] font-sans">

      <ManagementSideBar />
      <main className="ml-64 flex-1 p-8 overflow-y-auto">
        <div className="max-w-7xl mx-auto">
          {children}
        </div>
      </main>
    </div>
  );
}