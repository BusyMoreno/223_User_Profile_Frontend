import api from "../config/Api";
import { User, UserRegister } from "../types/models/User.model";

const UserService = {
  getUser: async (userID: string): Promise<User> => {
    const { data } = await api.get<User>(`/user/${userID}`);
    return data;
  },

  updateUser: (user: User & { id: string }) => {
    return api.put(`/user/editUser/${user.id}`, user);
  },

  addUser: (registrationData: UserRegister) => {
    return api.post("/user/register", registrationData).then((res) => {
      return res.data;
    });
  },

  getAllUsers: () => {
    return api.get<User[]>(`/user`);
  },

  getCurrentUser() {
    return api.get<User>("/user/profile");
  },

  getFilteredUsers: (params: {
    minAge?: number;
    maxAge?: number;
    firstName?: string;
    lastName?: string;
    page?: number;
    size?: number;
  }) => {
    return api.get<User[]>(`/user/admin/search`, {
      params,
    });
  },

  deleteUser: (id: string) => {
    return api.delete(`/user/${id}`);
  },

  deleteOwnProfile() {
    return api.delete("/user/me");
  },
};

export default UserService;
