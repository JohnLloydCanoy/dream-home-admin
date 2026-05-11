'use client';

import ManagementSideBar from "@/components/ui/Navbar";
import { AuthProvider } from "@/hooks/useAuth";

export default function AdminLayout({ children }) {
  return (
    <AuthProvider>
      <div className="flex min-h-screen bg-[#f0f2f5] font-sans">

        <ManagementSideBar />
        <main className="ml-69 flex-1 p-8 overflow-y-auto">
          <div className="max-w-7xl mx-auto">
            {children}
          </div>
        </main>
      </div>
    </AuthProvider>
  );
}