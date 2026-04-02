"use client"
import '@rainbow-me/rainbowkit/styles.css';
import { polygon, optimism, arbitrum,base,mainnet } from 'wagmi/chains';
import { getDefaultConfig, RainbowKitProvider } from "@rainbow-me/rainbowkit";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { WagmiProvider } from "wagmi";


const queryClient = new QueryClient();

const config=getDefaultConfig({
    appName:"PTracker",
    projectId:process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID!,
    chains:[polygon,optimism,arbitrum,base,mainnet],
    ssr:true
})

export function Provider({children}:{children:React.ReactNode }){
    return(
        <WagmiProvider config={config}>
        <QueryClientProvider client={queryClient}>
        <RainbowKitProvider>
        {children}
        </RainbowKitProvider>
        </QueryClientProvider>
        </WagmiProvider>
    )

}