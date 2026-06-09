"use client";

import React, { useState } from "react";
import Link from "next/link";

const PINK  = "#FF1F7D";
const DARK  = "#1C1B1C";
const CREAM = "#F6F1EB";
const PAPER = "#FEFCF7";
const PAPER_TEX = `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='200'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='4' stitchTiles='stitch' result='t'/%3E%3CfeColorMatrix type='saturate' values='0' in='t'/%3E%3C/filter%3E%3Crect width='200' height='200' fill='%23000' filter='url(%23n)' opacity='0.05'/%3E%3C/svg%3E")`;

type CityCategory = "landing" | "eats" | "go" | "solo" | "favorites" | "trending";

/* ── keyframe injection ────────────────────────────────────────── */
const CSS = `
@keyframes trainRoll {
  0%   { transform: translateX(-140px); }
  100% { transform: translateX(calc(100vw + 60px)); }
}
@keyframes carRoll {
  0%   { transform: translateX(calc(100vw + 60px)) scaleX(-1); }
  100% { transform: translateX(-140px) scaleX(-1); }
}
@keyframes bikeRide {
  0%   { transform: translateX(-80px); }
  100% { transform: translateX(calc(100vw + 40px)); }
}
@keyframes cloudDrift {
  0%   { transform: translateX(0); }
  100% { transform: translateX(60px); }
}
`;

/* ── Mini SVG vehicles ─────────────────────────────────────────── */

function SubwayCar({ y = 0, color = "rgba(255,255,255,0.9)" }: { y?: number; color?: string }) {
  return (
    <g transform={`translate(0,${y})`}>
      <rect x="0"  y="0"  width="120" height="28" rx="4" fill={color} stroke="rgba(0,0,0,0.08)" strokeWidth="0.8"/>
      <rect x="4"  y="0"  width="112" height="7"  rx="3" fill="rgba(0,0,0,0.07)"/>
      {[12,30,48,66,84,102].map((x,i)=>(
        <rect key={i} x={x} y="8" width="14" height="9" rx="1.5" fill="rgba(255,220,100,0.7)" stroke="rgba(0,0,0,0.06)" strokeWidth="0.5"/>
      ))}
      <rect x="50" y="14" width="20" height="14" rx="0.5" fill="rgba(0,0,0,0.08)"/>
      <circle cx="20"  cy="28" r="5.5" fill="rgba(0,0,0,0.15)" stroke={color} strokeWidth="1"/>
      <circle cx="100" cy="28" r="5.5" fill="rgba(0,0,0,0.15)" stroke={color} strokeWidth="1"/>
      <rect x="120" y="8" width="8" height="12" rx="1" fill={color} opacity={0.7}/>
    </g>
  );
}

function TaxiCar() {
  return (
    <g>
      <rect x="4"  y="10" width="46" height="18" rx="3" fill="#F5C518"/>
      <rect x="10" y="4"  width="30" height="14" rx="3" fill="#F5C518"/>
      <rect x="12" y="5"  width="12" height="11" rx="1" fill="rgba(150,210,255,0.7)"/>
      <rect x="26" y="5"  width="12" height="11" rx="1" fill="rgba(150,210,255,0.7)"/>
      <circle cx="13" cy="28" r="5" fill="#333"/>
      <circle cx="40" cy="28" r="5" fill="#333"/>
      <circle cx="13" cy="28" r="2" fill="#888"/>
      <circle cx="40" cy="28" r="2" fill="#888"/>
      <rect x="0" y="18" width="4" height="6" rx="1" fill="rgba(255,240,100,0.8)"/>
      <rect x="50" y="18" width="4" height="4" rx="1" fill="rgba(255,80,80,0.7)"/>
    </g>
  );
}

function Bicycle() {
  return (
    <g>
      <circle cx="8"  cy="14" r="7" fill="none" stroke="#555" strokeWidth="1.5"/>
      <circle cx="28" cy="14" r="7" fill="none" stroke="#555" strokeWidth="1.5"/>
      <path d="M8 14 L18 6 L28 14" fill="none" stroke={PINK} strokeWidth="1.5"/>
      <path d="M18 6 L18 14 L28 14" fill="none" stroke="#555" strokeWidth="1.2"/>
      <circle cx="18" cy="14" r="2" fill={PINK}/>
    </g>
  );
}

/* ── Band scenes (horizontal building cross-sections) ─────────── */

