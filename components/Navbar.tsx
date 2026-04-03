"use client"

import { ConnectButton } from "@rainbow-me/rainbowkit";

const chains=[
    {id:1,name:"Ethereum"},
    {id:357,name:"Polygon"},
    { id: 8453, name: "Base" },
    { id: 42161, name: "Arbitrum" },
    { id: 10, name: "Optimism" },
]

export default function Navbar({
    selectedChain,
    onChainChange,
}:{
    selectedChain:number;
    onChainChange:(chainId:number)=>void;
}){
    return(
        <nav className="flex items-center justify-between px-6 py-4 border-b border-gray-800 bg-gray-950">
            <h1 className="text-xl font-bold text-white">PTracker</h1>

            <select value={selectedChain} onChange={(e)=>onChainChange(Number(e.target.value))}
                className="bg-gray-800 text-white px-3 py-2 rounded-lg border border-gray-700 text-sm"
                >
                    {chains.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
                </select>
                <ConnectButton label="Connect Wallet"/>
        </nav>
    )
}