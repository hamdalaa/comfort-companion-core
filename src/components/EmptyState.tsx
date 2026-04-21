import type { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { SearchX } from "lucide-react";

export function EmptyState({
  title,
  description,
  action,
  className,
  icon,
}: {
  title: string;
  description?: string;
  action?: ReactNode;
  className?: string;
  icon?: ReactNode;
}) {
  return (
    <div
      className={cn(
        "flex min-h-[60vh] w-full items-center justify-center",
        className,
      )}
    >
      <div className="mx-auto flex w-full max-w-sm flex-col items-center gap-5 text-center">
        <div className="relative flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 text-primary">
          <span className="absolute inset-0 animate-ping rounded-2xl bg-primary/10" aria-hidden />
          {icon ?? <SearchX className="relative h-6 w-6" strokeWidth={2.2} />}
        </div>
        <div className="space-y-1.5">
          <h3 className="text-lg font-semibold tracking-tight text-foreground">{title}</h3>
          {description && (
            <p className="text-sm leading-relaxed text-muted-foreground">{description}</p>
          )}
        </div>
        {action && <div className="flex justify-center">{action}</div>}
      </div>
    </div>
  );
}
