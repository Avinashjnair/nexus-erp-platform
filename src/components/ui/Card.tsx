import type { HTMLAttributes } from "react";
import { cn } from "../../lib/utils";

export function Card({ className, children, ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "bg-white rounded-[2rem] border border-border/50 shadow-[0_10px_40px_-15px_rgba(0,0,0,0.05)] relative overflow-hidden transition-shadow duration-300 hover:shadow-[0_15px_50px_-15px_rgba(0,0,0,0.1)]",
        className
      )}
      {...props}
    >
      <div className="relative z-10 w-full h-full flex flex-col p-6">
        {children}
      </div>
    </div>
  );
}

export default Card;
