import { FC } from 'react'
import Skeleton from "react-loading-skeleton"

interface loadingProps { }

const loading: FC<loadingProps> = ({ }) => {
  return (
    <div className='w-full h-full flex justify-center items-center'>
      <svg xmlns="http://www.w3.org/2000/svg" width="38" height="38" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" className="lucide lucide-loader-circle fa-spinner"><path d="M21 12a9 9 0 1 1-6.219-8.56" /></svg>
    </div>
  )
}

export default loading