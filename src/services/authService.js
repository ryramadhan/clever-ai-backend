const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const { query } = require("./db");

const SALT_ROUNDS = 12;
const JWT_SECRET = process.env.JWT_SECRET;
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || "7d";
const RESET_TOKEN_EXPIRY_MINUTES = 15;

// Error factory
function createError(message, statusCode = 400) {
  const err = new Error(message);
  err.statusCode = statusCode;
  return err;
}

// Hash password
async function hashPassword(password) {
  return bcrypt.hash(password, SALT_ROUNDS);
}

// Compare password
async function comparePassword(password, hash) {
  return bcrypt.compare(password, hash);
}

// Generate JWT
function generateToken(userId) {
  if (!JWT_SECRET) {
    throw createError("JWT_SECRET not configured", 500);
  }
  return jwt.sign({ userId }, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
}

// Verify JWT
function verifyToken(token) {
  if (!JWT_SECRET) {
    throw createError("JWT_SECRET not configured", 500);
  }
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch (err) {
    throw createError("Invalid or expired token", 401);
  }
}

async function registerUser({ name, email, password }) {
  // Validate input
  if (!name || !email || !password) {
    throw createError("Name, email, and password are required");
  }

  if (password.length < 6) {
    throw createError("Password must be at least 6 characters");
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    throw createError("Invalid email format");
  }

  const existingUser = await findUserByEmail(email);
  if (existingUser) {
    throw createError("Email already registered", 409);
  }

  const hashedPassword = await hashPassword(password);

  const { rows } = await query(
    `INSERT INTO users (name, email, password)
     VALUES ($1, $2, $3)
     RETURNING id, name, email, created_at`,
    [name.trim(), email.toLowerCase().trim(), hashedPassword]
  );

  const user = rows[0];
  const token = generateToken(user.id);

  return {
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      picture: user.picture,
      createdAt: user.created_at,
    },
    token,
  };
}

async function loginUser({ email, password }) {
  if (!email || !password) {
    throw createError("Email and password are required");
  }

  // Find user
  const user = await findUserByEmail(email);
  if (!user) {
    throw createError("Invalid email or password", 401);
  }

  // Check if user has password (might be Google-only user)
  if (!user.password) {
    throw createError("Please use Google login for this account", 401);
  }

  // Verify password
  const isValid = await comparePassword(password, user.password);
  if (!isValid) {
    throw createError("Invalid email or password", 401);
  }

  const token = generateToken(user.id);

  return {
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      picture: user.picture,
      createdAt: user.created_at,
    },
    token,
  };
}

async function findUserByEmail(email) {
  const { rows } = await query(
    `SELECT id, name, email, password, google_id, picture, created_at
     FROM users
     WHERE email = $1`,
    [email.toLowerCase().trim()]
  );
  return rows[0] || null;
}

async function findUserById(userId) {
  const { rows } = await query(
    `SELECT id, name, email, picture, created_at
     FROM users
     WHERE id = $1`,
    [userId]
  );
  return rows[0] || null;
}

async function findOrCreateGoogleUser({ googleId, email, name, picture }) {
  // Try to find by google_id first
  let { rows } = await query(
    `SELECT id, name, email, google_id, picture, created_at
     FROM users
     WHERE google_id = $1`,
    [googleId]
  );

  if (rows[0]) {
    const user = rows[0];
    const token = generateToken(user.id);
    return {
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        picture: user.picture,
        createdAt: user.created_at,
      },
      token,
      isNew: false,
    };
  }

  ({ rows } = await query(
    `SELECT id, name, email, picture, created_at
     FROM users
     WHERE email = $1`,
    [email.toLowerCase().trim()]
  ));

  if (rows[0]) {
    const user = rows[0];
    await query(
      `UPDATE users SET google_id = $1, picture = COALESCE($2, picture) WHERE id = $3`,
      [googleId, picture, user.id]
    );

    const token = generateToken(user.id);
    return {
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        picture: picture || user.picture,
        createdAt: user.created_at,
      },
      token,
      isNew: false,
    };
  }

  ({ rows } = await query(
    `INSERT INTO users (name, email, google_id, picture)
     VALUES ($1, $2, $3, $4)
     RETURNING id, name, email, picture, created_at`,
    [name.trim(), email.toLowerCase().trim(), googleId, picture]
  ));

  const newUser = rows[0];
  const token = generateToken(newUser.id);

  return {
    user: {
      id: newUser.id,
      name: newUser.name,
      email: newUser.email,
      picture: newUser.picture,
      createdAt: newUser.created_at,
    },
    token,
    isNew: true,
  };
}

// Generate password reset token
async function generateResetToken(email) {
  const user = await findUserByEmail(email);
  if (!user) {
    // Don't reveal if email exists
    return { success: true, message: "If email exists, reset link sent" };
  }

  // Generate token and expiry
  const resetToken = crypto.randomUUID();
  const expiry = new Date(Date.now() + RESET_TOKEN_EXPIRY_MINUTES * 60 * 1000);

  await query(
    `UPDATE users
     SET reset_token = $1, reset_token_expiry = $2
     WHERE id = $3`,
    [resetToken, expiry, user.id]
  );

  return {
    success: true,
    resetToken,
    userEmail: user.email,
    message: "Reset token generated",
  };
}

async function verifyResetToken(token) {
  const { rows } = await query(
    `SELECT id, email, reset_token_expiry
     FROM users
     WHERE reset_token = $1
     AND reset_token_expiry > NOW()`,
    [token]
  );

  if (!rows[0]) {
    throw createError("Invalid or expired reset token", 400);
  }

  return rows[0];
}

async function resetPassword({ token, newPassword }) {
  if (!newPassword || newPassword.length < 6) {
    throw createError("Password must be at least 6 characters");
  }

  const user = await verifyResetToken(token);

  const hashedPassword = await hashPassword(newPassword);

  // Update password and clear reset token
  await query(
    `UPDATE users
     SET password = $1, reset_token = NULL, reset_token_expiry = NULL
     WHERE id = $2`,
    [hashedPassword, user.id]
  );

  return { success: true, message: "Password reset successful" };
}

module.exports = {
  registerUser,
  loginUser,
  findUserByEmail,
  findUserById,
  findOrCreateGoogleUser,
  generateResetToken,
  resetPassword,
  verifyResetToken,
  generateToken,
  verifyToken,
  hashPassword,
  comparePassword,
  createError,
};