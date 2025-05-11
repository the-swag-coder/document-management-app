'use client';
import { useEffect, useState } from 'react';
import { getUsersAPI, createUserAPI, getUserByIdAPI, updateUserAPI } from '../../apis/users';
import { Dialog } from '@headlessui/react';
import { ICreateUser, IUser } from '../../interfaces/auth';

export default function UsersPage() {
  const [users, setUsers] = useState<IUser[]>([]);
  const [modalOpen, setModalOpen] = useState<boolean>(false);
  const [editingUser, setEditingUser] = useState<IUser | null>(null);
  const [form, setForm] = useState<ICreateUser>({ name: '', email: '', password: '', role: '' });

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const res = await getUsersAPI();
      setUsers(res);
    } catch (err) {
      console.error('Failed to fetch users', err);
    }
  };

  const handleOpenCreate = () => {
    setForm({ name: '', email: '', password: '', role: '' });
    setEditingUser(null);
    setModalOpen(true);
  };

  const handleOpenEdit = async (userId: number) => {
    try {
      const user = await getUserByIdAPI(userId);
      setEditingUser(user);
      setForm({ name: user.name, email: user.email, password: '', role: user.role });
      setModalOpen(true);
    } catch (err) {
      console.error('Failed to fetch user', err);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.email || (!editingUser && !form.password) || !form.role) return;
    try {
      if (editingUser) {
        const updated = await updateUserAPI(editingUser.id, form);
        setUsers(users.map(u => (u.id === updated.id ? updated : u)));
      } else {
        const newUser = await createUserAPI(form);
        setUsers([...users, newUser]);
      }
      setModalOpen(false);
      setForm({ name: '', email: '', password: '', role: '' });
      setEditingUser(null);
    } catch (err) {
      console.error('Failed to submit user', err);
    }
  };

  return (
    <>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">User</h1>
        <button
          className="bg-black text-white px-4 py-2 rounded cursor-pointer"
          onClick={handleOpenCreate}
        >
          Create User
        </button>
      </div>

      <Dialog open={modalOpen} onClose={() => setModalOpen(false)} className="relative z-50">
        <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
        <div className="fixed inset-0 flex items-center justify-center p-4">
          <Dialog.Panel className="bg-white p-6 rounded shadow max-w-md w-full">
            <Dialog.Title className="text-lg font-bold mb-4">
              {editingUser ? 'Edit User' : 'Create User'}
            </Dialog.Title>
            <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-4">
              <div>
                <label className="block mb-1">Name</label>
                <input
                  className="w-full p-2 border rounded"
                  placeholder="Name"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                />
              </div>
              <div>
                <label className="block mb-1">Email</label>
                <input
                  className="w-full p-2 border rounded"
                  placeholder="Email"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                />
              </div>
              {!editingUser && (
                <div>
                  <label className="block mb-1">Password</label>
                  <input
                    className="w-full p-2 border rounded"
                    placeholder="Password"
                    type="password"
                    value={form.password}
                    onChange={(e) => setForm({ ...form, password: e.target.value })}
                  />
                </div>
              )}
              <div>
                <label className="block mb-1">Role</label>
                <select
                  className="w-full p-2 border rounded"
                  value={form.role}
                  onChange={(e) => setForm({ ...form, role: e.target.value })}
                >
                  <option value="">Select Role</option>
                  <option value="admin">Admin</option>
                  <option value="editor">Editor</option>
                  <option value="viewer">Viewer</option>
                </select>
              </div>
              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  className="px-4 py-2 rounded border cursor-pointer"
                  onClick={() => setModalOpen(false)}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-black text-white rounded cursor-pointer"
                >
                  Submit
                </button>
              </div>
            </form>
          </Dialog.Panel>
        </div>
      </Dialog>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {users.map((user) => (
          <div
            key={user.id}
            className="bg-white border rounded-lg p-4 shadow hover:shadow-lg cursor-pointer"
            onClick={() => handleOpenEdit(user.id)}
          >
            <h2 className="text-lg font-semibold">{user.name}</h2>
            <p className="text-sm text-gray-600">{user.email}</p>
            <span className="text-sm inline-block mt-2 px-2 py-1 bg-gray-300 rounded">
              {user.role}
            </span>
          </div>
        ))}
      </div>
    </>
  );
}
