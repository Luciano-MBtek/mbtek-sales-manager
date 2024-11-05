import { ReactNode } from "react";

type InfoItem = {
  icon?: ReactNode;
  label: string;
  value: string | undefined | string[];
};

const InfoItem = ({ icon, label, value }: InfoItem) => {
  return (
    <div className="flex flex-col space-y-1">
      <div className="flex items-center space-x-2">
        {icon}
        <span className="text-sm font-medium text-muted-foreground">
          {label}
        </span>
      </div>
      <p className="text-base font-semibold">{value}</p>
    </div>
  );
};

export default InfoItem;
