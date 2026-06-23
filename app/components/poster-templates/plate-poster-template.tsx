"use client";

import type { PosterTemplateProps } from "@/lib/poster-templates/types";

export function PlatePosterTemplate({
  title,
  category,
  date,
  time,
  location,
  seatsLeft,
  hostName,
  imageUrl,
  accentColor,
  href,
  plateStyle = "classic",
}: PosterTemplateProps & { plateStyle?: string }) {

  const parts = location.split(",").map(s => s.trim());
  const venueName = parts[0] ?? location;
  const venueCity = parts[1] ?? "";

  if (plateStyle === "wine") {
    const color = accentColor ?? "#2D5F2D";
    return (
      <a href={href ?? "#"} style={{ textDecoration: "none", display: "block" }}>
        <div style={{
          position: "relative",
          width: "100%",
          aspectRatio: "3/2",
          borderRadius: 18,
          overflow: "hidden",
          boxShadow: "0 14px 52px rgba(0,0,0,0.28)",
          background: `repeating-linear-gradient(90deg, ${color} 0px, ${color} 28px, white 28px, white 56px)`,
        }}>
          <div style={{ position: "absolute", inset: 0, background: "rgba(255,255,255,0.08)", backgroundImage: "repeating-linear-gradient(0deg, rgba(255,255,255,0.04) 0px, rgba(255,255,255,0.04) 1px, transparent 1px, transparent 4px)" }} />
          <div style={{
            position: "absolute",
            top: "50%", left: "50%",
            transform: "translate(-50%, -50%)",
            width: "62%", aspectRatio: "1",
            borderRadius: "50%",
            background: "white",
            boxShadow: "0 8px 40px rgba(0,0,0,0.22), inset 0 0 0 3px rgba(45,95,45,0.08), inset 0 0 0 8px rgba(45,95,45,0.04)",
            display: "flex", flexDirection: "column",
            alignItems: "center", justifyContent: "center",
            padding: "16px",
            zIndex: 2,
          }}>
            <svg width="32" height="16" viewBox="0 0 32 16" style={{ position: "absolute", top: "-12px", left: "50%", transform: "translateX(-50%)" }}>
              <ellipse cx="8" cy="8" rx="7" ry="4" fill="#2D5F2D" transform="rotate(-15 8 8)"/>
              <ellipse cx="24" cy="8" rx="7" ry="4" fill="#2D5F2D" transform="rotate(15 24 8)"/>
              <circle cx="16" cy="8" r="3" fill="#2D5F2D"/>
            </svg>
            <div style={{ position: "absolute", inset: "10%", borderRadius: "50%", border: `1.5px solid ${color}18` }} />
            <p style={{ fontFamily: "var(--font-caveat)", fontStyle: "italic", fontSize: "clamp(11px, 2.5vw, 16px)", color: color, letterSpacing: "0.04em", marginBottom: 2 }}>
              {category || "bloom bay presents"}
            </p>
            <div style={{ width: "40%", height: 1, background: `${color}40`, marginBottom: 6 }} />
            <p style={{ fontFamily: "var(--font-playfair)", fontStyle: "italic", fontWeight: 900, fontSize: "clamp(18px, 4vw, 28px)", color: color, lineHeight: 1, textAlign: "center", letterSpacing: "-0.01em" }}>
              {title}
            </p>
            {hostName && (
              <p style={{ fontFamily: "var(--font-caveat)", fontSize: "clamp(10px, 2vw, 14px)", color: `${color}88`, marginTop: 3, textAlign: "center" }}>
                at {venueName}
                {venueCity && <><br/><em style={{ fontStyle: "italic" }}>{venueCity}</em></>}
              </p>
            )}
            <div style={{ width: "55%", height: 1, background: `${color}30`, margin: "8px 0" }} />
            <div style={{ display: "flex", gap: "clamp(8px, 2vw, 14px)", alignItems: "center" }}>
              {[["✳", date], ["|", time], ["|", venueCity || location]].map(([sep, val], i) => (
                <div key={i} style={{ display: "flex", alignItems: "center", gap: 4 }}>
                  {i > 0 && <span style={{ color: `${color}44`, fontSize: 10 }}>|</span>}
                  <p style={{ fontFamily: "var(--font-jost)", fontSize: "clamp(7px, 1.5vw, 9px)", fontWeight: 800, color: color, letterSpacing: "0.06em" }}>{val}</p>
                </div>
              ))}
            </div>
            {seatsLeft !== undefined && (
              <div style={{ marginTop: 6, background: `${color}12`, borderRadius: 999, padding: "3px 10px", border: `1px solid ${color}25` }}>
                <p style={{ fontFamily: "var(--font-caveat)", fontSize: "clamp(9px, 1.8vw, 12px)", color: color, fontWeight: 700 }}>
                  {seatsLeft} seats left ♡
                </p>
              </div>
            )}
            <p style={{ fontFamily: "var(--font-caveat)", fontStyle: "italic", fontSize: "clamp(6px, 1.2vw, 8px)", color: `${color}55`, marginTop: 6 }}>Buon Appetito</p>
          </div>
          {imageUrl && (
            <div style={{
              position: "absolute", top: "8%", right: "5%", zIndex: 4,
              transform: "rotate(4deg)",
              background: "white", padding: "6px 6px 18px",
              boxShadow: "0 6px 22px rgba(0,0,0,0.3)",
              width: "28%",
            }}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={imageUrl} alt="" style={{ width: "100%", aspectRatio: "1", objectFit: "cover", display: "block" }} />
              <p style={{ fontFamily: "var(--font-caveat)", fontSize: "clamp(8px, 1.5vw, 11px)", color: "rgba(0,0,0,0.45)", textAlign: "center", marginTop: 4 }}>
                see you there! ♡
              </p>
            </div>
          )}
          <div style={{ position: "absolute", left: "3%", top: "30%", zIndex: 3, transform: "rotate(-3deg)" }}>
            <p style={{ fontFamily: "var(--font-caveat)", fontSize: "clamp(9px, 1.8vw, 12px)", color: color, lineHeight: 1.8, opacity: 0.8 }}>
              good food<br />better wine<br />better company ♡
            </p>
          </div>
          <div style={{ position: "absolute", bottom: "6%", right: "3%", zIndex: 3, width: "10%", aspectRatio: "1", borderRadius: "50%", background: "white", boxShadow: "0 3px 12px rgba(0,0,0,0.18)", display: "flex", alignItems: "center", justifyContent: "center", border: `2px solid ${color}22` }}>
            <p style={{ fontFamily: "var(--font-playfair)", fontStyle: "italic", fontSize: "clamp(8px, 1.8vw, 12px)", fontWeight: 700, color: color }}>BB</p>
          </div>
          <div style={{ position: "absolute", bottom: "8%", left: "4%", zIndex: 3, opacity: 0.55 }}>
            <svg width="clamp(14px,3vw,20px)" height="clamp(10px,2.2vw,14px)" viewBox="0 0 20 14" fill={color}>
              <ellipse cx="7" cy="5" rx="5" ry="3.5" transform="rotate(-15 7 5)"/>
              <ellipse cx="13" cy="5" rx="5" ry="3.5" transform="rotate(15 13 5)"/>
              <ellipse cx="10" cy="10" rx="3" ry="2"/>
            </svg>
          </div>
        </div>
      </a>
    );
  }

  if (plateStyle === "china") {
    const color = accentColor ?? "#1A3464";
    return (
      <a href={href ?? "#"} style={{ textDecoration: "none", display: "block" }}>
        <div style={{
          position: "relative",
          width: "100%",
          aspectRatio: "3/2",
          borderRadius: 18,
          overflow: "hidden",
          boxShadow: "0 14px 52px rgba(0,0,0,0.28)",
          background: "#1A3464",
        }}>
          <div style={{ position: "absolute", inset: 0, background: "rgba(255,255,255,0.08)", backgroundImage: "repeating-linear-gradient(0deg, rgba(255,255,255,0.04) 0px, rgba(255,255,255,0.04) 1px, transparent 1px, transparent 4px)" }} />
          <div style={{
            position: "absolute",
            top: "50%", left: "50%",
            transform: "translate(-50%, -50%)",
            width: "62%", aspectRatio: "1",
            borderRadius: "50%",
            background: "white",
            boxShadow: "0 8px 40px rgba(0,0,0,0.22), inset 0 0 0 3px rgba(26,52,100,0.08), inset 0 0 0 8px rgba(26,52,100,0.04)",
            display: "flex", flexDirection: "column",
            alignItems: "center", justifyContent: "center",
            padding: "16px",
            zIndex: 2,
          }}>
            <div style={{ position: "absolute", inset: "10%", borderRadius: "50%", border: `1.5px solid ${color}18` }} />
            <svg style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }} viewBox="0 0 100 100">
              <circle cx="50" cy="50" r="42" fill="none" stroke="#1A3464" strokeWidth="0.8" strokeDasharray="6 4"/>
              {[0,1,2,3,4,5,6,7].map(i => {
                const angle = (i * 45) * Math.PI / 180;
                const x = 50 + 42 * Math.cos(angle);
                const y = 50 + 42 * Math.sin(angle);
                return <circle key={i} cx={x} cy={y} r="2" fill="#1A3464" opacity="0.6"/>;
              })}
            </svg>
            <p style={{ fontFamily: "var(--font-caveat)", fontStyle: "italic", fontSize: "clamp(11px, 2.5vw, 16px)", color: color, letterSpacing: "0.04em", marginBottom: 2 }}>
              {category || "bloom bay presents"}
            </p>
            <div style={{ width: "40%", height: 1, background: `${color}40`, marginBottom: 6 }} />
            <p style={{ fontFamily: "var(--font-playfair)", fontStyle: "italic", fontWeight: 900, fontSize: "clamp(18px, 4vw, 28px)", color: color, lineHeight: 1, textAlign: "center", letterSpacing: "-0.01em" }}>
              {title}
            </p>
            {hostName && (
              <p style={{ fontFamily: "var(--font-caveat)", fontSize: "clamp(10px, 2vw, 14px)", color: `${color}88`, marginTop: 3, textAlign: "center" }}>
                at {venueName}
                {venueCity && <><br/><em style={{ fontStyle: "italic" }}>{venueCity}</em></>}
              </p>
            )}
            <div style={{ width: "55%", height: 1, background: `${color}30`, margin: "8px 0" }} />
            <div style={{ display: "flex", gap: "clamp(8px, 2vw, 14px)", alignItems: "center" }}>
              {[["✳", date], ["|", time], ["|", venueCity || location]].map(([sep, val], i) => (
                <div key={i} style={{ display: "flex", alignItems: "center", gap: 4 }}>
                  {i > 0 && <span style={{ color: `${color}44`, fontSize: 10 }}>|</span>}
                  <p style={{ fontFamily: "var(--font-jost)", fontSize: "clamp(7px, 1.5vw, 9px)", fontWeight: 800, color: color, letterSpacing: "0.06em" }}>{val}</p>
                </div>
              ))}
            </div>
            {seatsLeft !== undefined && (
              <div style={{ marginTop: 6, background: `${color}12`, borderRadius: 999, padding: "3px 10px", border: `1px solid ${color}25` }}>
                <p style={{ fontFamily: "var(--font-caveat)", fontSize: "clamp(9px, 1.8vw, 12px)", color: color, fontWeight: 700 }}>
                  {seatsLeft} seats left ♡
                </p>
              </div>
            )}
            <p style={{ fontFamily: "var(--font-jost)", fontSize: "clamp(6px, 1.2vw, 8px)", fontWeight: 900, letterSpacing: "0.2em", color: `${color}55`, marginTop: 6 }}>·BB·</p>
          </div>
          {imageUrl && (
            <div style={{
              position: "absolute", top: "8%", right: "5%", zIndex: 4,
              transform: "rotate(4deg)",
              background: "white", padding: "6px 6px 18px",
              boxShadow: "0 6px 22px rgba(0,0,0,0.3)",
              width: "28%",
            }}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={imageUrl} alt="" style={{ width: "100%", aspectRatio: "1", objectFit: "cover", display: "block" }} />
              <p style={{ fontFamily: "var(--font-caveat)", fontSize: "clamp(8px, 1.5vw, 11px)", color: "rgba(0,0,0,0.45)", textAlign: "center", marginTop: 4 }}>
                see you there! ♡
              </p>
            </div>
          )}
          <div style={{ position: "absolute", left: "3%", top: "30%", zIndex: 3, transform: "rotate(-3deg)" }}>
            <p style={{ fontFamily: "var(--font-caveat)", fontSize: "clamp(9px, 1.8vw, 12px)", color: "white", lineHeight: 1.8, opacity: 0.8 }}>
              good food<br />better wine<br />better company ♡
            </p>
          </div>
          <div style={{ position: "absolute", bottom: "6%", right: "3%", zIndex: 3, width: "10%", aspectRatio: "1", borderRadius: "50%", background: "white", boxShadow: "0 3px 12px rgba(0,0,0,0.18)", display: "flex", alignItems: "center", justifyContent: "center", border: `2px solid ${color}22` }}>
            <p style={{ fontFamily: "var(--font-playfair)", fontStyle: "italic", fontSize: "clamp(8px, 1.8vw, 12px)", fontWeight: 700, color: color }}>BB</p>
          </div>
          <div style={{ position: "absolute", bottom: "8%", left: "4%", zIndex: 3, opacity: 0.55 }}>
            <svg width="clamp(14px,3vw,20px)" height="clamp(10px,2.2vw,14px)" viewBox="0 0 20 14" fill={color}>
              <ellipse cx="7" cy="5" rx="5" ry="3.5" transform="rotate(-15 7 5)"/>
              <ellipse cx="13" cy="5" rx="5" ry="3.5" transform="rotate(15 13 5)"/>
              <ellipse cx="10" cy="10" rx="3" ry="2"/>
            </svg>
          </div>
        </div>
      </a>
    );
  }

  if (plateStyle === "check") {
    const color = accentColor ?? "#CC2222";
    return (
      <a href={href ?? "#"} style={{ textDecoration: "none", display: "block" }}>
        <div style={{
          position: "relative",
          width: "100%",
          aspectRatio: "3/2",
          borderRadius: 18,
          overflow: "hidden",
          boxShadow: "0 14px 52px rgba(0,0,0,0.28)",
          background: "repeating-conic-gradient(#CC2222 0% 25%, #FFFFFF 0% 50%)",
          backgroundSize: "32px 32px",
        }}>
          <div style={{ position: "absolute", inset: 0, background: "rgba(255,255,255,0.08)", backgroundImage: "repeating-linear-gradient(0deg, rgba(255,255,255,0.04) 0px, rgba(255,255,255,0.04) 1px, transparent 1px, transparent 4px)" }} />
          <div style={{
            position: "absolute",
            top: "50%", left: "50%",
            transform: "translate(-50%, -50%)",
            width: "62%", aspectRatio: "1",
            borderRadius: "50%",
            background: "white",
            boxShadow: "0 8px 40px rgba(0,0,0,0.22), inset 0 0 0 3px rgba(204,34,34,0.08), inset 0 0 0 8px rgba(204,34,34,0.04)",
            filter: "drop-shadow(0 6px 24px rgba(0,0,0,0.25))",
            display: "flex", flexDirection: "column",
            alignItems: "center", justifyContent: "center",
            padding: "16px",
            zIndex: 2,
          }}>
            <div style={{ position: "absolute", inset: "-2%", borderRadius: "50%", border: "3px dashed rgba(204,34,34,0.3)", borderSpacing: "10px" }} />
            <div style={{ position: "absolute", inset: "10%", borderRadius: "50%", border: `1.5px solid ${color}18` }} />
            <p style={{ fontFamily: "var(--font-caveat)", fontStyle: "italic", fontSize: "clamp(11px, 2.5vw, 16px)", color: color, letterSpacing: "0.04em", marginBottom: 2 }}>
              {category || "bloom bay presents"}
            </p>
            <div style={{ width: "40%", height: 1, background: `${color}40`, marginBottom: 6 }} />
            <p style={{ fontFamily: "var(--font-playfair)", fontStyle: "italic", fontWeight: 900, fontSize: "clamp(18px, 4vw, 28px)", color: color, lineHeight: 1, textAlign: "center", letterSpacing: "-0.01em" }}>
              {title}
            </p>
            {hostName && (
              <p style={{ fontFamily: "var(--font-caveat)", fontSize: "clamp(10px, 2vw, 14px)", color: `${color}88`, marginTop: 3, textAlign: "center" }}>
                at {venueName}
                {venueCity && <><br/><em style={{ fontStyle: "italic" }}>{venueCity}</em></>}
              </p>
            )}
            <div style={{ width: "55%", height: 1, background: `${color}30`, margin: "8px 0" }} />
            <div style={{ display: "flex", gap: "clamp(8px, 2vw, 14px)", alignItems: "center" }}>
              {[["✳", date], ["|", time], ["|", venueCity || location]].map(([sep, val], i) => (
                <div key={i} style={{ display: "flex", alignItems: "center", gap: 4 }}>
                  {i > 0 && <span style={{ color: `${color}44`, fontSize: 10 }}>|</span>}
                  <p style={{ fontFamily: "var(--font-jost)", fontSize: "clamp(7px, 1.5vw, 9px)", fontWeight: 800, color: color, letterSpacing: "0.06em" }}>{val}</p>
                </div>
              ))}
            </div>
            {seatsLeft !== undefined && (
              <div style={{ marginTop: 6, background: `${color}12`, borderRadius: 999, padding: "3px 10px", border: `1px solid ${color}25` }}>
                <p style={{ fontFamily: "var(--font-caveat)", fontSize: "clamp(9px, 1.8vw, 12px)", color: color, fontWeight: 700 }}>
                  {seatsLeft} seats left ♡
                </p>
              </div>
            )}
            <p style={{ fontFamily: "var(--font-jost)", fontSize: "clamp(6px, 1.2vw, 8px)", fontWeight: 900, letterSpacing: "0.2em", color: `${color}55`, marginTop: 6 }}>·BB·</p>
          </div>
          {imageUrl && (
            <div style={{
              position: "absolute", top: "8%", right: "5%", zIndex: 4,
              transform: "rotate(4deg)",
              background: "white", padding: "6px 6px 18px",
              boxShadow: "0 6px 22px rgba(0,0,0,0.3)",
              width: "28%",
            }}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={imageUrl} alt="" style={{ width: "100%", aspectRatio: "1", objectFit: "cover", display: "block" }} />
              <p style={{ fontFamily: "var(--font-caveat)", fontSize: "clamp(8px, 1.5vw, 11px)", color: "rgba(0,0,0,0.45)", textAlign: "center", marginTop: 4 }}>
                see you there! ♡
              </p>
            </div>
          )}
          <div style={{ position: "absolute", left: "3%", top: "30%", zIndex: 3, transform: "rotate(-3deg)" }}>
            <p style={{ fontFamily: "var(--font-caveat)", fontSize: "clamp(9px, 1.8vw, 12px)", color: color, lineHeight: 1.8, opacity: 0.8 }}>
              good food<br />better wine<br />better company ♡
            </p>
          </div>
          <div style={{ position: "absolute", bottom: "6%", right: "3%", zIndex: 3, width: "10%", aspectRatio: "1", borderRadius: "50%", background: "white", boxShadow: "0 3px 12px rgba(0,0,0,0.18)", display: "flex", alignItems: "center", justifyContent: "center", border: `2px solid ${color}22` }}>
            <p style={{ fontFamily: "var(--font-playfair)", fontStyle: "italic", fontSize: "clamp(8px, 1.8vw, 12px)", fontWeight: 700, color: color }}>BB</p>
          </div>
          <div style={{ position: "absolute", bottom: "8%", left: "4%", zIndex: 3, opacity: 0.55 }}>
            <svg width="clamp(14px,3vw,20px)" height="clamp(10px,2.2vw,14px)" viewBox="0 0 20 14" fill={color}>
              <ellipse cx="7" cy="5" rx="5" ry="3.5" transform="rotate(-15 7 5)"/>
              <ellipse cx="13" cy="5" rx="5" ry="3.5" transform="rotate(15 13 5)"/>
              <ellipse cx="10" cy="10" rx="3" ry="2"/>
            </svg>
          </div>
        </div>
      </a>
    );
  }

  if (plateStyle === "date_night") {
    const color = accentColor ?? "#D4A853";
    return (
      <a href={href ?? "#"} style={{ textDecoration: "none", display: "block" }}>
        <div style={{
          position: "relative",
          width: "100%",
          aspectRatio: "3/2",
          borderRadius: 18,
          overflow: "hidden",
          boxShadow: "0 14px 52px rgba(0,0,0,0.28)",
          background: "linear-gradient(160deg, #1A1412 0%, #2D1E18 50%, #1A1412 100%)",
        }}>
          <div style={{ position: "absolute", inset: 0, background: "rgba(255,255,255,0.08)", backgroundImage: "repeating-linear-gradient(0deg, rgba(255,255,255,0.04) 0px, rgba(255,255,255,0.04) 1px, transparent 1px, transparent 4px)" }} />
          <div style={{ position: "absolute", top: "10%", left: "5%", zIndex: 3 }}>
            <svg width="16" height="28" viewBox="0 0 10 20" fill="none">
              <rect x="4" y="8" width="2" height="12" rx="1" fill="#D4A853" opacity="0.8"/>
              <path d="M5 8 C3 6 2 3 3 1 C3.5 0 4 1 5 0 C6 1 6.5 0 7 1 C8 3 7 6 5 8Z" fill="#FF6B35"/>
            </svg>
          </div>
          <div style={{
            position: "absolute",
            top: "50%", left: "50%",
            transform: "translate(-50%, -50%)",
            width: "58%", aspectRatio: "1",
            borderRadius: "50%",
            background: "white",
            boxShadow: "0 8px 40px rgba(0,0,0,0.45), 0 0 80px rgba(212,168,83,0.15)",
            display: "flex", flexDirection: "column",
            alignItems: "center", justifyContent: "center",
            padding: "16px",
            zIndex: 2,
          }}>
            <div style={{ position: "absolute", inset: "10%", borderRadius: "50%", border: `1.5px solid ${color}18` }} />
            <p style={{ fontFamily: "var(--font-caveat)", fontStyle: "italic", fontSize: "clamp(11px, 2.5vw, 16px)", color: color, letterSpacing: "0.04em", marginBottom: 2 }}>
              {category || "bloom bay presents"}
            </p>
            <div style={{ width: "40%", height: 1, background: `${color}40`, marginBottom: 6 }} />
            <p style={{ fontFamily: "var(--font-playfair)", fontStyle: "italic", fontWeight: 900, fontSize: "clamp(18px, 4vw, 28px)", color: color, lineHeight: 1, textAlign: "center", letterSpacing: "-0.01em" }}>
              {title}
            </p>
            {hostName && (
              <p style={{ fontFamily: "var(--font-caveat)", fontSize: "clamp(10px, 2vw, 14px)", color: `${color}88`, marginTop: 3, textAlign: "center" }}>
                at {venueName}
                {venueCity && <><br/><em style={{ fontStyle: "italic" }}>{venueCity}</em></>}
              </p>
            )}
            <div style={{ width: "55%", height: 1, background: `${color}30`, margin: "8px 0" }} />
            <div style={{ display: "flex", gap: "clamp(8px, 2vw, 14px)", alignItems: "center" }}>
              {[["✳", date], ["|", time], ["|", venueCity || location]].map(([sep, val], i) => (
                <div key={i} style={{ display: "flex", alignItems: "center", gap: 4 }}>
                  {i > 0 && <span style={{ color: `${color}44`, fontSize: 10 }}>|</span>}
                  <p style={{ fontFamily: "var(--font-jost)", fontSize: "clamp(7px, 1.5vw, 9px)", fontWeight: 800, color: color, letterSpacing: "0.06em" }}>{val}</p>
                </div>
              ))}
            </div>
            {seatsLeft !== undefined && (
              <div style={{ marginTop: 6, background: `${color}12`, borderRadius: 999, padding: "3px 10px", border: `1px solid ${color}25` }}>
                <p style={{ fontFamily: "var(--font-caveat)", fontSize: "clamp(9px, 1.8vw, 12px)", color: color, fontWeight: 700 }}>
                  {seatsLeft} seats left ♡
                </p>
              </div>
            )}
            <p style={{ fontFamily: "var(--font-jost)", fontSize: "clamp(6px, 1.2vw, 8px)", fontWeight: 900, letterSpacing: "0.2em", color: `${color}55`, marginTop: 6 }}>·BB·</p>
          </div>
          <div style={{ position: "absolute", left: "3%", top: "30%", zIndex: 3, transform: "rotate(-3deg)" }}>
            <p style={{ fontFamily: "var(--font-caveat)", fontSize: "clamp(9px, 1.8vw, 12px)", color: color, lineHeight: 1.8, opacity: 0.8 }}>
              good food<br />better wine<br />better company ♡
            </p>
          </div>
          <div style={{ position: "absolute", bottom: "6%", right: "3%", zIndex: 3, width: "10%", aspectRatio: "1", borderRadius: "50%", background: "white", boxShadow: "0 3px 12px rgba(0,0,0,0.18)", display: "flex", alignItems: "center", justifyContent: "center", border: `2px solid ${color}22` }}>
            <p style={{ fontFamily: "var(--font-caveat)", fontStyle: "italic", fontSize: "clamp(6px, 1.2vw, 8px)", fontWeight: 700, color: color }}>Bloombay New York</p>
          </div>
        </div>
      </a>
    );
  }

  if (plateStyle === "birthday") {
    const color = accentColor ?? "#FF1F7D";
    return (
      <a href={href ?? "#"} style={{ textDecoration: "none", display: "block" }}>
        <div style={{
          position: "relative",
          width: "100%",
          aspectRatio: "3/2",
          borderRadius: 18,
          overflow: "hidden",
          boxShadow: "0 14px 52px rgba(0,0,0,0.28)",
          background: "radial-gradient(ellipse at 10% 10%, #FFC8E0 0%, #FFB3D9 60%, #FF99CC 100%)",
        }}>
          <div style={{ position: "absolute", inset: 0, background: "rgba(255,255,255,0.08)", backgroundImage: "repeating-linear-gradient(0deg, rgba(255,255,255,0.04) 0px, rgba(255,255,255,0.04) 1px, transparent 1px, transparent 4px)" }} />
          <div style={{
            position: "absolute",
            top: "50%", left: "50%",
            transform: "translate(-50%, -50%)",
            width: "62%", aspectRatio: "1",
            borderRadius: "50%",
            background: "white",
            boxShadow: "0 8px 40px rgba(0,0,0,0.22), inset 0 0 0 3px rgba(255,31,125,0.08), inset 0 0 0 8px rgba(255,31,125,0.04)",
            display: "flex", flexDirection: "column",
            alignItems: "center", justifyContent: "center",
            padding: "16px",
            zIndex: 2,
          }}>
            <div style={{ position: "absolute", inset: "10%", borderRadius: "50%", border: `1.5px solid ${color}18` }} />
            {[{top:"12%",left:"50%"},{top:"50%",left:"12%"},{top:"50%",left:"82%"},{top:"82%",left:"50%"}].map((pos, i) => (
              <svg key={i} style={{ position: "absolute", top: pos.top, left: pos.left, transform: "translate(-50%,-50%)" }} width="14" height="14" viewBox="0 0 14 14">
                <circle cx="7" cy="7" r="2" fill="#FF1F7D"/>
                {[0,72,144,216,288].map(a => {
                  const rad = a * Math.PI / 180;
                  return <ellipse key={a} cx={7 + 3.5*Math.cos(rad)} cy={7 + 3.5*Math.sin(rad)} rx="2" ry="1.2" fill="#FF1F7D" opacity="0.7" transform={`rotate(${a} ${7 + 3.5*Math.cos(rad)} ${7 + 3.5*Math.sin(rad)})`}/>;
                })}
              </svg>
            ))}
            <p style={{ fontFamily: "var(--font-caveat)", fontStyle: "italic", fontSize: "clamp(11px, 2.5vw, 16px)", color: color, letterSpacing: "0.04em", marginBottom: 2 }}>
              {category || "bloom bay presents"}
            </p>
            <div style={{ width: "40%", height: 1, background: `${color}40`, marginBottom: 6 }} />
            <p style={{ fontFamily: "var(--font-playfair)", fontStyle: "italic", fontWeight: 900, fontSize: "clamp(18px, 4vw, 28px)", color: color, lineHeight: 1, textAlign: "center", letterSpacing: "-0.01em" }}>
              {title}
            </p>
            {hostName && (
              <p style={{ fontFamily: "var(--font-caveat)", fontSize: "clamp(10px, 2vw, 14px)", color: `${color}88`, marginTop: 3, textAlign: "center" }}>
                at {venueName}
                {venueCity && <><br/><em style={{ fontStyle: "italic" }}>{venueCity}</em></>}
              </p>
            )}
            <div style={{ width: "55%", height: 1, background: `${color}30`, margin: "8px 0" }} />
            <div style={{ display: "flex", gap: "clamp(8px, 2vw, 14px)", alignItems: "center" }}>
              {[["✳", date], ["|", time], ["|", venueCity || location]].map(([sep, val], i) => (
                <div key={i} style={{ display: "flex", alignItems: "center", gap: 4 }}>
                  {i > 0 && <span style={{ color: `${color}44`, fontSize: 10 }}>|</span>}
                  <p style={{ fontFamily: "var(--font-jost)", fontSize: "clamp(7px, 1.5vw, 9px)", fontWeight: 800, color: color, letterSpacing: "0.06em" }}>{val}</p>
                </div>
              ))}
            </div>
            {seatsLeft !== undefined && (
              <div style={{ marginTop: 6, background: `${color}12`, borderRadius: 999, padding: "3px 10px", border: `1px solid ${color}25` }}>
                <p style={{ fontFamily: "var(--font-caveat)", fontSize: "clamp(9px, 1.8vw, 12px)", color: color, fontWeight: 700 }}>
                  {seatsLeft} seats left ♡
                </p>
              </div>
            )}
            <p style={{ fontFamily: "var(--font-jost)", fontSize: "clamp(6px, 1.2vw, 8px)", fontWeight: 900, letterSpacing: "0.2em", color: `${color}55`, marginTop: 6 }}>·BB·</p>
          </div>
          {imageUrl && (
            <div style={{
              position: "absolute", top: "8%", right: "5%", zIndex: 4,
              transform: "rotate(4deg)",
              background: "white", padding: "6px 6px 18px",
              boxShadow: "0 6px 22px rgba(0,0,0,0.3)",
              width: "28%",
            }}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={imageUrl} alt="" style={{ width: "100%", aspectRatio: "1", objectFit: "cover", display: "block" }} />
              <p style={{ fontFamily: "var(--font-caveat)", fontSize: "clamp(8px, 1.5vw, 11px)", color: "rgba(0,0,0,0.45)", textAlign: "center", marginTop: 4 }}>
                see you there! ♡
              </p>
            </div>
          )}
          <div style={{ position: "absolute", left: "3%", top: "30%", zIndex: 3, transform: "rotate(-3deg)" }}>
            <p style={{ fontFamily: "var(--font-caveat)", fontSize: "clamp(9px, 1.8vw, 12px)", color: color, lineHeight: 1.8, opacity: 0.8 }}>
              good food<br />better wine<br />better company ♡
            </p>
          </div>
          <div style={{ position: "absolute", bottom: "6%", right: "3%", zIndex: 3, width: "10%", aspectRatio: "1", borderRadius: "50%", background: "white", boxShadow: "0 3px 12px rgba(0,0,0,0.18)", display: "flex", alignItems: "center", justifyContent: "center", border: `2px solid ${color}22` }}>
            <p style={{ fontFamily: "var(--font-playfair)", fontStyle: "italic", fontSize: "clamp(8px, 1.8vw, 12px)", fontWeight: 700, color: color }}>BB</p>
          </div>
          <div style={{ position: "absolute", bottom: "18%", left: "4%", zIndex: 3, display: "flex", gap: 3 }}>
            {[0,1,2].map(i => (
              <svg key={i} width="12" height="16" viewBox="0 0 12 16">
                <circle cx="6" cy="5" r="4" fill="#FF1F7D" opacity="0.8"/>
                <line x1="6" y1="9" x2="6" y2="15" stroke="#4CAF50" strokeWidth="1"/>
              </svg>
            ))}
          </div>
          <div style={{ position: "absolute", bottom: "8%", left: "4%", zIndex: 3 }}>
            <p style={{ fontFamily: "var(--font-caveat)", fontSize: "clamp(9px, 1.8vw, 12px)", color: "#FF1F7D", fontStyle: "italic" }}>Girls Night ♡</p>
          </div>
        </div>
      </a>
    );
  }

  const classicAccent = accentColor ?? "#9B2335";

  return (
    <a href={href ?? "#"} style={{ textDecoration: "none", display: "block" }}>
      <div style={{
        position: "relative",
        width: "100%",
        aspectRatio: "3/2",
        borderRadius: 18,
        overflow: "hidden",
        boxShadow: "0 14px 52px rgba(0,0,0,0.28)",
        background: `repeating-linear-gradient(
          90deg,
          ${classicAccent} 0px,
          ${classicAccent} 28px,
          white 28px,
          white 56px
        )`,
      }}>

        <div style={{ position: "absolute", inset: 0, background: "rgba(255,255,255,0.08)", backgroundImage: "repeating-linear-gradient(0deg, rgba(255,255,255,0.04) 0px, rgba(255,255,255,0.04) 1px, transparent 1px, transparent 4px)" }} />

        <div style={{
          position: "absolute",
          top: "50%", left: "50%",
          transform: "translate(-50%, -50%)",
          width: "62%", aspectRatio: "1",
          borderRadius: "50%",
          background: "white",
          boxShadow: "0 8px 40px rgba(0,0,0,0.22), inset 0 0 0 3px rgba(155,35,53,0.08), inset 0 0 0 8px rgba(155,35,53,0.04)",
          display: "flex", flexDirection: "column",
          alignItems: "center", justifyContent: "center",
          padding: "16px",
          zIndex: 2,
        }}>
          <div style={{ position: "absolute", inset: "10%", borderRadius: "50%", border: `1.5px solid ${classicAccent}18` }} />

          <p style={{ fontFamily: "var(--font-caveat)", fontStyle: "italic", fontSize: "clamp(11px, 2.5vw, 16px)", color: classicAccent, letterSpacing: "0.04em", marginBottom: 2 }}>
            {category || "bloom bay presents"}
          </p>
          <div style={{ width: "40%", height: 1, background: `${classicAccent}40`, marginBottom: 6 }} />

          <p style={{ fontFamily: "var(--font-playfair)", fontStyle: "italic", fontWeight: 900, fontSize: "clamp(18px, 4vw, 28px)", color: classicAccent, lineHeight: 1, textAlign: "center", letterSpacing: "-0.01em" }}>
            {title}
          </p>

          {hostName && (
            <p style={{ fontFamily: "var(--font-caveat)", fontSize: "clamp(10px, 2vw, 14px)", color: `${classicAccent}88`, marginTop: 3, textAlign: "center" }}>
              at {venueName}
              {venueCity && <><br/><em style={{ fontStyle: "italic" }}>{venueCity}</em></>}
            </p>
          )}

          <div style={{ width: "55%", height: 1, background: `${classicAccent}30`, margin: "8px 0" }} />

          <div style={{ display: "flex", gap: "clamp(8px, 2vw, 14px)", alignItems: "center" }}>
            {[["✳", date], ["|", time], ["|", venueCity || location]].map(([sep, val], i) => (
              <div key={i} style={{ display: "flex", alignItems: "center", gap: 4 }}>
                {i > 0 && <span style={{ color: `${classicAccent}44`, fontSize: 10 }}>|</span>}
                <p style={{ fontFamily: "var(--font-jost)", fontSize: "clamp(7px, 1.5vw, 9px)", fontWeight: 800, color: classicAccent, letterSpacing: "0.06em" }}>{val}</p>
              </div>
            ))}
          </div>

          {seatsLeft !== undefined && (
            <div style={{ marginTop: 6, background: `${classicAccent}12`, borderRadius: 999, padding: "3px 10px", border: `1px solid ${classicAccent}25` }}>
              <p style={{ fontFamily: "var(--font-caveat)", fontSize: "clamp(9px, 1.8vw, 12px)", color: classicAccent, fontWeight: 700 }}>
                {seatsLeft} seats left ♡
              </p>
            </div>
          )}

          <p style={{ fontFamily: "var(--font-jost)", fontSize: "clamp(6px, 1.2vw, 8px)", fontWeight: 900, letterSpacing: "0.2em", color: `${classicAccent}55`, marginTop: 6 }}>·BB·</p>
        </div>

        {imageUrl && (
          <div style={{
            position: "absolute", top: "8%", right: "5%", zIndex: 4,
            transform: "rotate(4deg)",
            background: "white", padding: "6px 6px 18px",
            boxShadow: "0 6px 22px rgba(0,0,0,0.3)",
            width: "28%",
          }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={imageUrl} alt="" style={{ width: "100%", aspectRatio: "1", objectFit: "cover", display: "block" }} />
            <p style={{ fontFamily: "var(--font-caveat)", fontSize: "clamp(8px, 1.5vw, 11px)", color: "rgba(0,0,0,0.45)", textAlign: "center", marginTop: 4 }}>
              see you there! ♡
            </p>
          </div>
        )}

        <div style={{ position: "absolute", left: "3%", top: "30%", zIndex: 3, transform: "rotate(-3deg)" }}>
          <p style={{ fontFamily: "var(--font-caveat)", fontSize: "clamp(9px, 1.8vw, 12px)", color: classicAccent, lineHeight: 1.8, opacity: 0.8 }}>
            good food<br />better wine<br />better company ♡
          </p>
        </div>

        <div style={{ position: "absolute", bottom: "6%", right: "3%", zIndex: 3, width: "10%", aspectRatio: "1", borderRadius: "50%", background: "white", boxShadow: "0 3px 12px rgba(0,0,0,0.18)", display: "flex", alignItems: "center", justifyContent: "center", border: `2px solid ${classicAccent}22` }}>
          <p style={{ fontFamily: "var(--font-playfair)", fontStyle: "italic", fontSize: "clamp(8px, 1.8vw, 12px)", fontWeight: 700, color: classicAccent }}>BB</p>
        </div>

        <div style={{ position: "absolute", bottom: "8%", left: "4%", zIndex: 3, opacity: 0.55 }}>
          <svg width="clamp(14px,3vw,20px)" height="clamp(10px,2.2vw,14px)" viewBox="0 0 20 14" fill={classicAccent}>
            <ellipse cx="7" cy="5" rx="5" ry="3.5" transform="rotate(-15 7 5)"/>
            <ellipse cx="13" cy="5" rx="5" ry="3.5" transform="rotate(15 13 5)"/>
            <ellipse cx="10" cy="10" rx="3" ry="2"/>
          </svg>
        </div>
      </div>
    </a>
  );
}
