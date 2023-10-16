import FriendRequestes from "@/components/shared/FriendRequestes";
import { user } from "@/components/types/db";
import { fetchRedis } from "@/components/utils/redishelper";
import { authOptions } from "@/pages/api/auth/[...nextauth]";
import { getServerSession } from "next-auth/next";
import { notFound } from "next/navigation";

const Request = async () => {
    const session = await getServerSession(authOptions);
    if (!session) notFound();

    const incomingSenderIds: string[] = await fetchRedis('smembers', `user:${session.user.id}:incoming_friend_requests`) as string[];

    const incomingFriendRequests = await Promise.all(
        incomingSenderIds.map(async (senderId) => {
            let sender: string | user = await fetchRedis('get', `user:${senderId}`) as string;
            sender = JSON.parse(sender) as user;
            return {
                senderId,
                senderEmail: sender.email,
            }
        })
    );

    return (
        <main className='pt-8'>
            <h1 className='font-bold text-5xl mb-8'>Friend requests</h1>
            <div className="flex flex-col gap-4">
                <FriendRequestes sessionId={session.user.id} incomingFriendRequests={incomingFriendRequests} />
            </div>
        </main>
    )
}

export default Request