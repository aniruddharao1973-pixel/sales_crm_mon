// CRM-Backend\src\controllers\auth.controller.js
import bcrypt from "bcryptjs";
import prisma from "../utils/prisma.js";
import { generateToken } from "../utils/generateToken.js";
import { ApiError, asyncHandler } from "../utils/ApiError.js";

// @desc    Register user
// @route   POST /api/auth/register
export const register = asyncHandler(async (req, res) => {
  const { name, username, employeeId, email, password, role, mobile } = req.body;

  if (!name || !username || !employeeId || !password) {
    throw new ApiError(400, "Please provide name, username, employeeId, and password");
  }

  const existingUser = await prisma.user.findUnique({ where: { username } });
  if (existingUser) {
    throw new ApiError(400, "User already exists with this username");
  }

  const hashedPassword = await bcrypt.hash(password, 12);

  const user = await prisma.user.create({
    data: {
      name,
      username,
      employeeId,
      email,
      password: hashedPassword,
      role: role || "SALES_REP",
      mobile,
      maxDiscount: parseFloat(req.body.maxDiscount) || 0,
    },
    select: {
      id: true,
      name: true,
      username: true,
      employeeId: true,
      email: true,
      role: true,
      avatar: true,
      mobile: true,
      maxDiscount: true,
    },
  });

  const token = generateToken(user.id);

  // res.cookie("token", token, {
  //   httpOnly: true,
  //   secure: process.env.NODE_ENV === "production",
  //   sameSite: "strict",
  //   maxAge: 7 * 24 * 60 * 60 * 1000,
  // });

  res.cookie("token", token, {
    httpOnly: true,
    secure: true, // must be true in production
    sameSite: "none", // CRITICAL FIX
    secure: true,
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });

  // res.status(201).json({
  //   success: true,
  //   data: { user, token },
  // });
  res.status(201).json({
    success: true,
    message: "User created successfully",
    data: user,
  });
});

// @desc    Login user
// @route   POST /api/auth/login
export const login = asyncHandler(async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    throw new ApiError(400, "Please provide username and password");
  }

  const user = await prisma.user.findUnique({ where: { username } });
  if (!user) {
    throw new ApiError(401, "Invalid credentials");
  }

  if (!user.isActive) {
    throw new ApiError(401, "Account is deactivated");
  }

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    throw new ApiError(401, "Invalid credentials");
  }

  const token = generateToken(user.id);

  // res.cookie("token", token, {
  //   httpOnly: true,
  //   secure: process.env.NODE_ENV === "production",
  //   sameSite: "strict",
  //   maxAge: 7 * 24 * 60 * 60 * 1000,
  // });

  res.cookie("token", token, {
    httpOnly: true,
    secure: true, // must be true in production
    sameSite: "none", // CRITICAL FIX
    secure: true,
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });

  res.json({
    success: true,
    data: {
      user: {
        id: user.id,
        name: user.name,
        username: user.username,
        employeeId: user.employeeId,
        email: user.email,
        role: user.role,
        avatar: user.avatar,
        mobile: user.mobile,
        maxDiscount: user.maxDiscount,
      },
      token,
    },
  });
});

// @desc    Logout user
// @route   POST /api/auth/logout
export const logout = asyncHandler(async (req, res) => {
  res.cookie("token", "", {
    httpOnly: true,
    expires: new Date(0),
  });

  res.json({ success: true, message: "Logged out" });
});

// @desc    Get current user
// @route   GET /api/auth/me
// export const getMe = asyncHandler(async (req, res) => {
//   res.json({ success: true, data: req.user });
// });

// @desc    Get current user
// @route   GET /api/auth/me
export const getMe = asyncHandler(async (req, res) => {
  const user = await prisma.user.findUnique({
    where: { id: req.user.id },
    select: {
      id: true,
      name: true,
      username: true,
      employeeId: true,
      email: true,
      role: true,
      avatar: true,
      isActive: true,
      mobile: true,
      maxDiscount: true,

      // IMPORTANT FOR EMAIL SYSTEM
      emailProvider: true,
      emailAccessToken: true,
      emailRefreshToken: true,
    },
  });

  res.json({
    success: true,
    data: user,
  });
});

// @desc    Get all users (for dropdowns)
// @route   GET /api/auth/users
// export const getUsers = asyncHandler(async (req, res) => {
//   const users = await prisma.user.findMany({
//     where: { isActive: true },
//     select: { id: true, name: true, email: true, role: true },
//     orderBy: { name: "asc" },
//   });

//   res.json({ success: true, data: users });
// });

export const getUsers = asyncHandler(async (req, res) => {
  const { showInactive } = req.query;
  
  const users = await prisma.user.findMany({
    where: showInactive === "true" ? {} : { isActive: true },
    select: {
      id: true,
      name: true,
      username: true,
      employeeId: true,
      email: true,
      role: true,
      avatar: true,
      isActive: true,
      mobile: true,
      maxDiscount: true,
      emailProvider: true,
    },
    orderBy: { name: "asc" },
  });

  res.json({
    success: true,
    data: users,
  });
});

export const deleteUser = asyncHandler(async (req, res) => {
  const { id } = req.params;
  
  const user = await prisma.user.findUnique({
    where: { id },
  });

  if (!user) {
    throw new ApiError(404, "User not found");
  }

  // Prevent deleting yourself
  if (req.user.id === id) {
    throw new ApiError(400, "Cannot delete yourself");
  }

  // Two-stage deletion: Soft delete first, then Hard delete
  if (user.isActive) {
    await prisma.user.update({
      where: { id },
      data: { isActive: false },
    });

    return res.json({
      success: true,
      message: "User deactivated successfully. They can be permanently deleted from the inactive list.",
    });
  }

  // If already inactive, attempt permanent delete
  try {
    await prisma.user.delete({
      where: { id },
    });

    res.json({
      success: true,
      message: "User deleted permanently from the database.",
    });
  } catch (error) {
    // Check for foreign key constraints (Prisma code P2003)
    if (error.code === 'P2003') {
      throw new ApiError(400, "Cannot permanently delete this user because they have associated records (Leads, Quotations, etc.). They will remain in deactivated state for data integrity.");
    }
    throw error;
  }
});
export const updateUser = asyncHandler(async (req, res) => {
  const { name, username, employeeId, email, role, isActive, mobile } = req.body;

  const existingUser = await prisma.user.findUnique({
    where: { id: req.params.id },
  });

  if (!existingUser) {
    throw new ApiError(404, "User not found");
  }

  // Prevent duplicate username
  if (username && username !== existingUser.username) {
    const usernameExists = await prisma.user.findUnique({
      where: { username },
    });

    if (usernameExists) {
      throw new ApiError(400, "Username already in use");
    }
  }

  // Prevent duplicate employeeId
  if (employeeId && employeeId !== existingUser.employeeId) {
    const employeeIdExists = await prisma.user.findUnique({
      where: { employeeId },
    });

    if (employeeIdExists) {
      throw new ApiError(400, "Employee ID already in use");
    }
  }

  const updatedUser = await prisma.user.update({
    where: { id: req.params.id },
    data: {
      name,
      username,
      employeeId,
      email,
      role,
      isActive,
      mobile,
      maxDiscount: req.body.maxDiscount !== undefined ? parseFloat(req.body.maxDiscount) : undefined,
    },
    select: {
      id: true,
      name: true,
      username: true,
      employeeId: true,
      email: true,
      role: true,
      avatar: true,
      isActive: true,
      mobile: true,
      maxDiscount: true,
      emailProvider: true,
    },
  });

  res.json({
    success: true,
    message: "User updated successfully",
    data: updatedUser,
  });
});
