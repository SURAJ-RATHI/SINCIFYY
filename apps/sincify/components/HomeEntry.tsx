'use client';

import { useEffect, useState } from "react";
import CanvasBoard from "./canvas/CanvasBoard";
import { getRoomParamsFromHash } from "@/utils/roomParams";
import LandingPage from "./LandingPage";

export default function HomeEntry() {
    const [inRoom, setInRoom] = useState(false);

    useEffect(() => {
        const syncHashState = () => {
            const hash = typeof window !== "undefined" ? window.location.hash : "";
            setInRoom(Boolean(getRoomParamsFromHash(hash)));
        };

        syncHashState();
        window.addEventListener("hashchange", syncHashState);
        return () => window.removeEventListener("hashchange", syncHashState);
    }, []);

    if (inRoom) {
        return <CanvasBoard />;
    }

    return <LandingPage />;
}

