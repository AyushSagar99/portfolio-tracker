import { Alchemy, Network } from "alchemy-sdk";                                                                            

const chainToNetwork: Record<number,Network>={
    1:Network.ETH_MAINNET,
    137:Network.MATIC_MAINNET,
    8453:Network.BASE_MAINNET,
    42161: Network.ARB_MAINNET,
    10: Network.OPT_MAINNET,
}

function getAlchemy(chainId:number):Alchemy{
    const network = chainToNetwork[chainId];
    if(!network) throw new Error ("UNKNOWN Network");

    return new Alchemy({
        apiKey:process.env.NEXT_PUBLIC_ALCHEMY_API_KEY,
        network
    });
}

export type TokenBalance = {
    contractAddress:string;
    balance:string;
    name:string;
    symbol:string;
    decimals:number;
    logo:string|null;
}

export async function getTokenBalances(
    address: string,
    chainId: number =1
):Promise<TokenBalance[]>{
    const alchemy=getAlchemy(chainId);

    const { tokenBalances } = await alchemy.core.getTokenBalances(address);

    const nonZero = tokenBalances.filter(
        (t) => t.tokenBalance && BigInt(t.tokenBalance) > 0n
    );

    const tokens:TokenBalance[]= await Promise.all(
        nonZero.map(async (t)=>{
            const metadata=await alchemy.core.getTokenMetadata(
                t.contractAddress
            );

            const rawBalance = BigInt(t.tokenBalance!);
            const decimals=metadata.decimals ?? 18;
            const balance= (
                Number(rawBalance)/ Math.pow(10,decimals)
            ).toString();

            return{
                contractAddress:t.contractAddress,
                balance,
                name:metadata.name ?? "UNKOWN",
                symbol:metadata.symbol ?? "??",
                decimals,
                logo:metadata.logo || null,
            };
        })
    );
    return tokens;
}

export async function getNativeBalance(
    address:string,
    chainId:number=1
): Promise<string>{
    const alchemy = getAlchemy(chainId);
    const balance = await alchemy.core.getBalance(address);

    return (Number(balance)/1e18).toFixed(6);
}

export type NFTItem = {
    name: string;
    collection: string;
    tokenId: string;
    image: string | null;
    contractAddress: string;
};

export async function getNFTsForOwner(
    address: string,
    chainId: number = 1
): Promise<NFTItem[]> {
    const alchemy = getAlchemy(chainId);
    const response = await alchemy.nft.getNftsForOwner(address);

    return response.ownedNfts.map((nft) => ({
        name: nft.name || `#${nft.tokenId}`,
        collection: nft.contract.name || "Unknown Collection",
        tokenId: nft.tokenId,
        image: nft.image?.thumbnailUrl || nft.image?.cachedUrl || null,
        contractAddress: nft.contract.address,
    }));
}