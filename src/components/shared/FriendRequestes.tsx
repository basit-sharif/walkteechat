"use client"

import { useState } from "react"
import { IncomingFriendRequests } from "../types/pusher";
import { Check, UserPlus, X } from "lucide-react";
import Button from "./ui/Button";

const FriendRequestes = ({ incomingFriendRequests, sessionId }: { incomingFriendRequests: IncomingFriendRequests[], sessionId: string }) => {
    const [friendRequests, setFriendRequests] = useState(incomingFriendRequests);
    return (
        <>
            {friendRequests.length === 0 ? (
                <p className="text-sm text-zinc-500">Friend request is Empty...</p>
            ) : (
                friendRequests.map((item, index) => (
                    <div key={index} className="flex gap-4 items-center">
                        <UserPlus className="text-black" />
                        <p className="font-medium text-lg">{item.senderEmail}</p>
                        <button aria-label="accept friend" className="w-8 h-8 bg-indigo-600 hover:bg-indigo-700 rounded-full grid place-items-center  transition hover:shadow-md">
                            <Check className="font-semibold text-white w-3/4" />
                        </button>
                        <button aria-label="deny friend" className="w-8 h-8 bg-red-600 hover:bg-red-700 rounded-full grid place-items-center  transition hover:shadow-md">
                            <X className="font-semibold text-white w-3/4" />
                        </button>
                    </div>
                ))
            )}
        </>
    )
}

export default FriendRequestes