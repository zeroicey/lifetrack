"use client";
import { getLinkTitle } from "@/api/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";

export default function LinkPage() {
  const [keyText, setKeyText] = useState("");
  const [valueText, setValueText] = useState("");
  return (
    <div className="flex h-full w-full gap-4 justify-center">
      <div className="w-[500px] flex flex-col gap-2">
        <div className="border p-4">
          <div className="grid w-full max-w-sm items-center gap-1.5">
            <Label htmlFor="title">Title</Label>
            <Input
              value={keyText}
              onChange={(e) => setKeyText(e.target.value)}
              placeholder="Enter a title"
              onKeyDown={async (e) => {
                if (e.key == "Enter") {
                  console.log("aaa");
                  await getLinkTitle(keyText);
                }
              }}
            />
          </div>
          <div className="grid w-full max-w-sm items-center gap-1.5">
            <Label htmlFor="url">Url</Label>
            <Input
              placeholder="Enter a URL"
              value={valueText}
              onChange={(e) => setValueText(e.target.value)}
            />
          </div>
          <Button>Submit</Button>
        </div>
        <div className="border p-4">
          <div>aaa</div>
          <div>aaa</div>
          <div>aaa</div>
          <div>aaa</div>
        </div>
      </div>
    </div>
  );
}