/* EATS — subway station interior: tunnel arch, platform, train tracks */
function EatsScene({ width }: { width: number }) {
  return (
    <svg viewBox={`0 0 ${width} 130`} style={{ display: "block", width: "100%", height: "100%" }} preserveAspectRatio="none">
      {/* sky/ceiling */}
      <rect x="0" y="0" width={width} height="130" fill="#f0e8dc"/>
      {/* tunnel arch tiles */}
      {Array.from({length: Math.ceil(width/32)}).map((_,i)=>(
        <rect key={i} x={i*32} y="0" width="30" height="90" rx="0" fill="none" stroke="rgba(0,0,0,0.06)" strokeWidth="1"/>
      ))}
      {/* arch curve */}
      <path d={`M0 90 Q${width/2} 30 ${width} 90`} fill="none" stroke="rgba(0,0,0,0.08)" strokeWidth="2"/>
      {/* platform */}
      <rect x="0" y="90" width={width} height="10" fill="rgba(0,0,0,0.1)"/>
      <rect x="0" y="100" width={width} height="30" fill="#d4cfc8"/>
      {/* platform tiles */}
      {Array.from({length: Math.ceil(width/20)}).map((_,i)=>(
        <rect key={i} x={i*20} y="100" width="19" height="30" fill="none" stroke="rgba(0,0,0,0.05)" strokeWidth="0.5"/>
      ))}
      {/* tracks */}
      <line x1="0" y1="96" x2={width} y2="96" stroke="rgba(0,0,0,0.15)" strokeWidth="1.2"/>
      <line x1="0" y1="99" x2={width} y2="99" stroke="rgba(0,0,0,0.15)" strokeWidth="1.2"/>
      {Array.from({length: Math.ceil(width/24)}).map((_,i)=>(
        <rect key={i} x={i*24+2} y="93" width="10" height="8" fill="rgba(0,0,0,0.08)"/>
      ))}
      {/* support pillars */}
      {[60,180,300,420,540].filter(x=>x<width).map((x,i)=>(
        <rect key={i} x={x} y="0" width="8" height="130" fill="rgba(180,160,140,0.35)" stroke="rgba(0,0,0,0.04)" strokeWidth="0.5"/>
      ))}
      {/* platform edge yellow line */}
      <line x1="0" y1="91" x2={width} y2="91" stroke="rgba(255,200,0,0.6)" strokeWidth="2" strokeDasharray="8 4"/>
      {/* overhead signs */}
      {[90, 270, 450].filter(x=>x<width-40).map((x,i)=>(
        <g key={i}>
          <rect x={x} y="8" width="48" height="18" rx="2" fill="rgba(0,80,160,0.7)"/>
          <rect x={x+2} y="26" width="2" height="12" fill="rgba(0,0,0,0.2)"/>
          <rect x={x+44} y="26" width="2" height="12" fill="rgba(0,0,0,0.2)"/>
        </g>
      ))}
    </svg>
  );
}

/* GO — Manhattan skyscraper tops: looking horizontally across the skyline */
function GoScene({ width }: { width: number }) {
  const bldgs = [
    {x:0,   w:55, h:130, floors:14, dark:"#c8d8e8"},
    {x:58,  w:40, h:110, floors:12, dark:"#d0c8c0"},
    {x:100, w:30, h:130, floors:15, dark:"#c0ccd8"},
    {x:132, w:18, h:130, floors:18, dark:"#c8c8d0"},
    {x:152, w:35, h:120, floors:13, dark:"#ccd4c0"},
    {x:190, w:50, h:130, floors:14, dark:"#d0c8c8"},
    {x:243, w:28, h:125, floors:15, dark:"#c8d0d8"},
    {x:274, w:42, h:130, floors:14, dark:"#d4ccc0"},
    {x:319, w:25, h:110, floors:12, dark:"#c0ccd4"},
    {x:347, w:55, h:130, floors:14, dark:"#ccc8d0"},
  ].filter(b=>b.x<width);

  return (
    <svg viewBox={`0 0 ${width} 130`} style={{ display: "block", width: "100%", height: "100%" }} preserveAspectRatio="xMidYMid slice">
      {/* sky gradient */}
      <defs>
        <linearGradient id="sky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#dce8f5"/>
          <stop offset="100%" stopColor="#f0e8dc"/>
        </linearGradient>
      </defs>
      <rect x="0" y="0" width={width} height="130" fill="url(#sky)"/>
      {/* buildings */}
      {bldgs.map((b,i)=>(
        <g key={i}>
          <rect x={b.x} y={130-b.h} width={b.w} height={b.h} fill={b.dark} stroke="rgba(0,0,0,0.05)" strokeWidth="0.5"/>
          {/* windows grid */}
          {Array.from({length:b.floors}).map((_,row)=>
            Array.from({length:Math.floor(b.w/9)}).map((_,col)=>{
              const lit = (row*7+col*3+i*11)%5 !== 0;
              return (
                <rect key={`${row}-${col}`}
                  x={b.x+2+col*9} y={130-b.h+4+row*8}
                  width="6" height="5" rx="0.5"
                  fill={lit ? "rgba(255,240,160,0.65)" : "rgba(0,0,0,0.1)"}
                />
              );
            })
          )}
          {/* spire for center building */}
          {i===3 && <rect x={b.x+b.w/2-1} y={0} width="2" height={130-b.h} fill={b.dark}/>}
          {/* water tower */}
          {i%3===1 && b.x+20<width && (
            <g>
              <rect x={b.x+b.w/2-5} y={130-b.h-16} width="10" height="12" rx="2 2 0 0" fill="rgba(0,0,0,0.18)" stroke="rgba(0,0,0,0.1)" strokeWidth="0.5"/>
              <rect x={b.x+b.w/2-1} y={130-b.h-20} width="2" height="6" fill="rgba(0,0,0,0.2)"/>
            </g>
          )}
        </g>
      ))}
      {/* ground */}
      <rect x="0" y="125" width={width} height="5" fill="rgba(0,0,0,0.08)"/>
    </svg>
  );
}

