import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";
import Card from "@/components/common/Card";
import EmptyState from "@/components/common/EmptyState";
import { formatCurrency } from "@/utils/formatCurrency";

export default function MonthlySalesChart({ data }) {
  const hasData = data?.some((d) => d.sales > 0 || d.count > 0);

  return (
    <Card className="p-0">
      <div className="px-5 py-4 border-b border-ink-300/60">
        <h2 className="text-sm font-semibold text-ink-900">Sales trend</h2>
        <p className="text-xs text-ink-500 mt-0.5">Last 6 months</p>
      </div>

      <div className="p-5">
        {!hasData ? (
          <EmptyState
            title="No sales yet"
            description="Sales trend will appear once invoices are created."
          />
        ) : (
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data} margin={{ top: 8, right: 8, left: -10, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" vertical={false} />
                <XAxis
                  dataKey="label"
                  tick={{ fontSize: 12, fill: "#6b7280" }}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis
                  tick={{ fontSize: 12, fill: "#6b7280" }}
                  axisLine={false}
                  tickLine={false}
                  width={60}
                  tickFormatter={(v) =>
                    v >= 1000 ? `${(v / 1000).toFixed(1)}k` : v
                  }
                />
                <Tooltip
                  cursor={{ fill: "rgba(59,130,246,0.05)" }}
                  contentStyle={{
                    borderRadius: 8,
                    border: "1px solid #e5e7eb",
                    fontSize: 12,
                  }}
                  formatter={(value, name) => [
                    formatCurrency(value),
                    name === "sales" ? "Sales" : "Outstanding",
                  ]}
                />
                <Bar dataKey="sales" fill="#2563eb" radius={[6, 6, 0, 0]} maxBarSize={48} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>
    </Card>
  );
}