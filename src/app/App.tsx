import { useState, useEffect, useRef } from "react";
import { motion } from "motion/react";
import {
  Package, MapPin, Clock, CheckCircle, QrCode, Truck,
  LayoutDashboard, Settings, AlertTriangle, ChevronRight,
  Bluetooth, Camera, CreditCard, Smartphone, Banknote,
  Users, TrendingUp, FileText, Bell, Search, Home,
  ArrowLeft, Box, Timer, Route, ScanLine, DollarSign,
  Activity, RefreshCw, Phone, User, Battery, Signal,
  ShieldCheck, Monitor, Navigation, Wifi, Filter,
  Lock, Unlock, Star, Send, Zap, Eye,
  Check, X, ChevronDown, ChevronLeft, ChevronUp,
  Building2, Package2, AlertCircle, Layers, Grid3X3,
  ToggleLeft, ToggleRight, Minus, Plus, Server,
  Maximize2, MoreVertical, Circle, Gauge, Map
} from "lucide-react";
import {
  BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Tooltip,
  LineChart, Line, CartesianGrid, Area, AreaChart
} from "recharts";

// â”€â”€â”€ Types â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
type Screen =
  | "hub"
  | "kiosk_welcome" | "kiosk_sender_info" | "kiosk_destination"
  | "kiosk_delivery_type" | "kiosk_payer" | "kiosk_locker_size"
  | "kiosk_payment" | "kiosk_door_timer" | "kiosk_success"
  | "kiosk_collect_otp" | "kiosk_scan_qr"
  | "mobile_home" | "mobile_tracking" | "mobile_proximity"
  | "courier_dashboard" | "courier_route" | "courier_scan" | "courier_handoff"
  | "admin_dashboard" | "admin_locker_details" | "admin_transactions" | "admin_rules";

// â”€â”€â”€ Design tokens â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
const P = "#004d99";
const O = "#ff8928";
const G = "#00c97b";
const R = "#e8365d";
const BG = "#f8fafc";

// â”€â”€â”€ Shared micro-components â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
const Glass = ({ children, className = "" }: { children: React.ReactNode; className?: string }) => (
  <div className={`rounded-xl border border-black/[0.09] backdrop-blur-md ${className}`}
    style={{ background: "rgba(0,0,0,0.055)" }}>
    {children}
  </div>
);

const Badge = ({ children, color = P }: { children: React.ReactNode; color?: string }) => (
  <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-mono font-semibold uppercase tracking-wider"
    style={{ background: `${color}25`, color, border: `1px solid ${color}40` }}>
    {children}
  </span>
);

const PrimaryBtn = ({ children, onClick, disabled = false, className = "" }: {
  children: React.ReactNode; onClick?: () => void; disabled?: boolean; className?: string;
}) => (
  <button onClick={onClick} disabled={disabled}
    className={`flex items-center justify-center gap-2 rounded-lg font-semibold transition-all duration-200 ${className}`}
    style={{
      background: disabled ? "rgba(0,77,153,0.3)" : P,
      color: disabled ? "rgba(0,0,0,0.4)" : "#fff",
      cursor: disabled ? "not-allowed" : "pointer",
    }}>
    {children}
  </button>
);

const OrangeBtn = ({ children, onClick, className = "", disabled = false }: {
  children: React.ReactNode; onClick?: () => void; className?: string; disabled?: boolean;
}) => (
  <button onClick={onClick} disabled={disabled}
    className={`flex items-center justify-center gap-2 rounded-lg font-semibold transition-all duration-200 ${className}`}
    style={{ background: disabled ? `${O}40` : O, color: disabled ? "rgba(0,0,0,0.4)" : "#fff", cursor: disabled ? "not-allowed" : "pointer" }}>
    {children}
  </button>
);

const StepBar = ({ step, total }: { step: number; total: number }) => (
  <div className="flex items-center gap-1.5">
    {Array.from({ length: total }).map((_, i) => (
      <div key={i} className="h-1 rounded-full flex-1 transition-all duration-300"
        style={{ background: i < step ? P : "rgba(0,0,0,0.15)" }} />
    ))}
  </div>
);

// â”€â”€â”€ KIOSK FRAME â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
function KioskFrame({ children, onHome }: { children: React.ReactNode; onHome: () => void }) {
  return (
    <div className="w-full min-h-screen flex flex-col items-center justify-center p-6 gap-4"
      style={{ background: `radial-gradient(ellipse at 50% 40%, #e2e8f0 0%, ${BG} 70%)` }}>
      <div className="w-full max-w-5xl">
        <div className="rounded-2xl p-[10px] border border-black/[0.07]"
          style={{
            background: "linear-gradient(160deg, #ffffff 0%, #f1f5f9 100%)",
            boxShadow: `0 0 80px ${P}30, 0 40px 80px rgba(0,0,0,0.7)`,
          }}>
          {/* Bezel top */}
          <div className="flex items-center justify-between mb-2 px-3">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full animate-pulse" style={{ background: O }} />
              <span className="text-[9px] font-mono uppercase tracking-[0.2em] text-slate-900/25">PML-K7 TERMINAL Â· ACTIVE</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Wifi className="w-3 h-3 text-slate-900/25" />
              <div className="w-1.5 h-1.5 rounded-full" style={{ background: G }} />
              <span className="text-[9px] font-mono text-slate-900/25">ONLINE</span>
            </div>
          </div>
          {/* Screen */}
          <div className="relative rounded-xl overflow-hidden" style={{ aspectRatio: "16/9", background: BG }}>
            <div className="absolute inset-0 pointer-events-none"
              style={{ background: "radial-gradient(ellipse at 50% 0%, rgba(0,77,153,0.12) 0%, transparent 60%)" }} />
            {children}
          </div>
          {/* Bezel bottom */}
          <div className="flex items-center justify-between mt-2 px-3">
            <span className="text-[9px] font-mono text-slate-900/20 uppercase tracking-widest">PML SMART LOCKERâ„¢</span>
            <span className="text-[9px] font-mono text-slate-900/20">v4.2.1</span>
          </div>
        </div>
      </div>
      <button onClick={onHome}
        className="flex items-center gap-2 text-sm text-slate-900/35 hover:text-slate-900/65 transition-colors">
        <ArrowLeft className="w-4 h-4" /> Back to Hub
      </button>
    </div>
  );
}

// â”€â”€â”€ PHONE FRAME â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
function PhoneFrame({ children, onHome, label }: {
  children: React.ReactNode; onHome: () => void; label: string;
}) {
  return (
    <div className="w-full min-h-screen flex flex-col items-center justify-center py-8 gap-4"
      style={{ background: `radial-gradient(ellipse at 50% 40%, #e2e8f0 0%, ${BG} 70%)` }}>
      <div className="text-center mb-2">
        <span className="text-xs font-mono uppercase tracking-widest text-slate-900/30">{label}</span>
      </div>
      <div className="relative rounded-[3.4rem] border-[7px] border-[#161e30]"
        style={{
          width: 390,
          background: "#ffffff",
          boxShadow: `0 0 50px ${P}20, 0 40px 80px rgba(0,0,0,0.75)`,
        }}>
        {/* Dynamic island */}
        <div className="absolute top-3 left-1/2 -translate-x-1/2 z-20 w-28 h-7 bg-black rounded-full" />
        {/* Status bar */}
        <div className="absolute top-0 left-0 right-0 z-10 flex justify-between items-center px-6 pt-[14px] text-slate-900/60">
          <span className="text-[11px] font-semibold">9:41</span>
          <div className="flex items-center gap-1">
            <Signal className="w-3.5 h-3.5" />
            <Wifi className="w-3.5 h-3.5" />
            <Battery className="w-4 h-4" />
          </div>
        </div>
        {/* Content */}
        <div className="rounded-[2.9rem] overflow-hidden" style={{ height: 800 }}>
          <div className="h-full overflow-y-auto" style={{ paddingTop: 52, background: BG }}>
            {children}
          </div>
        </div>
        {/* Home bar */}
        <div className="absolute bottom-2 left-1/2 -translate-x-1/2 w-32 h-1 bg-white/25 rounded-full" />
      </div>
      <button onClick={onHome}
        className="flex items-center gap-2 text-sm text-slate-900/35 hover:text-slate-900/65 transition-colors mt-2">
        <ArrowLeft className="w-4 h-4" /> Back to Hub
      </button>
    </div>
  );
}

// â”€â”€â”€ KIOSK: WELCOME â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
function KioskWelcome({ go }: { go: (s: Screen) => void }) {
  const now = new Date();
  const timeStr = now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  const dateStr = now.toLocaleDateString([], { weekday: "long", year: "numeric", month: "long", day: "numeric" });
  return (
    <div className="h-full flex flex-col p-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: P }}>
            <Package className="w-5 h-5 text-slate-900" />
          </div>
          <div>
            <div className="text-slate-900 font-bold text-lg tracking-tight" style={{ fontFamily: "'Roboto Slab', serif" }}>PML Smart Locker</div>
            <div className="text-slate-900/40 text-[10px] font-mono uppercase tracking-wider">Self-service terminal</div>
          </div>
        </div>
        <div className="text-right">
          <div className="text-slate-900 font-semibold text-xl font-mono">{timeStr}</div>
          <div className="text-slate-900/40 text-[10px]">{dateStr}</div>
        </div>
      </div>
      {/* Hero */}
      <div className="flex-1 flex flex-col items-center justify-center gap-6">
        <div className="text-center mb-2">
          <h1 className="text-4xl font-bold text-slate-900 tracking-tight mb-2" style={{ fontFamily: "'Roboto Slab', serif" }}>
            Welcome
          </h1>
          <p className="text-slate-900/45 text-sm">Touch any option below to get started</p>
        </div>
        <div className="grid grid-cols-3 gap-4 w-full max-w-2xl">
          {[
            { label: "Drop Off Parcel", icon: Send, color: P, sub: "Deposit a parcel", screen: "kiosk_sender_info" as Screen },
            { label: "Collect Parcel", icon: Package, color: G, sub: "Pick up with OTP", screen: "kiosk_collect_otp" as Screen },
            { label: "Scan QR Code", icon: QrCode, color: O, sub: "Quick collection", screen: "kiosk_scan_qr" as Screen },
          ].map(({ label, icon: Icon, color, sub, screen }) => (
            <button key={label} onClick={() => go(screen)}
              className="flex flex-col items-center gap-3 p-6 rounded-2xl border transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]"
              style={{
                background: `${color}18`,
                borderColor: `${color}40`,
                boxShadow: `0 8px 30px ${color}15`,
              }}>
              <div className="w-14 h-14 rounded-2xl flex items-center justify-center" style={{ background: `${color}30` }}>
                <Icon className="w-7 h-7" style={{ color }} />
              </div>
              <div className="text-center">
                <div className="text-slate-900 font-semibold text-sm">{label}</div>
                <div className="text-slate-900/40 text-[11px] mt-0.5">{sub}</div>
              </div>
            </button>
          ))}
        </div>
      </div>
      <div className="text-center text-slate-900/20 text-[10px] font-mono uppercase tracking-widest">
        Touch screen to interact Â· Windhoek Central Hub A Â· Locker Bank 07
      </div>
    </div>
  );
}

