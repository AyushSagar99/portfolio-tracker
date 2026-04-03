import { Token } from "@/lib/types";

  export function TokenList({ tokens }: { tokens: Token[] }) {
    const sorted = [...tokens].sort((a, b) => b.valueUsd - a.valueUsd);

    return (
      <div className="bg-gray-900 rounded-xl border border-gray-800 overflow-hidden">
        <table className="w-full text-left">
          <thead>
            <tr className="border-b border-gray-800 text-gray-400 text-sm">
              <th className="px-6 py-3">Token</th>
              <th className="px-6 py-3">Balance</th>
              <th className="px-6 py-3">Price</th>
              <th className="px-6 py-3">Value</th>
              <th className="px-6 py-3">24h</th>
            </tr>
          </thead>
          <tbody>
            {sorted.map((token) => (
              <tr
                key={token.contractAddress}
                className="border-b border-gray-800 hover:bg-gray-800/50 transition-colors"
              >
                <td className="px-6 py-4 flex items-center gap-3">
                  {token.logo ? (
                    <img
                      src={token.logo}
                      alt={token.symbol}
                      className="w-8 h-8 rounded-full"
                    />
                  ) : (
                    <div className="w-8 h-8 rounded-full bg-gray-700 flex items-center justify-center text-xs text-white">
                      {token.symbol.slice(0, 2)}
                    </div>
                  )}
                  <div>
                    <p className="text-white font-medium">{token.name}</p>
                    <p className="text-gray-400 text-sm">{token.symbol}</p>
                  </div>
                </td>
                <td className="px-6 py-4 text-white">
                  {Number(token.balance).toLocaleString(undefined, {
                    maximumFractionDigits: 4,
                  })}
                </td>
                <td className="px-6 py-4 text-white">
                  ${token.priceUsd.toLocaleString(undefined, {
                    maximumFractionDigits: 2,
                  })}
                </td>
                <td className="px-6 py-4 text-white">
                  ${token.valueUsd.toLocaleString(undefined, {
                    maximumFractionDigits: 2,
                  })}
                </td>
                <td
                  className={`px-6 py-4 font-medium ${
                    token.change24h >= 0 ? "text-green-400" : "text-red-400"
                  }`}
                >
                  {token.change24h >= 0 ? "+" : ""}
                  {token.change24h.toFixed(2)}%
                </td>
              </tr>
            ))}
            {sorted.length === 0 && (
              <tr>
                <td colSpan={5} className="px-6 py-8 text-center text-gray-500">
                  No tokens found on this chain
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    );
  }