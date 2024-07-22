import Skeleton from 'react-loading-skeleton'
import 'react-loading-skeleton/dist/skeleton.css'

const Loading = () => {
  return (
    <div className='pt-8 flex flex-col justify-center items-center'>
      <Skeleton className='mb-4' height={40} width={200} />
      <Skeleton height={20} width={150} />
      <Skeleton height={50} width={400} />
  
    </div>
  )
}

export default Loading