// â”€â”€â”€ KIOSK: SENDER INFO â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
function KioskSenderInfo({ go }: { go: (s: Screen) => void }) {
  const [form, setForm] = useState({ senderName: "", senderPhone: "", receiverName: "", receiverPhone: "" });
  const valid = Object.values(form).every(v => v.length > 2);
  const field = (label: string, key: keyof typeof form, placeholder: string) => (
    <div>
      <label className="text-[11px] font-mono uppercase tracking-wider text-slate-900/40 block mb-1.5">{label}</label>
      <input value={form[key]} onChange={e => setForm(f => ({ ...f, [key]: e.target.value }))}
        placeholder={placeholder}
        className="w-full px-4 py-3 rounded-xl text-slate-900 text-sm placeholder-white/20 outline-none focus:ring-1 transition-all"
        style={{ background: "rgba(0,0,0,0.07)", border: "1px solid rgba(0,0,0,0.12)", ringColor: P }} />
    </div>
  );
  return (
    <div className="h-full flex flex-col p-8 gap-5">
      <KioskNav title="Drop Off Parcel" step={1} total={5} onCancel={() => go("kiosk_welcome")} />
      <div className="flex-1 grid grid-cols-2 gap-6">
        <Glass className="p-5 flex flex-col gap-4">
          <div className="text-[11px] font-mono uppercase tracking-widest text-slate-900/40 flex items-center gap-2">
            <User className="w-3.5 h-3.5" /> Sender Details
          </div>
          {field("Full Name", "senderName", "e.g. Anna Shikongo")}
          {field("Phone Number", "senderPhone", "+264 81 234 5678")}
        </Glass>
        <Glass className="p-5 flex flex-col gap-4">
          <div className="text-[11px] font-mono uppercase tracking-widest text-slate-900/40 flex items-center gap-2">
            <User className="w-3.5 h-3.5" /> Receiver Details
          </div>
          {field("Full Name", "receiverName", "e.g. David Nghipandulwa")}
          {field("Phone Number", "receiverPhone", "+264 81 987 6543")}
        </Glass>
      </div>
      <PrimaryBtn onClick={() => go("kiosk_destination")} disabled={!valid} className="py-3.5 text-base w-full">
        Next â€” Choose Destination <ChevronRight className="w-5 h-5" />
      </PrimaryBtn>
    </div>
  );
}

function KioskNav({ title, step, total, onCancel }: { title: string; step: number; total: number; onCancel: () => void }) {
  return (
    <div className="flex items-center justify-between">
      <div>
        <div className="flex items-center gap-2 mb-2">
          <button onClick={onCancel} className="w-8 h-8 rounded-lg flex items-center justify-center transition-colors"
            style={{ background: "rgba(0,0,0,0.07)" }}>
            <ArrowLeft className="w-4 h-4 text-slate-900/50" />
          </button>
          <h2 className="text-slate-900 font-semibold text-lg" style={{ fontFamily: "'Roboto Slab', serif" }}>{title}</h2>
        </div>
        <StepBar step={step} total={total} />
      </div>
      <button onClick={onCancel} className="text-[11px] font-mono uppercase tracking-wider text-slate-900/30 hover:text-slate-900/60 flex items-center gap-1.5 transition-colors">
        <X className="w-3.5 h-3.5" /> Cancel
      </button>
    </div>
  );
}

// â”€â”€â”€ KIOSK: DESTINATION â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
function KioskDestination({ go }: { go: (s: Screen) => void }) {
  const [selected, setSelected] = useState<number | null>(null);
  const lockers = [
    { id: 1, name: "Wernhil Park Mall", address: "Independence Ave, Windhoek Central", slots: 24, free: 8 },
    { id: 2, name: "Grove Mall Eros", address: "Sam Nujoma Drive, Eros", slots: 36, free: 12 },
    { id: 3, name: "Maerua Mall", address: "Jan Jonker Rd, Windhoek West", slots: 18, free: 3 },
    { id: 4, name: "Katutura Shoprite", address: "Eveline St, Katutura", slots: 12, free: 5 },
  ];
  return (
    <div className="h-full flex flex-col p-8 gap-4">
      <KioskNav title="Select Destination Locker" step={2} total={5} onCancel={() => go("kiosk_welcome")} />
      <div className="flex-1 grid grid-cols-5 gap-4 min-h-0">
        {/* Map */}
        <div className="col-span-3 rounded-xl overflow-hidden relative border border-black/[0.08]"
          style={{ background: "#071220" }}>
          <svg viewBox="0 0 600 340" className="w-full h-full">
            <defs>
              <pattern id="grid" width="30" height="30" patternUnits="userSpaceOnUse">
                <path d="M 30 0 L 0 0 0 30" fill="none" stroke="rgba(0,0,0,0.04)" strokeWidth="0.5" />
              </pattern>
            </defs>
            <rect width="600" height="340" fill="url(#grid)" />
            {/* Roads */}
            <line x1="0" y1="170" x2="600" y2="170" stroke="rgba(0,0,0,0.08)" strokeWidth="4" />
            <line x1="300" y1="0" x2="300" y2="340" stroke="rgba(0,0,0,0.08)" strokeWidth="4" />
            <line x1="100" y1="60" x2="500" y2="280" stroke="rgba(0,0,0,0.06)" strokeWidth="3" />
            <line x1="500" y1="60" x2="100" y2="280" stroke="rgba(0,0,0,0.06)" strokeWidth="3" />
            {/* Locker pins */}
            {[
              { x: 180, y: 140, id: 1 }, { x: 380, y: 100, id: 2 },
              { x: 260, y: 220, id: 3 }, { x: 120, y: 260, id: 4 },
            ].map(({ x, y, id }) => (
              <g key={id} onClick={() => setSelected(id)} style={{ cursor: "pointer" }}>
                <circle cx={x} cy={y} r={selected === id ? 18 : 14} fill={selected === id ? O : P}
                  opacity={selected === id ? 1 : 0.7} />
                <text x={x} y={y + 5} textAnchor="middle" fill="white" fontSize="11" fontWeight="700">{id}</text>
              </g>
            ))}
            <text x="300" y="330" textAnchor="middle" fill="rgba(0,0,0,0.2)" fontSize="9" fontFamily="monospace">WINDHOEK â€” NAMIBIA</text>
          </svg>
        </div>
        {/* List */}
        <div className="col-span-2 flex flex-col gap-2 overflow-y-auto">
          {lockers.map(l => (
            <button key={l.id} onClick={() => setSelected(l.id)}
              className="w-full text-left p-3 rounded-xl border transition-all duration-200"
              style={{
                background: selected === l.id ? `${P}25` : "rgba(0,0,0,0.04)",
                borderColor: selected === l.id ? `${P}60` : "rgba(0,0,0,0.08)",
              }}>
              <div className="flex items-start justify-between gap-2 mb-1">
                <span className="text-slate-900 text-sm font-semibold leading-tight">{l.name}</span>
                <span className="text-[10px] font-mono shrink-0 mt-0.5"
                  style={{ color: l.free > 5 ? G : O }}>{l.free} free</span>
              </div>
              <div className="text-slate-900/40 text-[11px] flex items-center gap-1">
                <MapPin className="w-3 h-3 shrink-0" /> {l.address}
              </div>
            </button>
          ))}
        </div>
      </div>
      <PrimaryBtn onClick={() => go("kiosk_delivery_type")} disabled={!selected} className="py-3.5 text-base w-full">
        Confirm Locker <ChevronRight className="w-5 h-5" />
      </PrimaryBtn>
    </div>
  );
}

// â”€â”€â”€ KIOSK: DELIVERY TYPE â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
function KioskDeliveryType({ go }: { go: (s: Screen) => void }) {
  const [type, setType] = useState<string | null>(null);
  return (
    <div className="h-full flex flex-col p-8 gap-5">
      <KioskNav title="Delivery Method" step={3} total={5} onCancel={() => go("kiosk_welcome")} />
      <div className="flex-1 grid grid-cols-2 gap-5 items-center">
        {[
          {
            key: "direct", icon: Package, label: "Direct Pickup", color: P,
            desc: "Receiver collects directly from the locker using an OTP code.",
            badge: "Most Popular",
          },
          {
            key: "courier", icon: Truck, label: "Courier Delivery", color: O,
            desc: "A PML courier will collect and deliver to the receiver's address.",
            badge: "Door-to-Door",
          },
        ].map(({ key, icon: Icon, label, color, desc, badge }) => (
          <button key={key} onClick={() => setType(key)}
            className="h-full p-7 rounded-2xl border flex flex-col items-center justify-center gap-4 transition-all duration-200"
            style={{
              background: type === key ? `${color}20` : "rgba(0,0,0,0.04)",
              borderColor: type === key ? `${color}55` : "rgba(0,0,0,0.08)",
              boxShadow: type === key ? `0 0 40px ${color}15` : "none",
            }}>
            <div className="w-16 h-16 rounded-2xl flex items-center justify-center" style={{ background: `${color}25` }}>
              <Icon className="w-8 h-8" style={{ color }} />
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center gap-2 mb-1">
                <span className="text-slate-900 font-bold text-lg">{label}</span>
                {type === key && <Check className="w-4 h-4" style={{ color: G }} />}
              </div>
              <Badge color={color}>{badge}</Badge>
              <p className="text-slate-900/40 text-sm mt-3 leading-relaxed">{desc}</p>
            </div>
          </button>
        ))}
      </div>
      <PrimaryBtn onClick={() => go("kiosk_payer")} disabled={!type} className="py-3.5 text-base w-full">
        Continue <ChevronRight className="w-5 h-5" />
      </PrimaryBtn>
    </div>
  );
}

