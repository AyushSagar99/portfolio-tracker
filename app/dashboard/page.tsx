"use client";
  import { useAccount } from "wagmi";
  import { useEffect, useState } from "react";
  import { getTokenBalances, getNativeBalance } from "@/lib/alchemy";
  import { getTokenPrice, getNativeTokenPrice } from "@/lib/coingecko";
  import { Token } from "@/lib/types";
  import { PortfolioSummary } from "@/components/PortfolioSummary";
  import { TokenList } from "@/components/TokenList";
  import { PortfolioChart } from "@/components/PortfolioChart";

  export default function DashboardPage() {
    const { address } = useAccount();
    const [tokens, setTokens] = useState<Token[]>([]);
    const [loading, setLoading] = useState(true);

    // TODO: get selectedChain from layout context — hardcoded to 1 for now
    const selectedChain = 1;

    useEffect(() => {
      if (!address) return;

      async function fetchPortfolio() {
        setLoading(true);
        try {
          // Fetch token balances from Alchemy
          const balances = await getTokenBalances(address!, selectedChain);

          // Fetch prices from CoinGecko
          const contractAddresses = balances.map((t) => t.contractAddress);
          const prices = await getTokenPrice(contractAddresses, selectedChain);

          // Merge balances + prices
          const enriched: Token[] = balances.map((t) => {
            const price = prices[t.contractAddress.toLowerCase()];
            const priceUsd = price?.usd ?? 0;
            const valueUsd = Number(t.balance) * priceUsd;
            return {
              contractAddress: t.contractAddress,
              name: t.name,
              symbol: t.symbol,
              logo: t.logo,
              balance: t.balance,
              decimals: t.decimals,
              priceUsd,
              valueUsd,
              change24h: price?.usd_24h_change ?? 0,
            };
          });

          // Add native token (ETH/MATIC/etc)
          const [nativeBal, nativePrice] = await Promise.all([
            getNativeBalance(address!, selectedChain),
            getNativeTokenPrice(selectedChain),
          ]);

          const nativeNames: Record<number, { name: string; symbol: string }> = {
            1: { name: "Ethereum", symbol: "ETH" },
            137: { name: "Polygon", symbol: "MATIC" },
            8453: { name: "Ethereum", symbol: "ETH" },
            42161: { name: "Ethereum", symbol: "ETH" },
            10: { name: "Ethereum", symbol: "ETH" },
          };

          const native = nativeNames[selectedChain] ?? { name: "Native", symbol: "???" };

          enriched.unshift({
            contractAddress: "native",
            name: native.name,
            symbol: native.symbol,
            logo: null,
            balance: nativeBal,
            decimals: 18,
            priceUsd: nativePrice.usd,
            valueUsd: Number(nativeBal) * nativePrice.usd,
            change24h: nativePrice.usd_24h_change,
          });

          setTokens(enriched);
        } catch (err) {
          console.error("Failed to fetch portfolio:", err);
        } finally {
          setLoading(false);
        }
      }

      fetchPortfolio();
    }, [address, selectedChain]);

    if (loading) {
      return (
        <div className="flex items-center justify-center h-64">
          <p className="text-gray-400 text-lg">Loading portfolio...</p>
        </div>
      );
    }

    return (
      <div className="space-y-6">
        <PortfolioSummary tokens={tokens} />
        <div className="grid grid-cols-3 gap-6">
          <div className="col-span-2">
            <TokenList tokens={tokens} />
          </div>
          <PortfolioChart tokens={tokens} />
        </div>
      </div>
    );
  }