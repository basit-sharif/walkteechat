"use client"

import { useEffect, useState } from "react"
import { IncomingFriendRequests } from "../types/pusher";
import { Check, UserPlus, X } from "lucide-react";
import Button from "./ui/Button";
import axios from "axios";
import { useRouter } from "next/navigation";
import { pusherClient } from "@/lib/pusher";
import { toPusherKey } from "@/lib/utils";

const FriendRequestes = ({ incomingFriendRequests, sessionId }: { incomingFriendRequests: IncomingFriendRequests[], sessionId: string }) => {
    const { refresh } = useRouter()
    const [friendRequests, setFriendRequests] = useState<IncomingFriendRequests[]>(incomingFriendRequests);

    useEffect(() => {
        pusherClient.subscribe(toPusherKey(`user:${sessionId}:incoming_friend_requests`));

        const friendRequestHandler = ({senderId,senderEmail}:IncomingFriendRequests) => {
            setFriendRequests((prev)=>[...prev,{senderId,senderEmail}]);
        }

        pusherClient.bind('incoming_friend_requests', friendRequestHandler)
        return () => {
            pusherClient.unsubscribe(toPusherKey(`user:${sessionId}:incoming_friend_requests`));
            pusherClient.unbind('incoming_friend_requests', friendRequestHandler);
        };

    }, []);


    async function acceptFriend(senderId: string) {
        await axios.post('/api/friends/accept', { id: senderId });
        setFriendRequests((prev) => prev.filter((item) => item.senderId !== senderId));
        refresh();
    };
    async function denyFriend(senderId: string) {
        await axios.post('/api/friends/deny', { id: senderId });
        setFriendRequests((prev) => prev.filter((item) => item.senderId !== senderId));
        refresh();
    };

    return (
        <>
            {friendRequests.length === 0 ? (
                <p className="text-sm text-zinc-500">Friend request is Empty...</p>
            ) : (
                friendRequests.map((item, index) => (
                    <div key={index} className="flex gap-4 items-center">
                        <UserPlus className="text-black" />
                        <p className="font-medium text-lg">{item.senderEmail}</p>
                        <button onClick={() => acceptFriend(item.senderId)} aria-label="accept friend" className="w-8 h-8 bg-indigo-600 hover:bg-indigo-700 rounded-full grid place-items-center  transition hover:shadow-md">
                            <Check className="font-semibold text-white w-3/4" />
                        </button>
                        <button onClick={() => denyFriend(item.senderId)} aria-label="deny friend" className="w-8 h-8 bg-red-600 hover:bg-red-700 rounded-full grid place-items-center  transition hover:shadow-md">
                            <X className="font-semibold text-white w-3/4" />
                        </button>
                    </div>
                ))
            )}
        </>
    )
}

export default FriendRequestes