/* SOLO — brownstone row: facades with stoops */
function SoloScene({ width }: { width: number }) {
  const count = Math.ceil(width / 80);
  const colors = ["#d4b8a0","#c8a898","#bca8c0","#a8b8c4","#c0b8a0","#c8b4a4","#b8b0c4"];
  return (
    <svg viewBox={`0 0 ${width} 130`} style={{ display: "block", width: "100%", height: "100%" }} preserveAspectRatio="xMidYMid slice">
      <rect x="0" y="0" width={width} height="130" fill="#dce4f0"/>
      {/* brownstones */}
      {Array.from({length:count}).map((_,i)=>{
        const x = i*80;
        const h = 70 + (i%3)*15;
        const c = colors[i%colors.length];
        return (
          <g key={i}>
            <rect x={x} y={130-h} width="78" height={h} fill={c} stroke="rgba(0,0,0,0.07)" strokeWidth="0.5"/>
            {/* cornice */}
            <rect x={x} y={130-h} width="78" height="5" fill="rgba(0,0,0,0.12)"/>
            <rect x={x} y={130-h+5} width="78" height="2" fill="rgba(0,0,0,0.06)"/>
            {/* windows — 2 rows of 2 */}
            {[0,1].map(col=>[0,1].map(row=>{
              const lit = (i+col+row)%3!==0;
              return (
                <g key={`${col}-${row}`}>
                  <rect x={x+8+col*32} y={130-h+12+row*20} width="20" height="15" rx="10 10 0 0"
                    fill={lit?"rgba(255,240,160,0.6)":"rgba(0,0,0,0.12)"} stroke="rgba(0,0,0,0.1)" strokeWidth="0.5"/>
                  {/* shutter lines */}
                  {[3,6,9,12].map(ly=>(
                    <line key={ly} x1={x+8+col*32} y1={130-h+12+row*20+ly} x2={x+28+col*32} y2={130-h+12+row*20+ly}
                      stroke="rgba(0,0,0,0.07)" strokeWidth="0.5"/>
                  ))}
                </g>
              );
            }))}
            {/* door */}
            <rect x={x+26} y={130-h+46} width="26" height={h-46} rx="13 13 0 0"
              fill="rgba(80,40,20,0.6)" stroke="rgba(0,0,0,0.15)" strokeWidth="0.7"/>
            {/* stoop steps */}
            <rect x={x+20} y={120} width="38" height="5"  rx="1" fill="rgba(0,0,0,0.1)"/>
            <rect x={x+24} y="125" width="30" height="5" rx="1" fill="rgba(0,0,0,0.08)"/>
          </g>
        );
      })}
      {/* sidewalk */}
      <rect x="0" y="125" width={width} height="5" fill="rgba(0,0,0,0.1)"/>
      {/* trees */}
      {Array.from({length:Math.ceil(width/80)}).map((_,i)=>(
        <g key={i}>
          <rect x={i*80+74} y="95" width="3" height="35" fill="rgba(60,100,40,0.5)"/>
          <circle cx={i*80+75} cy="90" r="11" fill="rgba(60,130,50,0.3)" stroke="rgba(40,100,30,0.3)" strokeWidth="0.8"/>
        </g>
      ))}
    </svg>
  );
}

/* BLOOMIES FAVORITES — Central Park: trees, path, benches, fountain */
function FavoritesScene({ width }: { width: number }) {
  return (
    <svg viewBox={`0 0 ${width} 130`} style={{ display: "block", width: "100%", height: "100%" }} preserveAspectRatio="xMidYMid slice">
      <defs>
        <linearGradient id="parksky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#c8dff0"/>
          <stop offset="100%" stopColor="#e8f4e0"/>
        </linearGradient>
        <linearGradient id="grass" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#8db870"/>
          <stop offset="100%" stopColor="#6a9a50"/>
        </linearGradient>
      </defs>
      <rect x="0" y="0" width={width} height="100" fill="url(#parksky)"/>
      <rect x="0" y="100" width={width} height="30" fill="url(#grass)"/>
      {/* path */}
      <path d={`M0 118 Q${width*0.3} 108 ${width*0.5} 112 Q${width*0.7} 116 ${width} 110`}
        fill="rgba(200,180,150,0.5)" stroke="rgba(180,160,130,0.5)" strokeWidth="8"/>
      {/* trees */}
      {Array.from({length: Math.ceil(width/55)}).map((_,i)=>{
        const x = i*55+10;
        const h = 28+((i*7)%14);
        const cr = 12+((i*5)%8);
        return (
          <g key={i}>
            <rect x={x} y={100-h} width="4" height={h} fill="rgba(80,50,20,0.5)"/>
            <circle cx={x+2} cy={100-h-cr/2} rx={cr} ry={cr*0.8}
              fill={`rgba(${60+i%3*15},${110+i%5*8},${40+i%4*6},0.75)`}
              stroke="rgba(40,80,20,0.2)" strokeWidth="0.5"/>
          </g>
        );
      })}
      {/* bench */}
      <rect x={width*0.4-20} y="114" width="40" height="4" rx="1" fill="rgba(120,80,40,0.6)"/>
      <rect x={width*0.4-15} y="118" width="4" height="7" fill="rgba(100,60,30,0.5)"/>
      <rect x={width*0.4+11} y="118" width="4" height="7" fill="rgba(100,60,30,0.5)"/>
      <rect x={width*0.4-15} y="110" width="30" height="3" rx="1" fill="rgba(120,80,40,0.45)"/>
      {/* lamp */}
      <rect x={width*0.65} y="78" width="3" height="46" fill="rgba(0,0,0,0.3)"/>
      <ellipse cx={width*0.65+1.5} cy="76" rx="9" ry="6" fill="none" stroke="rgba(0,0,0,0.3)" strokeWidth="1"/>
      <circle  cx={width*0.65+1.5} cy="76" r="3" fill="rgba(255,240,160,0.8)"/>
      {/* clouds */}
      <ellipse cx={width*0.2} cy="20" rx="30" ry="12" fill="rgba(255,255,255,0.7)"/>
      <ellipse cx={width*0.2+18} cy="18" rx="22" ry="10" fill="rgba(255,255,255,0.8)"/>
      <ellipse cx={width*0.7} cy="28" rx="24" ry="10" fill="rgba(255,255,255,0.6)"/>
      {/* city backdrop faint */}
      {[0,1,2,3,4,5].map(i=>(
        <rect key={i} x={i*(width/6)} y={50-i%3*10} width={width/6-2} height={50+i%3*10}
          fill="rgba(100,120,160,0.08)"/>
      ))}
    </svg>
  );
}

