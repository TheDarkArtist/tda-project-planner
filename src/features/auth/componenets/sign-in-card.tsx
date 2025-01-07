import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { SignInFlow } from "../types";
import { useState } from "react";
import { OauthProviders } from "./oauth-providers";

interface SignInCardProps {
  setState: (state: SignInFlow) => void;
}

export const SignInCard = ({ setState }: SignInCardProps) => {
  const [email, setEmail] = useState("");
  const [password, setpassword] = useState("");

  return (
    <Card className="w-full h-full p-8">
      <CardHeader className="px-0 pt-0">
        <CardTitle className="text-2xl">Login to continue</CardTitle>
        <CardDescription className="">
          User you email or another authenticatin service to continue
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-5 px-0 pb-0">
        <form className="space-y-2">
          <Input
            value={email}
            type="email"
            placeholder="Email"
            disabled={false}
            required
            onChange={(e) => setEmail(e.target.value)}
          />
          <Input
            value={password}
            type="password"
            placeholder="password"
            disabled={false}
            required
            onChange={(e) => setpassword(e.target.value)}
          />
          <Button
            className="w-full"
            size="lg"
            type="submit"
          >
            Continue
          </Button>
        </form>
        <Separator />
        <OauthProviders />
        <p className="text-xs text-slate-600">
          Don&apos;t have an account ?{" "}
          <span
            className="text-sky-700 hover:underline cursor-pointer"
            onClick={() => setState("signUp")}
          >
            Sign up
          </span>
        </p>
      </CardContent>
    </Card>
  );
};
