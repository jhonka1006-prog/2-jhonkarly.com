import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { UserRole } from "@/context/AuthContext";
import {
  AreaChart, Area,
  PieChart, Pie, Cell,
  LineChart, Line,
  BarChart, Bar,
  XAxis, YAxis, Tooltip,
  ResponsiveContainer, Legend,
} from "recharts";
import { Users, TrendingUp, Activity, BarChart2 } from "lucide-react";

/* ── Mock time-series data (swap for real analytics when available) ── */
const MONTHLY_GROWTH = [
  { mes: "Oct", usuarios: 1 },
  { mes: "Nov", usuarios: 2 },
  { mes: "Dic", usuarios: 3 },
  { mes: "Ene", usuarios: 5 },
  { mes: "Feb", usuarios: 6 },
  { mes: "Mar", usuarios: 8 },
];

const ENGAGEMENT_DATA = [
  { mes: "Oct", nuevos: 1, recurrentes: 0 },
  { mes: "Nov", nuevos: 1, recurrentes: 1 },
  { mes: "Dic", nuevos: 1, recurrentes: 2 },
  { mes: "Ene", nuevos: 2, recurrentes: 3 },
  { mes: "Feb", nuevos: 1, recurrentes: 5 },
  { mes: "Mar", nuevos: 2, recurrentes: 6 },
];

const ACTIVITY_HOURS = [
  { hora: "00", visitas: 3 },  { hora: "03", visitas: 1 },
  { hora: "06", visitas: 6 },  { hora: "09", visitas: 20 },
  { hora: "12", visitas: 26 }, { hora: "15", visitas: 22 },
  { hora: "18", visitas: 31 }, { hora: "21", visitas: 17 },
];

const ROLE_HEX: Record<UserRole, string> = {
  admin:   "#ffffff",
  prensa:  "#bfbfbf",
  premium: "#e6e6e6",
  public:  "#2b2b2b",
};

const TICK = {
  fontSize: 11,
  fontFamily: "var(--font-body)",
  fill: "hsl(0 0% 45%)",
};

/* ── Custom tooltip ── */
const ChartTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-g900 border border-g700 px-3 py-2">
      <p className="font-body text-[0.6rem] tracking-[0.28em] uppercase text-g700 mb-1">{label}</p>
      {payload.map((p: any) => (
        <p key={p.name} className="font-body text-[0.78rem] font-semibold" style={{ color: p.color }}>
          {p.name}: {p.value}
        </p>
      ))}
    </div>
  );
};

const LegendText = (value: string) => (
  <span style={{
    fontFamily: "var(--font-body)",
    fontSize: "0.65rem",
    textTransform: "uppercase" as const,
    letterSpacing: "0.22em",
    color: "hsl(0 0% 60%)",
  }}>
    {value}
  </span>
);

