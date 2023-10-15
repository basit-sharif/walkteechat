import ChatInput from "@/components/shared/ChatInput";
import Messages from "@/components/shared/Messages";
import { message, user } from "@/components/types/db";
import { fetchRedis } from "@/components/utils/redishelper";
import { messageArrayValidator } from "@/components/utils/validation";
import { db } from "@/lib/db";
import { authOptions } from "@/pages/api/auth/[...nextauth]";
import { getServerSession } from "next-auth";
import Image from "next/image";
import { notFound } from 'next/navigation';

const getChatMessages = async (chatId: string) => {
    try {
        const result: string[] = await fetchRedis('zrange', `chat:${chatId}:messages`, 0, -1);
        const dbMessages = result.map((message) => JSON.parse(message) as message);

        const reversedDbMessages = dbMessages.reverse();
        const messages: Array<message> = messageArrayValidator.parse(reversedDbMessages);

        return messages
    } catch (error) {
        notFound();
    };
};

const Chat = async ({ params }: { params: { chatid: string } }) => {
    const { chatid } = params;
    const session = await getServerSession(authOptions);
    if (!session) notFound();

    const { user } = session;

    const [userId1, userId2] = chatid.split('--');

    if (user.id !== userId1 && user.id !== userId2) {
        notFound();
    };

    const chatPartnerId = user.id === userId1 ? userId2 : userId1;
    const chatPartner = (await db.get(`user:${chatPartnerId}`)) as user;
    const initialMessage = await getChatMessages(chatid);

    return (
        <div className="flex-1 justify-between flex flex-col h-full max-h-[calc(100vh-6rem)] ">
            <div className="flex sm:items-center justify-between py-3 border-b-2 border-gray-200">
                <div className="relative flex items-center space-x-4">
                    <div className="relative">
                        <div className="relative w-8 sm:w-12 h-8 sm:h-12">
                            <Image
                                fill
                                referrerPolicy="no-referrer"
                                src={chatPartner.image}
                                alt={`${chatPartner.name} profile picture`}
                                className="rounded-full"
                            />
                        </div>
                    </div>
                    <div className="flex flex-col leading-tight">
                        <div className="text-xl flex items-center">
                            <span className="text-gray-700 mr-3 font-semibold">
                                {chatPartner.name}
                            </span>
                        </div>
                        <span className="text-sm text-gray-600 "> {chatPartner.email}</span>
                    </div>
                </div>
            </div>
            <Messages sessionImg={session.user.image} chatPartner={chatPartner} initialMessages={initialMessage} sessionId={session.user.id} />
            <ChatInput chatId={chatid} chatPartner={chatPartner} />
        </div>
    )
}

export default Chat