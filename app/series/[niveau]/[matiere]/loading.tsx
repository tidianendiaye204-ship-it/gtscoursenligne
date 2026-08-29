export default function LoadingMatiere() {
  return (
    <section className="mx-auto max-w-6xl px-6 py-20 animate-pulse">
      <div className="h-3 w-32 bg-encre/10 rounded mb-4" />
      <div className="h-8 w-64 bg-encre/10 rounded mb-6" />
      
      <div className="flex flex-wrap gap-2 mb-10">
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-9 w-20 bg-encre/10 rounded-sm" />
        ))}
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div key={i} className="border border-encre/10 p-6 rounded-sm">
            <div className="h-3 w-24 bg-encre/10 rounded mb-3" />
            <div className="h-6 w-48 bg-encre/10 rounded mb-3" />
            <div className="h-3 w-32 bg-azur/20 rounded mb-3" />
            <div className="space-y-2 mb-6">
              <div className="h-3 w-full bg-encre/10 rounded" />
              <div className="h-3 w-5/6 bg-encre/10 rounded" />
            </div>
            <div className="h-4 w-32 bg-azur/20 rounded" />
          </div>
        ))}
      </div>
    </section>
  );
}