// â”€â”€â”€ KIOSK: PAYER SELECTION â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
function KioskPayerSelection({ go }: { go: (s: Screen) => void }) {
  return (
    <div className="h-full flex flex-col p-8 gap-5">
      <KioskNav title="Who Pays?" step={4} total={5} onCancel={() => go("kiosk_welcome")} />
      <div className="flex-1 grid grid-cols-2 gap-5 items-center">
        {[
          {
            label: "Sender Pays", icon: CreditCard, color: P,
            desc: "Payment collected now. Receiver gets free pickup.",
            action: () => go("kiosk_locker_size"),
            badge: "Pay Now",
          },
          {
            label: "Receiver Pays", icon: Smartphone, color: O,
            desc: "Receiver pays via mobile when collecting from locker.",
            action: () => go("kiosk_door_timer"),
            badge: "Pay on Collect",
          },
        ].map(({ label, icon: Icon, color, desc, action, badge }) => (
          <button key={label} onClick={action}
            className="h-full p-7 rounded-2xl border flex flex-col items-center justify-center gap-4 transition-all duration-200 hover:scale-[1.01]"
            style={{ background: `${color}15`, borderColor: `${color}40` }}>
            <div className="w-16 h-16 rounded-2xl flex items-center justify-center" style={{ background: `${color}25` }}>
              <Icon className="w-8 h-8" style={{ color }} />
            </div>
            <div className="text-center">
              <div className="text-slate-900 font-bold text-xl mb-2">{label}</div>
              <Badge color={color}>{badge}</Badge>
              <p className="text-slate-900/40 text-sm mt-3 leading-relaxed">{desc}</p>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}

// â”€â”€â”€ KIOSK: LOCKER SIZE â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
function KioskLockerSize({ go }: { go: (s: Screen) => void }) {
  const [size, setSize] = useState<string | null>(null);
  const sizes = [
    { key: "S", label: "Small", dims: "30Ã—30Ã—30 cm", weight: "â‰¤ 2 kg", price: "N$35", color: "#7c6af7" },
    { key: "M", label: "Medium", dims: "50Ã—40Ã—30 cm", weight: "â‰¤ 10 kg", price: "N$55", color: P },
    { key: "L", label: "Large", dims: "80Ã—60Ã—40 cm", weight: "â‰¤ 25 kg", price: "N$85", color: O },
    { key: "XL", label: "X-Large", dims: "100Ã—80Ã—60 cm", weight: "â‰¤ 50 kg", price: "N$120", color: R },
  ];
  return (
    <div className="h-full flex flex-col p-8 gap-5">
      <KioskNav title="Choose Locker Size" step={5} total={5} onCancel={() => go("kiosk_welcome")} />
      <div className="flex-1 grid grid-cols-4 gap-4 items-center">
        {sizes.map(s => (
          <button key={s.key} onClick={() => setSize(s.key)}
            className="h-full p-5 rounded-2xl border flex flex-col items-center justify-center gap-3 transition-all duration-200"
            style={{
              background: size === s.key ? `${s.color}20` : "rgba(0,0,0,0.04)",
              borderColor: size === s.key ? `${s.color}55` : "rgba(0,0,0,0.08)",
            }}>
            {/* Visual locker size indicator */}
            <div className="flex items-end justify-center" style={{ height: 60 }}>
              <div className="rounded-md border-2 flex items-center justify-center"
                style={{
                  width: s.key === "S" ? 28 : s.key === "M" ? 38 : s.key === "L" ? 50 : 62,
                  height: s.key === "S" ? 28 : s.key === "M" ? 38 : s.key === "L" ? 50 : 62,
                  borderColor: s.color,
                  background: `${s.color}15`,
                }}>
                <span className="font-bold text-sm" style={{ color: s.color }}>{s.key}</span>
              </div>
            </div>
            <div className="text-center">
              <div className="text-slate-900 font-bold">{s.label}</div>
              <div className="text-slate-900/40 text-[11px] mt-1 font-mono">{s.dims}</div>
              <div className="text-slate-900/35 text-[10px] mt-0.5">{s.weight}</div>
              <div className="font-bold text-base mt-2" style={{ color: s.color }}>{s.price}</div>
            </div>
            {size === s.key && (
              <div className="w-6 h-6 rounded-full flex items-center justify-center" style={{ background: s.color }}>
                <Check className="w-3.5 h-3.5 text-slate-900" />
              </div>
            )}
          </button>
        ))}
      </div>
      <PrimaryBtn onClick={() => go("kiosk_payment")} disabled={!size} className="py-3.5 text-base w-full">
        Proceed to Payment <ChevronRight className="w-5 h-5" />
      </PrimaryBtn>
    </div>
  );
}

// â”€â”€â”€ KIOSK: PAYMENT â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
function KioskPayment({ go }: { go: (s: Screen) => void }) {
  const [method, setMethod] = useState<string | null>(null);
  const methods = [
    { key: "card", icon: CreditCard, label: "Bank Card", sub: "Visa / Mastercard / Maestro", color: P },
    { key: "mobile", icon: Smartphone, label: "Mobile Money", sub: "MTC MoMo Â· Telecom Pay", color: G },
    { key: "cash", icon: Banknote, label: "Cash", sub: "Insert notes into reader", color: O },
  ];
  return (
    <div className="h-full flex flex-col p-8 gap-5">
      <KioskNav title="Payment" step={5} total={5} onCancel={() => go("kiosk_welcome")} />
      {/* Order summary */}
      <Glass className="p-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Box className="w-5 h-5 text-slate-900/40" />
          <div>
            <div className="text-slate-900 text-sm font-semibold">Medium Locker Â· Direct Pickup</div>
            <div className="text-slate-900/40 text-[11px]">Grove Mall Eros Â· Ref: PML-20724-07</div>
          </div>
        </div>
        <div className="text-right">
          <div className="text-slate-900 font-bold text-xl">N$55.00</div>
          <div className="text-slate-900/35 text-[11px]">incl. VAT</div>
        </div>
      </Glass>
      <div className="flex-1 grid grid-cols-3 gap-4 items-center">
        {methods.map(m => (
          <button key={m.key} onClick={() => setMethod(m.key)}
            className="h-full p-6 rounded-2xl border flex flex-col items-center justify-center gap-3 transition-all duration-200"
            style={{
              background: method === m.key ? `${m.color}20` : "rgba(0,0,0,0.04)",
              borderColor: method === m.key ? `${m.color}55` : "rgba(0,0,0,0.08)",
            }}>
            <div className="w-14 h-14 rounded-xl flex items-center justify-center" style={{ background: `${m.color}25` }}>
              <m.icon className="w-7 h-7" style={{ color: m.color }} />
            </div>
            <div className="text-center">
              <div className="text-slate-900 font-bold">{m.label}</div>
              <div className="text-slate-900/40 text-[11px] mt-1">{m.sub}</div>
            </div>
          </button>
        ))}
      </div>
      <OrangeBtn onClick={() => go("kiosk_door_timer")} disabled={!method} className="py-3.5 text-base w-full">
        <DollarSign className="w-5 h-5" /> Pay N$55.00 Now
      </OrangeBtn>
    </div>
  );
}

// â”€â”€â”€ KIOSK: DOOR OPEN TIMER â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
function KioskDoorTimer({ go }: { go: (s: Screen) => void }) {
  const [countdown, setCountdown] = useState(3);
  useEffect(() => {
    if (countdown <= 0) { go("kiosk_success"); return; }
    const t = setTimeout(() => setCountdown(c => c - 1), 1000);
    return () => clearTimeout(t);
  }, [countdown, go]);
  return (
    <div className="h-full flex flex-col items-center justify-center gap-6 p-8">
      <div className="text-center">
        <Badge color={G}>DOOR OPENING</Badge>
        <h2 className="text-slate-900 text-2xl font-bold mt-3 mb-1" style={{ fontFamily: "'Roboto Slab', serif" }}>
          Please Open Door #{Math.floor(Math.random() * 8) + 1}
        </h2>
        <p className="text-slate-900/45 text-sm">Place your parcel inside and close the door securely</p>
      </div>
      {/* Animated locker door */}
      <div className="relative flex items-center justify-center" style={{ width: 200, height: 200 }}>
        <div className="absolute inset-0 rounded-full opacity-20 animate-ping"
          style={{ background: G, animationDuration: "1.5s" }} />
        <div className="absolute inset-4 rounded-full opacity-15 animate-ping"
          style={{ background: G, animationDuration: "1.5s", animationDelay: "0.3s" }} />
        <motion.div
          className="relative z-10 flex items-center justify-center"
          style={{ width: 120, height: 140 }}>
          {/* Locker body */}
          <div className="w-full h-full rounded-xl border-2 flex items-center justify-center relative overflow-hidden"
            style={{ background: `${P}30`, borderColor: `${P}60` }}>
            {/* Door swinging open */}
            <motion.div
              className="absolute inset-0 rounded-xl"
              style={{ background: `${P}50`, transformOrigin: "left center" }}
              animate={{ rotateY: [0, -85] }}
              transition={{ duration: 1, repeat: Infinity, repeatDelay: 1.5, ease: "easeInOut" }}>
              <div className="absolute right-3 top-1/2 -translate-y-1/2 w-3 h-3 rounded-full border-2 border-black/50" />
            </motion.div>
            <Unlock className="w-8 h-8" style={{ color: G }} />
          </div>
        </motion.div>
      </div>
      <div className="text-center">
        <div className="text-6xl font-mono font-bold" style={{ color: G }}>{countdown}</div>
        <div className="text-slate-900/40 text-sm mt-1">Closing automatically</div>
      </div>
      <div className="flex gap-2 mt-2">
        {[0, 1, 2].map(i => (
          <div key={i} className="w-2 h-2 rounded-full transition-all duration-500"
            style={{ background: i < (3 - countdown) ? G : "rgba(0,0,0,0.2)" }} />
        ))}
      </div>
    </div>
  );
}

// â”€â”€â”€ KIOSK: SUCCESS â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
function KioskSuccess({ go }: { go: (s: Screen) => void }) {
  const trackingNo = "PML-207240716-A3F9";
  return (
    <div className="h-full flex flex-col items-center justify-center gap-6 p-8">
      <motion.div
        initial={{ scale: 0.5, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: "spring", stiffness: 200, damping: 20 }}
        className="w-20 h-20 rounded-full flex items-center justify-center"
        style={{ background: `${G}25`, border: `2px solid ${G}` }}>
        <CheckCircle className="w-10 h-10" style={{ color: G }} />
      </motion.div>
      <div className="text-center">
        <h2 className="text-3xl font-bold text-slate-900 mb-2" style={{ fontFamily: "'Roboto Slab', serif" }}>
          Parcel Deposited!
        </h2>
        <p className="text-slate-900/45 text-sm">Your parcel is secure. The receiver will be notified by SMS.</p>
      </div>
      <Glass className="p-5 w-full max-w-md text-center">
        <div className="text-slate-900/40 text-[11px] font-mono uppercase tracking-widest mb-2">Tracking Number</div>
        <div className="text-xl font-mono font-bold text-slate-900 mb-3">{trackingNo}</div>
        {/* Fake QR code */}
        <div className="inline-grid grid-cols-8 gap-0.5 p-3 rounded-xl bg-white mx-auto">
          {Array.from({ length: 64 }).map((_, i) => (
            <div key={i} className="w-4 h-4 rounded-[1px]"
              style={{ background: Math.random() > 0.5 ? "#000" : "#fff" }} />
          ))}
        </div>
        <div className="text-slate-900/35 text-[11px] mt-2">Share with receiver for QR pickup</div>
      </Glass>
      <div className="flex gap-4 w-full max-w-md">
        <button onClick={() => go("kiosk_welcome")}
          className="flex-1 py-3 rounded-xl text-slate-900 font-semibold transition-colors"
          style={{ background: "rgba(0,0,0,0.08)", border: "1px solid rgba(0,0,0,0.12)" }}>
          <Home className="w-4 h-4 inline mr-2" /> Done
        </button>
        <OrangeBtn className="flex-1 py-3">
          <FileText className="w-4 h-4" /> Print Receipt
        </OrangeBtn>
      </div>
    </div>
  );
}

// â”€â”€â”€ KIOSK: COLLECT OTP â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
function KioskCollectOTP({ go }: { go: (s: Screen) => void }) {
  const [pin, setPin] = useState("");
  const keys = ["1","2","3","4","5","6","7","8","9","â†","0","OK"];
  const handleKey = (k: string) => {
    if (k === "â†") setPin(p => p.slice(0, -1));
    else if (k === "OK" && pin.length === 6) go("kiosk_door_timer");
    else if (k !== "OK" && pin.length < 6) setPin(p => p + k);
  };
  return (
    <div className="h-full flex flex-col items-center justify-center gap-6 p-10">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-slate-900 mb-1" style={{ fontFamily: "'Roboto Slab', serif" }}>
          Enter Collection Code
        </h2>
        <p className="text-slate-900/45 text-sm">Enter the 6-digit OTP sent to your phone</p>
      </div>
      {/* PIN display */}
      <div className="flex gap-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="w-12 h-14 rounded-xl border-2 flex items-center justify-center transition-all duration-200"
            style={{
              borderColor: i < pin.length ? P : "rgba(0,0,0,0.15)",
              background: i < pin.length ? `${P}20` : "rgba(0,0,0,0.05)",
            }}>
            {i < pin.length && <div className="w-3 h-3 rounded-full bg-white" />}
          </div>
        ))}
      </div>
      {/* Keypad */}
      <div className="grid grid-cols-3 gap-3 w-64">
        {keys.map(k => (
          <button key={k} onClick={() => handleKey(k)}
            className="h-14 rounded-xl font-bold text-lg flex items-center justify-center transition-all duration-150 active:scale-95"
            style={{
              background: k === "OK"
                ? (pin.length === 6 ? P : "rgba(0,77,153,0.3)")
                : k === "â†"
                ? "rgba(0,0,0,0.08)"
                : "rgba(0,0,0,0.07)",
              color: k === "OK" && pin.length < 6 ? "rgba(0,0,0,0.3)" : "#fff",
              border: "1px solid rgba(0,0,0,0.08)",
            }}>
            {k === "â†" ? <ArrowLeft className="w-5 h-5" /> : k}
          </button>
        ))}
      </div>
      <button onClick={() => go("kiosk_scan_qr")}
        className="text-sm flex items-center gap-1.5 transition-colors" style={{ color: O }}>
        <QrCode className="w-4 h-4" /> Use QR Code instead
      </button>
      <button onClick={() => go("kiosk_welcome")}
        className="text-xs text-slate-900/30 hover:text-slate-900/50 transition-colors">Cancel</button>
    </div>
  );
}

// â”€â”€â”€ KIOSK: SCAN QR â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
function KioskScanQR({ go }: { go: (s: Screen) => void }) {
  const [scanning, setScanning] = useState(false);
  return (
    <div className="h-full flex flex-col items-center justify-center gap-5 p-8">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-slate-900 mb-1" style={{ fontFamily: "'Roboto Slab', serif" }}>
          Scan Collection QR
        </h2>
        <p className="text-slate-900/45 text-sm">Hold your QR code up to the scanner below</p>
      </div>
      {/* Scanner UI */}
      <div className="relative w-64 h-64 rounded-2xl overflow-hidden border-2 border-black/15"
        style={{ background: "#000" }}>
        {/* Corners */}
        {[["top-3 left-3", "border-t-2 border-l-2"], ["top-3 right-3", "border-t-2 border-r-2"],
          ["bottom-3 left-3", "border-b-2 border-l-2"], ["bottom-3 right-3", "border-b-2 border-r-2"]
        ].map(([pos, cls], i) => (
          <div key={i} className={`absolute w-6 h-6 ${pos} ${cls}`} style={{ borderColor: O }} />
        ))}
        {/* Scan line */}
        <motion.div
          className="absolute left-4 right-4 h-0.5 rounded-full"
          style={{ background: `linear-gradient(90deg, transparent, ${O}, transparent)` }}
          animate={{ top: ["20%", "80%", "20%"] }}
          transition={{ duration: 2, repeat: Infinity, ease: "linear" }} />
        <div className="absolute inset-0 flex items-center justify-center">
          <Camera className="w-12 h-12 text-slate-900/20" />
        </div>
      </div>
      <div className="flex flex-col items-center gap-3 w-full max-w-xs">
        <OrangeBtn onClick={() => { setScanning(true); setTimeout(() => go("kiosk_door_timer"), 1200); }}
          className="py-3 w-full text-sm">
          <Zap className="w-4 h-4" /> {scanning ? "Scanningâ€¦" : "Simulate QR Scan"}
        </OrangeBtn>
        <button onClick={() => go("kiosk_collect_otp")}
          className="text-sm" style={{ color: P }}>â† Enter OTP instead</button>
        <button onClick={() => go("kiosk_welcome")}
          className="text-xs text-slate-900/30 hover:text-slate-900/50 transition-colors">Cancel</button>
      </div>
    </div>
  );
}

// â”€â”€â”€ MOBILE: HOME â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
function MobileHome({ go }: { go: (s: Screen) => void }) {
  const [query, setQuery] = useState("");
  const recent = [
    { id: "PML-207240711-B2E1", status: "READY", location: "Wernhil Park Mall", color: G },
    { id: "PML-207240709-K9X3", status: "IN TRANSIT", location: "Grove Mall Eros", color: O },
    { id: "PML-207240705-F7T8", status: "COLLECTED", location: "Maerua Mall", color: "rgba(0,0,0,0.3)" },
  ];
  return (
    <div className="px-5 pb-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <div className="text-slate-900/40 text-xs mb-0.5">Good afternoon,</div>
          <div className="text-slate-900 font-bold text-lg">Anna Shikongo</div>
        </div>
        <div className="relative">
          <Bell className="w-5 h-5 text-slate-900/50" />
          <div className="absolute -top-1 -right-1 w-3.5 h-3.5 rounded-full flex items-center justify-center text-[8px] font-bold text-slate-900"
            style={{ background: O }}>2</div>
        </div>
      </div>
      {/* Search */}
      <div className="relative mb-5">
        <Search className="absolute left-3.5 top-3.5 w-4 h-4 text-slate-900/30" />
        <input value={query} onChange={e => setQuery(e.target.value)}
          placeholder="Enter tracking numberâ€¦"
          className="w-full pl-10 pr-4 py-3 rounded-xl text-sm text-slate-900 placeholder-white/25 outline-none"
          style={{ background: "rgba(0,0,0,0.08)", border: "1px solid rgba(0,0,0,0.1)" }} />
        {query && (
          <button onClick={() => go("mobile_tracking")}
            className="absolute right-2 top-1.5 px-3 py-1.5 rounded-lg text-slate-900 text-xs font-semibold"
            style={{ background: P }}>Track</button>
        )}
      </div>
      {/* Hero card */}
      <div className="rounded-2xl p-5 mb-5 relative overflow-hidden"
        style={{ background: `linear-gradient(135deg, ${P} 0%, #0072e5 100%)` }}>
        <div className="absolute -right-4 -top-4 w-24 h-24 rounded-full opacity-15"
          style={{ background: "#fff" }} />
        <div className="text-slate-900/70 text-xs mb-1">Active parcel</div>
        <div className="text-slate-900 font-bold text-base mb-0.5">PML-207240711-B2E1</div>
        <div className="text-slate-900/80 text-xs mb-3 flex items-center gap-1">
          <MapPin className="w-3 h-3" /> Wernhil Park Mall Â· Door 12
        </div>
        <button onClick={() => go("mobile_tracking")}
          className="px-4 py-2 rounded-lg text-sm font-semibold flex items-center gap-1.5"
          style={{ background: "rgba(0,0,0,0.2)", color: "#fff" }}>
          View Details <ChevronRight className="w-4 h-4" />
        </button>
      </div>
      {/* Recent */}
      <div className="text-slate-900/40 text-[11px] font-mono uppercase tracking-wider mb-3">Recent Parcels</div>
      <div className="flex flex-col gap-2.5">
        {recent.map(p => (
          <button key={p.id} onClick={() => go("mobile_tracking")}
            className="w-full flex items-center gap-3 p-3.5 rounded-xl text-left transition-colors"
            style={{ background: "rgba(0,0,0,0.05)", border: "1px solid rgba(0,0,0,0.08)" }}>
            <div className="w-2 h-2 rounded-full shrink-0" style={{ background: p.color }} />
            <div className="flex-1 min-w-0">
              <div className="text-slate-900 text-xs font-mono truncate">{p.id}</div>
              <div className="text-slate-900/40 text-[11px] flex items-center gap-1 mt-0.5">
                <MapPin className="w-3 h-3" /> {p.location}
              </div>
            </div>
            <Badge color={p.color as string}>{p.status}</Badge>
          </button>
        ))}
      </div>
      <div className="mt-5 flex items-center justify-center gap-8 pt-3 border-t border-black/[0.07]">
        {[
          { icon: Home, label: "Home", active: true },
          { icon: Package, label: "Parcels", active: false },
          { icon: MapPin, label: "Lockers", active: false },
          { icon: User, label: "Profile", active: false },
        ].map(({ icon: Icon, label, active }) => (
          <button key={label} className="flex flex-col items-center gap-1">
            <Icon className="w-5 h-5" style={{ color: active ? O : "rgba(0,0,0,0.3)" }} />
            <span className="text-[10px]" style={{ color: active ? O : "rgba(0,0,0,0.3)" }}>{label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}

// â”€â”€â”€ MOBILE: TRACKING â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
function MobileTracking({ go }: { go: (s: Screen) => void }) {
  const steps = [
    { label: "Created", time: "16 Jul, 08:14", done: true, icon: Package },
    { label: "Payment Confirmed", time: "16 Jul, 08:15", done: true, icon: CreditCard },
    { label: "Deposited at Locker", time: "16 Jul, 09:02", done: true, icon: Lock },
    { label: "Ready for Pickup", time: "16 Jul, 09:03", done: true, icon: CheckCircle, active: true },
    { label: "Collected", time: "Pending", done: false, icon: Package2 },
  ];
  return (
    <div className="px-5 pb-8">
      <div className="flex items-center gap-3 mb-5">
        <button onClick={() => go("mobile_home")}
          className="w-8 h-8 rounded-xl flex items-center justify-center"
          style={{ background: "rgba(0,0,0,0.08)" }}>
          <ArrowLeft className="w-4 h-4 text-slate-900/60" />
        </button>
        <div>
          <div className="text-slate-900 font-semibold text-sm">Tracking Details</div>
          <div className="text-slate-900/40 text-[10px] font-mono">PML-207240711-B2E1</div>
        </div>
      </div>
      {/* Status card */}
      <div className="rounded-2xl p-4 mb-5"
        style={{ background: `${G}18`, border: `1px solid ${G}40` }}>
        <div className="flex items-center justify-between mb-1">
          <Badge color={G}>READY FOR PICKUP</Badge>
          <Clock className="w-4 h-4 text-slate-900/30" />
        </div>
        <div className="text-slate-900 text-sm mt-2 font-semibold">Wernhil Park Mall Â· Door #12</div>
        <div className="text-slate-900/50 text-xs mt-0.5">Free pickup period: 10h 22m remaining</div>
      </div>
      {/* Timeline */}
      <div className="relative pl-5">
        <div className="absolute left-[7px] top-2 bottom-2 w-px" style={{ background: "rgba(0,0,0,0.1)" }} />
        {steps.map((s, i) => (
          <div key={i} className="flex items-start gap-3 mb-4 relative">
            <div className="absolute left-[-13px] top-1 w-4 h-4 rounded-full flex items-center justify-center z-10"
              style={{
                background: s.done ? (s.active ? G : "rgba(0,0,0,0.2)") : BG,
                border: `2px solid ${s.done ? (s.active ? G : "rgba(0,0,0,0.2)") : "rgba(0,0,0,0.12)"}`,
              }}>
              {s.done && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
            </div>
            <div className="flex-1 pb-1">
              <div className="text-sm font-semibold" style={{ color: s.active ? "#fff" : s.done ? "rgba(0,0,0,0.7)" : "rgba(0,0,0,0.3)" }}>
                {s.label}
              </div>
              <div className="text-[11px] mt-0.5" style={{ color: s.done ? "rgba(0,0,0,0.35)" : "rgba(0,0,0,0.2)" }}>
                {s.time}
              </div>
            </div>
          </div>
        ))}
      </div>
      {/* QR Code */}
      <Glass className="p-4 text-center mt-2">
        <div className="text-slate-900/40 text-[11px] font-mono uppercase tracking-wider mb-3">Collection QR Code</div>
        <div className="inline-grid grid-cols-7 gap-0.5 p-3 rounded-xl bg-white mx-auto mb-2">
          {Array.from({ length: 49 }).map((_, i) => (
            <div key={i} className="w-4 h-4 rounded-[1px]"
              style={{ background: Math.random() > 0.45 ? "#000" : "#fff" }} />
          ))}
        </div>
        <div className="text-slate-900/35 text-[10px]">Show at kiosk or tap Unlock</div>
      </Glass>
      <button onClick={() => go("mobile_proximity")}
        className="w-full mt-4 py-3.5 rounded-xl font-semibold flex items-center justify-center gap-2 text-slate-900"
        style={{ background: P }}>
        <Bluetooth className="w-5 h-5" /> Unlock with Bluetooth
      </button>
    </div>
  );
}

// â”€â”€â”€ MOBILE: PROXIMITY UNLOCK â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
function MobileProximity({ go }: { go: (s: Screen) => void }) {
  const [phase, setPhase] = useState<"scanning" | "found" | "unlocked">("scanning");
  useEffect(() => {
    const t1 = setTimeout(() => setPhase("found"), 1800);
    return () => clearTimeout(t1);
  }, []);
  return (
    <div className="px-5 pb-8">
      <div className="flex items-center gap-3 mb-6">
        <button onClick={() => go("mobile_tracking")}
          className="w-8 h-8 rounded-xl flex items-center justify-center"
          style={{ background: "rgba(0,0,0,0.08)" }}>
          <ArrowLeft className="w-4 h-4 text-slate-900/60" />
        </button>
        <div className="text-slate-900 font-semibold text-sm">Proximity Unlock</div>
      </div>
      <div className="flex flex-col items-center gap-6 mt-4">
        {/* Bluetooth animation */}
        <div className="relative flex items-center justify-center" style={{ width: 180, height: 180 }}>
          {[1, 2, 3].map(i => (
            <div key={i} className="absolute rounded-full border opacity-20 animate-ping"
              style={{
                width: i * 50 + 30, height: i * 50 + 30,
                borderColor: phase === "unlocked" ? G : P,
                animationDuration: `${1.2 + i * 0.4}s`,
                animationDelay: `${i * 0.2}s`,
              }} />
          ))}
          <div className="w-16 h-16 rounded-full flex items-center justify-center z-10 border-2"
            style={{
              background: phase === "unlocked" ? `${G}20` : `${P}20`,
              borderColor: phase === "unlocked" ? G : P,
            }}>
            {phase === "unlocked"
              ? <Unlock className="w-8 h-8" style={{ color: G }} />
              : <Bluetooth className="w-8 h-8" style={{ color: P }} />
            }
          </div>
        </div>
        <div className="text-center">
          {phase === "scanning" && (
            <>
              <div className="text-slate-900 font-bold text-lg mb-1">Scanning for Lockerâ€¦</div>
              <div className="text-slate-900/45 text-sm">Stand within 1 metre of the locker</div>
            </>
          )}
          {phase === "found" && (
            <>
              <Badge color={O}>LOCKER DETECTED</Badge>
              <div className="text-slate-900 font-bold text-lg mt-2 mb-1">PML-WPM-12 Â· 3.2m away</div>
              <div className="text-slate-900/45 text-sm">Wernhil Park Mall Â· Bank A Â· Door 12</div>
            </>
          )}
          {phase === "unlocked" && (
            <>
              <Badge color={G}>DOOR UNLOCKED</Badge>
              <div className="text-slate-900 font-bold text-lg mt-2 mb-1">Door is Open!</div>
              <div className="text-slate-900/45 text-sm">Collect your parcel and close the door</div>
            </>
          )}
        </div>
        {phase === "found" && (
          <button onClick={() => setPhase("unlocked")}
            className="w-full max-w-xs py-3.5 rounded-xl font-semibold flex items-center justify-center gap-2 text-slate-900"
            style={{ background: G }}>
            <Unlock className="w-5 h-5" /> Unlock Door Now
          </button>
        )}
        {phase === "unlocked" && (
          <button onClick={() => go("mobile_home")}
            className="w-full max-w-xs py-3.5 rounded-xl font-semibold text-slate-900 transition-colors"
            style={{ background: "rgba(0,0,0,0.1)", border: "1px solid rgba(0,0,0,0.15)" }}>
            Done
          </button>
        )}
      </div>
    </div>
  );
}

// â”€â”€â”€ COURIER: DASHBOARD â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
function CourierDashboard({ go }: { go: (s: Screen) => void }) {
  const tasks = [
    { id: "PML-207240715-C1R4", action: "COLLECT", loc: "Wernhil Park Mall", time: "10:00", priority: true },
    { id: "PML-207240715-D5P2", action: "DROP-OFF", loc: "Grove Mall Eros", time: "10:45", priority: false },
    { id: "PML-207240715-E8K7", action: "COLLECT", loc: "Maerua Mall", time: "11:20", priority: false },
    { id: "PML-207240716-A3F9", action: "DROP-OFF", loc: "Katutura Shoprite", time: "12:00", priority: true },
  ];
  return (
    <div className="px-5 pb-8">
      <div className="flex items-center justify-between mb-5">
        <div>
          <div className="text-slate-900/40 text-xs">Good morning,</div>
          <div className="text-slate-900 font-bold text-lg">David Nghipandulwa</div>
          <div className="text-slate-900/30 text-[11px] font-mono">Driver ID: PML-DRV-042</div>
        </div>
        <div className="w-9 h-9 rounded-full flex items-center justify-center text-slate-900 font-bold text-sm"
          style={{ background: O }}>DN</div>
      </div>
      {/* Metrics */}
      <div className="grid grid-cols-2 gap-3 mb-5">
        <button onClick={() => go("courier_scan")}
          className="p-4 rounded-2xl flex flex-col gap-2 text-left"
          style={{ background: `${P}20`, border: `1px solid ${P}40` }}>
          <div className="flex items-center gap-2">
            <ScanLine className="w-4 h-4" style={{ color: P }} />
            <span className="text-slate-900/50 text-xs">Pickups</span>
          </div>
          <div className="text-3xl font-bold font-mono text-slate-900">12</div>
          <Badge color={P}>Today</Badge>
        </button>
        <button onClick={() => go("courier_handoff")}
          className="p-4 rounded-2xl flex flex-col gap-2 text-left"
          style={{ background: `${O}18`, border: `1px solid ${O}35` }}>
          <div className="flex items-center gap-2">
            <Truck className="w-4 h-4" style={{ color: O }} />
            <span className="text-slate-900/50 text-xs">Drop-offs</span>
          </div>
          <div className="text-3xl font-bold font-mono text-slate-900">8</div>
          <Badge color={O}>Today</Badge>
        </button>
      </div>
      {/* Start route */}
      <button onClick={() => go("courier_route")}
        className="w-full py-3.5 rounded-xl flex items-center justify-center gap-2 font-semibold text-slate-900 mb-4"
        style={{ background: P }}>
        <Navigation className="w-4 h-4" /> Start Today's Route
      </button>
      {/* Task list */}
      <div className="text-slate-900/35 text-[11px] font-mono uppercase tracking-wider mb-3">Task Queue</div>
      <div className="flex flex-col gap-2">
        {tasks.map(t => (
          <div key={t.id} className="flex items-center gap-3 p-3 rounded-xl"
            style={{ background: "rgba(0,0,0,0.05)", border: "1px solid rgba(0,0,0,0.08)" }}>
            <div className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0"
              style={{ background: t.action === "COLLECT" ? `${P}25` : `${O}25` }}>
              {t.action === "COLLECT"
                ? <ScanLine className="w-3.5 h-3.5" style={{ color: P }} />
                : <Truck className="w-3.5 h-3.5" style={{ color: O }} />
              }
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-slate-900 text-xs font-mono truncate">{t.id}</div>
              <div className="text-slate-900/40 text-[10px] flex items-center gap-1">
                <MapPin className="w-3 h-3" /> {t.loc}
              </div>
            </div>
            <div className="text-right shrink-0">
              <div className="text-slate-900/60 text-xs font-mono">{t.time}</div>
              {t.priority && <div className="text-[9px] mt-0.5" style={{ color: O }}>Priority</div>}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// â”€â”€â”€ COURIER: ROUTE â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
function CourierRoute({ go }: { go: (s: Screen) => void }) {
  const stops = [
    { n: 1, name: "Wernhil Park Mall", dist: "2.3 km", eta: "8 min", done: false, active: true },
    { n: 2, name: "Grove Mall Eros", dist: "5.8 km", eta: "16 min", done: false, active: false },
    { n: 3, name: "Maerua Mall", dist: "7.1 km", eta: "22 min", done: false, active: false },
    { n: 4, name: "Katutura Shoprite", dist: "12.4 km", eta: "31 min", done: false, active: false },
  ];
  return (
    <div className="pb-8">
      {/* Map */}
      <div className="relative h-48 overflow-hidden">
        <svg viewBox="0 0 390 192" className="w-full h-full">
          <rect width="390" height="192" fill="#071220" />
          <defs>
            <pattern id="mapgrid" width="25" height="25" patternUnits="userSpaceOnUse">
              <path d="M 25 0 L 0 0 0 25" fill="none" stroke="rgba(0,0,0,0.04)" strokeWidth="0.5" />
            </pattern>
          </defs>
          <rect width="390" height="192" fill="url(#mapgrid)" />
          <line x1="0" y1="96" x2="390" y2="96" stroke="rgba(0,0,0,0.07)" strokeWidth="3" />
          <line x1="195" y1="0" x2="195" y2="192" stroke="rgba(0,0,0,0.07)" strokeWidth="3" />
          <polyline points="60,150 130,100 220,130 320,70" fill="none" stroke={P} strokeWidth="2.5" strokeDasharray="5,3" />
          {[{ x: 60, y: 150, active: true }, { x: 130, y: 100, active: false }, { x: 220, y: 130, active: false }, { x: 320, y: 70, active: false }].map((p, i) => (
            <g key={i}>
              <circle cx={p.x} cy={p.y} r={p.active ? 10 : 7} fill={p.active ? O : P} opacity={0.9} />
              <text x={p.x} y={p.y + 4} textAnchor="middle" fill="white" fontSize="8" fontWeight="bold">{i + 1}</text>
            </g>
          ))}
          {/* Current position dot */}
          <circle cx={60} cy={150} r={4} fill="#fff" opacity={0.9} />
        </svg>
        <div className="absolute top-3 left-3 px-3 py-1.5 rounded-lg flex items-center gap-2"
          style={{ background: "rgba(0,0,0,0.6)", backdropFilter: "blur(8px)" }}>
          <Navigation className="w-3.5 h-3.5" style={{ color: O }} />
          <span className="text-slate-900 text-xs font-semibold">27.6 km total Â· ~1h 17min</span>
        </div>
      </div>
      {/* Stops */}
      <div className="px-4 pt-4">
        <div className="text-slate-900/35 text-[11px] font-mono uppercase tracking-wider mb-3">Route Stops</div>
        <div className="flex flex-col gap-2 mb-4">
          {stops.map(s => (
            <div key={s.n} className="flex items-center gap-3 p-3 rounded-xl"
              style={{
                background: s.active ? `${O}15` : "rgba(0,0,0,0.05)",
                border: `1px solid ${s.active ? O + "40" : "rgba(0,0,0,0.08)"}`,
              }}>
              <div className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold text-slate-900 shrink-0"
                style={{ background: s.active ? O : "rgba(0,0,0,0.15)" }}>
                {s.n}
              </div>
              <div className="flex-1">
                <div className="text-slate-900 text-sm font-semibold">{s.name}</div>
                <div className="text-slate-900/40 text-[11px]">{s.dist} Â· ETA {s.eta}</div>
              </div>
              {s.active && <Badge color={O}>NEXT</Badge>}
            </div>
          ))}
        </div>
        <button onClick={() => go("courier_scan")}
          className="w-full py-3.5 rounded-xl font-semibold flex items-center justify-center gap-2 text-slate-900"
          style={{ background: P }}>
          <Navigation className="w-4 h-4" /> Navigate to Stop 1
        </button>
      </div>
    </div>
  );
}

// â”€â”€â”€ COURIER: SCAN WAYBILL â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
function CourierScan({ go }: { go: (s: Screen) => void }) {
  const [scanned, setScanned] = useState<string | null>(null);
  return (
    <div className="px-5 pb-8">
      <div className="flex items-center gap-3 mb-5">
        <button onClick={() => go("courier_dashboard")}
          className="w-8 h-8 rounded-xl flex items-center justify-center"
          style={{ background: "rgba(0,0,0,0.08)" }}>
          <ArrowLeft className="w-4 h-4 text-slate-900/60" />
        </button>
        <div className="text-slate-900 font-semibold text-sm">Scan Parcel Waybill</div>
      </div>
      {/* Scanner */}
      <div className="relative rounded-2xl overflow-hidden mb-4"
        style={{ height: 260, background: "#000" }}>
        <div className="absolute inset-0 flex items-center justify-center">
          <Camera className="w-12 h-12 text-slate-900/10" />
        </div>
        {/* Corner markers */}
        {[["top-6 left-6", "border-t-[3px] border-l-[3px]"],
          ["top-6 right-6", "border-t-[3px] border-r-[3px]"],
          ["bottom-6 left-6", "border-b-[3px] border-l-[3px]"],
          ["bottom-6 right-6", "border-b-[3px] border-r-[3px]"]
        ].map(([pos, cls], i) => (
          <div key={i} className={`absolute w-8 h-8 ${pos} ${cls}`} style={{ borderColor: O }} />
        ))}
        {/* Scan line */}
        <motion.div
          className="absolute left-8 right-8 h-0.5 rounded"
          style={{ background: `linear-gradient(90deg, transparent, ${O}, transparent)` }}
          animate={{ top: ["25%", "75%", "25%"] }}
          transition={{ duration: 1.8, repeat: Infinity, ease: "linear" }} />
        <div className="absolute bottom-4 left-0 right-0 flex justify-center">
          <span className="text-slate-900/40 text-xs font-mono px-4 py-1.5 rounded-full"
            style={{ background: "rgba(0,0,0,0.5)" }}>
            Point camera at barcode
          </span>
        </div>
      </div>
      {scanned ? (
        <Glass className="p-4 mb-4">
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-xl flex items-center justify-center" style={{ background: `${G}25` }}>
              <CheckCircle className="w-4 h-4" style={{ color: G }} />
            </div>
            <div>
              <div className="text-slate-900 font-semibold text-sm">{scanned}</div>
              <div className="text-slate-900/40 text-xs mt-0.5">Anna Shikongo Â· Medium Â· Door 07 assigned</div>
            </div>
          </div>
        </Glass>
      ) : null}
      <OrangeBtn onClick={() => { setScanned("PML-207240716-A3F9"); setTimeout(() => go("courier_handoff"), 800); }}
        className="w-full py-3.5">
        <ScanLine className="w-5 h-5" /> {scanned ? "Scanningâ€¦" : "Simulate Barcode Scan"}
      </OrangeBtn>
    </div>
  );
}

// â”€â”€â”€ COURIER: LOCKER HANDOFF â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
function CourierHandoff({ go }: { go: (s: Screen) => void }) {
  const [open, setOpen] = useState<number[]>([]);
  useEffect(() => {
    const t1 = setTimeout(() => setOpen([7]), 600);
    const t2 = setTimeout(() => setOpen([7, 14]), 1200);
    const t3 = setTimeout(() => setOpen([7, 14, 22]), 1800);
    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); };
  }, []);
  const parcels = [
    { door: 7, id: "PML-207240716-A3F9", receiver: "Anna Shikongo", size: "M" },
    { door: 14, id: "PML-207240715-C1R4", receiver: "Petrus Hamukwaya", size: "L" },
    { door: 22, id: "PML-207240715-E8K7", receiver: "Maria Nghiimbwa", size: "S" },
  ];
  return (
    <div className="px-5 pb-8">
      <div className="flex items-center gap-3 mb-5">
        <button onClick={() => go("courier_dashboard")}
          className="w-8 h-8 rounded-xl flex items-center justify-center"
          style={{ background: "rgba(0,0,0,0.08)" }}>
          <ArrowLeft className="w-4 h-4 text-slate-900/60" />
        </button>
        <div>
          <div className="text-slate-900 font-semibold text-sm">Locker Handoff</div>
          <div className="text-slate-900/40 text-[10px]">Wernhil Park Mall Â· Bank A</div>
        </div>
      </div>
      <Glass className="p-3 flex items-center gap-2 mb-4">
        <div className="w-2 h-2 rounded-full animate-pulse" style={{ background: G }} />
        <span className="text-slate-900/70 text-xs">3 doors opening automatically for your parcels</span>
      </Glass>
      <div className="flex flex-col gap-3">
        {parcels.map(p => (
          <div key={p.door}
            className="flex items-center gap-3 p-3.5 rounded-2xl border transition-all duration-500"
            style={{
              background: open.includes(p.door) ? `${G}15` : "rgba(0,0,0,0.05)",
              borderColor: open.includes(p.door) ? `${G}40` : "rgba(0,0,0,0.08)",
            }}>
            {/* Door visual */}
            <div className="relative w-12 h-14 shrink-0">
              <div className="w-full h-full rounded-lg border-2 flex items-center justify-center text-lg font-bold"
                style={{
                  borderColor: open.includes(p.door) ? G : "rgba(0,0,0,0.2)",
                  background: open.includes(p.door) ? `${G}20` : "rgba(0,0,0,0.06)",
                  color: open.includes(p.door) ? G : "rgba(0,0,0,0.4)",
                  transform: open.includes(p.door) ? "perspective(200px) rotateY(-25deg)" : "none",
                  transition: "all 0.6s ease",
                }}>
                {p.door}
              </div>
            </div>
            <div className="flex-1">
              <div className="text-slate-900/80 text-sm font-semibold">{p.receiver}</div>
              <div className="text-slate-900/40 text-[10px] font-mono mt-0.5">{p.id}</div>
              <div className="flex items-center gap-2 mt-1">
                <Badge color={P}>Size {p.size}</Badge>
                {open.includes(p.door) && <Badge color={G}>Door Open</Badge>}
              </div>
            </div>
          </div>
        ))}
      </div>
      {open.length === 3 && (
        <button onClick={() => go("courier_dashboard")}
          className="w-full mt-5 py-3.5 rounded-xl font-semibold text-slate-900"
          style={{ background: P }}>
          <Check className="w-4 h-4 inline mr-2" /> All Parcels Deposited
        </button>
      )}
    </div>
  );
}

// â”€â”€â”€ ADMIN LAYOUT â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
type AdminScreen = "admin_dashboard" | "admin_locker_details" | "admin_transactions" | "admin_rules";

function AdminLayout({ screen, go }: { screen: Screen; go: (s: Screen) => void }) {
  const nav = [
    { s: "admin_dashboard" as Screen, icon: LayoutDashboard, label: "Dashboard" },
    { s: "admin_locker_details" as Screen, icon: Grid3X3, label: "Lockers" },
    { s: "admin_transactions" as Screen, icon: FileText, label: "Transactions" },
    { s: "admin_rules" as Screen, icon: Settings, label: "Rules" },
  ];
  return (
    <div className="flex h-screen overflow-hidden" style={{ background: BG }}>
      {/* Sidebar */}
      <div className="w-56 shrink-0 flex flex-col border-r border-black/[0.07]"
        style={{ background: "rgba(0,0,0,0.025)" }}>
        <div className="p-5 border-b border-black/[0.07]">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ background: P }}>
              <Package className="w-4 h-4 text-slate-900" />
            </div>
            <div>
              <div className="text-slate-900 font-bold text-sm" style={{ fontFamily: "'Roboto Slab', serif" }}>PML Admin</div>
              <div className="text-slate-900/30 text-[9px] font-mono uppercase tracking-wider">Control Center</div>
            </div>
          </div>
        </div>
        <nav className="flex-1 p-3 flex flex-col gap-1">
          {nav.map(n => (
            <button key={n.s} onClick={() => go(n.s)}
              className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-left transition-all duration-150"
              style={{
                background: screen === n.s ? `${P}25` : "transparent",
                color: screen === n.s ? "#fff" : "rgba(0,0,0,0.45)",
                borderLeft: screen === n.s ? `2px solid ${P}` : "2px solid transparent",
              }}>
              <n.icon className="w-4 h-4 shrink-0" />
              <span className="text-sm font-medium">{n.label}</span>
            </button>
          ))}
        </nav>
        <div className="p-4 border-t border-black/[0.07]">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold text-slate-900"
              style={{ background: O }}>SA</div>
            <div>
              <div className="text-slate-900 text-xs font-medium">Sys Admin</div>
              <div className="text-slate-900/30 text-[10px]">admin@pml.na</div>
            </div>
          </div>
        </div>
      </div>
      {/* Main */}
      <div className="flex-1 overflow-y-auto">
        {screen === "admin_dashboard" && <AdminDashboard go={go} />}
        {screen === "admin_locker_details" && <AdminLockerDetails go={go} />}
        {screen === "admin_transactions" && <AdminTransactions go={go} />}
        {screen === "admin_rules" && <AdminRules go={go} />}
      </div>
    </div>
  );
}

// â”€â”€â”€ ADMIN: DASHBOARD â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
const revenueData = [
  { day: "Mon", revenue: 4200 }, { day: "Tue", revenue: 6800 },
  { day: "Wed", revenue: 5400 }, { day: "Thu", revenue: 7200 },
  { day: "Fri", revenue: 9100 }, { day: "Sat", revenue: 11400 },
  { day: "Sun", revenue: 8300 },
];
const occupancyData = [
  { time: "06h", pct: 22 }, { time: "08h", pct: 48 }, { time: "10h", pct: 72 },
  { time: "12h", pct: 81 }, { time: "14h", pct: 75 }, { time: "16h", pct: 88 },
  { time: "18h", pct: 93 }, { time: "20h", pct: 79 }, { time: "22h", pct: 54 },
];

function AdminDashboard({ go }: { go: (s: Screen) => void }) {
  const metrics = [
    { label: "Lockers Online", value: "247", sub: "3 in maintenance", icon: Server, color: P },
    { label: "Active Parcels", value: "1,842", sub: "+124 today", icon: Package, color: G },
    { label: "Overdue Parcels", value: "38", sub: "Requires action", icon: AlertTriangle, color: R },
    { label: "Revenue Today", value: "N$52,140", sub: "+18% vs yesterday", icon: DollarSign, color: O },
  ];
  const alerts = [
    { msg: "Locker PML-WPM-08 door sensor fault", time: "2m ago", level: "error" },
    { msg: "Overdue notice sent: 12 parcels at Grove Mall", time: "14m ago", level: "warn" },
    { msg: "New locker bank PML-KAT-03 came online", time: "1h ago", level: "info" },
    { msg: "Revenue milestone: N$50,000 exceeded", time: "2h ago", level: "success" },
  ];
  return (
    <div className="p-6">
      {/* Top bar */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-slate-900 text-xl font-bold" style={{ fontFamily: "'Roboto Slab', serif" }}>Overview</h1>
          <div className="text-slate-900/40 text-sm">Wednesday, 16 July 2025</div>
        </div>
        <div className="flex items-center gap-3">
          <button className="px-3 py-2 rounded-lg flex items-center gap-2 text-sm text-slate-900/60 transition-colors hover:text-slate-900"
            style={{ background: "rgba(0,0,0,0.07)", border: "1px solid rgba(0,0,0,0.1)" }}>
            <RefreshCw className="w-4 h-4" /> Refresh
          </button>
          <button className="px-3 py-2 rounded-lg flex items-center gap-2 text-sm text-slate-900"
            style={{ background: P }}>
            <Download className="w-4 h-4" /> Export
          </button>
        </div>
      </div>
      {/* Metrics */}
      <div className="grid grid-cols-4 gap-4 mb-6">
        {metrics.map(m => (
          <Glass key={m.label} className="p-4">
            <div className="flex items-start justify-between mb-3">
              <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: `${m.color}20` }}>
                <m.icon className="w-4.5 h-4.5" style={{ color: m.color }} />
              </div>
              <TrendingUp className="w-4 h-4 text-slate-900/20" />
            </div>
            <div className="text-2xl font-bold font-mono text-slate-900">{m.value}</div>
            <div className="text-slate-900/40 text-xs mt-1">{m.label}</div>
            <div className="text-[11px] mt-0.5" style={{ color: m.color }}>{m.sub}</div>
          </Glass>
        ))}
      </div>
      {/* Charts */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <Glass className="col-span-2 p-4">
          <div className="flex items-center justify-between mb-4">
            <div>
              <div className="text-slate-900 font-semibold text-sm">Revenue (7 days)</div>
              <div className="text-slate-900/40 text-xs">N$ collected across all lockers</div>
            </div>
            <Badge color={G}>â†‘ 18%</Badge>
          </div>
          <ResponsiveContainer width="100%" height={160}>
            <BarChart data={revenueData} barSize={24}>
              <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fill: "rgba(0,0,0,0.35)", fontSize: 11 }} />
              <YAxis hide />
              <Tooltip contentStyle={{ background: "#0c1829", border: "1px solid rgba(0,0,0,0.1)", borderRadius: 8, color: "#fff", fontSize: 12 }} />
              <Bar dataKey="revenue" fill={P} radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </Glass>
        <Glass className="p-4">
          <div className="text-slate-900 font-semibold text-sm mb-1">Occupancy Today</div>
          <div className="text-slate-900/40 text-xs mb-4">% of lockers in use by hour</div>
          <ResponsiveContainer width="100%" height={160}>
            <AreaChart data={occupancyData}>
              <defs>
                <linearGradient id="occ" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor={O} stopOpacity={0.4} />
                  <stop offset="100%" stopColor={O} stopOpacity={0} />
                </linearGradient>
              </defs>
              <XAxis dataKey="time" axisLine={false} tickLine={false} tick={{ fill: "rgba(0,0,0,0.35)", fontSize: 10 }} />
              <YAxis hide />
              <Tooltip contentStyle={{ background: "#0c1829", border: "1px solid rgba(0,0,0,0.1)", borderRadius: 8, color: "#fff", fontSize: 12 }} />
              <Area type="monotone" dataKey="pct" stroke={O} strokeWidth={2} fill="url(#occ)" />
            </AreaChart>
          </ResponsiveContainer>
        </Glass>
      </div>
      {/* Alerts */}
      <Glass className="p-4">
        <div className="flex items-center justify-between mb-3">
          <div className="text-slate-900 font-semibold text-sm">System Alerts</div>
          <button className="text-xs" style={{ color: P }}>View all</button>
        </div>
        <div className="flex flex-col gap-2">
          {alerts.map((a, i) => {
            const colors = { error: R, warn: O, info: P, success: G };
            const c = colors[a.level as keyof typeof colors];
            return (
              <div key={i} className="flex items-center gap-3 py-2 border-b border-black/[0.06] last:border-0">
                <div className="w-1.5 h-1.5 rounded-full shrink-0" style={{ background: c }} />
                <span className="text-slate-900/70 text-sm flex-1">{a.msg}</span>
                <span className="text-slate-900/30 text-xs shrink-0 font-mono">{a.time}</span>
              </div>
            );
          })}
        </div>
      </Glass>
    </div>
  );
}

// â”€â”€â”€ ADMIN: LOCKER DETAILS â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
function AdminLockerDetails({ go }: { go: (s: Screen) => void }) {
  const statuses = ["empty", "occupied", "overdue", "empty", "maintenance", "occupied",
    "occupied", "empty", "overdue", "occupied", "empty", "empty",
    "occupied", "overdue", "empty", "occupied", "occupied", "empty",
    "maintenance", "occupied", "empty", "overdue", "occupied", "empty",
    "empty", "occupied", "occupied", "empty", "occupied", "overdue"];
  const colorMap: Record<string, string> = {
    empty: "rgba(0,0,0,0.08)",
    occupied: `${P}30`,
    overdue: `${R}30`,
    maintenance: `${O}20`,
  };
  const borderMap: Record<string, string> = {
    empty: "rgba(0,0,0,0.1)",
    occupied: `${P}50`,
    overdue: `${R}55`,
    maintenance: `${O}45`,
  };
  const textMap: Record<string, string> = { empty: "rgba(0,0,0,0.3)", occupied: P, overdue: R, maintenance: O };
  const [popped, setPopped] = useState<number | null>(null);
  const stats = statuses.reduce((acc, s) => { acc[s] = (acc[s] || 0) + 1; return acc; }, {} as Record<string, number>);
  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-slate-900 text-xl font-bold" style={{ fontFamily: "'Roboto Slab', serif" }}>Locker Grid</h1>
          <div className="text-slate-900/40 text-sm">Wernhil Park Mall Â· Bank A Â· 30 Doors</div>
        </div>
        <div className="flex items-center gap-2">
          {Object.entries(stats).map(([s, n]) => (
            <div key={s} className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg"
              style={{ background: colorMap[s], border: `1px solid ${borderMap[s]}` }}>
              <div className="w-2 h-2 rounded-full" style={{ background: textMap[s] }} />
              <span className="text-xs font-mono" style={{ color: textMap[s] }}>{n} {s}</span>
            </div>
          ))}
        </div>
      </div>
      <div className="grid grid-cols-6 gap-2 mb-6">
        {statuses.map((s, i) => (
          <div key={i}
            className="aspect-square rounded-xl flex flex-col items-center justify-center gap-1 border cursor-pointer transition-all duration-200 hover:scale-105"
            style={{ background: colorMap[s], borderColor: borderMap[s] }}
            onClick={() => setPopped(popped === i ? null : i)}>
            <span className="text-xs font-mono font-bold" style={{ color: textMap[s] }}>
              {String(i + 1).padStart(2, "0")}
            </span>
            {s === "occupied" && <Lock className="w-3 h-3" style={{ color: P }} />}
            {s === "overdue" && <AlertTriangle className="w-3 h-3" style={{ color: R }} />}
            {s === "maintenance" && <Settings className="w-3 h-3" style={{ color: O }} />}
            {s === "empty" && <div className="w-3 h-3 rounded border border-black/15" />}
          </div>
        ))}
      </div>
      {popped !== null && (
        <Glass className="p-4 mt-2">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-slate-900 font-semibold">Door #{String(popped + 1).padStart(2, "0")} â€” {statuses[popped].toUpperCase()}</div>
              {statuses[popped] === "occupied" && (
                <div className="text-slate-900/40 text-xs mt-1">PML-207240714-X2Y1 Â· Anna Shikongo Â· Deposited 06:22</div>
              )}
              {statuses[popped] === "overdue" && (
                <div className="text-xs mt-1" style={{ color: R }}>4h 12m overdue Â· Overstay fee: N$41.20</div>
              )}
            </div>
            <button
              className="px-3 py-1.5 rounded-lg text-slate-900 text-xs font-semibold flex items-center gap-1.5"
              style={{ background: statuses[popped] === "overdue" ? R : P }}>
              <Unlock className="w-3.5 h-3.5" /> Pop Door Open
            </button>
          </div>
        </Glass>
      )}
    </div>
  );
}

// â”€â”€â”€ ADMIN: TRANSACTION LOG â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
function AdminTransactions({ go }: { go: (s: Screen) => void }) {
  const rows = [
    { id: "PML-207240716-A3F9", action: "DEPOSITED", locker: "WPM-12", payer: "Sender", amount: "N$55", time: "09:02", status: "active" },
    { id: "PML-207240716-B1K2", action: "COLLECTED", locker: "GML-07", payer: "Receiver", amount: "N$55", time: "08:44", status: "closed" },
    { id: "PML-207240716-C9R1", action: "OVERDUE FEE", locker: "MAE-03", payer: "Receiver", amount: "N$30", time: "08:31", status: "warn" },
    { id: "PML-207240716-D7P5", action: "DEPOSITED", locker: "KAT-22", payer: "Sender", amount: "N$35", time: "08:15", status: "active" },
    { id: "PML-207240715-F2X8", action: "COLLECTED", locker: "WPM-18", payer: "Sender", amount: "N$85", time: "07:58", status: "closed" },
    { id: "PML-207240715-G4T6", action: "OVERDUE FEE", locker: "GML-14", payer: "Receiver", amount: "N$70", time: "07:33", status: "warn" },
    { id: "PML-207240715-H8V3", action: "DEPOSITED", locker: "MAE-09", payer: "Sender", amount: "N$120", time: "07:11", status: "active" },
    { id: "PML-207240715-I6Q2", action: "COLLECTED", locker: "KAT-05", payer: "Receiver", amount: "N$35", time: "06:49", status: "closed" },
  ];
  const statusColors: Record<string, string> = { active: P, closed: G, warn: R };
  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-slate-900 text-xl font-bold" style={{ fontFamily: "'Roboto Slab', serif" }}>Transaction Log</h1>
          <div className="text-slate-900/40 text-sm">All system events Â· Today</div>
        </div>
        <div className="flex items-center gap-2">
          <button className="px-3 py-2 rounded-lg flex items-center gap-2 text-sm text-slate-900/60"
            style={{ background: "rgba(0,0,0,0.07)", border: "1px solid rgba(0,0,0,0.1)" }}>
            <Filter className="w-4 h-4" /> Filter
          </button>
          <button className="px-3 py-2 rounded-lg flex items-center gap-2 text-sm text-slate-900"
            style={{ background: P }}>
            <Download className="w-4 h-4" /> Export CSV
          </button>
        </div>
      </div>
      {/* Table */}
      <Glass className="overflow-hidden">
        <div className="grid text-[11px] font-mono uppercase tracking-wider text-slate-900/35 px-5 py-3 border-b border-black/[0.07]"
          style={{ gridTemplateColumns: "2fr 1.2fr 0.8fr 0.8fr 0.8fr 0.8fr 0.6fr" }}>
          <span>Parcel ID</span><span>Action</span><span>Locker</span>
          <span>Payer</span><span>Amount</span><span>Time</span><span>Status</span>
        </div>
        {rows.map((r, i) => (
          <div key={i}
            className="grid items-center px-5 py-3.5 border-b border-black/[0.05] last:border-0 hover:bg-white/[0.03] transition-colors cursor-pointer"
            style={{ gridTemplateColumns: "2fr 1.2fr 0.8fr 0.8fr 0.8fr 0.8fr 0.6fr" }}>
            <span className="text-xs font-mono text-slate-900/70">{r.id}</span>
            <span className="text-xs font-mono" style={{ color: r.action.includes("FEE") ? R : r.action === "COLLECTED" ? G : "rgba(0,0,0,0.7)" }}>
              {r.action}
            </span>
            <span className="text-xs font-mono text-slate-900/50">{r.locker}</span>
            <span className="text-xs text-slate-900/50">{r.payer}</span>
            <span className="text-xs font-mono text-slate-900/70 font-semibold">{r.amount}</span>
            <span className="text-xs font-mono text-slate-900/40">{r.time}</span>
            <div>
              <div className="w-2 h-2 rounded-full" style={{ background: statusColors[r.status] }} />
            </div>
          </div>
        ))}
      </Glass>
      <div className="flex items-center justify-between mt-4 text-slate-900/40 text-xs">
        <span className="font-mono">Showing 8 of 1,284 records today</span>
        <div className="flex items-center gap-2">
          <button className="px-3 py-1.5 rounded-lg" style={{ background: "rgba(0,0,0,0.07)" }}>
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button className="px-3 py-1.5 rounded-lg" style={{ background: "rgba(0,0,0,0.07)" }}>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}

// â”€â”€â”€ ADMIN: OVERDUE RULES â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
function AdminRules({ go }: { go: (s: Screen) => void }) {
  const [freeHours, setFreeHours] = useState(12);
  const [feePerHour, setFeePerHour] = useState(10);
  const [graceMin, setGraceMin] = useState(15);
  const [smsAlert, setSmsAlert] = useState(true);
  const [emailAlert, setEmailAlert] = useState(true);
  const [autoCharge, setAutoCharge] = useState(false);
  const [saved, setSaved] = useState(false);
  const save = () => { setSaved(true); setTimeout(() => setSaved(false), 2500); };
  const Toggle = ({ on, toggle }: { on: boolean; toggle: () => void }) => (
    <button onClick={toggle} className="w-12 h-6 rounded-full relative transition-colors duration-200"
      style={{ background: on ? P : "rgba(0,0,0,0.15)" }}>
      <div className="absolute top-1 w-4 h-4 bg-white rounded-full transition-all duration-200"
        style={{ left: on ? "calc(100% - 20px)" : "4px" }} />
    </button>
  );
  const NumField = ({ label, value, onChange, unit, min, max }: {
    label: string; value: number; onChange: (n: number) => void;
    unit: string; min: number; max: number;
  }) => (
    <div className="flex items-center justify-between py-4 border-b border-black/[0.06] last:border-0">
      <div>
        <div className="text-slate-900 text-sm font-semibold">{label}</div>
      </div>
      <div className="flex items-center gap-3">
        <button onClick={() => onChange(Math.max(min, value - 1))}
          className="w-8 h-8 rounded-lg flex items-center justify-center transition-colors"
          style={{ background: "rgba(0,0,0,0.1)" }}>
          <Minus className="w-3.5 h-3.5 text-slate-900/70" />
        </button>
        <div className="w-24 text-center">
          <span className="text-slate-900 font-bold text-lg font-mono">{value}</span>
          <span className="text-slate-900/40 text-xs ml-1">{unit}</span>
        </div>
        <button onClick={() => onChange(Math.min(max, value + 1))}
          className="w-8 h-8 rounded-lg flex items-center justify-center transition-colors"
          style={{ background: "rgba(0,0,0,0.1)" }}>
          <Plus className="w-3.5 h-3.5 text-slate-900/70" />
        </button>
      </div>
    </div>
  );
  return (
    <div className="p-6 max-w-2xl">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-slate-900 text-xl font-bold" style={{ fontFamily: "'Roboto Slab', serif" }}>Overdue & Fee Rules</h1>
          <div className="text-slate-900/40 text-sm">Configure collection periods and overstay charges</div>
        </div>
        {saved && <Badge color={G}>Saved âœ“</Badge>}
      </div>
      <Glass className="p-5 mb-4">
        <div className="text-slate-900/40 text-[11px] font-mono uppercase tracking-wider mb-3">Timing Configuration</div>
        <NumField label="Free Collection Period" value={freeHours} onChange={setFreeHours} unit="hours" min={1} max={72} />
        <NumField label="Grace Period after Deadline" value={graceMin} onChange={setGraceMin} unit="minutes" min={0} max={60} />
        <NumField label="Overstay Fee Rate" value={feePerHour} onChange={setFeePerHour} unit="N$/hr" min={1} max={100} />
      </Glass>
      <Glass className="p-5 mb-4">
        <div className="text-slate-900/40 text-[11px] font-mono uppercase tracking-wider mb-4">Notifications</div>
        {[
          { label: "SMS Alert to Receiver", sub: "Send SMS when parcel is overdue", value: smsAlert, toggle: () => setSmsAlert(v => !v) },
          { label: "Email Alert to Sender", sub: "Notify sender of overdue status", value: emailAlert, toggle: () => setEmailAlert(v => !v) },
          { label: "Auto-charge on Collection", sub: "Charge overstay fee automatically at pickup", value: autoCharge, toggle: () => setAutoCharge(v => !v) },
        ].map((item, i) => (
          <div key={i} className="flex items-center justify-between py-3.5 border-b border-black/[0.06] last:border-0">
            <div>
              <div className="text-slate-900 text-sm font-semibold">{item.label}</div>
              <div className="text-slate-900/40 text-xs mt-0.5">{item.sub}</div>
            </div>
            <Toggle on={item.value} toggle={item.toggle} />
          </div>
        ))}
      </Glass>
      {/* Preview */}
      <Glass className="p-4 mb-5" style={{ borderColor: `${P}40` }}>
        <div className="flex items-start gap-3">
          <Eye className="w-4 h-4 shrink-0 mt-0.5" style={{ color: P }} />
          <div>
            <div className="text-slate-900 text-xs font-semibold mb-1">Policy Preview</div>
            <div className="text-slate-900/50 text-xs leading-relaxed">
              Receivers have <strong className="text-slate-900">{freeHours} hours</strong> to collect free of charge.
              After a <strong className="text-slate-900">{graceMin}-minute</strong> grace period, overstay fees of{" "}
              <strong className="text-slate-900">N${feePerHour}/hour</strong> apply.
              {smsAlert && " SMS notifications will be sent when parcels become overdue."}
            </div>
          </div>
        </div>
      </Glass>
      <button onClick={save}
        className="w-full py-3.5 rounded-xl font-semibold text-slate-900 flex items-center justify-center gap-2 transition-all"
        style={{ background: P }}>
        <ShieldCheck className="w-5 h-5" /> Save Policy Changes
      </button>
    </div>
  );
}

// â”€â”€â”€ HUB SCREEN â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
function Hub({ go }: { go: (s: Screen) => void }) {
  const sections = [
    {
      title: "Kiosk Terminal",
      sub: "Self-service drop-off & collection",
      icon: Monitor,
      color: P,
      badge: "11 screens",
      description: "Physical locker terminal for parcel deposit, OTP collection, and QR scanning.",
      screen: "kiosk_welcome" as Screen,
      tag: "LANDSCAPE",
    },
    {
      title: "Consumer App",
      sub: "Track parcels on mobile",
      icon: Smartphone,
      color: G,
      badge: "3 screens",
      description: "End-user mobile web app for tracking parcels and unlocking lockers via Bluetooth.",
      screen: "mobile_home" as Screen,
      tag: "MOBILE",
    },
    {
      title: "Courier App",
      sub: "Driver routing & handoff",
      icon: Truck,
      color: O,
      badge: "4 screens",
      description: "Utility app for delivery drivers with optimised routing, scanning, and locker handoff.",
      screen: "courier_dashboard" as Screen,
      tag: "MOBILE",
    },
    {
      title: "Admin Dashboard",
      sub: "System operator control centre",
      icon: LayoutDashboard,
      color: "#a78bf6",
      badge: "4 screens",
      description: "Dense data dashboard for managing lockers, transactions, and overdue rules.",
      screen: "admin_dashboard" as Screen,
      tag: "DESKTOP",
    },
  ];
  return (
    <div className="min-h-screen flex flex-col"
      style={{ background: `radial-gradient(ellipse at 50% -10%, #0a1e3d 0%, ${BG} 55%)` }}>
      {/* Header */}
      <div className="px-8 pt-8 pb-6 border-b border-black/[0.06] flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl flex items-center justify-center" style={{ background: P }}>
            <Package className="w-5 h-5 text-slate-900" />
          </div>
          <div>
            <div className="text-slate-900 font-bold text-xl" style={{ fontFamily: "'Roboto Slab', serif" }}>
              PML Smart Locker
            </div>
            <div className="text-slate-900/35 text-xs font-mono uppercase tracking-wider">Ecosystem Prototype Â· v4.2</div>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-mono"
            style={{ background: `${G}18`, color: G, border: `1px solid ${G}35` }}>
            <div className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: G }} />
            All systems nominal
          </div>
        </div>
      </div>
      {/* Grid */}
      <div className="flex-1 p-8">
        <div className="mb-6">
          <h2 className="text-slate-900 text-2xl font-bold" style={{ fontFamily: "'Roboto Slab', serif" }}>
            Select Interface
          </h2>
          <p className="text-slate-900/40 text-sm mt-1">
            Four connected interfaces. Click any to enter the prototype.
          </p>
        </div>
        <div className="grid grid-cols-2 gap-5 lg:grid-cols-4">
          {sections.map(s => (
            <button key={s.title} onClick={() => go(s.screen)}
              className="group text-left p-5 rounded-2xl border flex flex-col gap-4 transition-all duration-200 hover:scale-[1.02] hover:-translate-y-0.5"
              style={{
                background: `${s.color}10`,
                borderColor: `${s.color}30`,
                boxShadow: `0 8px 30px ${s.color}08`,
              }}>
              <div className="flex items-start justify-between">
                <div className="w-11 h-11 rounded-xl flex items-center justify-center" style={{ background: `${s.color}25` }}>
                  <s.icon className="w-5.5 h-5.5" style={{ color: s.color }} />
                </div>
                <Badge color={s.color}>{s.tag}</Badge>
              </div>
              <div>
                <div className="text-slate-900 font-bold text-base mb-0.5">{s.title}</div>
                <div className="text-slate-900/45 text-xs">{s.sub}</div>
                <div className="text-slate-900/35 text-xs mt-2 leading-relaxed">{s.description}</div>
              </div>
              <div className="flex items-center justify-between mt-auto pt-2 border-t border-black/[0.07]">
                <span className="text-[11px] font-mono" style={{ color: s.color }}>{s.badge}</span>
                <div className="flex items-center gap-1 text-xs font-semibold transition-colors group-hover:text-slate-900 text-slate-900/50">
                  Enter <ChevronRight className="w-3.5 h-3.5" />
                </div>
              </div>
            </button>
          ))}
        </div>
        {/* Footer stats */}
        <div className="mt-8 flex items-center gap-8 pt-6 border-t border-black/[0.06]">
          {[
            { label: "Total Screens", value: "22" },
            { label: "Interfaces", value: "4" },
            { label: "Design System", value: "Unified" },
            { label: "Stack", value: "React + Tailwind" },
          ].map(stat => (
            <div key={stat.label} className="text-center">
              <div className="text-slate-900 font-bold text-lg font-mono">{stat.value}</div>
              <div className="text-slate-900/30 text-xs mt-0.5">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// â”€â”€â”€ APP â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
const kioskScreens: Screen[] = [
  "kiosk_welcome", "kiosk_sender_info", "kiosk_destination", "kiosk_delivery_type",
  "kiosk_payer", "kiosk_locker_size", "kiosk_payment", "kiosk_door_timer",
  "kiosk_success", "kiosk_collect_otp", "kiosk_scan_qr",
];
const mobileScreens: Screen[] = ["mobile_home", "mobile_tracking", "mobile_proximity"];
const courierScreens: Screen[] = ["courier_dashboard", "courier_route", "courier_scan", "courier_handoff"];
const adminScreens: Screen[] = ["admin_dashboard", "admin_locker_details", "admin_transactions", "admin_rules"];

export default function App() {
  const [screen, setScreen] = useState<Screen>("hub");
  const [history, setHistory] = useState<Screen[]>([]);
  const go = (s: Screen) => { setHistory(h => [...h, screen]); setScreen(s); };
  const back = () => {
    if (history.length > 0) {
      setScreen(history[history.length - 1]);
      setHistory(h => h.slice(0, -1));
    }
  };
  const toHub = () => { setScreen("hub"); setHistory([]); };

  if (screen === "hub") return <Hub go={go} />;

  if (kioskScreens.includes(screen)) {
    const content = {
      kiosk_welcome: <KioskWelcome go={go} />,
      kiosk_sender_info: <KioskSenderInfo go={go} />,
      kiosk_destination: <KioskDestination go={go} />,
      kiosk_delivery_type: <KioskDeliveryType go={go} />,
      kiosk_payer: <KioskPayerSelection go={go} />,
      kiosk_locker_size: <KioskLockerSize go={go} />,
      kiosk_payment: <KioskPayment go={go} />,
      kiosk_door_timer: <KioskDoorTimer go={go} />,
      kiosk_success: <KioskSuccess go={go} />,
      kiosk_collect_otp: <KioskCollectOTP go={go} />,
      kiosk_scan_qr: <KioskScanQR go={go} />,
    }[screen] ?? null;
    return <KioskFrame onHome={toHub}>{content}</KioskFrame>;
  }

  if (mobileScreens.includes(screen)) {
    const content = {
      mobile_home: <MobileHome go={go} />,
      mobile_tracking: <MobileTracking go={go} />,
      mobile_proximity: <MobileProximity go={go} />,
    }[screen] ?? null;
    return <PhoneFrame onHome={toHub} label="Consumer Mobile App">{content}</PhoneFrame>;
  }

  if (courierScreens.includes(screen)) {
    const content = {
      courier_dashboard: <CourierDashboard go={go} />,
      courier_route: <CourierRoute go={go} />,
      courier_scan: <CourierScan go={go} />,
      courier_handoff: <CourierHandoff go={go} />,
    }[screen] ?? null;
    return (
      <PhoneFrame onHome={toHub} label="Courier Mobile App">
        <div className="pb-16">
          {content}
        </div>
        {/* Courier bottom nav */}
        <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50"
          style={{ width: 360 }}>
          <div className="mx-5 flex items-center justify-around py-3 rounded-2xl border border-black/[0.1]"
            style={{ background: "rgba(5,13,26,0.92)", backdropFilter: "blur(16px)" }}>
            {[
              { s: "courier_dashboard" as Screen, icon: Home, label: "Home" },
              { s: "courier_route" as Screen, icon: Route, label: "Route" },
              { s: "courier_scan" as Screen, icon: ScanLine, label: "Scan" },
              { s: "courier_handoff" as Screen, icon: Layers, label: "Handoff" },
            ].map(n => (
              <button key={n.s} onClick={() => go(n.s)}
                className="flex flex-col items-center gap-1 px-4 py-1">
                <n.icon className="w-5 h-5"
                  style={{ color: screen === n.s ? O : "rgba(0,0,0,0.3)" }} />
                <span className="text-[10px]"
                  style={{ color: screen === n.s ? O : "rgba(0,0,0,0.3)" }}>
                  {n.label}
                </span>
              </button>
            ))}
          </div>
        </div>
      </PhoneFrame>
    );
  }

  if (adminScreens.includes(screen)) {
    return (
      <div className="h-screen flex flex-col" style={{ background: BG }}>
        <div className="flex items-center justify-between px-6 py-3 border-b border-black/[0.06]"
          style={{ background: "rgba(0,0,0,0.02)" }}>
          <span className="text-slate-900/25 text-xs font-mono uppercase tracking-wider">Admin Dashboard Prototype</span>
          <button onClick={toHub}
            className="flex items-center gap-1.5 text-xs text-slate-900/35 hover:text-slate-900/60 transition-colors">
            <ArrowLeft className="w-3.5 h-3.5" /> Back to Hub
          </button>
        </div>
        <div className="flex-1 overflow-hidden">
          <AdminLayout screen={screen} go={go} />
        </div>
      </div>
    );
  }

  return <Hub go={go} />;
}

