import HomeEntry from "@/components/HomeEntry";
import type { Metadata } from "next";
import { baseMetadata } from "@/utils/metadata";

export const metadata: Metadata = {
  ...baseMetadata,
  title: "Sincify | Draw Together, Anywhere",
  description:
    "Create beautiful hand-drawn sketches and diagrams with real-time collaboration. End-to-end encrypted, privacy-focused collaborative whiteboard. No account required to start drawing.",
  openGraph: {
    ...baseMetadata.openGraph,
    title: "Sincify | Draw Together, Anywhere",
    description:
      "Create beautiful hand-drawn sketches and diagrams with real-time collaboration. End-to-end encrypted, privacy-focused collaborative whiteboard.",
    url: "https://Sincify.onrender.com",
  },
  twitter: {
    ...baseMetadata.twitter,
    title: "Sincify | Draw Together, Anywhere ",
    description:
      "Create beautiful hand-drawn sketches and diagrams with real-time collaboration. End-to-end encrypted, privacy-focused collaborative whiteboard.",
  },
  alternates: {
    canonical: "https://Sincify.xyz",
  },
};

export default async function Home() {
  return (
    <HomeEntry />
  )
}
