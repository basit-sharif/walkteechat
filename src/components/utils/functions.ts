import { user } from "../types/db";
import { fetchRedis } from "./redishelper";

export async function getFriendsByUserId(userId: string) {
    const friendIds = await fetchRedis("smembers", `user:${userId}:friends`) as string[];

    const friends = await Promise.all(
        friendIds.map(async (friendId) => {
            const friend = await fetchRedis('get', `user:${friendId}`) as string;
            const parsedFriend = JSON.parse(friend) as user;
            return parsedFriend
        })
    )
    return friends;
};
export function chatHrefConstructor(id1: string, id2: string) {
    const sortedIds = [id1, id2].sort();
    return `${sortedIds[0]}--${sortedIds[1]}`
}