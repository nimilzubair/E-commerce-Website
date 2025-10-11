"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function SignoutPage() {
  const router = useRouter();

  useEffect(() => {
    const logout = async () => {
      await fetch("/api/auth/signout", {
        method: "POST",
      });
      alert("You have been signed out!");
      router.push("/auth/login");
    };

    logout();
  }, [router]);

  return (
    <div className="flex flex-col justify-center items-center h-screen text-center">
      <p className="text-lg font-semibold">Signing you out...</p>
    </div>
  );
}
