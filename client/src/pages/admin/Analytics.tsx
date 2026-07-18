import { useState } from "react";
import { trpc } from "@/lib/trpc";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  BarChart3,
  ClipboardCheck,
  MessageCircle,
  Sparkles,
  TrendingUp,
  Users,
} from "lucide-react";

const RANGES: { label: string; days: number }[] = [
  { label: "7 días", days: 7 },
  { label: "30 días", days: 30 },
  { label: "90 días", days: 90 },
];

function formatDate(v: string | Date) {
  return new Date(v).toLocaleString("es-MX", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function StatCard({
  icon: Icon,
  label,
  value,
  hint,
}: {
  icon: typeof BarChart3;
  label: string;
  value: number | string;
  hint?: string;
}) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">
          {label}
        </CardTitle>
        <Icon className="w-4 h-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="text-3xl font-bold">{value}</div>
        {hint && <p className="text-xs text-muted-foreground mt-1">{hint}</p>}
      </CardContent>
    </Card>
  );
}

function BarRow({
  label,
  count,
  max,
}: {
  label: string;
  count: number;
  max: number;
}) {
  const pct = max > 0 ? Math.max(2, Math.round((count / max) * 100)) : 0;
  return (
    <div className="space-y-1">
      <div className="flex items-center justify-between text-sm">
        <span className="text-slate-300 truncate max-w-[70%]">{label}</span>
        <span className="text-slate-400 tabular-nums">{count}</span>
      </div>
      <div className="h-1.5 rounded-full bg-white/5 overflow-hidden">
        <div
          className="h-full bg-primary/70"
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}

export default function Analytics() {
  const [days, setDays] = useState(30);
  const summary = trpc.analytics.summary.useQuery({ days });
  const diagnostics = trpc.analytics.diagnostics.useQuery({ limit: 25 });
  const ctaClicks = trpc.analytics.ctaClicks.useQuery({ limit: 25 });

  const s = summary.data;
  const maxCta = Math.max(1, ...(s?.topCtas?.map((r) => r.count) ?? [1]));
  const maxLocation = Math.max(1, ...(s?.topLocations?.map((r) => r.count) ?? [1]));
  const maxProfile = Math.max(1, ...(s?.diagnosticsByProfile?.map((r) => r.count) ?? [1]));
  const maxSource = Math.max(1, ...(s?.leadsBySource?.map((r) => r.count) ?? [1]));

  const conversionRate =
    s && s.totals.diagnostics > 0
      ? Math.round((s.totals.completedDiagnostics / s.totals.diagnostics) * 100)
      : 0;

  return (
    <div className="p-6 space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Analytics internas</h1>
          <p className="text-slate-400 text-sm mt-1">
            Resumen de tráfico útil — diagnósticos GPS, clicks en CTAs y leads capturados.
          </p>
        </div>
        <div className="flex gap-1 rounded-xl border border-white/10 bg-white/5 p-1">
          {RANGES.map((r) => (
            <button
              key={r.days}
              onClick={() => setDays(r.days)}
              className={`px-3 py-1.5 text-sm rounded-lg transition-colors ${
                days === r.days
                  ? "bg-primary text-white"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              {r.label}
            </button>
          ))}
        </div>
      </div>

      {/* Top stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          icon={Users}
          label="Leads capturados"
          value={s?.totals.leads ?? "…"}
          hint="Formularios enviados"
        />
        <StatCard
          icon={ClipboardCheck}
          label="Diagnósticos GPS"
          value={s?.totals.diagnostics ?? "…"}
          hint={
            s
              ? `${s.totals.completedDiagnostics} completados (${conversionRate}%)`
              : ""
          }
        />
        <StatCard
          icon={MessageCircle}
          label="Clicks en CTAs"
          value={s?.totals.ctaClicks ?? "…"}
          hint="WhatsApp + otros"
        />
        <StatCard
          icon={TrendingUp}
          label="Conversión GPS → WA"
          value={`${conversionRate}%`}
          hint="Diagnóstico completado"
        />
      </div>

      {/* Breakdowns */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-primary" />
              Diagnósticos por perfil
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {(s?.diagnosticsByProfile ?? []).map((row) => (
              <BarRow
                key={row.profile}
                label={row.profile}
                count={row.count}
                max={maxProfile}
              />
            ))}
            {(!s || s.diagnosticsByProfile.length === 0) && (
              <p className="text-xs text-slate-500">Sin datos aún.</p>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Users className="w-4 h-4 text-primary" />
              Leads por fuente
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {(s?.leadsBySource ?? []).map((row) => (
              <BarRow
                key={row.fuente}
                label={row.fuente}
                count={row.count}
                max={maxSource}
              />
            ))}
            {(!s || s.leadsBySource.length === 0) && (
              <p className="text-xs text-slate-500">Sin datos aún.</p>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <MessageCircle className="w-4 h-4 text-primary" />
              Top CTAs
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {(s?.topCtas ?? []).map((row) => (
              <BarRow
                key={row.cta}
                label={row.cta}
                count={row.count}
                max={maxCta}
              />
            ))}
            {(!s || s.topCtas.length === 0) && (
              <p className="text-xs text-slate-500">Sin clicks registrados.</p>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <BarChart3 className="w-4 h-4 text-primary" />
              Top páginas (origen del click)
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {(s?.topLocations ?? []).map((row) => (
              <BarRow
                key={row.location}
                label={row.location}
                count={row.count}
                max={maxLocation}
              />
            ))}
            {(!s || s.topLocations.length === 0) && (
              <p className="text-xs text-slate-500">Sin datos aún.</p>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Recent tables */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">Últimos diagnósticos</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="max-h-96 overflow-y-auto">
              <table className="w-full text-sm">
                <thead className="text-left text-xs uppercase text-slate-500 sticky top-0 bg-background">
                  <tr>
                    <th className="py-2 pr-3">Perfil</th>
                    <th className="py-2 pr-3">Estado</th>
                    <th className="py-2 pr-3">Fuente</th>
                    <th className="py-2 pr-3">Fecha</th>
                  </tr>
                </thead>
                <tbody>
                  {(diagnostics.data ?? []).map((row: any) => (
                    <tr key={row.id} className="border-t border-white/5">
                      <td className="py-2 pr-3">{row.profile ?? "—"}</td>
                      <td className="py-2 pr-3">
                        {row.completed === "true" ? (
                          <Badge variant="outline" className="border-green-500/40 text-green-400 bg-green-500/10 text-xs">
                            Completado
                          </Badge>
                        ) : (
                          <Badge variant="outline" className="border-slate-500/40 text-slate-400 bg-slate-500/10 text-xs">
                            Iniciado
                          </Badge>
                        )}
                      </td>
                      <td className="py-2 pr-3 text-slate-400">{row.utmSource ?? "—"}</td>
                      <td className="py-2 pr-3 text-slate-400">{formatDate(row.createdAt)}</td>
                    </tr>
                  ))}
                  {!diagnostics.data?.length && (
                    <tr>
                      <td colSpan={4} className="text-center text-slate-500 py-8">
                        Sin diagnósticos aún.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">Últimos clicks</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="max-h-96 overflow-y-auto">
              <table className="w-full text-sm">
                <thead className="text-left text-xs uppercase text-slate-500 sticky top-0 bg-background">
                  <tr>
                    <th className="py-2 pr-3">CTA</th>
                    <th className="py-2 pr-3">Página</th>
                    <th className="py-2 pr-3">Fecha</th>
                  </tr>
                </thead>
                <tbody>
                  {(ctaClicks.data ?? []).map((row: any) => (
                    <tr key={row.id} className="border-t border-white/5">
                      <td className="py-2 pr-3 font-mono text-xs">{row.cta}</td>
                      <td className="py-2 pr-3 text-slate-400">{row.location ?? "—"}</td>
                      <td className="py-2 pr-3 text-slate-400">{formatDate(row.createdAt)}</td>
                    </tr>
                  ))}
                  {!ctaClicks.data?.length && (
                    <tr>
                      <td colSpan={3} className="text-center text-slate-500 py-8">
                        Sin clicks aún.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
