import { Metadata } from "next";
import { AuthLayout } from "@/components/auth/AuthLayout";

export const metadata: Metadata = {
  title: "Sign in to Unrenewed",
  description: "Sign in to your Unrenewed account",
};

export default function SignInPage() {
  return <AuthLayout type="signin" />;
}
