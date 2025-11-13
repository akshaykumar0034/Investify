
import axiosInstance from './axiosConfig';

// Get all users
export const getAllUsers = () => {
  return axiosInstance.get('/admin/users');
};

// Promote a user to admin
export const promoteUser = (userId) => {
  return axiosInstance.post(`/admin/promote/${userId}`);
};