"use client";
import { z } from "zod";
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
import Link from "next/link";
import { useState } from "react";
import { toast } from "sonner";
import { registerAuth } from "@/api/auth";

export default function RegisterPage() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordAgain, setPasswordAgain] = useState("");
  return (
    <div className="w-full max-w-sm">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">Register</CardTitle>
          <CardDescription>
            Enter your email, username, and password to create an account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-3">
            <div className="grid gap-2">
              <Label htmlFor="username">Username</Label>
              <Input
                id="username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
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
            <div className="grid gap-2">
              <Label htmlFor="passwordAgain">Password Again</Label>
              <Input
                id="passwordAgain"
                type="password"
                value={passwordAgain}
                onChange={(e) => setPasswordAgain(e.target.value)}
                required
              />
            </div>
            <Button
              type="submit"
              className="w-full"
              onClick={async () => {
                if (!username || !email || !password || !passwordAgain) {
                  toast.warning("Please fill in all fields");
                  return;
                }
                if (username.length < 3) {
                  toast.warning("Username must be at least 3 characters long");
                  return;
                }
                if (z.string().email().safeParse(email).success === false) {
                  toast.warning("Invalid email address");
                  return;
                }
                if (password.length < 8) {
                  toast.warning("Password must be at least 8 characters long");
                  return;
                }
                if (password !== passwordAgain) {
                  toast.warning("Passwords do not match");
                  return;
                }
                const res = await registerAuth({
                  username,
                  email,
                  password,
                });
                if (res.status) {
                  toast.success(res.message);
                  setUsername("");
                  setEmail("");
                  setPassword("");
                  setPasswordAgain("");
                }
              }}
            >
              Register
            </Button>
          </div>
          <div className="mt-4 text-center text-sm">
            Already have an account?{" "}
            <Link href="/login" className="underline underline-offset-4">
              Login
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
