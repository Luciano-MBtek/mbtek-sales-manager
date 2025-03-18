import PageHeader from "@/components/PageHeader";
import PaymentInstructions from "./PaymentInstructions";

const paymentPage = () => {
  return (
    <div className="container mx-auto py-10">
      <PageHeader
        title="Payment instructions for sales agents"
        subtitle={`This document provides MBTEK's sales agents with clear
          instructions on how customers can make payments using different
          available methods. Please ensure that customers receive the correct
          payment details based on their preferred payment method.`}
      />
      <PaymentInstructions />
    </div>
  );
};

export default paymentPage;
