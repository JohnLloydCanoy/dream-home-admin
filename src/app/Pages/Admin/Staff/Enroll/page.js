import ManagementNavBar from "../../components/ui/Navbar";

export default function AdminLayout({ children }) {
  return (
    <div className="flex bg-[#f0f2f5] min-h-screen font-sans">

      <ManagementNavBar />

      <main className="ml-64 flex-1 p-8">
        <div className="max-w-6xl mx-auto">
          {children}
        </div>
      </main>
    </div>
  );
}