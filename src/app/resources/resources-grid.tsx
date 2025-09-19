"use client";

import {
  BookOpen,
  Calculator,
  MapPin,
  CreditCard,
  FileText,
  ClipboardList,
  Check,
  Table2,
} from "lucide-react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { useRouter } from "next/navigation";

export default function ResourcesGrid() {
  const router = useRouter();
  const cards = [
    /* {
      icon: <BookOpen className="h-6 w-6" />,
      title: "Knowledge Base",
      subtitle: "Product assistance",
      items: [],
      onClick: () => {},
    }, */
    {
      icon: <Calculator className="h-6 w-6" />,
      title: "Calculators",
      subtitle: "ROI & technical tools",
      items: ["ROI & Loan Calculator", "Pool Heating Calculator"],
      onClick: () => {
        router.push("/resources/calculators");
      },
    },
    {
      icon: <MapPin className="h-6 w-6" />,
      title: "Installers Map",
      subtitle: "Certified partners",
      items: ["Find local installers"],
      onClick: () => {
        window.open(
          "https://www.google.com/maps/d/u/0/viewer?mid=11w8982kwIXNLi-L2iOEByzbrGD_e8Ug&ll=41.271953138759145%2C-80.78441631783622&z=6",
          "_blank"
        );
      },
    },
    {
      icon: <CreditCard className="h-6 w-6" />,
      title: "Payment Info",
      subtitle: "Financial options",
      items: [
        "Financing programs",
        "Payment methods",
        "Rebates and incentives",
      ],
      onClick: () => {
        router.push("/resources/payment");
      },
    },
    {
      icon: <Table2 className="h-6 w-6" />,
      title: "Orders",
      subtitle: "Order management",
      items: ["View order status", "Track shipments", "Order history"],
      onClick: () => {
        router.push("/resources/orders");
      },
    },
    /* {
      icon: <FileText className="h-6 w-6" />,
      title: "Onboarding Guide",
      subtitle: "Getting started",
      items: [
        "First-time user guides",
        "Customer setup docs",
        "System commissioning",
      ],
      onClick: () => {
        router.push("/resources/onboarding");
      },
    }, */
    /* {
      icon: <ClipboardList className="h-6 w-6" />,
      title: "Sales SOP",
      subtitle: "Policies and procedures",
      items: [
        "Standard procedures",
        "Terms and conditions",
        "Sales policy documents",
      ],
      onClick: () => {
        router.push("/resources/sales-sop");
      },
    }, */
  ];

  return (
    <div className="container mx-auto p-4">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {cards.map((card, index) => (
          <Card
            key={index}
            className="border shadow-sm hover:shadow-md transition-shadow cursor-pointer"
            onClick={card.onClick}
          >
            <CardHeader className="pb-2">
              <div className="mb-2">{card.icon}</div>
              <h3 className="text-lg font-medium">{card.title}</h3>
              <p className="text-sm text-muted-foreground">{card.subtitle}</p>
            </CardHeader>
            <CardContent>
              {card.items.length > 0 && (
                <ul className="space-y-2">
                  {card.items.map((item, itemIndex) => (
                    <li key={itemIndex} className="flex items-start">
                      <Check className="h-5 w-5 text-primary mr-2 rounded-full" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
