"use client";
import { type TimeOfDay } from "./time-wrapper";

const SKY: Record<TimeOfDay, string> = {
  morning: `linear-gradient(180deg,
    #4A8CC0 0%, #72B4DC 15%, #A4D2EE 32%,
    #FFD090 50%, #FFA868 64%, #FFCCA0 76%,
    #FFF0E8 88%, #FDFAF5 100%)`,
  afternoon: `linear-gradient(180deg,
    #1464A0 0%, #2C88BC 22%, #68B4D8 45%,
    #B4D8EE 65%, #E4F2F9 82%, #FFF5F8 100%)`,
  evening: `linear-gradient(180deg,
    #0A0806 0%, #160C06 10%, #2C1408 22%,
    #481A0A 33%, #6E2A0C 46%, #96421A 57%,
    #AE5018 67%, #C25C12 73%, #CC6010 79%,
    #A84A0E 85%, #5C2006 92%, #160A04 100%)`,
  night: `linear-gradient(180deg,
    #040302 0%, #060504 25%,
    #0A0806 55%, #0C0A08 100%)`,
};

function Stars() {
  const pts: Array<[number, number, number, number]> = [
    [45,12,1,0.8],[120,28,0.7,0.6],[200,8,1.1,0.9],[310,20,0.8,0.7],
    [420,14,0.9,0.8],[530,6,1,0.9],[640,22,0.7,0.6],[720,10,1.1,0.8],
    [810,18,0.8,0.7],[920,5,1,0.9],[1000,24,0.9,0.8],[1100,12,0.7,0.7],
    [1200,8,1.1,0.9],[1310,20,0.8,0.6],[1380,14,1,0.8],
    [80,45,0.6,0.5],[180,38,1,0.8],[280,52,0.7,0.6],[380,34,0.9,0.9],
    [480,48,0.8,0.7],[580,40,1.1,0.8],[680,55,0.6,0.6],[780,38,0.9,0.9],
    [880,50,0.8,0.7],[980,42,1,0.8],[1080,35,0.7,0.6],[1180,48,1.1,0.9],
    [1280,40,0.8,0.7],[60,70,0.6,0.5],[160,65,1,0.7],[260,75,0.7,0.6],
    [360,60,0.9,0.8],[460,72,0.8,0.7],[560,68,1.1,0.9],[660,78,0.6,0.5],
    [760,62,0.9,0.8],[860,70,0.8,0.7],[960,64,1,0.9],[1060,76,0.7,0.6],
    [1160,68,1.1,0.8],[1260,72,0.8,0.7],[1360,65,0.9,0.6],
    [140,90,0.6,0.5],[340,88,0.8,0.7],[540,92,1,0.8],
    [740,86,0.7,0.6],[940,90,0.9,0.8],[1140,88,0.6,0.5],[1340,92,0.8,0.7],
  ];
  return (
    <svg style={{ position:"absolute", inset:0, width:"100%", height:"45%", pointerEvents:"none" }}
      viewBox="0 0 1400 200" preserveAspectRatio="xMidYMid slice">
      {pts.map(([cx,cy,r,op], i) => (
        <circle key={i} cx={cx} cy={cy} r={r} fill="white" opacity={op} />
      ))}
    </svg>
  );
}

