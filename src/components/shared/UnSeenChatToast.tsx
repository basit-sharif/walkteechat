import { cn } from "@/lib/utils"
import { Toast, toast } from "react-hot-toast"
import { chatHrefConstructor } from "../utils/functions"
import Image from "next/image"
import Link from "next/link"

const UnSeenChatToast = ({ t, sessionId, senderId, senderImg, senderName, senderMessage }: { t: Toast, sessionId: string, senderId: string, senderImg: string, senderName: string, senderMessage: string }) => {
    return (
        <div className={cn('max-w-md w-full bg-white shadow-lg rounded-lg pointer-events-auto flex ring-1 ring-black ring-opacity-5 ', {
            'animate-enter': t.visible,
            'animate-leave': !t.visible
        })}>
            <Link onClick={() => toast.dismiss(t.id)} href={`/dashboard/chat/${chatHrefConstructor(sessionId, senderId)}`}
                className="flex-1 w-0 p-4"
            >
                <div className="flex items-start">
                    <div className="flex-shrink-0 pt-0.5">
                        <div className="relative h-10 w-10">
                            <Image
                                fill
                                referrerPolicy="no-referrer"
                                className="rounded-full"
                                src={senderImg}
                                alt={`${senderName} profile picture`}
                            />

                        </div>
                    </div>
                    <div className="ml-3 flex-1 ">
                        <p className="text-sm font-medium text-gray-900">{senderName}</p>
                        <p className="text-sm mt-1 text-gray-500">{senderMessage}</p>
                    </div>
                </div>
            </Link>
            <div className="flex border-l border-gray-200">
                <button onClick={() => toast.dismiss(t.id)}
                    className="w-full border-transparent rounded-none rounded-r-lg p-4 flex items-center justify-center text-sm font-medium text-indigo-600 hover:text-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                    Close
                </button>
            </div>
        </div>
    )
}

export default UnSeenChatToast