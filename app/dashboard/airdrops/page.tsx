"use client";
import { useAccount } from "wagmi";
import { useEffect, useState } from "react";
import { Alchemy, Network } from "alchemy-sdk";

type AirdropTask = {
  label: string;
  check: (txCount: number, address: string) => boolean | Promise<boolean>;
};

type Airdrop = {
  name: string;
  description: string;
  status: "upcoming" | "live" | "ended";
  chain: string;
  tasks: AirdropTask[];
};

const AIRDROPS: Airdrop[] = [
  {
    name: "LayerZero Season 2",
    description: "Cross-chain messaging protocol. Bridge and swap across chains to qualify.",
    status: "upcoming",
    chain: "Multi-chain",
    tasks: [
      { label: "Have 10+ transactions on Ethereum", check: (txCount) => txCount >= 10 },
      { label: "Have 50+ transactions on Ethereum", check: (txCount) => txCount >= 50 },
      { label: "Have 100+ transactions on Ethereum", check: (txCount) => txCount >= 100 },
    ],
  },
  {
    name: "Scroll",
    description: "zkEVM Layer 2 on Ethereum. Use the bridge and ecosystem dApps.",
    status: "upcoming",
    chain: "Scroll",
    tasks: [
      { label: "Have 5+ transactions on Ethereum", check: (txCount) => txCount >= 5 },
      { label: "Have 20+ transactions on Ethereum", check: (txCount) => txCount >= 20 },
    ],
  },
  {
    name: "Linea",
    description: "Consensys zkEVM L2. Bridge assets and interact with ecosystem.",
    status: "upcoming",
    chain: "Linea",
    tasks: [
      { label: "Have 10+ transactions on Ethereum", check: (txCount) => txCount >= 10 },
      { label: "Have 30+ transactions on Ethereum", check: (txCount) => txCount >= 30 },
    ],
  },
  {
    name: "Base",
    description: "Coinbase L2 built on the OP Stack. Ongoing ecosystem incentives.",
    status: "live",
    chain: "Base",
    tasks: [
      { label: "Have 5+ transactions on Ethereum", check: (txCount) => txCount >= 5 },
      { label: "Have 25+ transactions on Ethereum", check: (txCount) => txCount >= 25 },
    ],
  },
  {
    name: "zkSync Era",
    description: "zkRollup L2 by Matter Labs. Interact with native dApps.",
    status: "upcoming",
    chain: "zkSync",
    tasks: [
      { label: "Have 10+ transactions on Ethereum", check: (txCount) => txCount >= 10 },
      { label: "Have 50+ transactions on Ethereum", check: (txCount) => txCount >= 50 },
    ],
  },
];

const statusColors: Record<string, string> = {
  upcoming: "bg-yellow-500/20 text-yellow-400",
  live: "bg-green-500/20 text-green-400",
  ended: "bg-gray-500/20 text-gray-400",
};

export default function AirdropsPage() {
  const { address } = useAccount();
  const [txCount, setTxCount] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!address) return;

    async function fetchActivity() {
      setLoading(true);
      try {
        const alchemy = new Alchemy({
          apiKey: process.env.NEXT_PUBLIC_ALCHEMY_API_KEY,
          network: Network.ETH_MAINNET,
        });
        const count = await alchemy.core.getTransactionCount(address!);
        setTxCount(count);
      } catch (err) {
        console.error("Failed to fetch tx count:", err);
      } finally {
        setLoading(false);
      }
    }

    fetchActivity();
  }, [address]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-gray-400 text-lg">Checking eligibility...</p>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-white">Airdrop Tracker</h2>
        <p className="text-gray-400 text-sm">
          Your Ethereum transactions: <span className="text-white font-medium">{txCount}</span>
        </p>
      </div>

      <div className="space-y-4">
        {AIRDROPS.map((airdrop) => {
          const results = airdrop.tasks.map((task) => task.check(txCount, address!));
          const completed = results.filter(Boolean).length;

          return (
            <div
              key={airdrop.name}
              className="bg-gray-900 rounded-xl border border-gray-800 p-6"
            >
              <div className="flex items-start justify-between mb-3">
                <div>
                  <div className="flex items-center gap-3">
                    <h3 className="text-white font-semibold text-lg">{airdrop.name}</h3>
                    <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${statusColors[airdrop.status]}`}>
                      {airdrop.status}
                    </span>
                  </div>
                  <p className="text-gray-400 text-sm mt-1">{airdrop.description}</p>
                  <p className="text-gray-500 text-xs mt-1">Chain: {airdrop.chain}</p>
                </div>
                <div className="text-right">
                  <p className="text-white font-bold text-lg">
                    {completed}/{airdrop.tasks.length}
                  </p>
                  <p className="text-gray-400 text-xs">tasks done</p>
                </div>
              </div>

              {/* Progress bar */}
              <div className="w-full bg-gray-800 rounded-full h-2 mb-4">
                <div
                  className="bg-indigo-500 h-2 rounded-full transition-all"
                  style={{ width: `${(completed / airdrop.tasks.length) * 100}%` }}
                />
              </div>

              {/* Task checklist */}
              <ul className="space-y-2">
                {airdrop.tasks.map((task, i) => (
                  <li key={i} className="flex items-center gap-3">
                    <div
                      className={`w-5 h-5 rounded-full flex items-center justify-center text-xs ${
                        results[i]
                          ? "bg-green-500/20 text-green-400"
                          : "bg-gray-800 text-gray-500"
                      }`}
                    >
                      {results[i] ? "\u2713" : ""}
                    </div>
                    <span className={`text-sm ${results[i] ? "text-white" : "text-gray-500"}`}>
                      {task.label}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          );
        })}
      </div>
    </div>
  );
}
