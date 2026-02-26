"use client";

import React from "react";

export function PageHeading({
  icon,
  children,
}: {
  icon: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <h1 className="text-2xl font-bold text-[var(--marine-dark)] mb-4 flex items-center gap-3">
      <span className="text-[var(--marine-primary)]">{icon}</span>
      {children}
    </h1>
  );
}
