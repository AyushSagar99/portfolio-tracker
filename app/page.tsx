"use client"
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { useRouter } from "next/navigation";
import { useBalance, UseBalanceReturnType } from "wagmi";

export default function Home() {
  const router = useRouter();

  return (
    <>
    <div>
    <ConnectButton label="Connect Wallet"></ConnectButton>
    </div>
    </>
  );
}
