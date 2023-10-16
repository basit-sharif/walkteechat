import { fetchRedis } from "@/components/utils/redishelper";
import { addFriendValidator } from "@/components/utils/validation";
import { db } from "@/lib/db";
import { pusherServer } from "@/lib/pusher";
import { toPusherKey } from "@/lib/utils";
import { authOptions } from "@/pages/api/auth/[...nextauth]";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        let email = body.email;

        const { email: emailToAdd } = addFriendValidator.parse({ email });
        // const RESTResponse = await fetch(`${process.env.UPSTASH_REDIS_REST_URL}/get/user:email${emailToAdd}`, {
        //     headers: {
        //         Authorization: `Bearer ${process.env.UPSTASH_REDIS_REST_TOKEN}`
        //     },
        //     cache: 'no-store',
        // });
        // const data = await RESTResponse.json() as { result: string | null };

        const idToAdd = await fetchRedis('get', `user:email:${emailToAdd}`);;
        // const idToAdd = idToAdded.result;
        console.log("idToAdd: ", idToAdd)

        const session = await getServerSession(authOptions);

        if (!idToAdd) {
            // UNE UserNotExists //UNE
            return new Response('This person does not exist.', { status: 400 })
        };

        if (!session) {
            return new Response('Unauthorized', { status: 401 })
        };
        if (idToAdd === session.user.id) {
            // YouCantAddYourselfAsFriend //YCAYAF
            return new Response('You cannot add yourself as a friend', { status: 400 })
        };

        const isAlreadyAdded = (await fetchRedis('sismember', `user:${idToAdd}:incoming_friend_requests`, session.user.id)) as 0 | 1;
        console.log("isAlreadyAdded: ", isAlreadyAdded)
        if (isAlreadyAdded) {
            // AEFL Already Added in Friend List  //AAFL
            return new Response('Already added this user', { status: 400 })
        };

        const isAlreadyFriends = (await fetchRedis('sismember', `user:${session.user.id}:friends`, idToAdd)) as 0 | 1;

        if (isAlreadyFriends) {
            // AEFL Already Exists in Friend List  //AEFL
            return new Response('Already friends with this user', { status: 400 })
        };

        let pus = await pusherServer.trigger(toPusherKey(`user:${idToAdd}:incoming_friend_requests`), 'incoming_friend_requests',
            {
                senderId: session.user.id,
                senderEmail: session.user.email
            }
        );


        db.sadd(`user:${idToAdd}:incoming_friend_requests`, session.user.id)

        return NextResponse.json('OK');


    } catch (error) {
        if (error instanceof z.ZodError) {
            return new Response('Invalid request payload', { status: 422 })
        }

        return new Response('Invalid request', { status: 400 })
    }
}