/* ── Component ── */
const OverviewPage = () => {
  const [totalUsers, setTotalUsers] = useState<number | null>(null);
  const [roleData, setRoleData] = useState<{ name: string; value: number }[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      const { count } = await supabase
        .from("profiles")
        .select("*", { count: "exact", head: true });
      setTotalUsers(count ?? 0);

      const { data } = await supabase.from("profiles").select("role");
      if (data) {
        const grouped = data.reduce<Record<string, number>>((acc, row) => {
          acc[row.role] = (acc[row.role] ?? 0) + 1;
          return acc;
        }, {});
        setRoleData(Object.entries(grouped).map(([name, value]) => ({ name, value })));
      }
      setLoading(false);
    };
    load();
  }, []);

  const kpis = [
    { label: "Total registros",    value: loading ? "—" : totalUsers ?? 0, sub: "usuarios en la plataforma",    icon: Users      },
    { label: "Activos",            value: loading ? "—" : totalUsers ?? 0, sub: "últimos 30 días",              icon: Activity   },
    { label: "Crecimiento",        value: "+100%",                          sub: "vs mes anterior",              icon: TrendingUp },
    { label: "Retención",          value: "—",                              sub: "datos próximamente",           icon: BarChart2  },
  ];

  return (
    <div>
      {/* Header */}
      <div className="mb-8">
        <span className="font-body text-[0.6rem] font-semibold tracking-[0.38em] uppercase text-g700 block mb-2">
          Dashboard · Analítica
        </span>
        <h1 className="font-display text-[clamp(2rem,5vw,3.5rem)] leading-none text-foreground">
          Resumen General
        </h1>
        <p className="font-body text-sm text-g300 mt-2">
          {new Date().toLocaleDateString("es-CO", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}
        </p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 border-t border-l border-g700 mb-8">
        {kpis.map((k) => (
          <div key={k.label} className="border-b border-r border-g700 p-6">
            <div className="flex items-start justify-between mb-4">
              <span className="font-body text-[0.58rem] font-semibold tracking-[0.32em] uppercase text-g700">
                {k.label}
              </span>
              <k.icon className="w-4 h-4 text-g700 flex-shrink-0" />
            </div>
            <p className="font-display text-[2.4rem] leading-none text-foreground mb-1">{k.value}</p>
            <p className="font-body text-[0.7rem] text-g700">{k.sub}</p>
          </div>
        ))}
      </div>

      {/* Charts 2×2 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 border-t border-l border-g700">

        {/* 1 — Area: growth */}
        <div className="border-b border-r border-g700 p-6">
          <span className="font-body text-[0.58rem] font-semibold tracking-[0.32em] uppercase text-g700 block mb-1">
            Crecimiento de usuarios
          </span>
          <p className="font-body text-[0.72rem] text-g300 mb-5">Acumulado mensual</p>
          <ResponsiveContainer width="100%" height={190}>
            <AreaChart data={MONTHLY_GROWTH} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="grad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%"  stopColor="#ffffff" stopOpacity={0.12} />
                  <stop offset="95%" stopColor="#ffffff" stopOpacity={0}    />
                </linearGradient>
              </defs>
              <XAxis dataKey="mes" tick={TICK} axisLine={false} tickLine={false} />
              <YAxis tick={TICK} axisLine={false} tickLine={false} allowDecimals={false} />
              <Tooltip content={<ChartTooltip />} />
              <Area
                type="monotone"
                dataKey="usuarios"
                stroke="#ffffff"
                strokeWidth={1.5}
                fill="url(#grad)"
                name="Usuarios"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* 2 — Pie: role distribution */}
        <div className="border-b border-r border-g700 p-6">
          <span className="font-body text-[0.58rem] font-semibold tracking-[0.32em] uppercase text-g700 block mb-1">
            Distribución de roles
          </span>
          <p className="font-body text-[0.72rem] text-g300 mb-5">Segmentación de la base de usuarios</p>
          {loading ? (
            <div className="h-[190px] flex items-center justify-center font-body text-g700 text-sm">
              Cargando…
            </div>
          ) : roleData.length === 0 ? (
            <div className="h-[190px] flex items-center justify-center font-body text-g700 text-sm">
              Sin datos
            </div>
          ) : (
            <ResponsiveContainer width="100%" height={190}>
              <PieChart>
                <Pie
                  data={roleData}
                  cx="50%"
                  cy="45%"
                  innerRadius={48}
                  outerRadius={76}
                  paddingAngle={3}
                  dataKey="value"
                >
                  {roleData.map((entry) => (
                    <Cell
                      key={entry.name}
                      fill={ROLE_HEX[entry.name as UserRole] ?? "#555"}
                    />
                  ))}
                </Pie>
                <Tooltip content={<ChartTooltip />} />
                <Legend formatter={LegendText} iconSize={8} />
              </PieChart>
            </ResponsiveContainer>
          )}
        </div>

        {/* 3 — Line: engagement */}
        <div className="border-b border-r border-g700 p-6">
          <span className="font-body text-[0.58rem] font-semibold tracking-[0.32em] uppercase text-g700 block mb-1">
            Engagement
          </span>
          <p className="font-body text-[0.72rem] text-g300 mb-5">Nuevos vs. recurrentes por mes</p>
          <ResponsiveContainer width="100%" height={190}>
            <LineChart data={ENGAGEMENT_DATA} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
              <XAxis dataKey="mes" tick={TICK} axisLine={false} tickLine={false} />
              <YAxis tick={TICK} axisLine={false} tickLine={false} allowDecimals={false} />
              <Tooltip content={<ChartTooltip />} />
              <Legend formatter={LegendText} iconSize={8} />
              <Line type="monotone" dataKey="nuevos"      stroke="#ffffff" strokeWidth={1.5} dot={false} name="Nuevos"      />
              <Line type="monotone" dataKey="recurrentes" stroke="#737373" strokeWidth={1.5} dot={false} name="Recurrentes" />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* 4 — Bar: activity by hour */}
        <div className="border-b border-r border-g700 p-6">
          <span className="font-body text-[0.58rem] font-semibold tracking-[0.32em] uppercase text-g700 block mb-1">
            Actividad por hora
          </span>
          <p className="font-body text-[0.72rem] text-g300 mb-5">Tráfico web promedio (UTC-5)</p>
          <ResponsiveContainer width="100%" height={190}>
            <BarChart data={ACTIVITY_HOURS} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
              <XAxis dataKey="hora" tick={TICK} axisLine={false} tickLine={false} />
              <YAxis tick={TICK} axisLine={false} tickLine={false} allowDecimals={false} />
              <Tooltip content={<ChartTooltip />} />
              <Bar dataKey="visitas" name="Visitas" radius={[2, 2, 0, 0]}>
                {ACTIVITY_HOURS.map((entry, i) => (
                  <Cell key={i} fill={entry.hora === "18" ? "#ffffff" : "hsl(0 0% 17%)"} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

      </div>
    </div>
  );
};

export default OverviewPage;
