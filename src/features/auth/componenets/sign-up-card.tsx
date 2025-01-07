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
import { FormEvent, useState } from "react";
import { OauthProviders } from "./oauth-providers";
import { useAuthActions } from "@convex-dev/auth/react";
import { TriangleAlertIcon } from "lucide-react";

interface SignUpCardProps {
  setState: (state: SignInFlow) => void;
}

export const SignUpCard = ({ setState }: SignUpCardProps) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [pending, setPending] = useState(false);

  const { signIn } = useAuthActions();

  const onPasswordSignUp = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      setError("Passwords do no match");
      return;
    }

    setPending(true);
    signIn("password", {
      name,
      email,
      password,
      confirmPassword,
      flow: "signUp",
    })
      .catch(() => {
        setError("Something went wrong");
      })
      .finally(() => {
        setPending(false);
      });
  };

  return (
    <Card className="w-full h-full p-8">
      <CardHeader className="px-0 pt-0">
        <CardTitle className="text-2xl">Signup to continue</CardTitle>
        <CardDescription className="">
          Use your email or another authentication service to continue
        </CardDescription>
      </CardHeader>
      {!!error && (
        <div className="bg-red-100 p-3 rounded-md flex items-center gap-x-2 text-sm text-red-600 mb-6">
          <TriangleAlertIcon className="text-red-600 size-4" />
          <p>{error}</p>
        </div>
      )}
      <CardContent className="space-y-5 px-0 pb-0">
        <form
          className="space-y-2"
          onSubmit={onPasswordSignUp}
        >
          <Input
            value={name}
            placeholder="Full name"
            disabled={pending}
            required
            onChange={(e) => setName(e.target.value)}
          />

          <Input
            value={email}
            type="email"
            placeholder="Email"
            disabled={pending}
            required
            onChange={(e) => setEmail(e.target.value)}
          />
          <Input
            value={password}
            type="password"
            placeholder="Password"
            disabled={pending}
            required
            onChange={(e) => setPassword(e.target.value)}
          />
          <Input
            value={confirmPassword}
            type="password"
            placeholder="Confirm password"
            disabled={pending}
            required
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
          <Button
            className="w-full"
            size="lg"
            disabled={pending}
            type="submit"
          >
            Continue
          </Button>
        </form>
        <Separator />
        <OauthProviders
          pending={pending}
          setPending={setPending}
        />
        <p className="text-xs text-slate-600">
          Don&apos;t have an account?{" "}
          <span
            className="text-sky-700 hover:underline cursor-pointer"
            onClick={() => setState("signIn")}
          >
            Sign In
          </span>
        </p>
      </CardContent>
    </Card>
  );
};
