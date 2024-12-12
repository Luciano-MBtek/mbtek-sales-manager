import { User, Activity, Lead } from "@prisma/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import FavoriteLeadCard from "./components/FavoriteLeadCard";

export type UserWithRelations = User & {
  activities: Activity[];
  favoriteLeads: { lead: Lead }[];
  recentLeads: { lead: Lead; accessedAt: Date }[];
};

export default function UserDashboard({ user }: { user: UserWithRelations }) {
  return (
    <div className="container mx-auto p-4 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>User Information</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center space-x-4">
            <div>
              <h2 className="text-2xl font-bold">{user.name}</h2>
              <p className="text-gray-500">{user.email}</p>
              <Badge>{user.accessLevel}</Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Recent Activities</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Type</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Details</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {user.activities.slice(0, 5).map((activity) => (
                <TableRow key={activity.id.toString()}>
                  <TableCell>{activity.activityType}</TableCell>
                  <TableCell>
                    {new Date(activity.activityDate).toLocaleString()}
                  </TableCell>
                  <TableCell>{activity.details || "N/A"}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <FavoriteLeadCard user={user} />

        <Card>
          <CardHeader>
            <CardTitle>Recent Leads</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {user.recentLeads.map(({ lead, accessedAt }) => (
                <li
                  key={lead.id.toString()}
                  className="flex justify-between items-center"
                >
                  <span>{lead.name}</span>
                  <span className="text-gray-500">
                    {new Date(accessedAt).toLocaleDateString()}
                  </span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
