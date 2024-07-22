"use client"
import { cn, toPusherKey } from "@/lib/utils";
import { useEffect, useRef, useState } from "react";
import { message, user } from "../types/db";
import { format } from "date-fns";
import Image from "next/image";
import { pusherClient } from "@/lib/pusher";

const Messages = ({ initialMessages, sessionId, sessionImg, chatPartner, chatId }: { initialMessages: message[], sessionId: string, sessionImg: string | undefined | null, chatPartner: user, chatId: string }) => {
    const [messages, setMessages] = useState(initialMessages);
    const scrollDownRef = useRef<HTMLDivElement | null>(null);


    useEffect(() => {
        pusherClient.subscribe(toPusherKey(`chat:${chatId}`));

        const messageHandler = (message:message) => {
            console.log("messageHandler:" , messageHandler)
            setMessages((prev) => [message, ...prev]);
        }

        pusherClient.bind('incoming-message', messageHandler)
        return () => {
            pusherClient.unsubscribe(toPusherKey(`chat:${chatId}`));
            pusherClient.unbind('incoming-message', messageHandler);
        };

    }, []);


    const formatTimestamp = (timestamp: number) => format(timestamp, 'HH:mm');

    return (
        <div id="messages" className="flex h-full flex-1 flex-col-reverse gap-4 p-3 overflow-y-auto scrollbar-thumb-blue scrollbar-thumb-rounded scrollbar-track-blue-lighter scrollbar-w-2">
            <div ref={scrollDownRef} />
            {messages.map((message, index) => {
                const isCurrentUser = message.senderId === sessionId;
                const hasNextMessageFromSameUser = messages[index - 1]?.senderId === messages[index].senderId;

                return <div
                    key={index}
                    className="chat-message"
                >
                    <div className={cn('flex items-end', {
                        'justify-end': isCurrentUser
                    })}>
                        <div className={cn('flex flex-col space-y-2 text-base max-w-xs mx-2', {
                            'order-1 items-end': isCurrentUser,
                            'order-2 items-start': !isCurrentUser
                        })}>
                            <span className={cn('px-4 py-2 rounded-lg inline-block', {
                                'bg-indigo-600 text-white ': isCurrentUser,
                                'bg-gray-200 text-gray-900': !isCurrentUser,
                                'rounded-br-none': !hasNextMessageFromSameUser && isCurrentUser,
                                'rounded-bl-none': !hasNextMessageFromSameUser && !isCurrentUser,
                            })}>
                                {message.text}{' '}
                                <span className="ml-2 text-xs text-gray-400">
                                    {formatTimestamp(message.timestamp)}
                                </span>
                            </span>
                        </div>
                        <div className={cn('hidden md:block relative w-6 h-6', {
                            'order-2': isCurrentUser,
                            'order-1': !isCurrentUser,
                            'invisible': hasNextMessageFromSameUser
                        })}>
                            <Image
                                fill
                                src={isCurrentUser ? (sessionImg as string) : chatPartner.image}
                                alt='Profile picture'
                                referrerPolicy="no-referrer"
                                className="rounded-full"
                            />
                        </div>
                    </div>
                </div>
            })}
        </div>
    )
}

export default Messages