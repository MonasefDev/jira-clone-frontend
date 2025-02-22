import { Loader } from "lucide-react";
import React from "react";

function Loading() {
  return (
    <div className="h-full flex justify-center items-center relative">
      <div className="h-full">
        <Loader className="animate-spin size-6 text-muted-foreground" />
      </div>
    </div>
  );
}

export default Loading;
