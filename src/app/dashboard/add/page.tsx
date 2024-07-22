import AddFriendButton from '@/components/shared/AddFriendButton'
import React from 'react'

const Add = async () => {
    
    return (
        <main className='pt-8 flex flex-col justify-center items-center'>
            <h1 className='font-bold text-4xl mb-8'>Add a friend</h1>
            <AddFriendButton />
        </main>
    )
}

export default Add