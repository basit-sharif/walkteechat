import { authOptions } from "@/pages/api/auth/[...nextauth]";
import { getServerSession } from "next-auth"

const Dashboard = async() => {
  const session = await getServerSession(authOptions);
console.log(session ? JSON.stringify(session):"Hi")
  return (
    <div>Dashboard</div>
  )
}

export default Dashboard