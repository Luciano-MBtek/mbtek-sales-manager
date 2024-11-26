import { getUserDataById } from "@/actions/user/getUserDataById";
import UserDashboard from "./user-dashboard";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "User Dashboard",
  description: "User dashboard for sales manager.",
};

const DashboardPage = async () => {
  const userData = await getUserDataById();

  return <UserDashboard user={userData} />;
};

export default DashboardPage;
