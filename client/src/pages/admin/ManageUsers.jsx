import React, { useState, useEffect } from 'react';
import { Search, Trash2, Shield, User, Users } from 'lucide-react';
import API from '../../utils/api';
import Loader from '../../components/ui/Loader';
import toast from 'react-hot-toast';

const ManageUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [updating, setUpdating] = useState(null);
  const [deleting, setDeleting] = useState(null);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const res = await API.get('/admin/users');
      setUsers(res.data.users || []);
    } catch (error) {
      toast.error('Failed to load users!');
    } finally {
      setLoading(false);
    }
  };

  const handleRoleChange = async (userId, newRole) => {
    setUpdating(userId);
    try {
      await API.put(`/admin/users/${userId}/role`, { role: newRole });
      toast.success('User role updated successfully!');
      fetchUsers();
    } catch (error) {
      toast.error('Failed to update role!');
    } finally {
      setUpdating(null);
    }
  };

  const handleDelete = async (userId) => {
    if (!window.confirm('Are you sure you want to delete this user?')) return;
    setDeleting(userId);
    try {
      await API.delete(`/admin/users/${userId}`);
      toast.success('User deleted successfully!');
      fetchUsers();
    } catch (error) {
      toast.error('Failed to delete user!');
    } finally {
      setDeleting(null);
    }
  };

  const getRoleStyle = (role) => {
    switch (role) {
      case 'admin': return 'bg-red-100 text-red-600';
      case 'organizer': return 'bg-blue-100 text-blue-600';
      default: return 'bg-green-100 text-green-600';
    }
  };

  const filteredUsers = users.filter(user =>
    user.name?.toLowerCase().includes(search.toLowerCase()) ||
    user.email?.toLowerCase().includes(search.toLowerCase()) ||
    user.role?.toLowerCase().includes(search.toLowerCase())
  );

  // Stats
  const adminCount = users.filter(u => u.role === 'admin').length;
  const organizerCount = users.filter(u => u.role === 'organizer').length;
  const userCount = users.filter(u => u.role === 'user').length;

  if (loading) return <Loader fullScreen />;

  return (
    <div className="min-h-screen bg-black">

      {/* Header */}
      <div className="bg-gray-900 border-b border-orange-500/30 text-white py-8 px-4">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-3xl font-bold">Manage Users</h1>
          <p className="text-orange-200 mt-1">{users.length} total users</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">

        {/* Stats Row */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="theme-card rounded-2xl shadow-sm p-4 flex items-center gap-4">
            <div className="bg-surface-soft p-3 rounded-full">
              <User className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <p className="text-theme-text-muted text-sm">Normal Users</p>
              <p className="text-2xl font-bold text-white">{userCount}</p>
            </div>
          </div>
          <div className="theme-card rounded-2xl shadow-sm p-4 flex items-center gap-4">
            <div className="bg-surface-soft p-3 rounded-full">
              <Users className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <p className="text-theme-text-muted text-sm">Organizers</p>
              <p className="text-2xl font-bold text-white">{organizerCount}</p>
            </div>
          </div>
          <div className="theme-card rounded-2xl shadow-sm p-4 flex items-center gap-4">
            <div className="bg-surface-soft p-3 rounded-full">
              <Shield className="w-6 h-6 text-red-600" />
            </div>
            <div>
              <p className="text-theme-text-muted text-sm">Admins</p>
              <p className="text-2xl font-bold text-white">{adminCount}</p>
            </div>
          </div>
        </div>

        {/* Search */}
        <div className="theme-card rounded-2xl shadow-sm p-4 mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search by name, email or role..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl outline-none focus:border-orange-400 transition"
            />
          </div>
        </div>

        {/* Users Table */}
        <div className="bg-gray-900 rounded-2xl shadow-sm overflow-hidden">

          {/* Table Header */}
          <div className="grid grid-cols-5 gap-4 p-4 bg-surface-soft border-b border-surface text-sm font-semibold text-theme-text-muted">
            <div className="col-span-2">User</div>
            <div>Phone</div>
            <div>Role</div>
            <div>Actions</div>
          </div>

          {/* Table Rows */}
          <div className="divide-y divide-gray-50">
            {filteredUsers.map((user) => (
              <div key={user._id} className="grid grid-cols-5 gap-4 p-4 items-center hover:bg-surface-soft transition">

                {/* User Info */}
                <div className="col-span-2">
                  <div className="flex items-center gap-3">
                    <div className="bg-surface-soft w-10 h-10 rounded-full flex items-center justify-center">
                      <span className="text-accent font-bold text-sm">
                        {user.name?.charAt(0).toUpperCase()}
                      </span>
                    </div>
                    <div>
                      <p className="font-semibold text-white text-sm">{user.name}</p>
                      <p className="text-theme-text-muted text-xs">{user.email}</p>
                    </div>
                  </div>
                </div>

                {/* Phone */}
                <div className="text-theme-text-muted text-sm">
                  {user.phone}
                </div>

                {/* Role */}
                <div>
                  <span className={`text-xs px-3 py-1 rounded-full font-semibold ${getRoleStyle(user.role)}`}>
                    {user.role}
                  </span>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2">
                  {/* Role Change Dropdown */}
                  <select
                    value={user.role}
                    onChange={(e) => handleRoleChange(user._id, e.target.value)}
                    disabled={updating === user._id}
                    className="text-xs border border-gray-200 rounded-lg px-2 py-1 outline-none focus:border-orange-400 cursor-pointer"
                  >
                    <option value="user">User</option>
                    <option value="organizer">Organizer</option>
                    <option value="admin">Admin</option>
                  </select>

                  {/* Delete Button */}
                  {user.role !== 'admin' && (
                    <button
                      onClick={() => handleDelete(user._id)}
                      disabled={deleting === user._id}
                      className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>

              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ManageUsers;