import PoolCalculator from "./PoolCalculator";
import HeatingCalculator from "./RoiAndFinancing";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";

const CalculatorTabs = () => {
  return (
    <div className="container mx-auto py-8 px-4">
      <Tabs defaultValue="heating" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="heating">ROI & Financing</TabsTrigger>
          <TabsTrigger value="pool">Pool Calculator</TabsTrigger>
        </TabsList>
        <TabsContent value="heating">
          <Card>
            <CardContent className="pt-6">
              <HeatingCalculator />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="pool">
          <Card>
            <CardContent className="pt-6">
              <PoolCalculator />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default CalculatorTabs;
