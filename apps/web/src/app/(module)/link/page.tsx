"use client";
import { getLinkTitle } from "@/api/link";
import { Input } from "@/components/ui/input";
import { useState } from "react";

export default function LinkPage() {
  const [keyText, setKeyText] = useState("");
  const [valueText, setValueText] = useState("");
  return (
    <div className="flex h-full w-full gap-4 justify-center">
      <div className="w-[500px] flex flex-col gap-2">
        <div>
          <Input
            value={keyText}
            onChange={(e) => setKeyText(e.target.value)}
            onKeyDown={async (e) => {
              if (e.key == "Enter") {
                console.log("aaa");
                await getLinkTitle(keyText);
              }
            }}
          />
          <Input
            value={valueText}
            onChange={(e) => setValueText(e.target.value)}
          />
        </div>
        <div>aaa</div>
      </div>
    </div>
  );
}
