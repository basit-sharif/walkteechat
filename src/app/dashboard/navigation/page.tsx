import FriendRequestSidebarOption from "@/components/shared/FriendRequestSidebarOption";
import { Icon, Icons } from "@/components/shared/Icons";
import SidebarChatList from "@/components/shared/SidebarChatList";
import SignOutButton from "@/components/shared/SignOutButton";
import { user } from "@/components/types/db";
import { SidebarOption } from "@/components/types/pagesTypes";
import { sidebarOptions } from "@/components/utils/dataarray";
import { getFriendsByUserId } from "@/components/utils/functions";
import { fetchRedis } from "@/components/utils/redishelper";
import { authOptions } from "@/pages/api/auth/[...nextauth]";
import { getServerSession } from "next-auth";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

const Navigation = async () => {
    const session = await getServerSession(authOptions);
    if (!session) notFound();
    const friends = await getFriendsByUserId(session.user.id);
    const unseenRequestCount = (await fetchRedis('smembers', `user:${session.user.id}:incoming_friend_requests`) as user[]).length;

    return (
        <div className="w-full flex h-screen">
            <div className={`md:hidden h-full max-w-xs grow flex-col gap-y-5 overflow-y-auto border-r border-gray-200 bg-white px-6`}>
                <Link href={"/dashboard"} className="flex h-16 shrink-0 items-center ">
                    <Image width={130} height={130} alt="WalkteeChatAppLogo" src={"/LogoWalkTee.png"} />
                </Link>
                {friends.length > 0 ? (
                    <div className="text-xs font-semibold leading-6 text-gray-400">
                        Your chats
                    </div>
                ) : null}
                <nav className="flex flex-1 flex-col">
                    <ul role="list" className="flex flex-1 flex-col gap-y-7">
                        <li className="">
                            <SidebarChatList sessionId={session.user.id} friends={friends} />
                        </li>
                        <li>
                            <div className="text-xs font-semibold leading-6 text-gray-400">
                                Overview
                            </div>
                            <ul role="list" className="-m-x-2 mt-2 space-y-1 ">
                                {sidebarOptions.map((item: SidebarOption, index: number) => {
                                    let displayIcon: Icon = item.Icons;
                                    let Icon: any;
                                    if (Icons.hasOwnProperty(displayIcon)) {
                                        Icon = Icons[displayIcon];
                                    }
                                    return (
                                        <li key={index}>
                                            <Link
                                                href={item.href}
                                                className="text-gray-700 hover:text-indigo-600 hover:bg-gray-50 group flex gap-3 rounded-md text-sm p-2 leading-6 font-semibold"
                                            >
                                                <span className="text-gray-400 border-gray-200 group-hover:border-indigo-600 group-hover:text-indigo-600 flex h-6 w-6 shrink-0 items-center justify-center rounded-lg border text-[0.625rem] font-medium bg-white">
                                                    <Icon className="h-4 w-4" />
                                                </span>
                                                <span className="truncate">{item.name}</span>
                                            </Link>
                                        </li>
                                    )
                                })}
                            </ul>
                        </li>

                        <li>
                            <FriendRequestSidebarOption sessionId={session.user.id} initialUnseenRequestCount={unseenRequestCount} />
                        </li>

                        <li className="-mx-6 mt-auto flex items-center">
                            <div className="flex flex-1 items-center gap-x-4 px-6 py-3 text-sm font-semibold leading-6 text-gray-900">
                                <div className="relative h-8 w-8 bg-gray-50">
                                    <Image
                                        fill
                                        referrerPolicy="no-referrer"
                                        className="rounded-full"
                                        src={session.user.image || ''}
                                        alt="Your profile picture"
                                    />
                                </div>
                                <span className="sr-only">Your profile</span>
                                <div className="flex flex-col">
                                    <span aria-hidden='true' >{session.user.name}</span>
                                    <span className="text-xs text-zinc-400" aria-hidden='true'>
                                        {session.user.email}
                                    </span>
                                </div>
                            </div>
                            <SignOutButton className="h-full aspect-square" />
                        </li>
                    </ul>
                </nav>
            </div>
        </div>
    )
}

export default Navigation