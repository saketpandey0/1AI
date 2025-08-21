"use client";

import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { ArrowUp, ChevronDownIcon } from "lucide-react";
import { useEffect, useState } from "react";

const BACKEND_URL = "http://localhost:3000";

const AI_MODELS = [
  { id: "gpt-4", name: "GPT-4" },
  { id: "gpt-3.5-turbo", name: "GPT-3.5 Turbo" },
  { id: "claude-3-opus", name: "Claude 3 Opus" },
  { id: "claude-3-sonnet", name: "Claude 3 Sonnet" },
];

export default function Home() {
  const [selectedModel, setSelectedModel] = useState(AI_MODELS[0].id);
  useEffect(() => {
    const makeRequest = async () => {
      const response = await fetch(`${BACKEND_URL}/chat`, {
        method: "POST",
        headers: {
          "content-type": "application/json",
        },
        body: JSON.stringify({
          message: "what is 2 + 2",
          model: "openai/gpt-4o",
        }),
      });

      if (!response.body) {
        console.error("No response body");
        return;
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();

      try {
        while (true) {
          const { done, value } = await reader.read();

          if (done) {
            console.log("Stream finished");
            break;
          }

          const chunk = decoder.decode(value, { stream: true });
          console.log("Received chunk:", chunk);
        }
      } catch (error) {
        console.error("Error reading stream:", error);
      } finally {
        reader.releaseLock();
      }
    };

    makeRequest();
  }, []);
  return (
    <main className="flex w-full items-center justify-center h-full bg-neutral-100 dark:bg-neutral-900 rounded-xl">
      <div className="absolute mx-auto bottom-4 flex w-full max-w-2xl flex-col gap-8 rounded-2xl">
        <div className="flex flex-col gap-8 p-2 dark:bg-neutral-900 border bg-neutral-100 rounded-2xl">
          <input
            type="text"
            placeholder="Enter your prompt"
            className="w-full focus:ring-0 focus:outline-0 px-2 py-2"
          />
          <div className="flex items-center justify-between gap-2">
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="secondary">
                  {AI_MODELS.find((model) => model.id === selectedModel)?.name}{" "}
                  <ChevronDownIcon className="size-4" />
                </Button>
              </PopoverTrigger>
              <PopoverContent side="bottom" align="start" sideOffset={10}>
                <div className="flex flex-col gap-1">
                  {AI_MODELS.map((model) => (
                    <Button
                      key={model.id}
                      variant="ghost"
                      className="w-full justify-start text-sm"
                      onClick={() => {
                        setSelectedModel(model.id);
                      }}
                    >
                      {model.name}
                    </Button>
                  ))}
                </div>
              </PopoverContent>
            </Popover>
            <Button size="icon">
              <ArrowUp className="size-4" />
            </Button>
          </div>
        </div>
      </div>
    </main>
  );
}
