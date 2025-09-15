/**
 * SearchBar (controlada) con debounce usando lodash.debounce.
 * - Estado local `value` para controlar el input.
 * - Debounce de onChange (400ms por defecto) para no spamear la API.
 * - Limpieza del debounce al desmontar o al cambiar dependencias.
 * - A11y: label accesible (sr-only) y aria-label en el input.
 */
import { useEffect, useMemo, useState } from "react";
import debounce from "lodash.debounce";

type Props = {
  onChange: (v: string) => void;      // notifica al padre el término de búsqueda
  placeholder?: string;                // texto de ayuda
  delay?: number;                      // ms para el debounce (default 400)
};

export default function SearchBar({
  onChange,
  placeholder = "Buscar por nombre (ej. pikachu)",
  delay = 400,
}: Props) {
  const [value, setValue] = useState("");

  // Creo la función debounced *una sola vez* por cada cambio de onChange/delay.
  // Importante: lodash.debounce devuelve una función con .cancel() y .flush().
  const debouncedOnChange = useMemo(
    () => debounce((v: string) => onChange(v), delay),
    [onChange, delay]
  );

  // Limpio el debounce cuando cambie onChange/delay o al desmontar el componente.
  useEffect(() => {
    return () => debouncedOnChange.cancel();
  }, [debouncedOnChange]);

  return (
    <label className="search">
      {/* Etiqueta accesible pero no visible */}
      <span className="sr-only">Buscar Pokémon</span>

      <input
        className="input"
        value={value}
        onChange={(e) => {
          const v = e.target.value;
          setValue(v);             // actualizo UI inmediatamente
          debouncedOnChange(v);    // notifico al padre con debounce
        }}
        placeholder={placeholder}
        aria-label="Buscar"
      />
    </label>
  );
}
