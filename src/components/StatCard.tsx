"use client";

import { ReactNode } from "react";

interface StatCardProps {
  label: string;
  value: number | string;
  icon?: ReactNode;
}

export function StatCard({ label, value, icon }: StatCardProps) {
  return (
    <div className="card p-4 flex items-start gap-3">
      {icon && (
        <div className="text-[var(--text-secondary)] mt-0.5" aria-hidden>
          {icon}
        </div>
      )}
      <div className="min-w-0 flex-1">
        <p className="text-sm text-[var(--text-secondary)]">{label}</p>
        <p className="text-xl font-semibold text-[var(--marine-dark)] mt-1 tabular-nums">
          {value}
        </p>
      </div>
    </div>
  );
}
