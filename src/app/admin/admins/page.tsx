"use client";

import { useEffect, useState } from "react";

export default function AdminsPage() {
  const [admins, setAdmins] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAdmins();
  }, []);

  const fetchAdmins = async () => {
    try {
      const res = await fetch("/api/auth/admin/admins");
      const data = await res.json();
      if (res.ok) {
        setAdmins(data.admins || []);
      }
    } catch (error) {
      console.error("Error fetching admins:", error);
    } finally {
      setLoading(false);
    }
  };

  const toggleStatus = async (id: string, currentStatus: boolean) => {
    try {
      const res = await fetch(`/api/auth/admin/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ is_active: !currentStatus }),
      });
      
      if (res.ok) {
        alert("Admin updated successfully");
        fetchAdmins();
      }
    } catch (error) {
      console.error("Error updating admin:", error);
    }
  };

  const changePassword = async (id: string) => {
    const newPassword = prompt("Enter new password (min 6 characters):");
    if (!newPassword || newPassword.length < 6) {
      alert("Password must be at least 6 characters long");
      return;
    }

    try {
      const res = await fetch(`/api/auth/admin/${id}/password`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ newPassword }),
      });
      
      if (res.ok) {
        alert("Password changed successfully");
      } else {
        const data = await res.json();
        alert(data.error);
      }
    } catch (error) {
      console.error("Error changing password:", error);
    }
  };

  if (loading) return <p>Loading admins...</p>;

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Admins Management</h1>
        <button 
          onClick={() => window.location.href = "/admin/admins/add"}
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          Add New Admin
        </button>
      </div>

      <div className="border rounded">
        <table className="w-full">
          <thead>
            <tr className="bg-gray-100">
              <th className="p-2 text-left">Name</th>
              <th className="p-2 text-left">Email</th>
              <th className="p-2 text-left">Role</th>
              <th className="p-2 text-left">Status</th>
              <th className="p-2 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {admins.map((admin: any) => (
              <tr key={admin.id} className="border-t">
                <td className="p-2">{admin.full_name}</td>
                <td className="p-2">{admin.email}</td>
                <td className="p-2">{admin.role}</td>
                <td className="p-2">
                  <span className={admin.is_active ? "text-green-500" : "text-red-500"}>
                    {admin.is_active ? "Active" : "Inactive"}
                  </span>
                </td>
                <td className="p-2">
                  <div className="flex gap-2">
                    <button 
                      onClick={() => window.location.href = `/admin/admins/${admin.id}`}
                      className="bg-blue-500 text-white px-2 py-1 rounded text-sm"
                    >
                      Edit
                    </button>
                    <button 
                      onClick={() => toggleStatus(admin.id, admin.is_active)}
                      className="bg-yellow-500 text-white px-2 py-1 rounded text-sm"
                    >
                      {admin.is_active ? "Deactivate" : "Activate"}
                    </button>
                    <button 
                      onClick={() => changePassword(admin.id)}
                      className="bg-green-500 text-white px-2 py-1 rounded text-sm"
                    >
                      Change Password
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {admins.length === 0 && <p className="p-4 text-center">No admins found</p>}
      </div>
    </div>
  );
}