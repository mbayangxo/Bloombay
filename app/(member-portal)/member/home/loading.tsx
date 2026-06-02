export default function Loading() {
  return (
    <div className="min-h-screen pb-24" style={{ background: "var(--pale-pink-bg)" }}>
      <div className="px-5 pt-12 pb-4 animate-pulse">
        <div className="h-8 w-32 rounded-2xl bg-pink-100 mb-2" />
        <div className="h-6 w-48 rounded-2xl bg-pink-100" />
      </div>
      <div className="px-5 flex flex-col gap-4 animate-pulse">
        <div className="h-40 rounded-3xl bg-pink-100" />
        <div className="h-32 rounded-3xl bg-pink-100" />
        <div className="h-32 rounded-3xl bg-pink-100" />
      </div>
    </div>
  );
}
