import * as motion from "framer-motion/client";
import { LucideProps } from "lucide-react";

export default function PageHeader({
  title,
  subtitle,
  icon: Icon,
}: {
  title: string;
  subtitle?: string;
  icon?: React.ComponentType<LucideProps>;
}) {
  return (
    <div className="w-full px-4 py-8 bg-gradient-to-r from-gray-50 to-white shadow-md rounded-lg">
      <div className="flex flex-col items-center sm:flex-row sm:items-start sm:justify-start space-y-4 sm:space-y-0 sm:space-x-6">
        {Icon && (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 260, damping: 20 }}
            className="flex-shrink-0"
          >
            <Icon
              className="w-12 h-12 text-gradient bg-gradient-to-br from-primary to-secondary rounded-full p-2 bg-clip-text "
              aria-hidden="true"
            />
          </motion.div>
        )}
        <div className="text-center sm:text-left">
          <motion.h1
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-4xl font-extrabold tracking-tight text-gray-900 bg-clip-text bg-gradient-to-r from-primary to-secondary"
          >
            {title}
          </motion.h1>
          {subtitle && (
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="mt-2 text-lg text-gray-600"
            >
              {subtitle}
            </motion.p>
          )}
        </div>
      </div>
    </div>
  );
}
