"use client";
import Image from "next/image";
import {
  CreditCard,
  Wallet,
  Building,
  Clock,
  FileText,
  ChevronUp,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import PayPal from "@/icons/PayPal";

export default function PaymentInstructions() {
  return (
    <div className="container mx-auto py-8 px-4">
      {/* Quick Navigation Cards */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Payment Methods</CardTitle>
          <CardDescription>
            Select a payment method to view details
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <a
              href="#credit-card"
              className="flex items-center gap-3 p-3 rounded-md hover:bg-muted transition-colors"
            >
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/10">
                <CreditCard className="h-5 w-5 text-primary" />
              </div>
              <div>
                <div className="font-medium">Credit Card Payments</div>
                <div className="text-sm text-muted-foreground">
                  Visa, MasterCard, American Express
                </div>
              </div>
            </a>

            <a
              href="#paypal"
              className="flex items-center gap-3 p-3 rounded-md hover:bg-muted transition-colors"
            >
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/10">
                <Wallet className="h-5 w-5 text-primary" />
              </div>
              <div>
                <div className="font-medium">PayPal Payments</div>
                <div className="text-sm text-muted-foreground">
                  Secure online payments
                </div>
              </div>
            </a>

            <a
              href="#bank-transfers"
              className="flex items-center gap-3 p-3 rounded-md hover:bg-muted transition-colors"
            >
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/10">
                <Building className="h-5 w-5 text-primary" />
              </div>
              <div>
                <div className="font-medium">Bank Transfers</div>
                <div className="text-sm text-muted-foreground">
                  USD and CAD payment options
                </div>
              </div>
            </a>

            <a
              href="#payment-plans"
              className="flex items-center gap-3 p-3 rounded-md hover:bg-muted transition-colors"
            >
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/10">
                <Clock className="h-5 w-5 text-primary" />
              </div>
              <div>
                <div className="font-medium">Payment Plans</div>
                <div className="text-sm text-muted-foreground">
                  US Only - Breadpay financing
                </div>
              </div>
            </a>

            <a
              href="#cheque"
              className="flex items-center gap-3 p-3 rounded-md hover:bg-muted transition-colors"
            >
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/10">
                <FileText className="h-5 w-5 text-primary" />
              </div>
              <div>
                <div className="font-medium">Payment by Cheque</div>
                <div className="text-sm text-muted-foreground">
                  Mail-in payment option
                </div>
              </div>
            </a>
          </div>
        </CardContent>
      </Card>

      <div className="mt-12 space-y-12">
        {/* Detailed Sections */}
        <section id="credit-card" className="scroll-mt-16">
          <div className="flex items-center gap-3 mb-4">
            <CreditCard className="h-8 w-8 text-primary" />
            <h2 className="text-2xl font-bold">1. Credit Card Payments</h2>
          </div>
          <Card>
            <CardContent className="pt-6">
              <p>
                MBTEK accepts payments via major credit cards. Customers can
                securely pay using Visa, MasterCard, and American Express
                directly on our website at checkout.
              </p>
              <div className="flex gap-4 mt-4 justify-center">
                <Image
                  src="/visa.svg"
                  alt="Visa"
                  width={60}
                  height={40}
                  className="h-10"
                />
                <Image
                  src="/mastercard.svg"
                  alt="MasterCard"
                  width={60}
                  height={40}
                  className="h-10"
                />
                <Image
                  src="/amex.svg"
                  alt="American Express"
                  width={60}
                  height={40}
                  className="h-10"
                />
              </div>
            </CardContent>
          </Card>
        </section>

        <section id="paypal" className="scroll-mt-16">
          <div className="flex items-center gap-3 mb-4">
            <Wallet className="h-8 w-8 text-primary" />
            <h2 className="text-2xl font-bold">2. PayPal Payments</h2>
          </div>
          <Card>
            <CardContent className="pt-6">
              <p>
                Customers can also pay securely via PayPal. If they prefer this
                method, they should select PayPal as their payment option when
                completing their order on our website.
              </p>
              <div className="flex justify-center mt-4">
                <PayPal />
              </div>
            </CardContent>
          </Card>
        </section>

        <section id="bank-transfers" className="scroll-mt-16">
          <div className="flex items-center gap-3 mb-4">
            <Building className="h-8 w-8 text-primary" />
            <h2 className="text-2xl font-bold">3. Bank Transfers</h2>
          </div>

          <Tabs defaultValue="usd" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="usd">
                USD Payments (U.S. Accounts)
              </TabsTrigger>
              <TabsTrigger value="cad">CAD Payments (Canada)</TabsTrigger>
            </TabsList>
            <TabsContent value="usd">
              <Card>
                <CardContent className="pt-6">
                  <h3 className="text-lg font-semibold mb-4">
                    USA using USD only (no international payment, local only)
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <ul className="space-y-2">
                        <li>
                          <span className="font-medium">Name:</span> 2424647
                          ALBERTA INC.
                        </li>
                        <li>
                          <span className="font-medium">Account Number:</span>{" "}
                          833367245854200
                        </li>
                        <li>
                          <span className="font-medium">Account Type:</span>{" "}
                          Checking
                        </li>
                        <li>
                          <span className="font-medium">
                            ACH Routing Number:
                          </span>{" "}
                          084009519
                        </li>
                      </ul>
                    </div>
                    <div>
                      <ul className="space-y-2">
                        <li>
                          <span className="font-medium">Bank Name:</span> Wise
                          US Inc
                        </li>
                        <li>
                          <span className="font-medium">Bank Address:</span> 30
                          W. 26th Street, Sixth Floor, New York, NY, 10010,
                          United States
                        </li>
                      </ul>
                    </div>
                  </div>
                  <div className="mt-4 p-4 bg-muted rounded-lg">
                    <h4 className="font-semibold">Important Notes:</h4>
                    <ul className="list-disc pl-5 mt-2">
                      <li>ACH Transfer (2-3 business days)</li>
                    </ul>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="cad">
              <Card>
                <CardContent className="pt-6">
                  <h3 className="text-lg font-semibold mb-4">
                    CANADA using CAD only (no international payment, local only)
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <ul className="space-y-2">
                        <li>
                          <span className="font-medium">Name:</span> 2424647
                          ALBERTA INC.
                        </li>
                        <li>
                          <span className="font-medium">Account Number:</span>{" "}
                          200116458449
                        </li>
                        <li>
                          <span className="font-medium">
                            Institution number:
                          </span>{" "}
                          621
                        </li>
                        <li>
                          <span className="font-medium">Transit number:</span>{" "}
                          16001
                        </li>
                        <li>
                          <span className="font-medium">
                            ACH Routing Number:
                          </span>{" "}
                          084009519
                        </li>
                      </ul>
                    </div>
                    <div>
                      <ul className="space-y-2">
                        <li>
                          <span className="font-medium">Bank Name:</span> Wise
                          US Inc
                        </li>
                        <li>
                          <span className="font-medium">Bank Address:</span> 30
                          W. 26th Street, Sixth Floor, New York, NY, 10010,
                          United States
                        </li>
                      </ul>
                    </div>
                  </div>
                  <div className="mt-4 p-4 bg-muted rounded-lg">
                    <h4 className="font-semibold">Important Notes:</h4>
                    <ul className="list-disc pl-5 mt-2">
                      <li>ACH Transfer (2-3 business days)</li>
                    </ul>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </section>

        <section id="payment-plans" className="scroll-mt-16">
          <div className="flex items-center gap-3 mb-4">
            <Clock className="h-8 w-8 text-primary" />
            <h2 className="text-2xl font-bold">
              4. Payment Plans (US Only) – Breadpay
            </h2>
          </div>
          <Card>
            <CardContent className="pt-6">
              <p>
                For customers in the United States, MBTEK offers financing
                options through Breadpay. Sales agents should direct customers
                to apply for financing at:
              </p>
              <div className="mt-4 p-4 bg-muted rounded-lg flex items-center gap-2">
                <span>➡️ Breadpay Financing:</span>
                <a
                  href="https://www.mbtek.com/pages/financing-with-breadpay%E2%84%A2"
                  className="text-primary hover:underline"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  https://www.mbtek.com/pages/financing-with-breadpay™
                </a>
              </div>
            </CardContent>
          </Card>
        </section>

        <section id="cheque" className="scroll-mt-16">
          <div className="flex items-center gap-3 mb-4">
            <FileText className="h-8 w-8 text-primary" />
            <h2 className="text-2xl font-bold">5. Payment by Cheque</h2>
          </div>
          <Card>
            <CardContent className="pt-6">
              <p>
                MBTEK accepts cheque payments. If a customer wishes to pay by
                cheque, instruct them to send their payment to the following
                address:
              </p>
              <div className="mt-4 p-4 bg-muted rounded-lg">
                <p className="font-medium">MBTEK</p>
                <p>113 Tamarack Way</p>
                <p>Fort McMurray, Alberta T9K1A2</p>
                <p>Canada</p>
              </div>
              <p className="mt-4 font-medium">
                Order# has to be mention on the cheque.
              </p>
              <div className="mt-4 p-4 border border-yellow-200 bg-yellow-50 rounded-lg text-yellow-800 dark:bg-yellow-900/30 dark:border-yellow-800 dark:text-yellow-200">
                <p>
                  * If a cheque is to be sent, the sales agent has to transmit
                  the order number with the cheque ETA to the sales manager so
                  he/she can inform the Finances department.
                </p>
              </div>
            </CardContent>
          </Card>
        </section>
      </div>

      <div className="mt-12 p-6 bg-muted rounded-lg">
        <p className="text-center">
          Sales agents should ensure that customers choose the most suitable
          payment method and receive accurate details. If any issues arise,
          please contact your department manager.
        </p>
      </div>

      <div className="fixed bottom-4 right-4">
        <Button
          className="rounded-full h-12 w-12 shadow-lg"
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
        >
          <ChevronUp className="h-6 w-6" />
        </Button>
      </div>
    </div>
  );
}