function CitySkyline({ tod }: { tod: TimeOfDay }) {
  const isNight  = tod === "evening" || tod === "night";
  const far  = isNight ? "rgba(12,7,3,0.62)"  : "rgba(100,78,58,0.28)";
  const near = isNight ? "rgba(6,4,2,0.96)"   : "rgba(48,34,22,0.50)";
  const win  = "rgba(255,210,88,0.9)";

  return (
    <svg viewBox="0 0 1400 280" xmlns="http://www.w3.org/2000/svg"
      style={{ width:"100%", display:"block" }} preserveAspectRatio="xMidYMax meet">

      {/* ── FAR BUILDINGS (ground y=215) ───── */}
      <g fill={far}>
        <rect x="0"    y="147" width="100" height="68"/>
        <rect x="98"   y="163" width="78"  height="52"/>
        <rect x="172"  y="127" width="58"  height="88"/>
        <rect x="226"  y="168" width="82"  height="47"/>
        {/* Setback tower */}
        <rect x="304"  y="128" width="78"  height="87"/>
        <rect x="308"  y="107" width="70"  height="22"/>
        <rect x="313"  y="90"  width="60"  height="18"/>
        <rect x="378"  y="143" width="48"  height="72"/>
        <rect x="422"  y="157" width="118" height="58"/>
        <rect x="536"  y="131" width="65"  height="84"/>
        <rect x="597"  y="153" width="38"  height="62"/>
        {/* Tall setback */}
        <rect x="631"  y="140" width="108" height="75"/>
        <rect x="636"  y="117" width="98"  height="24"/>
        <rect x="641"  y="100" width="88"  height="18"/>
        <rect x="735"  y="143" width="58"  height="72"/>
        <rect x="789"  y="165" width="82"  height="50"/>
        <rect x="867"  y="129" width="72"  height="86"/>
        <rect x="935"  y="155" width="48"  height="60"/>
        <rect x="979"  y="171" width="92"  height="44"/>
        <rect x="1067" y="127" width="68"  height="88"/>
        <rect x="1131" y="147" width="75"  height="68"/>
        <rect x="1202" y="127" width="62"  height="88"/>
        <rect x="1260" y="163" width="78"  height="52"/>
        <rect x="1334" y="147" width="66"  height="68"/>
      </g>

      {/* ── WATER TOWERS ─── */}
      <g fill={far}>
        <rect x="338" y="83"  width="9" height="10"/>
        <path d="M334,83 Q343,76 352,83 Z"/>
        <rect x="672" y="93"  width="9" height="8"/>
        <path d="M668,93 Q677,87 685,93 Z"/>
        <rect x="873" y="119" width="9" height="10"/>
        <path d="M869,119 Q878,112 887,119 Z"/>
      </g>

      {/* ── NEAR BUILDINGS (ground y=280) ─── */}
      <g fill={near}>
        <rect x="0"    y="180" width="88"  height="100"/>
        <rect x="84"   y="202" width="65"  height="78"/>
        {/* Tall setback */}
        <rect x="144"  y="175" width="80"  height="105"/>
        <rect x="148"  y="158" width="72"  height="18"/>
        <rect x="152"  y="143" width="64"  height="16"/>
        <rect x="218"  y="222" width="58"  height="58"/>
        <rect x="272"  y="168" width="95"  height="112"/>
        <rect x="277"  y="150" width="85"  height="19"/>
        <rect x="362"  y="212" width="60"  height="68"/>
        {/* Tall setback */}
        <rect x="416"  y="180" width="75"  height="100"/>
        <rect x="420"  y="162" width="67"  height="19"/>
        <rect x="424"  y="148" width="59"  height="15"/>
        <rect x="486"  y="198" width="52"  height="82"/>
        <rect x="532"  y="188" width="70"  height="92"/>
        <rect x="597"  y="172" width="85"  height="108"/>
        <rect x="602"  y="155" width="75"  height="18"/>
        <rect x="677"  y="218" width="60"  height="62"/>
        {/* Tall setback */}
        <rect x="731"  y="172" width="88"  height="108"/>
        <rect x="735"  y="155" width="80"  height="18"/>
        <rect x="739"  y="140" width="72"  height="16"/>
        <rect x="813"  y="202" width="65"  height="78"/>
        <rect x="872"  y="176" width="76"  height="104"/>
        <rect x="942"  y="218" width="58"  height="62"/>
        <rect x="994"  y="168" width="85"  height="112"/>
        <rect x="999"  y="150" width="75"  height="19"/>
        <rect x="1073" y="202" width="70"  height="78"/>
        <rect x="1137" y="182" width="75"  height="98"/>
        <rect x="1206" y="205" width="65"  height="75"/>
        {/* Tall setback */}
        <rect x="1264" y="178" width="88"  height="102"/>
        <rect x="1268" y="160" width="80"  height="19"/>
        <rect x="1346" y="198" width="54"  height="82"/>
      </g>

      {/* ── WINDOW LIGHTS (evening / night) ── */}
      {isNight && (
        <g fill={win}>
          {/* Building x=144 */}
          {([[155,183],[170,183],[185,183],[155,200],[185,200],[170,200],
            [155,217],[170,217],[155,234],[185,217]] as [number,number][]).map(([x,y],i)=>(
            <rect key={`a${i}`} x={x} y={y} width="8" height="10" rx="1" opacity={0.4+((i*17)%5)*0.12}/>
          ))}
          {/* Building x=272 */}
          {([[282,175],[298,175],[314,175],[282,192],[298,192],
            [314,192],[282,209],[298,209],[330,175],[314,209]] as [number,number][]).map(([x,y],i)=>(
            <rect key={`b${i}`} x={x} y={y} width="8" height="10" rx="1" opacity={0.4+((i*23)%5)*0.12}/>
          ))}
          {/* Building x=416 */}
          {([[427,168],[443,168],[459,168],[427,185],[459,185],
            [443,185],[427,202],[443,202],[475,168],[459,202]] as [number,number][]).map(([x,y],i)=>(
            <rect key={`c${i}`} x={x} y={y} width="8" height="10" rx="1" opacity={0.4+((i*31)%5)*0.12}/>
          ))}
          {/* Building x=597 */}
          {([[607,179],[623,179],[639,179],[607,196],[623,196],
            [639,196],[607,213],[639,213],[655,179],[655,196]] as [number,number][]).map(([x,y],i)=>(
            <rect key={`d${i}`} x={x} y={y} width="8" height="10" rx="1" opacity={0.4+((i*19)%5)*0.12}/>
          ))}
          {/* Building x=731 */}
          {([[742,162],[758,162],[774,162],[742,179],[758,179],
            [774,179],[742,196],[774,196],[790,162],[758,196]] as [number,number][]).map(([x,y],i)=>(
            <rect key={`e${i}`} x={x} y={y} width="8" height="10" rx="1" opacity={0.4+((i*29)%5)*0.12}/>
          ))}
          {/* Building x=994 */}
          {([[1004,175],[1020,175],[1036,175],[1004,192],[1020,192],
            [1036,192],[1004,209],[1036,209],[1052,175],[1052,192]] as [number,number][]).map(([x,y],i)=>(
            <rect key={`f${i}`} x={x} y={y} width="8" height="10" rx="1" opacity={0.4+((i*37)%5)*0.12}/>
          ))}
          {/* Building x=1264 */}
          {([[1275,185],[1291,185],[1307,185],[1275,202],[1291,202],
            [1307,202],[1275,219],[1307,219],[1323,185],[1323,202]] as [number,number][]).map(([x,y],i)=>(
            <rect key={`g${i}`} x={x} y={y} width="8" height="10" rx="1" opacity={0.4+((i*41)%5)*0.12}/>
          ))}
        </g>
      )}

      <rect x="0" y="272" width="1400" height="8" fill={near}/>
    </svg>
  );
}

