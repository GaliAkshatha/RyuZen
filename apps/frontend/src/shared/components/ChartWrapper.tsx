import type { ReactElement } from "react";
import { ResponsiveContainer } from "recharts";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/shared/components/Card";
import { EmptyState } from "@/shared/components/EmptyState";

export interface ChartWrapperProps {
  title: string;
  description?: string;
  /** A single recharts chart element (LineChart, BarChart, PieChart, etc.) */
  children: ReactElement;
  height?: number;
  isEmpty?: boolean;
  emptyMessage?: string;
  className?: string;
}

/**
 * No charting library was named in the approved stack (React, Vite, TS,
 * Tailwind, shadcn/ui, Radix UI, TanStack Query, RHF, Zod, Axios, Framer
 * Motion) — a real gap, not an oversight to route around silently.
 * recharts was chosen here since it's the library shadcn/ui's own
 * official chart components are built on, making it the most
 * ecosystem-consistent choice available. Every future chart (Placement
 * Analytics, Admin Dashboard, Career Score breakdown) renders through
 * this one wrapper.
 */
export function ChartWrapper({
  title,
  description,
  children,
  height = 300,
  isEmpty = false,
  emptyMessage = "No data to display yet.",
  className,
}: ChartWrapperProps) {
  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="text-base">{title}</CardTitle>
        {description && <CardDescription>{description}</CardDescription>}
      </CardHeader>
      <CardContent>
        {isEmpty ? (
          <EmptyState title={emptyMessage} />
        ) : (
          <ResponsiveContainer width="100%" height={height}>
            {children}
          </ResponsiveContainer>
        )}
      </CardContent>
    </Card>
  );
}
