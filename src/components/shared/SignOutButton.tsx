"use client"
import { ButtonHTMLAttributes, ReactNode, useState } from "react"
import Button from "./ui/Button";
import { toast } from "react-hot-toast";
import { signOut } from "next-auth/react";
import { Loader2, LogOut } from "lucide-react";

interface SignOutButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> { }

const SignOutButton = ({ ...props }: SignOutButtonProps) => {
    const [isSignOut, setSignOut] = useState(false);
    return <Button
        {...props}
        variant="ghost"
        onClick={async () => {
            setSignOut(true);
            try {
                await signOut();
            } catch (error) {
                toast.error('There was a problem signing out');
            } finally {
                setSignOut(false);
            }
        }}
    >
        {isSignOut ? (
            <Loader2 className="animate-spin h-4 w-4" />
        ) : (
            <LogOut className="w-4 h-4" />
        )}
    </Button>
}

export default SignOutButton