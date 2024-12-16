"use client";

import { Suspense } from "react";
import StepOneFormContent from "./stepOneFormContent";

export default function StepOneForm() {
  return (
    <Suspense fallback={<div>Cargando formulario...</div>}>
      <StepOneFormContent />
    </Suspense>
  );
}
