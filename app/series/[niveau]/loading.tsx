export default function LoadingNiveau() {
  return (
    <div className="bg-encre min-h-screen pt-32 pb-24 relative overflow-hidden">
      <section className="mx-auto max-w-6xl px-6 relative z-10 animate-pulse">
        <div className="text-center mb-16 flex flex-col items-center">
          <div className="h-6 w-24 bg-white/10 rounded-full mb-4" />
          <div className="h-12 w-64 md:w-96 bg-white/10 rounded-lg mb-6" />
          <div className="h-4 w-48 md:w-80 bg-white/10 rounded" />
        </div>
        <div className="grid md:grid-cols-3 gap-8">
          {[1, 2, 3].map((i) => (
            <div key={i} className="min-h-[280px] p-10 rounded-[2rem] bg-white/[0.02] border border-white/5 flex flex-col justify-between">
              <div>
                <div className="w-10 h-10 bg-white/10 rounded-full mb-6" />
                <div className="w-16 h-16 bg-white/10 rounded-2xl mb-8" />
                <div className="h-6 w-32 bg-white/10 rounded mb-2" />
              </div>
              <div className="h-4 w-40 bg-white/10 rounded mt-8" />
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
