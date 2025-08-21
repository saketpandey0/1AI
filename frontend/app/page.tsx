"use client";

import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { BACKEND_URL } from "@/lib/utils";
import { ArrowUp, ChevronDownIcon, ChevronUpIcon, User, Bot } from "lucide-react";
import { useState } from "react";


interface ChatMessage {
  role: "user" | "assistant";
  message: string;
}


const AI_MODELS = [
  { id: "openai/gpt-4o", name: "GPT-4" },
  { id: "openai/gpt-3.5-turbo", name: "GPT-3.5 Turbo" },
  { id: "anthropic/claude-3-opus", name: "Claude 3 Opus" },
  { id: "anthropic/claude-3-sonnet", name: "Claude 3 Sonnet" },
];

export default function Home() {
  const [selectedModel, setSelectedModel] = useState(AI_MODELS[0].id);
  const [inputValue, setInputValue] = useState("");
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [conversationId, setConversationId] = useState<string | null>(null);
  const [currentAssistantMessage, setCurrentAssistantMessage] = useState("");

  const handleSendMessage = async () => {
    if (!inputValue.trim() || isLoading) return;

    const userMessage = inputValue.trim();
    if (!userMessage) return;


    const newUserMessage: ChatMessage = {
      role: "user",
      message: userMessage
    };
    setChatMessages(prev => [...prev, newUserMessage]);
    setInputValue("");
    setIsLoading(true);
    setCurrentAssistantMessage("");

    try {
      const response = await fetch(`${BACKEND_URL}/ai/chat`, {
        method: 'POST',
        headers: {
          'Accept': 'text/event-stream',
          'Content-Type': 'application/json',
          'X-Postmark-Server-Token': 'server token',
          'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiIxNTg0MWUyNi1hYzgxLTQ0NjEtOTQ5Yi01NjEwYjJjZDg4M2UiLCJpYXQiOjE3NTU4MDgyMDl9.zDR2Qk6-aTpyeDM8SCTAj4bCUHexAXHx5Xada0HWgsI'
        },
        body: JSON.stringify({
          message: userMessage,
          model: selectedModel,
          ...(conversationId && { conversationId })
        })
      });
      
      if (!response.ok) {
        console.error("Response not ok:", response.status, response.statusText);
        const errorMessage: ChatMessage = {
          role: "assistant",
          message: "Sorry, I couldn't process your request. Please try again."
        };
        setChatMessages(prev => [...prev, errorMessage]);
        return;
      }

      if (!response.body) {
        console.error("No response body");
        const errorMessage: ChatMessage = {
          role: "assistant",
          message: "Sorry, I couldn't process your request. Please try again."
        };
        setChatMessages(prev => [...prev, errorMessage]);
        return;
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let accumulatedResponse = "";
      let buffer = "";

      try {
        while (true) {
          const { done, value } = await reader.read();

          if (done) {
            console.log("Stream finished");
            break;
          }


          const chunk = decoder.decode(value, { stream: true });
          buffer += chunk;


          while (true) {
            const lineEnd = buffer.indexOf('\n');
            if (lineEnd === -1) break;

            const line = buffer.slice(0, lineEnd).trim();
            buffer = buffer.slice(lineEnd + 1);


            if (line.startsWith('data: ')) {
              const dataStr = line.slice(6);
              
              try {
                const data = JSON.parse(dataStr);
                
                if (data.error) {
                  console.error("Server error:", data.error);
                  const errorMessage: ChatMessage = {
                    role: "assistant",
                    message: data.error
                  };
                  setChatMessages(prev => [...prev, errorMessage]);
                  setCurrentAssistantMessage("");
                  return;
                }
                
                if (data.done) {

                  if (accumulatedResponse.trim()) {
                    const assistantMessage: ChatMessage = {
                      role: "assistant",
                      message: accumulatedResponse.trim()
                    };
                    setChatMessages(prev => [...prev, assistantMessage]);
                  }
                  setCurrentAssistantMessage("");
                  return;
                }
                
                if (data.content) {
                  accumulatedResponse += data.content;
                  setCurrentAssistantMessage(accumulatedResponse);
                }
              } catch (parseError) {
                console.warn("Failed to parse SSE data:", dataStr, parseError);
              }
            }
          }
        }
      } catch (error) {
        console.error("Error reading stream:", error);
        const errorMessage: ChatMessage = {
          role: "assistant",
          message: "An error occurred while receiving the response. Please try again."
        };
        setChatMessages(prev => [...prev, errorMessage]);
        setCurrentAssistantMessage("");
      } finally {
        reader.releaseLock();
      }
    } catch (error) {
      console.error('Error making request:', error);
      const errorMessage: ChatMessage = {
        role: "assistant",
        message: "Failed to send message. Please check your connection and try again."
      };
      setChatMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <main className="flex w-full h-full bg-neutral-100 dark:bg-neutral-900 rounded-xl">
      <div className="flex flex-col w-full max-w-4xl mx-auto h-full">

        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {chatMessages.length === 0 && !currentAssistantMessage && (
            <div className="flex items-center justify-center h-full text-neutral-500 dark:text-neutral-400">
              <div className="text-center">
                <Bot className="mx-auto h-12 w-12 mb-4" />
                <p className="text-lg font-medium">Welcome to AI Chat</p>
                <p className="text-sm">Send a message to get started</p>
              </div>
            </div>
          )}
          
          {chatMessages.map((msg, index) => (
            <div key={index} className={`flex gap-3 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              {msg.role === 'assistant' && (
                <div className="flex-shrink-0">
                  <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                    <Bot className="w-4 h-4 text-white" />
                  </div>
                </div>
              )}
              <div className={`max-w-[70%] p-3 rounded-lg ${
                msg.role === 'user' 
                  ? 'bg-blue-500 text-white' 
                  : 'bg-white dark:bg-neutral-800 border'
              }`}>
                <div className="whitespace-pre-wrap text-sm">{msg.message}</div>
              </div>
              {msg.role === 'user' && (
                <div className="flex-shrink-0">
                  <div className="w-8 h-8 bg-neutral-500 rounded-full flex items-center justify-center">
                    <User className="w-4 h-4 text-white" />
                  </div>
                </div>
              )}
            </div>
          ))}
          

          {currentAssistantMessage && (
            <div className="flex gap-3 justify-start">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                  <Bot className="w-4 h-4 text-white" />
                </div>
              </div>
              <div className="max-w-[70%] p-3 rounded-lg bg-white dark:bg-neutral-800 border">
                <div className="whitespace-pre-wrap text-sm">{currentAssistantMessage}</div>
                {isLoading && (
                  <div className="inline-block w-2 h-2 bg-blue-500 rounded-full animate-pulse ml-1"></div>
                )}
              </div>
            </div>
          )}
        </div>
        

        <div className="p-4">
          <div className="flex flex-col gap-4 p-4 dark:bg-neutral-900 border bg-neutral-100 rounded-2xl">
            <input
              type="text"
              placeholder={isLoading ? "AI is typing..." : "Enter your prompt"}
              value={inputValue}
              autoFocus
              onChange={(e) => setInputValue(e.target.value)}
              className="w-full focus:ring-0 focus:outline-0 px-3 py-2 bg-transparent"
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  handleSendMessage();
                }
              }}
              disabled={isLoading}
            />
          <div className="flex items-center justify-between gap-2">
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="secondary">
                  {AI_MODELS.find((model) => model.id === selectedModel)?.name}{" "}
                  <ChevronUpIcon className="size-4" />
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
            <Button 
              size="icon" 
              onClick={handleSendMessage}
              disabled={isLoading || !inputValue.trim()}
            >
              <ArrowUp className="size-4" />
            </Button>
          </div>
          </div>
        </div>
      </div>
    </main>
  );
}
