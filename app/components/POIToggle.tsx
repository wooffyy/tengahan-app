import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"
import { Input } from "@/components/ui/input"

interface POIToggleProps {
  category: string[];
  setCategory: (val: string[]) => void;
  anyInput: string;
  setAnyInput: (val: string) => void;
}

export function POIToggle({ category, setCategory, anyInput, setAnyInput }: POIToggleProps) {
  return (
    <>
      <ToggleGroup
        value={category}
        onValueChange={(val: string[]) => {
          if (val.length > 0) setCategory([val[val.length - 1]]);
        }}
        className="flex flex-wrap gap-2"
      >
        <ToggleGroupItem value="Meal">Makan & Nongkrong</ToggleGroupItem>
        <ToggleGroupItem value="Mall">Mall</ToggleGroupItem>
        <ToggleGroupItem value="Sport">Olahraga</ToggleGroupItem>
        <ToggleGroupItem value="Park">Taman</ToggleGroupItem>
        <ToggleGroupItem value="Educational">Museum</ToggleGroupItem>
        <ToggleGroupItem value="Any">Lainnya</ToggleGroupItem>
      </ToggleGroup>

      {category[0] === "Any" && (
        <Input
          className="mt-2"
          placeholder="Cari tempat spesifik... (mis. lapangan padel, bowling)"
          value={anyInput}
          onChange={(e) => setAnyInput(e.target.value)}
        />
      )}
    </>
  );
}