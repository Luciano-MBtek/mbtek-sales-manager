"use client";

import { useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { AlertTriangle, Home, RefreshCw } from "lucide-react";
import Link from "next/link";

export default function ErrorPage() {
  const searchParams = useSearchParams();
  const error = searchParams.get("error");

  const errorMessages = {
    Signin: "There was a problem trying to sign in. Please try again.",
    OAuthSignin:
      "An error occurred while building the authorization URL. Our technical team has been notified.",
    OAuthCallback:
      "There was an issue processing the authentication response. Please try again.",
    AccessDenied:
      "You do not have permission to access this page. If you believe this is an error, contact support.",
    Default:
      "An unexpected error has occurred. Our team is working to resolve it.",
  };

  const errorMessage =
    errorMessages[error as keyof typeof errorMessages] || errorMessages.Default;

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-gradient-to-r from-red-50 to-red-100 p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <AlertTriangle className="h-12 w-12 text-red-600" />
          </div>
          <CardTitle className="text-2xl font-bold text-center text-red-600">
            Oops! Something went wrong
          </CardTitle>
          <CardDescription className="text-center text-gray-600">
            We have encountered an issue while processing your request
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-center text-gray-700 mb-4">{errorMessage}</p>
          <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-4">
            <p className="text-sm text-red-700">
              Error code:{" "}
              <span className="font-mono">{error || "Desconocido"}</span>
            </p>
          </div>
        </CardContent>
        <CardFooter className="flex justify-center space-x-4">
          <Button asChild variant="outline">
            <Link href="/">
              <Home className="mr-2 h-4 w-4" />
              Home
            </Link>
          </Button>
          <Button asChild>
            <Link href="/api/auth/signin">
              <RefreshCw className="mr-2 h-4 w-4" />
              Try again
            </Link>
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
