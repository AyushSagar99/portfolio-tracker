"use client";
import { useAccount } from "wagmi";
import { useEffect, useState } from "react";
import { getNFTsForOwner, NFTItem } from "@/lib/alchemy";

export default function NFTsPage() {
  const { address } = useAccount();
  const [nfts, setNfts] = useState<NFTItem[]>([]);
  const [loading, setLoading] = useState(true);

  const selectedChain = 1;

  useEffect(() => {
    if (!address) return;

    async function fetchNFTs() {
      setLoading(true);
      try {
        const data = await getNFTsForOwner(address!, selectedChain);
        setNfts(data);
      } catch (err) {
        console.error("Failed to fetch NFTs:", err);
      } finally {
        setLoading(false);
      }
    }

    fetchNFTs();
  }, [address, selectedChain]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-gray-400 text-lg">Loading NFTs...</p>
      </div>
    );
  }

  if (nfts.length === 0) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-gray-400 text-lg">No NFTs found on this chain</p>
      </div>
    );
  }

  return (
    <div>
      <h2 className="text-2xl font-bold text-white mb-6">Your NFTs</h2>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {nfts.map((nft, i) => (
          <div
            key={`${nft.contractAddress}-${nft.tokenId}-${i}`}
            className="bg-gray-900 rounded-xl border border-gray-800 overflow-hidden hover:border-gray-600 transition-colors"
          >
            {nft.image ? (
              <img
                src={nft.image}
                alt={nft.name}
                className="w-full aspect-square object-cover"
              />
            ) : (
              <div className="w-full aspect-square bg-gray-800 flex items-center justify-center text-gray-500 text-sm">
                No Image
              </div>
            )}
            <div className="p-4">
              <p className="text-white font-medium text-sm truncate">
                {nft.name}
              </p>
              <p className="text-gray-400 text-xs truncate mt-1">
                {nft.collection}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
