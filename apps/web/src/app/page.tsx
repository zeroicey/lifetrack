"use client";
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
import http from "@/lib/http";
import { useUserStore } from "@/store/user";
import { Label } from "@radix-ui/react-label";
import Link from "next/link";
import { useState } from "react";
import { toast } from "sonner";

export default function Home() {
  const [nameOrEmail, setNameOrEmail] = useState("");
  const [password, setPassword] = useState("");
  return (
    <div>
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
                console.log(res);
                if (res.status) {
                  console.log(res.data?.token);
                  useUserStore.getState().setToken(res.data?.token!);
                  toast.success(res.message);
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
