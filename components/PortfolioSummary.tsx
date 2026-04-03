import { Token } from "@/lib/types";

  export function PortfolioSummary({ tokens }: { tokens: Token[] }) {
    const totalValue = tokens.reduce((sum, t) => sum + t.valueUsd, 0);
    const weightedChange = tokens.reduce(
      (sum, t) => sum + t.change24h * (t.valueUsd / (totalValue || 1)),
      0
    );
    const isPositive = weightedChange >= 0;

    return (
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-gray-900 rounded-xl p-6 border border-gray-800">
          <p className="text-gray-400 text-sm">Total Portfolio Value</p>
          <p className="text-3xl font-bold text-white mt-1">
            ${totalValue.toLocaleString(undefined, { maximumFractionDigits: 2 })}
          </p>
        </div>
        <div className="bg-gray-900 rounded-xl p-6 border border-gray-800">
          <p className="text-gray-400 text-sm">24h Change</p>
          <p
            className={`text-3xl font-bold mt-1 ${
              isPositive ? "text-green-400" : "text-red-400"
            }`}
          >
            {isPositive ? "+" : ""}
            {weightedChange.toFixed(2)}%
          </p>
        </div>
        <div className="bg-gray-900 rounded-xl p-6 border border-gray-800">
          <p className="text-gray-400 text-sm">Tokens Held</p>
          <p className="text-3xl font-bold text-white mt-1">{tokens.length}</p>
        </div>
      </div>
    );
  }