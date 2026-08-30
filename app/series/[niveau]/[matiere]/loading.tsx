export default function LoadingMatiere() {
  return (
    <div className="bg-encre min-h-screen text-white">
      <section className="mx-auto max-w-6xl px-6 py-20 animate-pulse">
        <div className="h-4 w-32 bg-white/10 rounded mb-2" />
        <div className="h-8 w-64 bg-white/10 rounded mb-6" />
        
        <div className="flex gap-2 mb-10 overflow-hidden">
          <div className="h-10 w-24 bg-white/10 rounded-full" />
          <div className="h-10 w-24 bg-white/10 rounded-full" />
          <div className="h-10 w-24 bg-white/10 rounded-full" />
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="flex flex-col rounded-2xl bg-white/[0.02] border border-white/10 h-[280px] p-6">
              <div className="h-4 w-24 bg-white/10 rounded mb-4" />
              <div className="h-6 w-full bg-white/10 rounded mb-2" />
              <div className="h-6 w-2/3 bg-white/10 rounded mb-4" />
              <div className="space-y-2 mb-6">
                <div className="h-3 w-full bg-white/5 rounded" />
                <div className="h-3 w-4/5 bg-white/5 rounded" />
              </div>
              <div className="mt-auto border-t border-white/10 pt-4 flex gap-2">
                <div className="h-8 flex-1 bg-white/10 rounded" />
                <div className="h-8 flex-1 bg-white/5 rounded" />
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
