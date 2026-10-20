import { useQuery } from "@tanstack/react-query";
import { cargarEventos } from "@/lib/eventos";

/**
 * Los eventos del CMS, con una sola petición compartida por todas las
 * secciones de la página. Si el CMS no responde, `eventos` queda vacío y cada
 * sección se oculta: nunca se muestran datos viejos.
 *
 * Se vuelve a pedir cada minuto: la liga de la transmisión aparece sola cuando
 * abre la ventana del evento.
 */
export function useEventos() {
  const q = useQuery({
    queryKey: ["eventos-cms"],
    queryFn: cargarEventos,
    staleTime: 60_000,
    refetchInterval: 60_000,
    retry: 1,
  });
  return { eventos: q.data ?? [], cargando: q.isLoading, error: q.isError };
}