/* TRENDING — SoHo: cast-iron facades, fire escapes, awnings */
function TrendingScene({ width }: { width: number }) {
  const bldgs = Array.from({length: Math.ceil(width/90)}).map((_,i)=>({
    x: i*90, w: 88, h: 100+((i*17)%30),
    bg: ["#e8ddd0","#d8ccc8","#ddd4c8","#ccd0d8","#d0ccc0"][i%5],
  }));
  return (
    <svg viewBox={`0 0 ${width} 130`} style={{ display: "block", width: "100%", height: "100%" }} preserveAspectRatio="xMidYMid slice">
      <rect x="0" y="0" width={width} height="130" fill="#e0dcd4"/>
      {bldgs.map((b,i)=>(
        <g key={i}>
          <rect x={b.x} y={130-b.h} width={b.w} height={b.h} fill={b.bg} stroke="rgba(0,0,0,0.06)" strokeWidth="0.5"/>
          {/* cornice */}
          <rect x={b.x} y={130-b.h} width={b.w} height="6" fill="rgba(0,0,0,0.1)"/>
          {/* arched windows — 3 cols × 4 rows */}
          {[0,1,2].map(col=>[0,1,2,3].map(row=>{
            const lit=(i+col*2+row*3)%4!==0;
            return (
              <rect key={`${col}-${row}`} x={b.x+6+col*28} y={130-b.h+10+row*20} width="20" height="16"
                rx="10 10 0 0" fill={lit?"rgba(255,240,140,0.55)":"rgba(0,0,0,0.1)"}
                stroke="rgba(0,0,0,0.08)" strokeWidth="0.6"/>
            );
          }))}
          {/* fire escape */}
          {i%2===0 && (
            <g>
              <rect x={b.x+b.w-16} y={130-b.h+8} width="14" height="60" fill="none" stroke="rgba(0,0,0,0.2)" strokeWidth="0.8"/>
              {[0,1,2,3].map(r=>(
                <rect key={r} x={b.x+b.w-16} y={130-b.h+8+r*15} width="14" height="1.5" fill="rgba(0,0,0,0.18)"/>
              ))}
            </g>
          )}
          {/* awning */}
          <path d={`M${b.x+12} ${127} L${b.x+b.w-12} ${127} L${b.x+b.w-18} ${119} L${b.x+18} ${119} Z`}
            fill={[`${PINK}55`,"rgba(0,80,160,0.35)","rgba(0,120,60,0.35)","rgba(160,80,0,0.35)","rgba(80,0,120,0.35)"][i%5]}/>
          {/* ground door */}
          <rect x={b.x+b.w/2-8} y="110" width="18" height="20" rx="0" fill="rgba(0,0,0,0.12)" stroke="rgba(0,0,0,0.1)" strokeWidth="0.5"/>
        </g>
      ))}
      {/* sidewalk */}
      <rect x="0" y="125" width={width} height="5" fill="rgba(0,0,0,0.1)"/>
      {/* water tower */}
      <rect x={width*0.5} y={130-85} width="3" height="18" fill="rgba(0,0,0,0.2)"/>
      <rect x={width*0.5-8} y={130-85+4} width="22" height="13" rx="2 2 0 0" fill="rgba(0,0,0,0.12)" stroke="rgba(0,0,0,0.15)" strokeWidth="0.7"/>
    </svg>
  );
}

/* ── Band config ───────────────────────────────────────────────── */

