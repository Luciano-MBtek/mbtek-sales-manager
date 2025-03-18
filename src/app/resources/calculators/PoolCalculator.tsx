"use client";

import { useEffect, useState } from "react";

const PoolCalculator = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const script = document.createElement("script");
    script.id = "calconic";
    script.type = "text/javascript";
    script.async = true;
    script.dataset.calconic = "true";
    script.src = "https://cdn.calconic.com/static/js/calconic.min.js";

    script.onload = () => {
      setIsLoading(false);
    };

    script.onerror = () => {
      setError("Failed to load calculator");
      setIsLoading(false);
    };

    const firstScript = document.getElementsByTagName("script")[0];
    firstScript?.parentNode?.insertBefore(script, firstScript);

    return () => {
      const existingScript = document.getElementById("calconic");
      if (existingScript) {
        existingScript.remove();
      }
    };
  }, []);

  if (error) {
    return <div className="text-center text-red-600 py-4">{error}</div>;
  }

  return (
    <div className="space-y-4">
      <div className="text-center">
        Heat calculator use <strong>24hrs for heat pump</strong> and usually
        about <strong>4-8 hrs for boiler.</strong>
      </div>
      {isLoading && (
        <div className="text-center py-4">Loading calculator...</div>
      )}
      <div
        className="calconic-calculator"
        data-calculatorid="658dc205e36573001e25eff8"
      />
    </div>
  );
};

export default PoolCalculator;
