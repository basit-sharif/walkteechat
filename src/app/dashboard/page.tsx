import { authOptions } from "@/lib/auth";
import { getServerSession } from "next-auth"

const Dashboard = async() => {
  const session = await getServerSession(authOptions);

  return (
    <div>{JSON.stringify(session)}</div>
  )
}

export default Dashboard