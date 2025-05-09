"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ShieldAlert } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";

export default function Signup() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    organization: "",
    agreeToTerms: false,
  });
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!form.agreeToTerms) {
      toast({
        title: "Agreement required",
        description: "You must agree to the terms and conditions to continue.",
        variant: "destructive",
      });
      return;
    }


    try {
      setIsLoading(true);
      const response = await fetch("/api/auth/signup", {
        method: 'POST',
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form)
      });

      const data = await response.json()
      if (response.status === 400) {
        setIsLoading(false)
        toast({
          title: "User already exist",
          description: "You should have to login",
          variant: "destructive",
        });
        return
      }

      toast({
        title: "Account created",
        description: "Welcome to CallGuard AI. Your account has been created successfully.",
      });
      router.push("/login");
    }
    catch (error: any) {
      setIsLoading(false);
      toast({
        title: "Signup failed",
        description: error?.response?.data?.message || "User already exist",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false)
    }


  };

  return (
    <div className="min-h-screen flex flex-col overflow-y-hidden">
      <div className="container mx-auto px-4 py-4">
        <Link href="/" className="flex items-center gap-2 mb-16">
          <ShieldAlert className="h-6 w-6 text-primary" />
          <span className="font-bold text-lg">CallGuard AI</span>
        </Link>
      </div>

      <div className="flex-1 flex items-center justify-center pb-16">
        <div className="w-full max-w-md px-4">
          <Card>
            <CardHeader className="space-y-1">
              <CardTitle className="text-2xl font-bold text-center">Create an account</CardTitle>
              <CardDescription className="text-center">
                Enter your information to get started with CallGuard AI
              </CardDescription>
            </CardHeader>
            <form onSubmit={handleSubmit}>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name</Label>
                  <Input
                    id="name"
                    placeholder="Dr. John Smith"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="name@example.com"
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="organization">Healthcare Organization</Label>
                  <Input
                    id="organization"
                    placeholder="Metropolitan Health Partners"
                    value={form.organization}
                    onChange={(e) => setForm({ ...form, organization: e.target.value })}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <Input
                    id="password"
                    type="password"
                    value={form.password}
                    onChange={(e) => setForm({ ...form, password: e.target.value })}
                    required
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    Must be at least 8 characters with a number and special character
                  </p>
                </div>
                <div className="flex items-start space-x-2 pt-2">
                  <Checkbox
                    id="terms"
                    checked={form.agreeToTerms}
                    onCheckedChange={(e) => setForm({ ...form, agreeToTerms: (e as boolean) })}
                  />
                  <label
                    htmlFor="terms"
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    I agree to the{" "}
                    <Link href="/terms" className="text-primary hover:underline">
                      terms of service
                    </Link>{" "}
                    and{" "}
                    <Link href="/privacy" className="text-primary hover:underline">
                      privacy policy
                    </Link>
                  </label>
                </div>
              </CardContent>
              <CardFooter className="flex flex-col">
                <Button className="w-full" type="submit" disabled={isLoading}>
                  {isLoading ? "Creating account..." : "Create account"}
                </Button>
                <p className="mt-4 text-center text-sm text-muted-foreground">
                  Already have an account?{" "}
                  <Link href="/login" className="text-primary hover:underline">
                    Log in
                  </Link>
                </p>
              </CardFooter>
            </form>
          </Card>
        </div>
      </div>
    </div>
  );
}