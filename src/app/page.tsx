"use client";

import { signIn, signOut, useSession } from "next-auth/react";
import { useEffect, useState } from "react";

type User = {
  _id: string;
  name: string;
  email: string;
};

export default function HomePage() {
  const [users, setUsers] = useState<User[]>([]);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [editId, setEditId] = useState<string | null>(null); // Track user being edited
  const { data: session } = useSession();

  const fetchUsers = async () => {
    const res = await fetch("/api/users");
    const data = await res.json();
    setUsers(data);
  };

  const addUser = async () => {
    if (!name || !email) return;
    await fetch("/api/users", {
      method: "POST",
      body: JSON.stringify({ name, email }),
    });
    resetForm();
    fetchUsers();
  };

  const updateUser = async () => {
    if (!editId || !name || !email) return;
    await fetch(`/api/users/${editId}`, {
      method: "PUT",
      body: JSON.stringify({ name, email }),
    });
    resetForm();
    fetchUsers();
  };

  const deleteUser = async (id: string) => {
    await fetch(`/api/users/${id}`, { method: "DELETE" });
    fetchUsers();
  };

  const startEdit = (user: User) => {
    setName(user.name);
    setEmail(user.email);
    setEditId(user._id);
  };

  const resetForm = () => {
    setName("");
    setEmail("");
    setEditId(null);
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  return (
    <div className="p-6 max-w-xl mx-auto">
      {!session ? (
        <button
          onClick={() => signIn("google")}
          className="mb-4 bg-blue-600 text-white px-4 py-2 rounded"
        >
          Login with Google
        </button>
      ) : (
        <div className="mb-4">
          <p className="mb-2">Welcome, {session.user?.name}</p>
          <button
            onClick={() => signOut()}
            className="bg-red-600 text-white px-4 py-2 rounded"
          >
            Logout
          </button>
        </div>
      )}

      <h1 className="text-2xl font-bold mb-4">Users</h1>

      <div className="flex gap-2 mb-4">
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="border p-2 w-full"
          placeholder="Name"
        />
        <input
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="border p-2 w-full"
          placeholder="Email"
        />
        {editId ? (
          <>
            <button
              onClick={updateUser}
              className="bg-yellow-600 text-white px-4 rounded"
            >
              Update
            </button>
            <button
              onClick={resetForm}
              className="bg-gray-500 text-white px-2 rounded"
            >
              Cancel
            </button>
          </>
        ) : (
          <button
            onClick={addUser}
            className="bg-green-600 text-white px-4 rounded"
          >
            Add
          </button>
        )}
      </div>

      <ul>
        {users.map((u) => (
          <li key={u._id} className="flex justify-between items-center border-b py-2">
            <span>
              {u.name} - {u.email}
            </span>
            <div className="flex gap-2">
              <button
                onClick={() => startEdit(u)}
                className="text-blue-600"
              >
                Edit
              </button>
              <button
                onClick={() => deleteUser(u._id)}
                className="text-red-600"
              >
                Delete
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
