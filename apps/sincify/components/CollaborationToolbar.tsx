'use client'

import { useState } from "react";
import { Check, Copy, Link2 } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "./ui/tooltip";
import { RoomParticipants } from "@repo/common/types";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { getClientColor } from "@/utils/getClientColor";
import { Button } from "./ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "./ui/dialog";
import { Input } from "./ui/input";

export default function CollaborationToolbar({
    participants,
    showShare = false
}: {
    participants?: RoomParticipants[];
    showShare?: boolean;
}) {
    const displayParticipants = participants?.slice(0, 3);
    const remainingParticipants = participants?.slice(3);
    const [copied, setCopied] = useState(false);
    const [shareOpen, setShareOpen] = useState(false);
    const [shareUrl, setShareUrl] = useState("");

    const getCurrentShareUrl = () => {
        if (typeof window === "undefined") return "";
        return window.location.href;
    };

    const copyRoomUrl = async (url?: string) => {
        const roomUrl = url || getCurrentShareUrl();
        if (!roomUrl) return;
        try {
            if (navigator.clipboard?.writeText) {
                await navigator.clipboard.writeText(roomUrl);
            } else {
                const tempInput = document.createElement("input");
                tempInput.value = roomUrl;
                tempInput.style.position = "fixed";
                tempInput.style.left = "-9999px";
                document.body.appendChild(tempInput);
                tempInput.select();
                document.execCommand("copy");
                document.body.removeChild(tempInput);
            }
            setCopied(true);
            setTimeout(() => setCopied(false), 1500);
        } catch (error) {
            console.error("Failed to copy room URL:", error);
            window.prompt("Copy board URL:", roomUrl);
        }
    };

    const openShareDialog = (open: boolean) => {
        setShareOpen(open);
        if (open) {
            setShareUrl(getCurrentShareUrl());
        } else {
            setCopied(false);
        }
    };

    const encodedUrl = encodeURIComponent(shareUrl || getCurrentShareUrl());
    const socialLinks = [
        {
            label: "LinkedIn",
            href: `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`,
            className: "bg-[#0A66C2]",
            icon: "in",
        },
        {
            label: "Facebook",
            href: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
            className: "bg-[#1877F2]",
            icon: "f",
        },
        {
            label: "X",
            href: `https://x.com/intent/post?url=${encodedUrl}`,
            className: "bg-black",
            icon: "X",
        },
        {
            label: "Reddit",
            href: `https://www.reddit.com/submit?url=${encodedUrl}`,
            className: "bg-[#FF4500]",
            icon: "r",
        },
    ];

    return (
        <div className="Start_Room_Session transition-transform duration-500 ease-in-out flex items-center justify-end gap-2 md:gap-3">
            <div className="UserList__wrapper flex items-center justify-end">
                <div className="UserList p-1 flex flex-wrap justify-end items-center">
                    <TooltipProvider delayDuration={0}>
                        <div className="flex gap-1 md:gap-[.625rem]">
                            {displayParticipants?.map((participant) => (
                                <Tooltip key={participant.userId}>
                                    <TooltipTrigger asChild>
                                        <div style={{ backgroundColor: getClientColor(participant) }} className={`w-7 h-7 rounded-full flex items-center justify-center cursor-pointer`}>
                                            <span className="text-sm font-bold text-gray-900 dark:text-gray-900">
                                                {participant.userName.charAt(0).toUpperCase()}
                                            </span>
                                        </div>
                                    </TooltipTrigger>
                                    <TooltipContent>
                                        {participant.userName}
                                    </TooltipContent>
                                </Tooltip>
                            ))}

                            {remainingParticipants && remainingParticipants.length > 0 && (
                                <Popover>
                                    <PopoverTrigger asChild>
                                        <div
                                            className="w-7 h-7 rounded-full bg-gray-200 flex items-center justify-center 
                               cursor-pointer hover:bg-gray-400 transition-colors"
                                        >
                                            <span className="text-xs font-bold text-gray-900">
                                                +{remainingParticipants?.length}
                                            </span>
                                        </div>
                                    </PopoverTrigger>
                                    <PopoverContent className="w-full max-h-[200px] h-full overflow-auto p-4 mt-3 rounded-lg">
                                        <div className="space-y-2">
                                            <h4 className="text-sm font-medium font-assistant">Additional Participants</h4>
                                            {remainingParticipants?.map((participant) => (
                                                <div
                                                    key={participant.userId}
                                                    className="cursor-pointer select-none flex items-center space-x-2 h-8 w-full justify-start gap-2 rounded-md px-3 text-sm font-medium transition-colors text-color-on-surface hover:text-color-on-surface bg-transparent hover:bg-button-hover-bg focus-visible:shadow-brand-color-shadow focus-visible:outline-none focus-visible:ring-0 active:bg-button-hover-bg active:border active:border-brand-active dark:hover:bg-w-button-hover-bg"
                                                >
                                                    <div style={{ backgroundColor: getClientColor(participant) }} className={`w-7 h-7 rounded-full flex items-center justify-center cursor-pointer`}>
                                                        <span className="text-sm font-bold text-gray-900 dark:text-gray-900">
                                                            {participant.userName.charAt(0).toUpperCase()}
                                                        </span>
                                                    </div>

                                                    <span className="text-sm text-color-on-surface">{participant.userName}</span>
                                                </div>
                                            ))}
                                        </div>
                                    </PopoverContent>
                                </Popover>
                            )}
                        </div>
                    </TooltipProvider>
                </div>
            </div>
            {showShare && (
                <Dialog open={shareOpen} onOpenChange={openShareDialog}>
                    <TooltipProvider delayDuration={0}>
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <DialogTrigger asChild>
                                    <Button
                                        type="button"
                                        variant="outline"
                                        className="h-8 px-3 rounded-lg border-sidebar-border bg-island-bg-color hover:bg-button-hover-bg"
                                    >
                                        <Link2 className="h-4 w-4 mr-1" />
                                        Share
                                    </Button>
                                </DialogTrigger>
                            </TooltipTrigger>
                            <TooltipContent>
                                Share board link
                            </TooltipContent>
                        </Tooltip>
                    </TooltipProvider>
                    <DialogContent
                        className="max-w-[520px] overflow-hidden rounded-2xl border border-default-border-color bg-white p-0 dark:border-[#313846] dark:bg-[#1e222b]"
                        overlayClassName="bg-black/40"
                    >
                        <DialogHeader className="border-b border-default-border-color px-5 py-4 dark:border-[#313846]">
                            <DialogTitle className="text-left text-2xl text-color-primary dark:text-[#f3f5fb]">
                                Shareable board link
                            </DialogTitle>
                        </DialogHeader>

                        <div className="space-y-4 px-5 py-4">
                            <div className="flex items-center gap-2 rounded-2xl bg-[#eef3fb] p-2 dark:bg-[#2b313d]">
                                <Input
                                    readOnly
                                    value={shareUrl}
                                    className="h-11 border-0 bg-transparent text-sm text-[#1f2a44] shadow-none focus-visible:ring-0 dark:text-[#dce3f0]"
                                />
                                <Button
                                    type="button"
                                    onClick={() => copyRoomUrl(shareUrl)}
                                    className="h-11 rounded-xl bg-[#8fb0e8] px-4 text-sm font-semibold text-[#10203b] hover:bg-[#7ea4e5] dark:bg-[#a8c4f5] dark:text-[#0f1d36]"
                                >
                                    {copied ? <Check className="mr-1 h-4 w-4" /> : <Copy className="mr-1 h-4 w-4" />}
                                    {copied ? "Copied" : "Copy link"}
                                </Button>
                            </div>
                            <p className="text-xs leading-relaxed text-[#5a6784] dark:text-[#b2bccf]">
                                Anyone with this link can join the board. Share responsibly.
                            </p>
                        </div>

                        <div className="border-t border-default-border-color px-5 py-4 dark:border-[#313846]">
                            <div className="grid grid-cols-4 gap-3">
                                {socialLinks.map((item) => (
                                    <a
                                        key={item.label}
                                        href={item.href}
                                        target="_blank"
                                        rel="noreferrer"
                                        className="group flex flex-col items-center gap-2"
                                    >
                                        <span className={`${item.className} flex h-12 w-12 items-center justify-center rounded-full text-xl font-bold text-white shadow-sm transition-transform group-hover:scale-105`}>
                                            {item.icon}
                                        </span>
                                        <span className="text-xs text-[#2b364f] dark:text-[#d7dfec]">{item.label}</span>
                                    </a>
                                ))}
                            </div>
                        </div>
                    </DialogContent>
                </Dialog>
            )}
        </div>
    )
}
