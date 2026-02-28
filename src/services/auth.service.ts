import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { userRepository } from "../repositories/user.repository";

export const authService = {

  login: async (email: string, password: string) => {
    const user = await userRepository.findByEmail(email);
    if (!user) throw new Error("Invalid credentials");
    if (!user.isActive) throw new Error("Account is deactivated");

    const isValid = await bcrypt.compare(password, user.passwordHash);
    if (!isValid) throw new Error("Invalid credentials");


if (!process.env.JWT_SECRET) {
  throw new Error("JWT_SECRET is not defined in environment variables");
}
const secretKey: any = process.env.JWT_SECRET;
const expiresIn: any = process.env.JWT_EXPIRES_IN || "7d";
const token = jwt.sign(
  { id: user.id, role: user.role, email: user.email },
  secretKey,
  {
    expiresIn: expiresIn,
  }
);

    const { passwordHash, ...userWithoutPassword } = user;
    return { token, user: userWithoutPassword };
  },

  getMe: async (userId: string) => {
  const user = await userRepository.findById(userId);
  if (!user) throw new Error("User not found");
  const { passwordHash, ...userWithoutPassword } = user;
  return userWithoutPassword;
},

  changePassword: async (userId: string, oldPassword: string, newPassword: string) => {
    const user = await userRepository.findById(userId);
    if (!user) throw new Error("User not found");

    const isValid = await bcrypt.compare(oldPassword, user.passwordHash);
    if (!isValid) throw new Error("Old password is incorrect");

    const passwordHash = await bcrypt.hash(newPassword, 10);
    await userRepository.update(userId, { passwordHash });
  },

};