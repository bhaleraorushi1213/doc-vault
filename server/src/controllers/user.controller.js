import User from "../models/user.model.js";
import Role from "../models/role.model.js";

//@description     List all users (for an admin dashboard / user management screen)
//@route           GET /api/users
//@access          Protected - Admin only
export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find()
      .populate("role", "roleName permissions")
      .sort({ createdAt: -1 });

    return res.status(200).json(users);
  } catch (error) {
    console.log("Error in getAllUsers controller", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
};

//@description     Change a user's role (promote/demote)
//@route           PATCH /api/users/:id/role
//@access          Protected - Admin only
export const updateUserRole = async (req, res) => {
  const { id } = req.params;
  const { roleName } = req.body;

  try {
    if (!roleName) {
      return res.status(400).json({ message: "roleName is required" });
    }

    const role = await Role.findOne({ roleName });

    if (!role) {
      return res.status(404).json({ message: `Role '${roleName}' does not exist` });
    }

    // precaution: don't let an admin accidentally demote themselves and get locked out
    if (id === req.user._id.toString() && roleName !== "Admin") {
      return res.status(400).json({ message: "You cannot change your own admin role" });
    }

    const user = await User.findByIdAndUpdate(
      id,
      { role: role._id },
      { returnDocument: "after" }
    ).populate("role", "roleName permissions");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    return res.status(200).json(user);
  } catch (error) {
    console.log("Error in updateUserRole controller", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
}