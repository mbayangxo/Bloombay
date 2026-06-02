export default function Loading() {
  return (
    <div className="min-h-screen pb-36" style={{ background: "var(--pale-pink-bg)" }}>
      <div className="px-5 pt-12 pb-4 animate-pulse">
        <div className="h-8 w-32 rounded-2xl bg-pink-100 mb-2" />
      </div>
      <div className="px-5 grid grid-cols-2 gap-3 animate-pulse">
        {[1,2,3,4,5,6].map(i => <div key={i} className="h-32 rounded-2xl bg-pink-100" />)}
      </div>
    </div>
  );
}
