"use client";
import {
  EnergyCosts,
  LoanTerms,
  LoanResults,
  CalculationResults,
} from "./calculator-types";

import { formatCurrency } from "@/lib/utils";

import { useState } from "react";

const energyCosts: EnergyCosts = {
  oil: 0.033,
  propane: 0.03,
  electric: 0.039,
  gas: 0.0135,
  baseboard: 0.039,
  air: 0.0144,
  "oil-furnace": 0.034,
  "gas-furnace": 0.0135,
  "propane-furnace": 0.03,
  "electric-furnace": 0.039,
  evi: 0.0083,
  r290: 0.0068,
  geo: 0.0075,
  wood: 0.015,
  woodchip: 0.012,
  pellet: 0.016,
  coal: 0.0135,
};

function calculateMonthlyPayment(
  principal: number,
  annualRate: number,
  termMonths: number
): number {
  const monthlyRate = annualRate / 100 / 12;
  if (monthlyRate === 0) {
    return principal / termMonths;
  }
  return (
    (principal * monthlyRate * Math.pow(1 + monthlyRate, termMonths)) /
    (Math.pow(1 + monthlyRate, termMonths) - 1)
  );
}

export default function HeatingCalculator() {
  // Form states
  const [currentSystem, setCurrentSystem] = useState<string>("oil");
  const [newSystem, setNewSystem] = useState<string>("evi");
  const [annualCost, setAnnualCost] = useState<string>("");
  const [purchaseCost, setPurchaseCost] = useState<string>("");
  const [interestRate, setInterestRate] = useState<string>("7.99");
  const [loanTerms, setLoanTerms] = useState<LoanTerms>({
    18: true,
    24: false,
    36: true,
  });
  const [results, setResults] = useState<CalculationResults | null>(null);

  const handleCalculate = () => {
    const annualCostVal = parseFloat(annualCost);
    const purchaseCostVal = parseFloat(purchaseCost) || 0;
    if (
      !currentSystem ||
      !newSystem ||
      isNaN(annualCostVal) ||
      annualCostVal <= 0
    ) {
      alert("Please fill in all required fields with valid values.");
      return;
    }

    const currentEnergyCost = energyCosts[currentSystem];
    const newEnergyCost = energyCosts[newSystem];

    if (!currentEnergyCost || !newEnergyCost) {
      console.error("Missing energy cost data");
      return;
    }

    // Calculate energy consumption based on the current system
    const energyConsumption = annualCostVal / currentEnergyCost;
    const newSystemCost = energyConsumption * newEnergyCost;
    const annualSavings = annualCostVal - newSystemCost;
    const monthlySavings = annualSavings / 12;
    const oldMonthlyCost = annualCostVal / 12;
    const newMonthlyCost = newSystemCost / 12;

    let roiText = "No positive ROI";
    if (annualSavings > 0 && purchaseCostVal > 0) {
      const roiTime = purchaseCostVal / annualSavings;
      const roiYears = Math.floor(roiTime);
      const roiMonths = Math.round((roiTime - roiYears) * 12);
      roiText = `${roiYears} years and ${roiMonths} months`;
    }

    // Financing options if purchase cost is entered
    let loanResults: LoanResults = {};
    if (purchaseCostVal > 0) {
      [18, 24, 36].forEach((term) => {
        if (loanTerms[term]) {
          const payment = calculateMonthlyPayment(
            purchaseCostVal,
            parseFloat(interestRate),
            term
          );
          const netCost = payment - monthlySavings;
          loanResults[term] = {
            payment,
            netCost,
          };
        }
      });
    }

    setResults({
      oldMonthlyCost,
      newMonthlyCost,
      annualSavings,
      monthlySavings,
      roiText,
      loanResults,
    });
  };

  const resetForm = () => {
    setCurrentSystem("oil");
    setNewSystem("evi");
    setAnnualCost("");
    setPurchaseCost("");
    setInterestRate("7.99");
    setLoanTerms({ 18: true, 24: false, 36: true });
    setResults(null);
  };

  // Helper to format currency

  // Color helper based on value
  const textColor = (value: number): string =>
    value >= 0 ? "text-green-600" : "text-red-600";

  return (
    <div className="max-w-4xl mx-auto p-5">
      <div className="rounded-lg shadow-md overflow-hidden">
        {/* Card Header */}
        <div className="bg-gray-100 p-5 border-b border-gray-200">
          <h1 className="text-2xl font-bold">
            Heating System Savings Calculator - MBTEK
          </h1>
          <p className="text-sm text-gray-600 mt-2">
            This tool calculates annual savings by replacing an existing heating
            system with one of MBTEK&apos;s efficient units. All costs are based
            on national energy averages.
          </p>
        </div>

        {/* Card Content */}
        <div className="p-5 space-y-6">
          {/* Current Heating System */}
          <div>
            <h3 className="text-lg font-semibold mb-2">
              Client&apos;s Current Heating System:
            </h3>
            <div className="space-y-2">
              {[
                { id: "oil", label: "Oil Boiler", efficiency: "85%" },
                { id: "propane", label: "Propane Boiler", efficiency: "90%" },
                { id: "electric", label: "Electric Boiler", efficiency: "99%" },
                { id: "gas", label: "Natural Gas Boiler", efficiency: "92%" },
                {
                  id: "baseboard",
                  label: "Electric Baseboards",
                  efficiency: "99%",
                },
                {
                  id: "air",
                  label: "Standard Air-to-Air Heat Pump",
                  efficiency: "COP: 2.7",
                },
                { id: "oil-furnace", label: "Oil Furnace", efficiency: "82%" },
                {
                  id: "gas-furnace",
                  label: "Natural Gas Furnace",
                  efficiency: "92%",
                },
                {
                  id: "propane-furnace",
                  label: "Propane Furnace",
                  efficiency: "90%",
                },
                {
                  id: "electric-furnace",
                  label: "Electric Furnace",
                  efficiency: "99%",
                },
              ].map((item) => (
                <div key={item.id} className="flex items-center">
                  <input
                    type="radio"
                    id={item.id}
                    name="current-system"
                    value={item.id}
                    checked={currentSystem === item.id}
                    onChange={() => setCurrentSystem(item.id)}
                    className="form-radio"
                  />
                  <label htmlFor={item.id} className="ml-2 text-sm">
                    {item.label}{" "}
                    <span className="text-gray-500">({item.efficiency})</span>
                  </label>
                </div>
              ))}
            </div>
          </div>

          {/* Annual Heating Cost */}
          <div>
            <h3 className="text-lg font-semibold mb-2">
              <label htmlFor="annual-cost">
                Previous Annual Heating Cost ($):
              </label>
            </h3>
            <input
              type="number"
              id="annual-cost"
              placeholder="Enter annual cost..."
              value={annualCost}
              onChange={(e) => setAnnualCost(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-md"
            />
          </div>

          {/* New MBTEK Heating System */}
          <div>
            <h3 className="text-lg font-semibold mb-2">
              New MBTEK Heating System:
            </h3>
            <div className="space-y-2">
              {[
                {
                  id: "evi",
                  label: "Air-to-Water Heat Pump (R32)",
                  efficiency: "SCOP: 4.7",
                },
                {
                  id: "r290",
                  label: "Air-to-Water Heat Pump (R290)",
                  efficiency: "SCOP: 5.7",
                },
                {
                  id: "geo",
                  label: "Water-to-Water Geothermal (High Efficiency EVI)",
                  efficiency: "COP: 5.2",
                },
                { id: "wood", label: "Wood Boiler", efficiency: "75%" },
                { id: "woodchip", label: "Woodchip Boiler", efficiency: "80%" },
                { id: "pellet", label: "Pellet Boiler", efficiency: "85%" },
                { id: "coal", label: "Coal Boiler", efficiency: "75%" },
              ].map((item) => (
                <div key={item.id} className="flex items-center">
                  <input
                    type="radio"
                    id={item.id}
                    name="new-system"
                    value={item.id}
                    checked={newSystem === item.id}
                    onChange={() => setNewSystem(item.id)}
                    className="form-radio"
                  />
                  <label htmlFor={item.id} className="ml-2 text-sm">
                    {item.label}{" "}
                    <span className="text-gray-500">({item.efficiency})</span>
                  </label>
                </div>
              ))}
            </div>
          </div>

          {/* System Purchase Cost */}
          <div>
            <h3 className="text-lg font-semibold mb-2">
              <label htmlFor="purchase-cost">
                MBTEK System - Purchase Cost ($):
              </label>
            </h3>
            <input
              type="text"
              id="purchase-cost"
              placeholder="Enter purchase cost..."
              value={purchaseCost}
              onChange={(e) => {
                // Allow only numbers
                const val = e.target.value.replace(/[^\d]/g, "");
                setPurchaseCost(val);
              }}
              className="w-full p-3 border border-gray-300 rounded-md"
            />
            <p className="text-xs text-gray-500 mt-1">
              Average purchase cost for the selected system. You can adjust this
              value according to your situation.
            </p>
          </div>

          {/* Buttons */}
          <div className="flex flex-wrap gap-4">
            {/* Replace these with shadCN Button components if desired */}
            <button
              onClick={handleCalculate}
              className="bg-orange-500 hover:bg-orange-600 text-white font-bold py-3 px-6 rounded-md"
            >
              Calculate Savings
            </button>
            <button
              onClick={resetForm}
              className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-3 px-6 rounded-md"
            >
              Reset
            </button>
          </div>

          {/* Results Section */}
          {results && (
            <div>
              <div className="bg-gray-100 p-5 rounded-md mt-5 space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <div className="font-bold">
                      MONTHLY COST WITH OLD SYSTEM:
                    </div>
                    <input
                      type="text"
                      readOnly
                      value={formatCurrency(results.oldMonthlyCost)}
                      className="w-full p-3 border border-gray-300 rounded-md bg-white font-bold"
                    />
                  </div>
                  <div>
                    <div className="font-bold">
                      MONTHLY COST WITH NEW SYSTEM:
                    </div>
                    <input
                      type="text"
                      readOnly
                      value={formatCurrency(results.newMonthlyCost)}
                      className="w-full p-3 border border-gray-300 rounded-md bg-white font-bold"
                    />
                  </div>
                </div>
                <div>
                  <div
                    className={`font-bold ${results.annualSavings >= 0 ? "text-green-600" : "text-red-600"}`}
                  >
                    ANNUAL SAVINGS ($):
                  </div>
                  <input
                    type="text"
                    readOnly
                    value={results.annualSavings.toFixed(2)}
                    className="w-full p-3 border border-gray-300 rounded-md font-bold"
                  />
                </div>
                <div>
                  <div
                    className={`font-bold ${results.monthlySavings >= 0 ? "text-green-600" : "text-red-600"}`}
                  >
                    MONTHLY SAVINGS ($):
                  </div>
                  <input
                    type="text"
                    readOnly
                    value={results.monthlySavings.toFixed(2)}
                    className="w-full p-3 border border-gray-300 rounded-md font-bold"
                  />
                </div>
                <div>
                  <div className="font-bold text-blue-600">
                    RETURN ON INVESTMENT:
                  </div>
                  <input
                    type="text"
                    readOnly
                    value={results.roiText}
                    className="w-full p-3 border border-gray-300 rounded-md font-bold text-blue-600"
                  />
                </div>
              </div>

              {/* Financing Section */}
              {parseFloat(purchaseCost) > 0 && (
                <div className="border-t border-gray-200 mt-6 pt-6">
                  <div className="bg-blue-50 p-4 rounded-md mb-4">
                    <div className="font-bold text-lg text-blue-800 mb-3">
                      FINANCING OPTIONS
                    </div>
                    <div className="mb-4">
                      <label
                        htmlFor="interest-rate"
                        className="block text-sm font-medium text-gray-700"
                      >
                        Annual Interest Rate (%) - BreadPay offers between 7.99%
                        and 29.99%
                      </label>
                      <input
                        type="number"
                        id="interest-rate"
                        value={interestRate}
                        onChange={(e) => setInterestRate(e.target.value)}
                        min="7.99"
                        max="29.99"
                        step="0.01"
                        className="w-full p-3 border border-gray-300 rounded-md mt-1"
                      />
                    </div>

                    <div className="mb-4">
                      <div className="text-sm font-medium text-gray-700 mb-2">
                        Loan Term
                      </div>
                      <div className="flex flex-wrap gap-4">
                        {[18, 24, 36].map((term) => (
                          <div key={term} className="flex items-center">
                            <input
                              type="checkbox"
                              id={`term-${term}`}
                              checked={loanTerms[term]}
                              onChange={(e) =>
                                setLoanTerms((prev) => ({
                                  ...prev,
                                  [term]: e.target.checked,
                                }))
                              }
                              className="form-checkbox"
                              value={term}
                            />
                            <label
                              htmlFor={`term-${term}`}
                              className="ml-2 text-sm"
                            >
                              {term} months
                            </label>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Loan Results */}
                    {Object.entries(results.loanResults).map(([term, data]) => (
                      <div
                        key={term}
                        className="bg-white p-4 rounded-md shadow mb-4"
                      >
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <div className="font-bold text-purple-700">
                              MONTHLY LOAN PAYMENT ({term} MONTHS):
                            </div>
                            <input
                              type="text"
                              readOnly
                              value={formatCurrency(data.payment)}
                              className="w-full p-3 border border-gray-300 rounded-md bg-white font-bold text-purple-700"
                            />
                          </div>
                          <div>
                            <div className="font-bold text-indigo-700">
                              NET MONTHLY COST (Loan - Monthly Savings):
                            </div>
                            <input
                              type="text"
                              readOnly
                              value={formatCurrency(data.netCost)}
                              className={`w-full p-3 border border-gray-300 rounded-md font-bold ${textColor(-data.netCost)}`}
                            />
                            <p className="text-xs text-gray-500 mt-1">
                              {data.netCost <= 0
                                ? "Savings cover the loan payment!"
                                : "Additional cost after savings"}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
