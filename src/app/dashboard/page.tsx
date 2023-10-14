import { authOptions } from "@/lib/auth";
import { getServerSession } from "next-auth"

const Dashboard = async() => {
  const session = await getServerSession(authOptions);

  return (
    <div>{session ? JSON.stringify(session):"Hi"}</div>
  )
}

export default Dashboard