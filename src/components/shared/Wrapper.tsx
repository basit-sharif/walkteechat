"use client"
import { ReactNode } from "react"
import { Toaster } from "react-hot-toast"

const Wrapper = ({ children }: { children: ReactNode }) => {
    return (
        <>
            <Toaster position="top-center" reverseOrder={false} />
            {children}
        </>
    )
}

export default Wrapper