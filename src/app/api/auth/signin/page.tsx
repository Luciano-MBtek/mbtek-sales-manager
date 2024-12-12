"use client";

import { getProviders, signIn } from "next-auth/react";
import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { AlertCircle } from "lucide-react";
import Image from "next/image";
import Logo from "../../../../../public/Logo_Vector.png";
import { RiGoogleFill } from "@remixicon/react";
import { HubspotIcon } from "@/components/HubspotIcon";

export default function SignIn() {
  const [providers, setProviders] = useState<any>({});
  const searchParams = useSearchParams();
  const error = searchParams.get("error");

  useEffect(() => {
    const fetchProviders = async () => {
      const res = await getProviders();
      setProviders(res);
    };
    fetchProviders();
  }, []);

  const errorMessage =
    {
      Signin: "Intenta iniciar sesión de nuevo.",
      OAuthSignin: "Error al construir la URL de autorización.",
      OAuthCallback: "Error al manejar la respuesta.",
      AccessDenied: "No tienes permiso para iniciar sesión.",
      Default: "No se pudo iniciar sesión.",
    }[error as string] || "";

  return (
    <div className="min-h-screen flex items-center justify-center w-full bg-gradient-to-r from-blue-200 to-orange-400 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <div className="flex justify-center mb-4">
            <Image
              src={Logo}
              alt="Logo"
              width={128}
              height={128}
              className=""
            />
          </div>
          <CardTitle className="text-2xl font-bold text-center">
            Welcome
          </CardTitle>
          <CardDescription className="text-center">
            Sign in to continue
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {errorMessage && (
            <div
              className="flex items-center p-4 mb-4 text-sm text-red-800 border border-red-300 rounded-lg bg-red-50"
              role="alert"
            >
              <AlertCircle className="flex-shrink-0 inline w-4 h-4 mr-3" />
              <span className="sr-only">Error</span>
              <div>{errorMessage}</div>
            </div>
          )}
          {providers &&
            Object.values(providers).map((provider: any) => (
              <div key={provider.name}>
                <Button
                  onClick={() => signIn(provider.id)}
                  className="w-full flex gap-4"
                  variant={
                    provider.name.toLowerCase() === "google"
                      ? "outline"
                      : "default"
                  }
                >
                  {provider.name.toLowerCase() === "google" && (
                    <RiGoogleFill size={20} />
                  )}
                  {provider.name.toLowerCase() === "hubspot" && <HubspotIcon />}
                  Sign in with {provider.name}
                </Button>
              </div>
            ))}
          <p className="text-xs text-center text-gray-500 mt-4">
            Request permissions from the corresponding MBtek staff.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
