import OrgSidebar from "@/components/layout/OrgSidebar";

export default function OrgLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen">
      <OrgSidebar />
      <main className="flex-1 ml-64 p-6">
        {children}
      </main>
    </div>
  );
}
