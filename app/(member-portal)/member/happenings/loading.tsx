export default function Loading() {
  return (
    <div className="min-h-screen pb-24" style={{ background: "var(--pale-pink-bg)" }}>
      <div className="px-5 pt-12 pb-4 animate-pulse">
        <div className="h-8 w-40 rounded-2xl bg-pink-100 mb-2" />
      </div>
      <div className="px-5 flex flex-col gap-3 animate-pulse">
        {[1,2,3,4].map(i => <div key={i} className="h-24 rounded-2xl bg-pink-100" />)}
      </div>
    </div>
  );
}
