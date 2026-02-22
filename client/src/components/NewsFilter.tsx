import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Search } from "lucide-react";

const CATEGORIES = [
  { id: "all", label: "Todas" },
  { id: "visas-migracion", label: "Visas y Migración" },
  { id: "economia-finanzas", label: "Economía y Finanzas" },
  { id: "bienes-raices", label: "Bienes Raíces" },
  { id: "llc-negocios", label: "LLC y Negocios" },
  { id: "inversiones", label: "Inversiones" },
];

interface NewsFilterProps {
  selectedCategory: string;
  searchQuery: string;
  onCategoryChange: (category: string) => void;
  onSearchChange: (query: string) => void;
}

export function NewsFilter({
  selectedCategory,
  searchQuery,
  onCategoryChange,
  onSearchChange,
}: NewsFilterProps) {
  return (
    <div className="space-y-6">
      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
        <Input
          type="text"
          placeholder="Buscar noticias..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Categories */}
      <div className="space-y-3">
        <h3 className="font-semibold text-foreground">Categorías</h3>
        <div className="flex flex-wrap gap-2">
          {CATEGORIES.map((category) => (
            <Button
              key={category.id}
              variant={selectedCategory === category.id ? "default" : "outline"}
              size="sm"
              onClick={() => onCategoryChange(category.id)}
              className="rounded-full"
            >
              {category.label}
            </Button>
          ))}
        </div>
      </div>
    </div>
  );
}
