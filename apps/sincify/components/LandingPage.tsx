'use client';

import Image from "next/image";
import { Search } from "lucide-react";
import { FormEvent, useState } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { createNamedRoomHash } from "@/utils/roomParams";
import { generateAESKey } from "@/utils/crypto";

function normalizeBoardName(value: string): string {
    return value.trim().toLowerCase().replace(/\s+/g, "-");
}

export default function LandingPage() {
    const [namedBoard, setNamedBoard] = useState("");
    const [isCreatingPrivate, setIsCreatingPrivate] = useState(false);

    const goToPublicBoard = () => {
        window.location.hash = "#room=anonymous";
    };

    const goToPrivateBoard = async () => {
        setIsCreatingPrivate(true);
        try {
            const encryptionKey = await generateAESKey();
            const privateRoomId = crypto.randomUUID();
            window.location.hash = `#room=${privateRoomId},${encryptionKey}`;
        } finally {
            setIsCreatingPrivate(false);
        }
    };

    const submitNamedBoard = (event: FormEvent) => {
        event.preventDefault();
        const normalized = normalizeBoardName(namedBoard);
        const hash = createNamedRoomHash(normalized);
        if (!hash) {
            return;
        }
        window.location.hash = hash;
    };

    return (
        <div className="min-h-screen bg-[#f4f5f7] text-[#1f2a44]">
            <header className="border-b border-[#e3e7ef]">
                <div className="mx-auto flex w-full max-w-[1280px] flex-col gap-4 px-5 py-5 sm:flex-row sm:items-center sm:justify-between">
                    <h1 className="text-5xl font-sincifyfont font-bold tracking-wide text-[#606c82]">Sincify</h1>
                    <form onSubmit={submitNamedBoard} className="flex w-full items-center gap-2 sm:w-auto">
                        <div className="relative w-full sm:w-[380px]">
                            <Search className="pointer-events-none absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-[#74809b]" />
                            <Input
                                value={namedBoard}
                                onChange={(e) => setNamedBoard(e.target.value)}
                                placeholder="Open named board"
                                className="h-12 rounded-xl border-[#d7deea] bg-white pl-11 text-base placeholder:text-[#8d99b4]"
                            />
                        </div>
                        <Button
                            type="submit"
                            className="h-12 rounded-xl bg-[#5f6a80] px-5 text-base text-white hover:bg-[#4f596e]"
                        >
                            Go
                        </Button>
                    </form>
                </div>
            </header>

            <main className="mx-auto grid w-full max-w-[1280px] gap-5 px-5 py-6 lg:grid-cols-[1.25fr_0.8fr]">
                <section className="rounded-2xl border border-[#dfe5f0] bg-white p-5 shadow-[0_8px_20px_rgba(0,0,0,0.06)]">
                    <h2 className="text-4xl font-bold leading-tight text-[#1d2a44] sm:text-5xl">
                        Draw Anonymously
                    </h2>
                    <p className="mt-3 max-w-2xl text-lg text-[#4f5f7f] sm:text-xl">
                        To collaborate on a drawing in real time with someone, just send them its URL.                    
                    </p>
                     
                    <button
                        type="button"
                        onClick={goToPublicBoard}
                        aria-label="Open anonymous board"
                        className="mt-5 w-full overflow-hidden rounded-2xl border border-[#e7ebf2] text-left transition hover:opacity-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#5f6a80] focus-visible:ring-offset-2"
                    >
                        <Image
                            src="/brand/naruto.jpg"
                            alt="Open anonymous board"
                            width={1200}
                            height={700}
                            className="h-[290px] w-full object-cover sm:h-[350px]"
                            priority
                        />
                    </button>
                   
                </section>

                <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-1">
                    <div className="rounded-2xl border border-[#d7deea] bg-white p-5 shadow-[0_8px_20px_rgba(0,0,0,0.06)]">
                        <h3 className="text-3xl font-semibold text-[#1d2a44]">Public</h3>
                        <p className="mt-2 text-base text-[#52617f]">Join the shared anonymous board.</p>
                        <Button
                            type="button"
                            onClick={goToPublicBoard}
                            className="mt-4 h-12 w-full rounded-xl bg-[#5f6a80] text-base font-semibold text-white hover:bg-[#4f596e]"
                        >
                            Open public board
                        </Button>
                    </div>

                    <div className="rounded-2xl border border-[#d7deea] bg-white p-5 shadow-[0_8px_20px_rgba(0,0,0,0.06)]">
                        <h3 className="text-3xl font-semibold text-[#1d2a44]">Private</h3>
                        <p className="mt-2 text-base text-[#52617f]">Create a random private board link.</p>
                        <Button
                            type="button"
                            onClick={goToPrivateBoard}
                            disabled={isCreatingPrivate}
                            className="mt-4 h-12 w-full rounded-xl bg-[#5f6a80] text-base font-semibold text-white hover:bg-[#4f596e]"
                        >
                            {isCreatingPrivate ? "Creating..." : "Create private board"}
                        </Button>
                    </div>

                    <div className="rounded-2xl border border-[#d7deea] bg-white p-5 shadow-[0_8px_20px_rgba(0,0,0,0.06)] sm:col-span-2 lg:col-span-1">
                        <h3 className="text-3xl font-semibold text-[#1d2a44]">Named</h3>
                        <p className="mt-2 text-base text-[#52617f]">Use the top input to open or create any named board.</p>
                        <form onSubmit={submitNamedBoard} className="mt-4 flex items-center gap-2">
                            <Input
                                value={namedBoard}
                                onChange={(e) => setNamedBoard(e.target.value)}
                                placeholder="Board name"
                                className="h-12 rounded-xl border-[#d7deea] bg-[#f8f9fb] text-base placeholder:text-[#8d99b4]"
                            />
                            <Button
                                type="submit"
                                className="h-12 rounded-xl bg-[#5f6a80] px-5 text-base font-semibold text-white hover:bg-[#4f596e]"
                            >
                                Go
                            </Button>
                        </form>
                    </div>
                </section>
            </main>
        </div>
    );
}
