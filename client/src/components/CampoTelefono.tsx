import { useMemo, useState, type CSSProperties } from "react";
import { ChevronDown } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { listaDePaises, type Telefono } from "@shared/telefono";

/**
 * Campo de teléfono con selector de país obligatorio (CLAUDE.md §5).
 *
 * El selector arranca vacío a propósito: el país lo elige la persona, nunca se
 * asume. La validación y el paso a E.164 viven en `@shared/telefono`
 * (`telefonoAE164`), que el formulario llama al enviar.
 *
 * Cada formulario del sitio tiene su propio look, así que el campo del número
 * y el botón del país reciben la clase o el estilo del formulario que los usa.
 */

function sinAcentos(texto: string): string {
  return texto.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
}

/* No es un valor por defecto: solo el orden de la lista. Los países de donde
   más llegan visitantes van arriba para no tener que buscarlos. */
const FRECUENTES = ["MX", "US", "CO", "GT", "VE", "AR", "CL", "PE", "ES", "CA"];

interface Props {
  valor: Telefono;
  onCambio: (valor: Telefono) => void;
  /** Mensaje de error a mostrar debajo, si lo hay. */
  error?: string | null;
  placeholder?: string;
  ariaLabel?: string;
  id?: string;
  claseNumero?: string;
  estiloNumero?: CSSProperties;
  claseBoton?: string;
  estiloBoton?: CSSProperties;
  claseError?: string;
  estiloError?: CSSProperties;
  onFocus?: () => void;
  onBlur?: () => void;
}

export default function CampoTelefono({
  valor,
  onCambio,
  error,
  placeholder = "Número",
  ariaLabel = "Número de WhatsApp",
  id,
  claseNumero,
  estiloNumero,
  claseBoton,
  estiloBoton,
  claseError = "text-xs text-red-400 mt-1",
  estiloError,
  onFocus,
  onBlur,
}: Props) {
  const [abierto, setAbierto] = useState(false);
  const [busqueda, setBusqueda] = useState("");
  const paises = useMemo(() => listaDePaises(), []);
  const frecuentes = useMemo(
    () => FRECUENTES.map((c) => paises.find((p) => p.codigo === c)).filter((p): p is (typeof paises)[number] => !!p),
    [paises],
  );
  const elegido = paises.find((p) => p.codigo === valor.pais);

  const elegir = (codigo: string) => {
    onCambio({ ...valor, pais: codigo });
    setAbierto(false);
    setBusqueda("");
  };

  const item = (p: (typeof paises)[number], grupo: string) => (
    <CommandItem
      key={`${grupo}-${p.codigo}`}
      value={`${p.nombre} ${sinAcentos(p.nombre)} ${p.codigo} ${p.prefijo} ${grupo}`}
      onSelect={() => elegir(p.codigo)}
    >
      <span aria-hidden>{p.bandera}</span>
      <span className="flex-1 truncate">{p.nombre}</span>
      <span className="text-muted-foreground tabular-nums">{p.prefijo}</span>
    </CommandItem>
  );

  return (
    <div>
      <div style={{ display: "flex", gap: "8px" }}>
        <Popover open={abierto} onOpenChange={setAbierto}>
          <PopoverTrigger asChild>
            <button
              type="button"
              aria-label={elegido ? `Código de país: ${elegido.nombre} ${elegido.prefijo}` : "Selecciona el código de tu país"}
              aria-invalid={!valor.pais && !!error}
              className={claseBoton}
              style={{ display: "flex", alignItems: "center", gap: "6px", flexShrink: 0, whiteSpace: "nowrap", ...estiloBoton }}
            >
              {elegido ? (
                <>
                  <span aria-hidden>{elegido.bandera}</span>
                  <span>{elegido.prefijo}</span>
                </>
              ) : (
                <span style={{ opacity: 0.7 }}>País</span>
              )}
              <ChevronDown style={{ width: 14, height: 14, opacity: 0.6 }} />
            </button>
          </PopoverTrigger>
          <PopoverContent className="w-72 p-0 z-[200]" align="start">
            <Command>
              <CommandInput placeholder="Busca tu país o código" value={busqueda} onValueChange={setBusqueda} />
              <CommandList>
                <CommandEmpty>No encontramos ese país.</CommandEmpty>
                {/* Al buscar, los frecuentes saldrían repetidos: solo se muestran sin búsqueda. */}
                {!busqueda && (
                  <CommandGroup heading="Frecuentes">{frecuentes.map((p) => item(p, "frecuente"))}</CommandGroup>
                )}
                <CommandGroup heading="Todos los países">{paises.map((p) => item(p, "todos"))}</CommandGroup>
              </CommandList>
            </Command>
          </PopoverContent>
        </Popover>
        <input
          id={id}
          type="tel"
          inputMode="tel"
          autoComplete="tel-national"
          value={valor.numero}
          onChange={(e) => onCambio({ ...valor, numero: e.target.value })}
          onFocus={onFocus}
          onBlur={onBlur}
          placeholder={placeholder}
          aria-label={ariaLabel}
          aria-invalid={!!error}
          className={claseNumero}
          style={{ minWidth: 0, flex: 1, ...estiloNumero }}
        />
      </div>
      {error && (
        <p role="alert" className={claseError} style={estiloError}>
          {error}
        </p>
      )}
    </div>
  );
}
