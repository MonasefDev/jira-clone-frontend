"use client";
import { AlertTriangle } from "lucide-react";
import Link from "next/link";

const ErrorPage = () => {
  return (
    <div className="h-screen flex flex-col gap-y-2 items-center justify-center">
      <AlertTriangle className="size-6 text-red-700" height={24} width={24} />
      <p className="text-sm text-muted-foreground">Something went wrong</p>
      <button variant="secondary" size="sm">
        <Link href="/">Go Home</Link>
      </button>
    </div>
  );
};

export default ErrorPage;
