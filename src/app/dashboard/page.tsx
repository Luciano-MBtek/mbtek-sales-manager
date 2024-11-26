import { getUserDataById } from "@/actions/user/getUserDataById";
import UserDashboard from "./user-dashboard";

const DashboardPage = async () => {
  const userData = await getUserDataById();

  return <UserDashboard user={userData} />;
};

export default DashboardPage;
