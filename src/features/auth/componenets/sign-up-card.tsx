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
import { FcGoogle } from "react-icons/fc";
import { FaGithub } from "react-icons/fa";
import { SignInFlow } from "../types";
import { useState } from "react";

interface SignUpCardProps {
  setState: (state: SignInFlow) => void;
}

export const SignUpCard = ({ setState }: SignUpCardProps) => {
  const [email, setEmail] = useState("");
  const [password, setpassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  return (
    <Card className="w-full h-full p-8">
      <CardHeader className="px-0 pt-0">
        <CardTitle className="text-2xl">Signup to continue</CardTitle>
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
          <Input
            value={confirmPassword}
            type="password"
            placeholder="Confirm Password"
            disabled={false}
            required
            onChange={(e) => setConfirmPassword(e.target.value)}
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
        <div className="flex flex-col gap-y-2.5">
          <Button
            className="w-full relative"
            size="lg"
            variant="outline"
            onClick={() => {}}
          >
            <FcGoogle className="absolute size-6 left-2.5 top-3" />
            Continue with google
          </Button>
          <Button
            className="w-full relative"
            size="lg"
            variant="outline"
            onClick={() => {}}
          >
            <FaGithub className="absolute size-6 left-2.5 top-3" />
            Continue with github
          </Button>
        </div>
        <p className="text-xs text-slate-600">
          Already have an account ?{" "}
          <span
            className="text-sky-700 hover:underline cursor-pointer"
            onClick={() => setState("signIn")}
          >
            Sign in
          </span>
        </p>
      </CardContent>
    </Card>
  );
};
