"use client"
import React, { useEffect, useState } from 'react'
import { message, user } from '../types/db'
import { usePathname, useRouter } from "next/navigation"
import { chatHrefConstructor } from '../utils/functions'
import Link from 'next/link'
import { pusherClient } from '@/lib/pusher'
import { toPusherKey } from '@/lib/utils'
import { toast } from 'react-hot-toast'
import UnSeenChatToast from './UnSeenChatToast'

interface ExtendedMessage extends message {
    senderImg: string,
    senderName: string,
}

const SidebarChatList = ({ friends, sessionId }: { friends: user[], sessionId: string }) => {
    const { refresh } = useRouter();
    const pathName = usePathname();
    const [unseenMessages, setUnseenMessages] = useState<message[]>([]);

    useEffect(() => {
        pusherClient.subscribe(toPusherKey(`user:${sessionId}:chats`));
        // pusherClient.subscribe(toPusherKey(`user:${sessionId}:friends`));

        // const newFriendHandler = () => {
        //     refresh();
        // }
        const chatHandler = (message: ExtendedMessage) => {
            const shouldNotify = pathName !== `/dashboard/chat/${chatHrefConstructor(sessionId, message.senderId)}`;

            if (!shouldNotify) return

            toast.custom((t) => (
                <UnSeenChatToast
                    t={t}
                    sessionId={sessionId}
                    senderId={message.senderId}
                    senderImg={message.senderImg}
                    senderMessage={message.text}
                    senderName={message.senderName}
                />
            ));
            setUnseenMessages((prev) => [...prev, message]);

        }

        pusherClient.bind('new-message', chatHandler);
        // pusherClient.bind('new_friend', newFriendHandler);

        return () => {
            pusherClient.unsubscribe(toPusherKey(`user:${sessionId}:chats`));
            pusherClient.unbind('new-message', chatHandler);
            // pusherClient.unsubscribe(toPusherKey(`user:${sessionId}:friends`));
        }

    }, [pathName, sessionId])


    useEffect(() => {
        if (pathName?.includes('chat')) {
            setUnseenMessages((prev) => {
                return prev?.filter((item) => !pathName.includes)
            })
        }
    }, [pathName]);


    return (
        <ul role='list' className='max-h-[25rem] overflow-y-auto -mx-2 space-y-1'>
            {friends.sort().map((friend) => {
                const unseenMessagesCount = (unseenMessages?.filter((item) => item.senderId === friend.id) || []).length;
                return <li key={friend.id}>
                    <Link
                        href={`/dashboard/chat/${chatHrefConstructor(sessionId, friend.id)}`}
                        className='text-gray-700 hover:text-indigo-600 hover:bg-gray-50 group flex items-center gap-x-3 rounded-md p-2 text-sm leading-6 font-semibold'
                    >

                        {friend.name}
                        {unseenMessagesCount > 0 ? (
                            <div className="bg-indigo-600 font-medium text-xs text-white w-4 h-4 rounded-full flex justify-center items-center">
                                {unseenMessagesCount}
                            </div>
                        ) : null}
                    </Link>
                </li>
            })}
        </ul>
    )
}

export default SidebarChatList