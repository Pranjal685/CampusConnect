import AmbassadorSidebar from "@/components/layout/AmbassadorSidebar";

export default function AmbassadorLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-screen w-full overflow-hidden">
      <AmbassadorSidebar />
      <main className="flex-1 min-w-0 h-full overflow-y-auto p-6">
        {children}
      </main>
    </div>
  );
}
