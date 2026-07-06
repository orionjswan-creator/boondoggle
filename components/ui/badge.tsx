import * as React from "react";
import { cn } from "@/lib/utils";

export function Badge({ className, ...props }: React.HTMLAttributes<HTMLSpanElement>) {
  return (
    <span
      className={cn(
        "inline-flex min-h-7 items-center rounded-full bg-[#efe1c8] px-2.5 py-1 text-xs font-extrabold text-ink",
        className
      )}
      {...props}
    />
  );
}
