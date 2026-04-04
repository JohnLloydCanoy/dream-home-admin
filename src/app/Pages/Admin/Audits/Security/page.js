"use client";

export default function SecurityPage() {
  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h1 className="text-3xl font-extrabold text-[#002147]">Security & Access</h1>
        <p className="text-gray-600">Configure global authentication and encryption protocols.</p>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8 space-y-8">
        <div className="flex justify-between items-center">
            <div>
                <h3 className="font-bold text-gray-800">Two-Factor Authentication (2FA)</h3>
                <p className="text-sm text-gray-500">Require staff to verify their identity via email or SMS.</p>
            </div>
            <div className="w-12 h-6 bg-emerald-500 rounded-full relative"><div className="absolute right-1 top-1 h-4 w-4 bg-white rounded-full"></div></div>
        </div>
        
        <hr className="border-gray-50"/>

        <div className="flex justify-between items-center">
            <div>
                <h3 className="font-bold text-gray-800">API Access Tokens</h3>
                <p className="text-sm text-gray-500">Revoke or rotate keys for external integrations.</p>
            </div>
            <button className="text-xs font-bold py-2 px-4 bg-gray-100 rounded text-gray-700 hover:bg-gray-200">Manage Keys</button>
        </div>
      </div>
    </div>
  );
}