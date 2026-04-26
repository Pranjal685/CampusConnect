import OrgSidebar from "@/components/layout/OrgSidebar";

export default function OrgLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-screen w-full overflow-hidden">
      <OrgSidebar />
      <main className="flex-1 min-w-0 h-full overflow-y-auto p-6">
        {children}
      </main>
    </div>
  );
}
