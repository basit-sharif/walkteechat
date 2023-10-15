import { db } from "@/lib/db";
import { authOptions } from "@/pages/api/auth/[...nextauth]";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server"
import { z } from "zod";

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const session = await getServerSession(authOptions);

        if (!session) {
            return NextResponse.json("Unauthorized", { status: 401 });
        };

        const { id: idToDeny } = z.object({ id: z.string() }).parse(body);
        await db.srem(`user:${session.user.id}:incoming_friend_requests`, idToDeny);

        return NextResponse.json("OK");

    } catch (error) {
        console.log((error as { message: string }).message);

        if (error instanceof z.ZodError) {
            return NextResponse.json('Invalid request payload', { status: 422 })
        }

        return NextResponse.json('Invalid request', { status: 400 })
    }
}