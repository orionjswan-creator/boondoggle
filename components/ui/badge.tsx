import * as React from "react";
import { cn } from "@/lib/utils";

export function Badge({ className, ...props }: React.HTMLAttributes<HTMLSpanElement>) {
  return (
    <span
      className={cn(
        "inline-flex min-h-6 items-center rounded-full border border-line bg-cream px-2.5 py-0.5 font-mono text-[0.64rem] font-medium uppercase tracking-[0.12em] text-ink",
        className
      )}
      {...props}
    />
  );
}
