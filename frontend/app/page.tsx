import React, { useEffect, useState } from "react";
import UIInput from "@/components/ui/ui-input";
import { useRouter } from "next/navigation";

const AskPage = () => {
  const [token, setToken] = useState<string | null>(null);
  const router = useRouter();
  useEffect(() => {
    router.push("/ask");
  }, []);
  return (
    <div className="flex w-full max-w-screen flex-col items-center justify-center gap-4">
      <div className="flex w-full flex-col items-center gap-4">
        <UIInput />
      </div>
    </div>
  );
};

export default AskPage;
