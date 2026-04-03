"use client"

import Link from "next/link";
import { usePathname } from "next/navigation"

const links = [
    {href:"/dashboard", label:"Portfolio"},
    {href:"/dashboard/nfts", label:"NFTs"},
    {href:"/dashboard/airdrops", label:"Airdeops"},
]

export default function Sidebar(){
    const pathname =usePathname();
    return(
    <aside className="">
        <ul className="">
        {links.map((link) => (
            <li key={link.href}>
              <Link
                href={link.href}
                className={`block px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  pathname === link.href
                    ? "bg-gray-800 text-white"
                    : "text-gray-400 hover:text-white hover:bg-gray-900"
                }`}
              >
                {link.label}
              </Link>
            </li>
          ))}
        </ul>
    </aside>
    )
}