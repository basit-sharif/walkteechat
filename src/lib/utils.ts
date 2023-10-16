import { ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...input: ClassValue[]) {
    return twMerge(clsx(input))
};

export const toPusherKey = (key: string) => {
    return key.replace(/:/g, '__');
}