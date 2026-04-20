import { cn } from "@/lib/utils";

export function PriceBlock({
  priceText,
  priceValue,
  originalPriceValue,
  size = "md",
  className,
}: {
  priceText?: string;
  priceValue?: number;
  originalPriceValue?: number;
  size?: "sm" | "md" | "lg";
  className?: string;
}) {
  const main = size === "lg" ? "text-[1.65rem]" : size === "sm" ? "text-[15px]" : "text-xl";
  const fmt = (n: number) => `${n.toLocaleString("en-US")} IQD`;

  if (!priceText && !priceValue) {
    return <div className={cn("text-xs text-muted-foreground", className)}>السعر غير معلن</div>;
  }

  const savings =
    priceValue && originalPriceValue && originalPriceValue > priceValue
      ? Math.round(((originalPriceValue - priceValue) / originalPriceValue) * 100)
      : 0;

  return (
    <div className={cn("flex flex-col items-start", className)}>
      <div className="flex items-baseline gap-2">
        <span
          className={cn(
            "font-numeric font-semibold leading-none tracking-tight text-foreground tabular-stable",
            main,
          )}
        >
          {priceText ?? (priceValue ? fmt(priceValue) : "")}
        </span>
        {savings > 0 && (
          <span className="rounded-full bg-success-soft px-2 py-0.5 text-[10px] font-semibold text-success">
            −{savings}%
          </span>
        )}
      </div>
      {originalPriceValue && savings > 0 && (
        <span className="mt-1 text-xs text-muted-foreground/80 line-through tabular-stable">
          {fmt(originalPriceValue)}
        </span>
      )}
    </div>
  );
}
