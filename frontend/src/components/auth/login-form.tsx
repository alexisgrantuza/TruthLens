import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
  FieldSeparator,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { GoogleIcon } from "@/components/icons/Google";
import { FacebookIcon } from "@/components/icons/Facebook";
import { XIcon } from "@/components/icons/Twitter";
import { authClient } from "@/lib/auth-client";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";

export function LoginForm({
  className,
  ...props
}: React.ComponentProps<"form">) {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  // Email/Password Sign In
  const handleEmailSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      await authClient.signIn.email({
        email: formData.email,
        password: formData.password,
      });
      navigate("/gallary");
    } catch (err: any) {
      setError(err.message || "Failed to sign in");
    } finally {
      setLoading(false);
    }
  };

  // Social Sign In
  const handleSocialSignIn = async (
    provider: "google" | "facebook" | "twitter" | "github"
  ) => {
    setLoading(true);
    setError("");

    try {
      await authClient.signIn.social({
        provider,
        callbackURL: `${window.location.origin}/TruthLens`, // or hard-code http://localhost:5173/gallary
      });
    } catch (err: any) {
      setError(err.message || "Failed to sign in");
      setLoading(false);
    }
  };

  return (
    <form
      className={cn("flex flex-col gap-6", className)}
      {...props}
      onSubmit={handleEmailSignIn}
    >
      <FieldGroup>
        <div className="flex flex-col items-center gap-1 text-center">
          <h1 className="text-2xl font-bold">Login to your account</h1>
          <p className="text-muted-foreground text-sm text-balance">
            Enter your email below to login to your account
          </p>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
            {error}
          </div>
        )}

        <Field>
          <FieldLabel htmlFor="email">Email</FieldLabel>
          <Input
            id="email"
            type="email"
            placeholder="m@example.com"
            required
            value={formData.email}
            onChange={(e) =>
              setFormData({ ...formData, email: e.target.value })
            }
          />
        </Field>
        <Field>
          <div className="flex items-center">
            <FieldLabel htmlFor="password">Password</FieldLabel>
            <a
              href="#"
              className="ml-auto text-sm underline-offset-4 hover:underline"
            >
              Forgot your password?
            </a>
          </div>
          <Input
            id="password"
            type="password"
            required
            value={formData.password}
            onChange={(e) =>
              setFormData({ ...formData, password: e.target.value })
            }
          />
        </Field>
        <Field>
          <Button type="submit" disabled={loading}>
            {loading ? "Signing in..." : "Sign In"}
          </Button>
        </Field>
        <FieldSeparator>Or continue with</FieldSeparator>
        <Field>
          {" "}
          <Button
            variant="outline"
            type="button"
            onClick={() => handleSocialSignIn("google")}
            disabled={loading}
          >
            <GoogleIcon width={24} height={24} />
            Login with Google
          </Button>
          <Button
            variant="outline"
            type="button"
            onClick={() => handleSocialSignIn("facebook")}
            disabled={loading}
          >
            <XIcon width={24} height={24} />
            Login with Twitter
          </Button>
          <Button
            variant="outline"
            type="button"
            onClick={() => handleSocialSignIn("twitter")}
            disabled={loading}
          >
            <FacebookIcon width={24} height={24} />
            Login with facebook
          </Button>
          <FieldDescription className="text-center">
            Don&apos;t have an account?{" "}
            <Link to={"/get-started"} className="underline underline-offset-4">
              Sign up
            </Link>
          </FieldDescription>
        </Field>
      </FieldGroup>
    </form>
  );
}
