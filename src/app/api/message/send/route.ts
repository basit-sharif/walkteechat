import { message, user } from "@/components/types/db";
import { fetchRedis } from "@/components/utils/redishelper";
import { messageValidator } from "@/components/utils/validation";
import { db } from "@/lib/db";
import { pusherServer } from "@/lib/pusher";
import { toPusherKey } from "@/lib/utils";
import { authOptions } from "@/pages/api/auth/[...nextauth]";
import { nanoid } from "nanoid";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
    try {
        // FIXME
        const { text, chatId } = await req.json();
        const session = await getServerSession(authOptions);
        if (!session) return NextResponse.json('Unauthorized', { status: 401 });

        const [userId1, userId2] = chatId.split('--');
        if (session.user.id !== userId1 && session.user.id !== userId2) {
            return NextResponse.json('Unauthorized', { status: 401 });
        };

        const friendId = session.user.id === userId1 ? userId2 : userId1;

        const friendList = await fetchRedis('smembers', `user:${session.user.id}:friends`) as string[];

        const isFriend = friendList.includes(friendId);

        if (!isFriend) {
            return NextResponse.json('Unauthorized', { status: 401 });
        };

        const rawSender = await fetchRedis('get', `user:${session.user.id}`) as string;
        const sender = await JSON.parse(rawSender) as user;

        console.log("sender", sender);

        const messageData: message = {
            id: nanoid(),
            senderId: session.user.id,
            text,
            timestamp: Date.now()

        }
        const message = messageValidator.parse(messageData);


        pusherServer.trigger(toPusherKey(`chat:${chatId}`), 'incoming-message', message);
        pusherServer.trigger(toPusherKey(`user:${friendId}:chats`), 'new_message', {
            ...message,
            senderImg: sender.image,
            senderName: sender.name,
        });

        await db.zadd(`chat:${chatId}:messages`, {
            score: Date.now(),
            member: JSON.stringify(message)
        });

        return NextResponse.json("OK")


    } catch (error) {
        if (error instanceof Error) {
            return NextResponse.json(error.message, { status: 500 });
        }

        return NextResponse.json('Internal Server Error', { status: 500 });
    }
}