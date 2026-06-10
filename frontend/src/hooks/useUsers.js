import { useState, useEffect } from 'react';
import { userApi } from '../api/userApi';

export function useUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const getUsers = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await userApi.getAll();
      setUsers(Array.isArray(response) ? response : []);
    } catch (err) {
      console.warn('Failed to load users.', err);
      setError('Failed to load users');
      setUsers([]);
    } finally {
      setLoading(false);
    }
  };

  const updateUser = async (id, data) => {
    try {
      const updated = await userApi.update(id, data);
      setUsers((prev) => prev.map((user) => (user.id === id ? updated : user)));
      return updated;
    } catch (err) {
      console.error('Failed to update user.', err);
      throw err;
    }
  };

  const deleteUser = async (id) => {
    try {
      await userApi.delete(id);
      setUsers((prev) => prev.filter((user) => user.id !== id));
    } catch (err) {
      console.error('Failed to delete user.', err);
      throw err;
    }
  };

  useEffect(() => {
    getUsers();
  }, []);

  return {
    users,
    loading,
    error,
    getUsers,
    updateUser,
    deleteUser,
  };
}

export default useUsers;
