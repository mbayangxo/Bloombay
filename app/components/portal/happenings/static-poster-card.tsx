import Image from "next/image";

export function StaticPosterCard({ img, title, sub }: { img: string; title: string; sub: string; wide?: boolean }) {
  return (
    <div style={{
      borderRadius: 14,
      overflow: "hidden",
      position: "relative",
      height: 160,
      boxShadow: "0 5px 20px rgba(0,0,0,0.4)",
    }}>
      <Image src={img} alt={title} fill style={{ objectFit: "cover" }} />
      <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to bottom, rgba(0,0,0,0) 35%, rgba(0,0,0,0.82) 100%)" }}/>
      <div style={{ position: "absolute", bottom: 10, left: 10, right: 10 }}>
        <p style={{ fontFamily: "var(--font-playfair)", fontSize: 13, fontWeight: 900, fontStyle: "italic", color: "white", lineHeight: 1.2, textShadow: "0 2px 8px rgba(0,0,0,0.5)" }}>{title}</p>
        <p style={{ fontFamily: "var(--font-jost)", fontSize: "7px", color: "rgba(255,255,255,0.6)", letterSpacing: "0.05em", marginTop: 2 }}>{sub}</p>
      </div>
    </div>
  );
}
