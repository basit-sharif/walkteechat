"use client"
import { AppProgressBar as ProgressBar } from 'next-nprogress-bar';
import { ReactNode } from "react"
import { Toaster } from "react-hot-toast"

const Wrapper = ({ children }: { children: ReactNode }) => {
    return (
        <>
            <ProgressBar
                height="3px"
                color="#304FB6"
                options={{ showSpinner: false }}
                shallowRouting
            />
            <Toaster position="top-center" reverseOrder={false} />
            {children}
        </>
    )
}

export default Wrapper