import { Button } from "@/components/ui/button";

export interface StatusOption {
  value: string;
  label: string;
}

interface StatusFilterProps {
  options: StatusOption[];
  selected: string;
  onChange: (value: string) => void;
}

export function StatusFilter({ options, selected, onChange }: StatusFilterProps) {
  return (
    <div className="flex gap-2 flex-wrap">
      {options.map((option) => (
        <Button
          key={option.value}
          variant={selected === option.value ? "default" : "outline"}
          size="sm"
          onClick={() => onChange(option.value)}
        >
          {option.label}
        </Button>
      ))}
    </div>
  );
}
