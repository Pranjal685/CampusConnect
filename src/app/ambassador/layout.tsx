import AmbassadorSidebar from "@/components/layout/AmbassadorSidebar";

export default function AmbassadorLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen">
      <AmbassadorSidebar />
      <main className="flex-1 ml-64 p-6">
        {children}
      </main>
    </div>
  );
}
