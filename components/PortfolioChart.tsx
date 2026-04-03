"use client";
  import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";
  import { Token } from "@/lib/types";

  const COLORS = ["#6366f1", "#8b5cf6", "#a78bfa", "#c4b5fd", "#818cf8", "#7c3aed"];

  export function PortfolioChart({ tokens }: { tokens: Token[] }) {
    const sorted = [...tokens].sort((a, b) => b.valueUsd - a.valueUsd);
    const top5 = sorted.slice(0, 5);
    const othersValue = sorted.slice(5).reduce((sum, t) => sum + t.valueUsd, 0);

    const data = [
      ...top5.map((t) => ({ name: t.symbol, value: t.valueUsd })),
      ...(othersValue > 0 ? [{ name: "Other", value: othersValue }] : []),
    ];

    if (data.length === 0) return null;

    return (
      <div className="bg-gray-900 rounded-xl border border-gray-800 p-6">
        <h3 className="text-white font-semibold mb-4">Allocation</h3>
        <ResponsiveContainer width="100%" height={250}>
          <PieChart>
            <Pie
              data={data}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={100}
              paddingAngle={2}
            >
              {data.map((_, i) => (
                <Cell key={i} fill={COLORS[i % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip
              formatter={(value: number) =>
                `$${value.toLocaleString(undefined, { maximumFractionDigits: 2 })}`
              }
              contentStyle={{
                background: "#1f2937",
                border: "1px solid #374151",
                borderRadius: "8px",
                color: "#fff",
              }}
            />
          </PieChart>
        </ResponsiveContainer>
        <div className="flex flex-wrap gap-3 mt-4 justify-center">
          {data.map((d, i) => (
            <div key={d.name} className="flex items-center gap-2 text-sm">
              <div
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: COLORS[i % COLORS.length] }}
              />
              <span className="text-gray-400">{d.name}</span>
            </div>
          ))}
        </div>
      </div>
    );
  }