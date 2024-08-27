import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const NoContactCard = ({ value }: { value: string }) => {
  return (
    <Card className="shadow-[0_0_10px_rgba(255,0,0,0.5)]">
      <CardHeader>
        <CardTitle>No Contact Found</CardTitle>
      </CardHeader>
      <CardContent>
        <p>Try again with a different {value}.</p>
      </CardContent>
    </Card>
  );
};

export default NoContactCard;
