import { fetchRedis } from "@/components/utils/redishelper";
import { db } from "@/lib/db";
import { authOptions } from "@/pages/api/auth/[...nextauth]";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();

        const { id: idToAdd } = z.object({ id: z.string() }).parse(body);

        const session = await getServerSession(authOptions);

        if (!session) {
            return NextResponse.json('Unauthorized', { status: 401 });
        };

        const isAlreadyFriends = await fetchRedis('sismember', `user:${session.user.id}:friends`, idToAdd);

        if (isAlreadyFriends) {
            return NextResponse.json("Already friends", { status: 400 });
        };
        const hadFriendRequest = await fetchRedis('sismember', `user:${session.user.id}:incoming_friend_requests`, idToAdd);

        if (!hadFriendRequest) {
            return NextResponse.json('No friend request', { status: 400 });
        };

        await db.sadd(`user:${session.user.id}:friends`, idToAdd);
        await db.sadd(`user:${idToAdd}:friends`, session.user.id);

        // await db.srem(`user:${idToAdd}:outbound_icoming_friend_requests`, session.user.id);
        await db.srem(`user:${session.user.id}:incoming_friend_requests`, idToAdd);

        return NextResponse.json('OK');
    } catch (error) {
        console.log((error as { message: string }).message);

        if (error instanceof z.ZodError) {
            return NextResponse.json('Invalid request payload', { status: 422 })
        }

        return NextResponse.json('Invalid request', { status: 400 })
    }
}