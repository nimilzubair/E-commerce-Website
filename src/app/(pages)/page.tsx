"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase/client";

export default function MainPage() {
  const [userCount, setUserCount] = useState<number | null>(null);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const { count, error } = await supabase
          .from("customers")
          .select("*", { count: "exact", head: true });

        if (error) {
          console.error("Error fetching customers:", error.message);
          return;
        }

        setUserCount(count);
      } catch (err) {
        console.error("Unexpected error:", err);
      }
    };

    fetchUsers();
  }, []);

  return (
    <main className="p-6 text-center min-h-screen flex flex-col items-center justify-center">
      <h1 className="text-3xl font-bold mb-4">Supabase Connected 🎉</h1>
      <p className="text-lg">Total customers in DB: {userCount ?? "Loading..."}</p>
    </main>
  );
}