const BANDS = [
  {
    id: "eats"      as CityCategory,
    label: "EATS",
    sub: "restaurants · bars · late night",
    bgFrom: "#fdf4ec", bgTo: "#f5e8d8",
    textColor: "#8A3A10",
    accent: "#D4601A",
    Vehicle: ({ animating }: { animating: boolean }) => (
      <div style={{
        position: "absolute", bottom: 28, left: 0, zIndex: 5,
        animation: animating ? "trainRoll 1.8s linear forwards" : "none",
        display: "flex", gap: 1,
      }}>
        <svg width="248" height="36" viewBox="0 0 248 36">
          <SubwayCar y={0} color="#f5f0e8"/>
          <g transform="translate(128,0)"><SubwayCar y={0} color="#f0eae0"/></g>
        </svg>
      </div>
    ),
    height: 130,
    Scene: EatsScene,
  },
  {
    id: "go"        as CityCategory,
    label: "GO",
    sub: "events · shows · rooftops",
    bgFrom: "#f0f4fa", bgTo: "#e4ecf8",
    textColor: "#1A3A6A",
    accent: "#2A5AAA",
    Vehicle: ({ animating }: { animating: boolean }) => (
      <div style={{
        position: "absolute", bottom: 8, left: 0, zIndex: 5,
        animation: animating ? "carRoll 1.6s linear forwards" : "none",
      }}>
        <svg width="54" height="34" viewBox="0 0 54 34">
          <TaxiCar/>
        </svg>
      </div>
    ),
    height: 130,
    Scene: GoScene,
  },
  {
    id: "solo"      as CityCategory,
    label: "SOLO",
    sub: "walks · coffee · galleries",
    bgFrom: "#f8f0ec", bgTo: "#f0e4dc",
    textColor: "#6A2A18",
    accent: "#A04028",
    Vehicle: ({ animating }: { animating: boolean }) => (
      <div style={{
        position: "absolute", bottom: 6, left: 0, zIndex: 5,
        animation: animating ? "bikeRide 1.4s linear forwards" : "none",
      }}>
        <svg width="36" height="22" viewBox="0 0 36 22">
          <Bicycle/>
        </svg>
      </div>
    ),
    height: 130,
    Scene: SoloScene,
  },
  {
    id: "favorites" as CityCategory,
    label: "BLOOMIES FAVORITES",
    sub: "member picks",
    bgFrom: "#eef8ec", bgTo: "#e0f0dc",
    textColor: "#1A5A2A",
    accent: "#2A8040",
    Vehicle: ({ animating }: { animating: boolean }) => (
      <div style={{
        position: "absolute", bottom: 24, left: 0, zIndex: 5,
        animation: animating ? "cloudDrift 3s ease-in-out infinite alternate" : "none",
      }}>
        <svg width="60" height="24" viewBox="0 0 60 24">
          <ellipse cx="30" cy="14" rx="24" ry="10" fill="rgba(255,255,255,0.7)"/>
          <ellipse cx="40" cy="11" rx="18" ry="8" fill="rgba(255,255,255,0.8)"/>
        </svg>
      </div>
    ),
    height: 130,
    Scene: FavoritesScene,
  },
  {
    id: "trending"  as CityCategory,
    label: "TRENDING",
    sub: "what's hot right now",
    bgFrom: "#f8f4ee", bgTo: "#f0e8e0",
    textColor: "#5A1A3A",
    accent: PINK,
    Vehicle: ({ animating }: { animating: boolean }) => (
      <div style={{
        position: "absolute", bottom: 7, left: 0, zIndex: 5,
        animation: animating ? "carRoll 1.5s linear forwards" : "none",
      }}>
        <svg width="54" height="34" viewBox="0 0 54 34">
          <TaxiCar/>
        </svg>
      </div>
    ),
    height: 130,
    Scene: TrendingScene,
  },
];

/* ── Eats sub-page ─────────────────────────────────────────────── */

const FILTERS = ["Tonight", "1+", "Italian", "Cocktails", "Date Night", "Brunch", "Outdoor", "Sushi"];

const FEATURED = [
  { id: 1, name: "Bar Pisellino", neighborhood: "WEST VILLAGE", cuisine: "ITALIAN", women: 18, note: "So early for a martini at the bar — Maya", bg: "#1a0a0e" },
  { id: 2, name: "Lola Taverna",  neighborhood: "WEST VILLAGE", cuisine: "GREEK",   women: 41, badge: "TRENDING", bg: "#2d1a0e" },
  { id: 3, name: "Via Carota",    neighborhood: "WEST VILLAGE", cuisine: "ITALIAN", women: 12, badge: "⚑ RESERVED", bg: PAPER, reservation: { time: "8:15PM", seats: "2 SEATS" }, light: true },
];

const GRID_SPOTS = [
  { id: 4, name: "Sant Ambroeus", neighborhood: "SOHO",    saved: 12, bg: "#FAF0E8" },
  { id: 5, name: "Cecconni's",    neighborhood: "SOHO",    saved: 8,  bg: "#F0EAF8" },
  { id: 6, name: "Rubirosa",      neighborhood: "NOLITA",  saved: 12, bg: "#FFF5F8" },
  { id: 7, name: "Pasta Night",   neighborhood: "LES",     saved: 8,  bg: "#F5F0E8" },
];

