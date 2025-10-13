"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isAdminLogin, setIsAdminLogin] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Choose the appropriate API endpoint based on login type
    const apiUrl = isAdminLogin 
      ? "/api/auth/admin/login" 
      : "/api/auth/login";

    const res = await fetch(apiUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    const data = await res.json();
    if (res.ok) {
      alert(isAdminLogin ? "Admin logged in successfully!" : "Customer logged in successfully!");
      
      // Redirect based on login type
      if (isAdminLogin) {
        router.push("/admin"); // redirect to admin dashboard
      } else {
        router.push("/"); // redirect to home for customers
      }
    } else {
      alert(data.error);
    }
  };

  return (
    <div className="flex justify-center items-center h-screen">
      <form onSubmit={handleSubmit} className="flex flex-col gap-2 w-80">
        <h2 className="text-xl font-bold text-center">
          {isAdminLogin ? "Admin Login" : "Customer Login"}
        </h2>
        
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="border p-2 rounded"
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          className="border p-2 rounded"
        />
        
        <button type="submit" className="bg-blue-500 text-white p-2 rounded">
          {isAdminLogin ? "Admin Login" : "Customer Login"}
        </button>

        {/* Toggle between admin and customer login */}
        <button 
          type="button" 
          onClick={() => setIsAdminLogin(!isAdminLogin)}
          className="bg-gray-500 text-white p-2 rounded"
        >
          {isAdminLogin ? "Switch to Customer Login" : "Switch to Admin Login"}
        </button>

        {/* Navigation links */}
        <div className="flex justify-between mt-2">
          {!isAdminLogin && (
            <button 
              type="button" 
              onClick={() => router.push("/auth/signup")}
              className="text-blue-500 text-sm"
            >
              Create Customer Account
            </button>
          )}
          
          {isAdminLogin && (
            <button 
              type="button" 
              onClick={() => router.push("/admin/auth/register")}
              className="text-blue-500 text-sm"
            >
              Create Admin Account
            </button>
          )}
        </div>
      </form>
    </div>
  );
}