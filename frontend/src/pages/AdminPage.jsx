import React, { useState, useEffect, useCallback } from 'react';
import { getAllUsers, promoteUser } from '../api/adminService';
import { FaUsers, FaUserShield } from 'react-icons/fa';

function AdminPage() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const fetchUsers = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      setSuccess(null);
      const res = await getAllUsers();
      setUsers(res.data);
    } catch (err) {
      console.error("Failed to fetch users:", err);
      setError("Could not load users. You may not have admin rights.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const handlePromote = async (userId) => {
    try {
      await promoteUser(userId);
      setSuccess("User promoted to Admin!");
      // Refresh the user list to show new roles
      fetchUsers();
    } catch (err) {
      console.error("Failed to promote user:", err);
      setError("Failed to promote user.");
    }
  };

  // Helper to check if user is already an admin
  const isRoleAdmin = (roles) => {
    return roles.includes("ROLE_ADMIN");
  };

  return (
    <div className="p-8 text-white">
      <h1 className="text-4xl font-bold text-green-400 mb-8 flex items-center">
        <FaUserShield className="mr-3" /> Admin Panel
      </h1>
      
      {loading && <p className="text-gray-400">Loading users...</p>}
      {error && <p className="text-red-400 mb-4">{error}</p>}
      {success && <p className="text-green-400 mb-4">{success}</p>}

      <div className="w-full max-w-4xl bg-gray-800 rounded-lg shadow-lg overflow-hidden">
        <h3 className="text-xl font-semibold p-4 flex items-center">
          <FaUsers className="mr-2" /> All Users
        </h3>
        <table className="min-w-full text-white">
          <thead>
            <tr className="border-b border-gray-700">
              <th className="text-left p-4">ID</th>
              <th className="text-left p-4">Name</th>
              <th className="text-left p-4">Email</th>
              <th className="text-left p-4">Roles</th>
              <th className="text-right p-4">Action</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.id} className="border-b border-gray-700 hover:bg-gray-700">
                <td className="p-4">{user.id}</td>
                <td className="p-4">{user.name}</td>
                <td className="p-4">{user.email}</td>
                <td className="p-4 text-xs">
                  {user.roles.join(', ')}
                </td>
                <td className="text-right p-4">
                  <button
                    onClick={() => handlePromote(user.id)}
                    disabled={isRoleAdmin(user.roles)}
                    className="px-3 py-1 text-sm font-semibold text-gray-900 bg-blue-400 rounded-md hover:bg-blue-300 disabled:bg-gray-500 disabled:cursor-not-allowed"
                  >
                    {isRoleAdmin(user.roles) ? 'Admin' : 'Promote'}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default AdminPage;