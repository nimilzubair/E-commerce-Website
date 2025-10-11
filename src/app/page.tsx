"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";

type Customer = {
  id: string;
  full_name: string;
  email: string;
};

export default function MainPage() {
  const [userCount, setUserCount] = useState<number | null>(null);
  const [currentUser, setCurrentUser] = useState<Customer | null>(null);
  const router = useRouter();

  // Fetch total customers count from Supabase
  useEffect(() => {
    const fetchUsers = async () => {
      const { count, error } = await supabase
        .from("customers")
        .select("*", { count: "exact", head: true });

      if (!error) setUserCount(count);
    };
    fetchUsers();
  }, []);

  // Load logged-in user from localStorage safely
  useEffect(() => {
    const storedUser = localStorage.getItem("currentUser");
    if (storedUser) {
      try {
        const user = JSON.parse(storedUser);
        setCurrentUser(user);
      } catch (err) {
        console.error("Failed to parse stored user:", err);
        localStorage.removeItem("currentUser");
      }
    }
  }, []);

  // Sign out
  const handleSignOut = () => {
    localStorage.removeItem("currentUser");
    setCurrentUser(null);
    router.push("/auth/login");
  };

  return (
    <main className="p-6 text-center min-h-screen flex flex-col items-center justify-center gap-6">
      <h1 className="text-3xl font-bold">Supabase Connected 🎉</h1>
      <p>Total customers in DB: {userCount ?? "Loading..."}</p>

      {currentUser ? (
        <div className="flex flex-col items-center gap-2 mt-4">
          <p>
            Logged in as: <span className="font-semibold">{currentUser.full_name}</span>
          </p>
          <p>Email: {currentUser.email}</p>
          <button
            onClick={handleSignOut}
            className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 mt-2"
          >
            Sign Out
          </button>
        </div>
      ) : (
        <div className="mt-4">
          <p>No user is currently logged in.</p>
          <button
            onClick={() => router.push("/auth/login")}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 mt-2"
          >
            Login
          </button>
        </div>
      )}
    </main>
  );
}
