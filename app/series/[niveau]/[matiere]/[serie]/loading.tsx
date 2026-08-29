export default function LoadingSerie() {
  return (
    <section className="mx-auto max-w-3xl px-6 py-20 animate-pulse">
      <div className="h-3 w-32 bg-encre/10 rounded mb-4" />
      <div className="h-8 w-64 bg-encre/10 rounded mb-4" />
      <div className="h-4 w-full bg-encre/10 rounded mb-2" />
      <div className="h-4 w-5/6 bg-encre/10 rounded mb-10" />

      <div className="bg-white rounded-3xl p-6 md:p-8 mb-8 border border-encre/5 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 left-0 w-2 h-full bg-encre/10 rounded-l-3xl" />
        <div className="flex items-center justify-between mb-6 pl-4">
          <div className="h-8 w-48 bg-encre/10 rounded" />
          <div className="h-6 w-24 bg-encre/10 rounded-full" />
        </div>
        <div className="flex flex-col items-center justify-center p-8 bg-[#f8f9fa] rounded-2xl border border-black/5">
          <div className="h-10 w-40 bg-encre/10 rounded mb-4" />
          <div className="h-4 w-24 bg-encre/10 rounded" />
        </div>
      </div>

      <div className="bg-[#040e21] rounded-3xl p-6 md:p-8 mb-12 shadow-2xl relative overflow-hidden">
        <div className="flex items-center justify-between mb-6">
          <div className="h-8 w-64 bg-white/10 rounded" />
          <div className="h-6 w-24 bg-white/10 rounded-full" />
        </div>
        <div className="flex flex-col items-center justify-center p-8 bg-white/5 rounded-2xl border border-white/10">
          <div className="h-10 w-40 bg-white/10 rounded mb-4" />
          <div className="h-4 w-24 bg-white/10 rounded" />
        </div>
      </div>
    </section>
  );
}
