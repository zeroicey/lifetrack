"use client";

import { useRouter } from "next/navigation";

import { loginAuth } from "@/api/auth";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useUserStore } from "@/store/user";
import Link from "next/link";
import { use, useState } from "react";
import { toast } from "sonner";

export default function LoginPage() {
  const [nameOrEmail, setNameOrEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();
  return (
    <div className="w-full max-w-sm">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">Login</CardTitle>
          <CardDescription>
            Enter your email or username below to login to your account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-6">
            <div className="grid gap-2">
              <Label htmlFor="nameOrEmail">Email / Username</Label>
              <Input
                id="nameOrEmail"
                type="text"
                value={nameOrEmail}
                onChange={(e) => setNameOrEmail(e.target.value)}
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <Button
              type="submit"
              className="w-full"
              onClick={async () => {
                if (!nameOrEmail || !password) {
                  toast.warning("Please fill in all fields");
                  return;
                }
                const res = await loginAuth(nameOrEmail, password);
                console.log(res.data?.user);
                if (res.status) {
                  useUserStore.getState().setUser(res.data?.user!);
                  useUserStore.getState().setToken(res.data?.token!);
                  toast.success(res.message);
                  router.push("/home");
                } else {
                  toast.error(res.message);
                }
              }}
            >
              Login
            </Button>
          </div>
          <div className="mt-4 text-center text-sm">
            Don&apos;t have an account?{" "}
            <Link href="/register" className="underline underline-offset-4">
              Register
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
