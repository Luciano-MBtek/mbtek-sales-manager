"use client";
import { motion } from "framer-motion";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Search,
  ShoppingCart,
  Package,
  Truck,
  BarChart,
  MapPin,
} from "lucide-react";

interface ChatInfoGraphicProps {
  onClose: () => void;
}

export const ChatInfoGraphic = ({ onClose }: ChatInfoGraphicProps) => {
  const tools = [
    {
      name: "Product Search",
      description: "Technical specifications and product manuals",
      icon: <Search className="h-6 w-6 text-blue-500" />,
    },
    {
      name: "Shopify Inventory",
      description: "Prices, availability and product variants",
      icon: <ShoppingCart className="h-6 w-6 text-green-500" />,
    },
    {
      name: "Stock Status",
      description: "Available stock check and estimated dates",
      icon: <Package className="h-6 w-6 text-amber-500" />,
    },
    {
      name: "Order Tracking",
      description: "Shipping status and estimated delivery dates",
      icon: <Truck className="h-6 w-6 text-purple-500" />,
    },
    {
      name: "Chart Generation",
      description: "Data visualization through custom charts",
      icon: <BarChart className="h-6 w-6 text-red-500" />,
    },
    {
      name: "Installer Location",
      description: "Find installers near your location",
      icon: <MapPin className="h-6 w-6 text-indigo-500" />,
    },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      {...{
        className:
          "p-4 mb-4 bg-white rounded-lg shadow-md  bg-white/20 backdrop-blur-sm rounded-lg p-4 z-20",
      }}
    >
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold text-gray-800">
          Welcome to the Virtual Assistant!
        </h3>
        <Button
          variant="ghost"
          size="icon"
          onClick={onClose}
          className="h-8 w-8"
        >
          <X className="h-4 w-4" />
        </Button>
      </div>

      <p className="text-sm text-gray-600 mb-4">
        I can help you with product information, inventory, orders and more.
        These are my capabilities:
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {tools.map((tool, index) => (
          <Card
            key={index}
            className="overflow-hidden border-l-4 bg-background z-20"
            style={{ borderLeftColor: getColorForIndex(index) }}
          >
            <CardContent className="p-3 flex items-start space-x-3">
              <div className="mt-1">{tool.icon}</div>
              <div>
                <h4 className="font-medium text-sm">{tool.name}</h4>
                <p className="text-xs text-gray-500">{tool.description}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="mt-4 text-center">
        <p className="text-sm text-gray-500">How can I help you today?</p>
      </div>
    </motion.div>
  );
};

// Function to get colors for card borders
function getColorForIndex(index: number): string {
  const colors = [
    "#3b82f6", // blue
    "#10b981", // green
    "#f59e0b", // amber
    "#8b5cf6", // purple
    "#ef4444", // red
    "#6366f1", // indigo
  ];

  return colors[index % colors.length];
}
