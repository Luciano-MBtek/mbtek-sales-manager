"use client";

import { TechnicalInformationDropdownExample } from "@/components/Modals/TechnicalInformation/TechnicalInformationDropdownExample";

export default function TestModalPage() {
  return (
    <div className="container mx-auto p-8">
      <h1 className="text-2xl font-bold mb-4">
        Technical Information Collection - Dropdown Example
      </h1>
      <p className="mb-4 text-gray-600">
        Click on the three dots button to open the dropdown and select
        &ldquo;Technical Information&rdquo;
      </p>

      <TechnicalInformationDropdownExample
        contactId="98549658715"
        dealId="38274671141"
      />
    </div>
  );
}
