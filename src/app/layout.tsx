import type { Metadata } from "next";
import "./globals.css";
export const metadata: Metadata = { title: "Stock Screener", description: "Christopher Tang’s FOPL stock dashboard and one-step forecasting experiment." };
export default function Layout({ children }: { children: React.ReactNode }) { return <html lang="en"><body>{children}</body></html>; }
