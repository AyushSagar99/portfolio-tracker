import { headers } from "next/headers";


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

    const res= await fetch(`
        ${COINGECKO_BASE}/simple/token_price/${platform}?contract_addresses=${addresses}&vs_currencies=usd&include_24hr_change
  =true`,
{
    headers:process.env.NEXT_PUBLIC_COINGECKO_API_KEY
    ? { "x-cg-demo-api-key": process.env.NEXT_PUBLIC_COINGECKO_API_KEY }
    : {},
})

if (!res.ok) throw new Error (`COINGECKO API error: ${res.status}`);
const data= await res.json();

const prices: Record<string,TokenPrice>={}
    for (const [address, priceData] of Object.entries(data)) {
        const d = priceData as { usd?: number; usd_24h_change?: number };
        prices[address.toLowerCase()] = {
          usd: d.usd ?? 0,
          usd_24h_change: d.usd_24h_change ?? 0,
        };
    }
return prices;
}

export async function getNativeTokenPrice(
    chainId:number=1
):Promise<TokenPrice>{
    const id=chainToNativeId[chainId];
    if(!id) throw new Error (`Unsupported chain: ${chainId}`);

    const res=await fetch(
        `${COINGECKO_BASE}/simple/price?ids=${id}&vs_currencies=usd&include_24hr_change=true`,
        {
            headers:process.env.NEXT_PUBLIC_COINGECKO_API_KEY
            ? { "x-cg-demo-api-key": process.env.NEXT_PUBLIC_COINGECKO_API_KEY }
          : {},
        }
    );
    if(!res.ok) throw new Error(`COINGECKO API ERROR ${res.status}`);

    const data =await res.json();
    return {
        usd: data[id]?.usd ?? 0,
        usd_24h_change: data[id]?.usd_24h_change ?? 0,
      };
}