export function CityScene({ tod }: { tod: TimeOfDay }) {
  const isNight   = tod === "evening" || tod === "night";
  const isEvening = tod === "evening";

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden" style={{ zIndex: 0 }}>
      {/* Sky */}
      <div className="absolute inset-0" style={{ background: SKY[tod] }}/>

      {/* Morning sun */}
      {tod === "morning" && (
        <div className="absolute pointer-events-none" style={{
          right:"22%", top:"18%", width:"200px", height:"200px",
          background:"radial-gradient(circle, rgba(255,200,80,0.48) 0%, rgba(255,160,60,0.2) 40%, transparent 70%)",
          borderRadius:"50%",
        }}/>
      )}

      {/* Evening sunset glow */}
      {isEvening && (
        <>
          <div className="absolute pointer-events-none" style={{
            right:"15%", bottom:"26%", width:"280px", height:"280px",
            background:"radial-gradient(circle, rgba(255,120,20,0.7) 0%, rgba(200,50,10,0.32) 38%, transparent 70%)",
            borderRadius:"50%",
          }}/>
          <div className="absolute pointer-events-none" style={{
            left:0, right:0, bottom:"18%", height:"130px",
            background:"linear-gradient(transparent, rgba(160,44,12,0.28) 60%, rgba(120,30,8,0.38) 100%)",
          }}/>
        </>
      )}

      {/* Moon */}
      {tod === "night" && (
        <div className="absolute pointer-events-none" style={{
          right:"18%", top:"12%", width:"44px", height:"44px",
          background:"radial-gradient(circle, rgba(240,232,218,0.88) 0%, rgba(220,210,195,0.45) 55%, transparent 70%)",
          borderRadius:"50%",
          boxShadow:"0 0 28px rgba(240,220,180,0.12)",
        }}/>
      )}

      {/* Stars */}
      {isNight && <Stars/>}

      {/* City skyline */}
      <div className="absolute bottom-0 left-0 right-0" style={{ height:"280px" }}>
        <CitySkyline tod={tod}/>
      </div>

      {/* Ground shadow */}
      <div className="absolute bottom-0 left-0 right-0 pointer-events-none" style={{
        height:"36px",
        background: isNight
          ? "linear-gradient(transparent, rgba(6,4,2,0.65))"
          : "linear-gradient(transparent, rgba(0,0,0,0.07))",
      }}/>
    </div>
  );
}
