import { trpc } from "@/lib/trpc";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Users, Phone, Mail, Tag, Calendar } from "lucide-react";

const SOURCE_LABELS: Record<string, string> = {
  "cumbre-digital": "Cumbre Digital",
  general: "General",
};

function formatDate(date: string | Date) {
  return new Date(date).toLocaleString("es-MX", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default function Leads() {
  const { data: leads, isLoading } = trpc.leads.list.useQuery();

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">CRM · Leads</h1>
          <p className="text-slate-400 text-sm mt-1">
            Registros capturados desde los formularios del sitio
          </p>
        </div>
        <div className="flex items-center gap-2 bg-white/5 border border-white/10 px-4 py-2 rounded-xl text-slate-300 text-sm">
          <Users className="w-4 h-4 text-primary" />
          {isLoading ? "…" : leads?.length ?? 0} registros
        </div>
      </div>

      {/* Table */}
      <div className="rounded-xl border border-white/10 overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="border-white/10 hover:bg-transparent">
              <TableHead className="text-slate-400">
                <span className="flex items-center gap-1.5">
                  <Users className="w-3.5 h-3.5" /> Nombre
                </span>
              </TableHead>
              <TableHead className="text-slate-400">
                <span className="flex items-center gap-1.5">
                  <Phone className="w-3.5 h-3.5" /> WhatsApp
                </span>
              </TableHead>
              <TableHead className="text-slate-400">
                <span className="flex items-center gap-1.5">
                  <Mail className="w-3.5 h-3.5" /> Correo
                </span>
              </TableHead>
              <TableHead className="text-slate-400">
                <span className="flex items-center gap-1.5">
                  <Tag className="w-3.5 h-3.5" /> Fuente
                </span>
              </TableHead>
              <TableHead className="text-slate-400">
                <span className="flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5" /> Fecha
                </span>
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              Array.from({ length: 5 }).map((_, i) => (
                <TableRow key={i} className="border-white/10">
                  {Array.from({ length: 5 }).map((_, j) => (
                    <TableCell key={j}>
                      <div className="h-4 bg-white/5 rounded animate-pulse w-32" />
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : leads && leads.length > 0 ? (
              leads.map((lead) => (
                <TableRow
                  key={lead.id}
                  className="border-white/10 hover:bg-white/5 transition-colors"
                >
                  <TableCell className="font-medium text-white">
                    {lead.nombreCompleto}
                  </TableCell>
                  <TableCell className="text-slate-300 font-mono text-sm">
                    {lead.whatsapp}
                  </TableCell>
                  <TableCell className="text-slate-300 text-sm">
                    {lead.email}
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant="outline"
                      className="border-primary/40 text-primary bg-primary/10 text-xs"
                    >
                      {SOURCE_LABELS[lead.fuente] ?? lead.fuente}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-slate-400 text-sm">
                    {formatDate(lead.createdAt)}
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow className="border-white/10">
                <TableCell
                  colSpan={5}
                  className="text-center text-slate-500 py-16"
                >
                  No hay registros aún. Los formularios del sitio guardarán aquí los leads.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
