"use client"
import React, { useEffect, useState } from 'react'
import { message, user } from '../types/db'
import { usePathname, useRouter } from "next/navigation"
import { chatHrefConstructor } from '../utils/functions'

const SidebarChatList = ({ friends, sessionId }: { friends: user[], sessionId: string }) => {
    useRouter();
    const pathName = usePathname();
    const [unseenMessages, setUnseenMessages] = useState<message[]>();

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
                    <a
                        href={`/dashboard/chat/${chatHrefConstructor(sessionId, friend.id)}`}
                        className='text-gray-700 hover:text-indigo-600 hover:bg-gray-50 group flex items-center gap-x-3 rounded-md p-2 text-sm leading-6 font-semibold'
                    >

                        {friend.name}
                        {unseenMessagesCount > 0 ? (
                            <div className="bg-indigo-600 font-medium text-xs text-white w-4 h-4 rounded-full flex justify-center items-center">
                                {unseenMessagesCount}
                            </div>
                        ) : null}
                    </a>
                </li>
            })}
        </ul>
    )
}

export default SidebarChatList