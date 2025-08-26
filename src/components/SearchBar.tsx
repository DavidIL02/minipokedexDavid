import { useMemo } from "react";
import debounce from "lodash.debounce";

type Props = {
  onChange: (v: string) => void;
  placeholder?: string;
};

// input con debounce: evita reventar la API al teclear
export default function SearchBar({ onChange, placeholder = "Buscar por nombre (ej. pikachu)" }: Props) {
  const debounced = useMemo(() => debounce(onChange, 400), [onChange]);

  return (
    <input
      className="input"
      placeholder={placeholder}
      onChange={(e) => debounced(e.target.value)}
      aria-label="Buscar"
    />
  );
}
