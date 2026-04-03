"use client";
import { useAccount } from "wagmi";
import { useState } from "react";
import Navbar from "@/components/Navbar";
import Sidebar from "@/components/Sidebar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isConnected } = useAccount();
  const [selectedChain, setSelectedChain] = useState(1);

  if (!isConnected) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-950 text-white">
        <p className="text-lg">Please connect your wallet to continue.</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-gray-950">
      <Navbar selectedChain={selectedChain} onChainChange={setSelectedChain} />
      <div className="flex flex-1">
        <Sidebar />
        <main className="flex-1 p-6">{children}</main>
      </div>
    </div>
  );
}