

const COINGECKO_BASE="https://api.coingecko.com/api/v3"

const chainToPlatform: Record<number,string>={
    1:"etherum",
    137:"polygon-pos",
    8453: "base",
    42161: "arbitrum-one",
    10: "optimistic-ethereum",
};


const chainToNativeId: Record<number, string> = {
    1: "ethereum",
    137: "matic-network",
    8453: "ethereum",
    42161: "ethereum",
    10: "ethereum",
};

export type TokenPrice={
    usd:number;
    usd_24h_change:number;
}

export async function getTokenPrice(
    contractAddress:string[],
    chainId:number = 1
):Promise<Record<string,TokenPrice>>{
    const platform =chainToPlatform[chainId];
    if(!platform) throw new Error (`Unsupported chain: ${chainId}`);
    if (contractAddress.length ===0) return{};

    const addresses =contractAddress.join(",");
}