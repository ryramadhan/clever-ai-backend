const {
  registerUser,
  loginUser,
  findOrCreateGoogleUser,
  generateResetToken,
  resetPassword,
  findUserById,
} = require("../services/authService");
const { OAuth2Client } = require("google-auth-library");

const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;

// Initialize Google OAuth client
const googleClient = new OAuth2Client(GOOGLE_CLIENT_ID);

async function register(req, res) {
  const { name, email, password } = req.body ?? {};

  const { user, token } = await registerUser({ name, email, password });

  res.status(201).json({
    success: true,
    message: "User registered successfully",
    user,
    token,
  });
}

async function login(req, res) {
  const { email, password } = req.body ?? {};

  const { user, token } = await loginUser({ email, password });

  res.json({
    success: true,
    message: "Login successful",
    user,
    token,
  });
}

async function getMe(req, res) {
  const userId = req.userId;
  const user = await findUserById(userId);

  if (!user) {
    const err = new Error("User not found");
    err.statusCode = 404;
    throw err;
  }

  res.json({
    success: true,
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      picture: user.picture,
      createdAt: user.created_at,
    },
  });
}

// Google Login - Verify ID Token
async function googleLogin(req, res) {
  if (!GOOGLE_CLIENT_ID) {
    const err = new Error("Google OAuth not configured");
    err.statusCode = 500;
    throw err;
  }

  const { idToken } = req.body ?? {};

  if (!idToken) {
    const err = new Error("ID token is required");
    err.statusCode = 400;
    throw err;
  }

  // Verify Google ID token
  const ticket = await googleClient.verifyIdToken({
    idToken,
    audience: GOOGLE_CLIENT_ID,
  });

  const payload = ticket.getPayload();
  const { sub: googleId, email, name, picture } = payload;

  if (!email) {
    const err = new Error("Email not available from Google");
    err.statusCode = 400;
    throw err;
  }

  const { user, token, isNew } = await findOrCreateGoogleUser({
    googleId,
    email,
    name: name || email.split("@")[0],
    picture,
  });

  res.status(isNew ? 201 : 200).json({
    success: true,
    message: isNew ? "Account created via Google" : "Login successful",
    user,
    token,
  });
}

async function forgotPassword(req, res) {
  const { email } = req.body ?? {};

  if (!email) {
    const err = new Error("Email is required");
    err.statusCode = 400;
    throw err;
  }

  const result = await generateResetToken(email);

  res.json({
    success: true,
    message: "If email exists, password reset instructions have been sent",
    // Only include token in development
    ...(process.env.NODE_ENV !== "production" && result.resetToken
      ? { resetToken: result.resetToken }
      : {}),
  });
}

async function resetPasswordHandler(req, res) {
  const { token, newPassword } = req.body ?? {};

  if (!token || !newPassword) {
    const err = new Error("Token and new password are required");
    err.statusCode = 400;
    throw err;
  }

  const result = await resetPassword({ token, newPassword });

  res.json({
    success: true,
    message: result.message,
  });
}

module.exports = {
  register,
  login,
  getMe,
  googleLogin,
  forgotPassword,
  resetPasswordHandler,
};