function EatsPage({ onBack }: { onBack: () => void }) {
  const [activeFilter, setActiveFilter] = useState("Tonight");
  const [savedIds, setSaved] = useState<number[]>([]);
  function toggleSave(id: number) { setSaved(s => s.includes(id) ? s.filter(x => x !== id) : [...s, id]); }

  return (
    <div style={{ backgroundImage: PAPER_TEX, backgroundColor: CREAM, backgroundSize: "200px 200px", minHeight: "100vh", paddingBottom: 120 }}>

      {/* Cover */}
      <div style={{ position: "relative", height: 200, background: "#0d0806", overflow: "hidden" }}>
        <div style={{ position: "absolute", inset: 0, background: "radial-gradient(ellipse at 40% 30%, #3d1a0a 0%, #0d0806 70%)" }} />
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to bottom, transparent 40%, rgba(0,0,0,0.7) 100%)" }} />
        <button onClick={onBack} style={{ position: "absolute", top: 56, left: 16, background: "rgba(0,0,0,0.4)", border: "none", borderRadius: 999, padding: "6px 12px", display: "flex", alignItems: "center", gap: 6, cursor: "pointer" }}>
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round"><polyline points="15 18 9 12 15 6"/></svg>
          <span style={{ fontFamily: "var(--font-jost)", fontSize: "9px", fontWeight: 700, color: "white", letterSpacing: "0.06em" }}>CITY</span>
        </button>
        <div style={{ position: "absolute", bottom: 16, left: 18 }}>
          <p style={{ fontFamily: "var(--font-jost)", fontSize: "7px", fontWeight: 800, letterSpacing: "0.22em", color: PINK, marginBottom: 4 }}>EATS · NYC</p>
          <p style={{ fontFamily: "var(--font-playfair)", fontSize: 24, fontWeight: 900, fontStyle: "italic", color: "white", lineHeight: 1 }}>Tonight&apos;s<br />Table</p>
        </div>
      </div>

      {/* Filters */}
      <div style={{ background: "#0d0806", paddingBottom: 12 }}>
        <div style={{ display: "flex", gap: 8, overflowX: "auto", padding: "10px 16px 0", scrollbarWidth: "none" as const }}>
          {FILTERS.map(f => (
            <button key={f} onClick={() => setActiveFilter(f)} style={{
              flexShrink: 0, padding: "6px 13px", borderRadius: 999,
              border: `1.5px solid ${activeFilter === f ? PINK : "rgba(255,255,255,0.15)"}`,
              background: activeFilter === f ? PINK : "transparent",
              color: activeFilter === f ? "white" : "rgba(255,255,255,0.55)",
              fontSize: "10px", fontFamily: "var(--font-jost)", fontWeight: 700, letterSpacing: "0.04em", cursor: "pointer",
            }}>{f}</button>
          ))}
        </div>
      </div>

      <div style={{ padding: "14px 14px 0" }}>
        {/* Featured grid */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 10 }}>
          <div style={{ gridRow: "span 2", background: FEATURED[0].bg, borderRadius: 18, minHeight: 240, position: "relative", overflow: "hidden", boxShadow: "0 4px 20px rgba(0,0,0,0.22)" }}>
            <div style={{ position: "absolute", inset: 0, background: "radial-gradient(circle at 40% 30%, rgba(180,30,60,0.5) 0%, transparent 70%)" }} />
            <div style={{ position: "absolute", top: 18, left: 12 }}>
              <p style={{ fontFamily: "var(--font-playfair)", fontSize: 20, fontWeight: 900, fontStyle: "italic", color: "#ff9eb5", lineHeight: 1.1, textShadow: "0 0 20px rgba(255,31,125,0.6)" }}>Bar<br />Pisellino</p>
              <p style={{ fontFamily: "var(--font-jost)", fontSize: "7px", fontWeight: 700, color: "rgba(255,255,255,0.4)", letterSpacing: "0.1em", marginTop: 4 }}>{FEATURED[0].neighborhood} · {FEATURED[0].cuisine}</p>
            </div>
            <div style={{ position: "absolute", top: 12, right: 10, background: PINK, borderRadius: 999, padding: "3px 8px" }}>
              <span style={{ fontFamily: "var(--font-jost)", fontSize: "8px", fontWeight: 700, color: "white" }}>{FEATURED[0].women} going</span>
            </div>
            <div style={{ position: "absolute", bottom: 14, left: 12, right: 12 }}>
              <div style={{ transform: "rotate(-1deg)", background: "rgba(255,255,230,0.88)", padding: "7px 9px" }}>
                <p style={{ fontFamily: "var(--font-caveat)", fontSize: 11, color: "#444", lineHeight: 1.4 }}>{FEATURED[0].note}</p>
              </div>
            </div>
          </div>
          <div style={{ position: "relative", background: FEATURED[1].bg, borderRadius: 18, minHeight: 112, overflow: "hidden", boxShadow: "0 4px 20px rgba(0,0,0,0.18)" }}>
            <div style={{ position: "absolute", inset: 0, background: "radial-gradient(circle at 60% 30%, rgba(100,50,20,0.6) 0%, transparent 70%)" }} />
            {FEATURED[1].badge && <div style={{ position: "absolute", top: 10, left: 10, background: PINK, borderRadius: 999, padding: "2px 8px" }}><span style={{ fontFamily: "var(--font-jost)", fontSize: "7px", fontWeight: 800, color: "white", letterSpacing: "0.06em" }}>{FEATURED[1].badge}</span></div>}
            <div style={{ position: "absolute", bottom: 12, left: 12, right: 12 }}>
              <p style={{ fontFamily: "var(--font-playfair)", fontSize: 14, fontWeight: 900, fontStyle: "italic", color: "rgba(255,230,200,0.92)", lineHeight: 1.1 }}>{FEATURED[1].name}</p>
              <p style={{ fontFamily: "var(--font-jost)", fontSize: "7px", color: "rgba(255,255,255,0.4)", letterSpacing: "0.08em", marginTop: 2 }}>{FEATURED[1].neighborhood}</p>
            </div>
          </div>
          <div style={{ backgroundImage: PAPER_TEX, backgroundColor: PAPER, backgroundSize: "200px 200px", borderRadius: 18, minHeight: 112, padding: "12px 12px 10px", boxShadow: "0 4px 16px rgba(0,0,0,0.08)", overflow: "hidden" }}>
            {FEATURED[2].badge && <div style={{ display: "inline-flex", background: "#2d1a0a", borderRadius: 999, padding: "3px 9px", marginBottom: 6 }}><span style={{ fontFamily: "var(--font-jost)", fontSize: "7px", fontWeight: 800, color: "#d4a060", letterSpacing: "0.1em" }}>{FEATURED[2].badge}</span></div>}
            <p style={{ fontFamily: "var(--font-playfair)", fontSize: 13, fontWeight: 900, fontStyle: "italic", color: DARK, lineHeight: 1.1 }}>{FEATURED[2].name}</p>
            <p style={{ fontFamily: "var(--font-jost)", fontSize: "7px", color: "#aaa", letterSpacing: "0.08em", marginTop: 2 }}>{FEATURED[2].neighborhood}</p>
            {FEATURED[2].reservation && (
              <div style={{ marginTop: 8, background: DARK, borderRadius: 8, padding: "6px 8px" }}>
                <p style={{ fontFamily: "var(--font-jost)", fontSize: "9px", fontWeight: 800, color: "#d4a060" }}>{FEATURED[2].reservation.time}</p>
                <p style={{ fontFamily: "var(--font-jost)", fontSize: "7px", color: "rgba(255,255,255,0.4)", letterSpacing: "0.08em" }}>{FEATURED[2].reservation.seats}</p>
              </div>
            )}
          </div>
        </div>
        {/* Grid spots */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginBottom: 14 }}>
          {GRID_SPOTS.map(spot => (
            <div key={spot.id} style={{ backgroundImage: PAPER_TEX, backgroundColor: spot.bg, backgroundSize: "200px 200px", borderRadius: 16, padding: "12px 12px 10px", boxShadow: "0 2px 10px rgba(0,0,0,0.07)" }}>
              <p style={{ fontFamily: "var(--font-playfair)", fontSize: 13, fontWeight: 700, fontStyle: "italic", color: DARK, lineHeight: 1.2, marginBottom: 4 }}>{spot.name}</p>
              <p style={{ fontFamily: "var(--font-jost)", fontSize: "7.5px", color: "#aaa", letterSpacing: "0.06em" }}>{spot.neighborhood}</p>
              <div style={{ marginTop: 8, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <span style={{ fontFamily: "var(--font-jost)", fontSize: "8px", fontWeight: 700, color: "#bbb" }}>{spot.saved} saved</span>
                <button onClick={() => toggleSave(spot.id)} style={{ background: "none", border: "none", cursor: "pointer", padding: 2 }}>
                  <svg width="11" height="11" viewBox="0 0 24 24" fill={savedIds.includes(spot.id) ? PINK : "none"} stroke={PINK} strokeWidth="2.5"><path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"/></svg>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ── Coming soon ───────────────────────────────────────────────── */
function ComingSoon({ band, onBack }: { band: typeof BANDS[0]; onBack: () => void }) {
  return (
    <div style={{ backgroundImage: PAPER_TEX, backgroundColor: CREAM, backgroundSize: "200px 200px", minHeight: "100vh", paddingTop: 48, paddingBottom: 100 }}>
      <div style={{ position: "relative", height: 180, overflow: "hidden", background: `linear-gradient(to bottom, ${band.bgFrom}, ${band.bgTo})` }}>
        <band.Scene width={400}/>
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to bottom, transparent 30%, rgba(246,241,235,0.9) 100%)" }} />
        <button onClick={onBack} style={{ position: "absolute", top: 16, left: 16, background: "rgba(255,255,255,0.7)", backdropFilter: "blur(4px)", border: "1px solid rgba(0,0,0,0.08)", borderRadius: 999, padding: "6px 12px", display: "flex", alignItems: "center", gap: 6, cursor: "pointer" }}>
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke={DARK} strokeWidth="2.5" strokeLinecap="round"><polyline points="15 18 9 12 15 6"/></svg>
          <span style={{ fontFamily: "var(--font-jost)", fontSize: "9px", fontWeight: 700, color: DARK, letterSpacing: "0.06em" }}>CITY</span>
        </button>
      </div>
      <div style={{ padding: "28px 24px" }}>
        <p style={{ fontFamily: "var(--font-jost)", fontSize: "8px", fontWeight: 800, letterSpacing: "0.22em", color: band.accent, marginBottom: 8 }}>{band.label}</p>
        <p style={{ fontFamily: "var(--font-playfair)", fontSize: 26, fontWeight: 900, fontStyle: "italic", color: DARK, lineHeight: 1.1, marginBottom: 16 }}>Coming<br />Soon</p>
        <p style={{ fontFamily: "var(--font-jost)", fontSize: "11px", color: "#888", lineHeight: 1.6 }}>We&apos;re curating the best of NYC.<br />Check back soon.</p>
      </div>
    </div>
  );
}

/* ── Landing page ──────────────────────────────────────────────── */

function CityLanding({ onSelect }: { onSelect: (c: CityCategory) => void }) {
  const [hovered, setHovered] = useState<CityCategory | null>(null);
  const [animating, setAnimating] = useState<CityCategory | null>(null);

  function handleEnter(id: CityCategory) {
    setHovered(id);
    setAnimating(id);
  }
  function handleLeave() {
    setHovered(null);
    setTimeout(() => setAnimating(null), 2000);
  }

  return (
    <div style={{ backgroundImage: PAPER_TEX, backgroundColor: CREAM, backgroundSize: "200px 200px", minHeight: "100vh", paddingTop: 48, paddingBottom: 100 }}>
      <style>{CSS}</style>

      {/* Header */}
      <div style={{ padding: "18px 20px 14px" }}>
        <p style={{ fontFamily: "var(--font-jost)", fontSize: "8px", fontWeight: 800, letterSpacing: "0.22em", color: PINK, marginBottom: 5 }}>BB+ · NEW YORK CITY</p>
        <p style={{ fontFamily: "var(--font-playfair)", fontSize: 28, fontWeight: 900, fontStyle: "italic", color: DARK, lineHeight: 1.05 }}>Your City</p>
      </div>

      {/* Band strips */}
      <div style={{ display: "flex", flexDirection: "column" }}>
        {BANDS.map((band, i) => {
          const isHov = hovered === band.id;
          const isAnim = animating === band.id;
          return (
            <button
              key={band.id}
              onClick={() => onSelect(band.id)}
              onMouseEnter={() => handleEnter(band.id)}
              onMouseLeave={handleLeave}
              onTouchStart={() => handleEnter(band.id)}
              onTouchEnd={handleLeave}
              style={{
                display: "block",
                width: "100%",
                height: band.height,
                border: "none",
                padding: 0,
                cursor: "pointer",
                position: "relative",
                overflow: "hidden",
                background: `linear-gradient(to bottom, ${band.bgFrom}, ${band.bgTo})`,
                borderBottom: i < BANDS.length - 1 ? "1px solid rgba(0,0,0,0.07)" : "none",
                transition: "filter 0.2s",
                filter: isHov ? "brightness(1.04)" : "brightness(1)",
              }}
            >
              {/* Scene SVG */}
              <div style={{ position: "absolute", inset: 0 }}>
                <band.Scene width={430}/>
              </div>

              {/* Animated vehicle */}
              <band.Vehicle animating={isAnim}/>

              {/* Left fade + label */}
              <div style={{
                position: "absolute", inset: 0,
                background: `linear-gradient(to right, ${band.bgFrom}f8 0%, ${band.bgFrom}cc 30%, ${band.bgFrom}55 55%, transparent 80%)`,
                pointerEvents: "none",
              }}/>

              <div style={{ position: "absolute", left: 20, top: "50%", transform: "translateY(-50%)", zIndex: 3 }}>
                <p style={{
                  fontFamily: "var(--font-playfair)",
                  fontSize: band.label.length > 8 ? 18 : 26,
                  fontWeight: 900,
                  fontStyle: "italic",
                  color: band.textColor,
                  lineHeight: 1.1,
                  marginBottom: 4,
                  textShadow: "0 1px 3px rgba(255,255,255,0.5)",
                }}>
                  {band.label}
                </p>
                <p style={{ fontFamily: "var(--font-jost)", fontSize: "8px", fontWeight: 600, letterSpacing: "0.08em", color: band.accent, opacity: 0.85 }}>
                  {band.sub}
                </p>
              </div>

              {/* Arrow */}
              <div style={{ position: "absolute", right: 18, top: "50%", transform: "translateY(-50%)", zIndex: 3 }}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={band.accent} strokeWidth="2.5" strokeLinecap="round" opacity={0.6}>
                  <polyline points="9 18 15 12 9 6"/>
                </svg>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}

/* ── Main export ───────────────────────────────────────────────── */

export function CityPage() {
  const [category, setCategory] = useState<CityCategory>("landing");

  if (category === "landing") return <CityLanding onSelect={setCategory}/>;
  if (category === "eats")    return <EatsPage    onBack={() => setCategory("landing")}/>;

  const band = BANDS.find(b => b.id === category)!;
  return <ComingSoon band={band} onBack={() => setCategory("landing")}/>;
}
