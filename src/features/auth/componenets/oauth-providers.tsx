"use client";

import { Button } from "@/components/ui/button";
import { FaGithub } from "react-icons/fa";
import { FcGoogle } from "react-icons/fc";
import { useAuthActions } from "@convex-dev/auth/react";
import { useState } from "react";

export const OauthProviders = () => {
  const [pending, setPending] = useState(false);

  const { signIn } = useAuthActions();
  const handleProviderSignin = (value: "github" | "google") => {
    setPending(true);
    signIn(value).finally(() => {
      setPending(false);
    });
  };

  return (
    <div className="flex flex-col gap-y-2.5">
      <Button
        className="w-full relative"
        disabled={pending}
        size="lg"
        variant="outline"
        onClick={() => handleProviderSignin("google")}
      >
        <FcGoogle className="absolute size-6 left-2.5 top-3" />
        Continue with google
      </Button>
      <Button
        className="w-full relative"
        disabled={pending}
        size="lg"
        variant="outline"
        onClick={() => handleProviderSignin("github")}
      >
        <FaGithub className="absolute size-6 left-2.5 top-3" />
        Continue with github
      </Button>
    </div>
  );
};
