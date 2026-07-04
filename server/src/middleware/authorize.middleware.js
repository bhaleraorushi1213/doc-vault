// this middleware runs AFTER protectRoute, since it relies on req.user (with role populated)
// use it to gate routes either by role name, or by fine-grained permission strings

//@description  Restrict a route to specific role names
//@usage        router.delete("/:id", protectRoute, authorizeRoles("Admin"), deleteDocument)
export const authorizeRoles = (...allowedRoles) => {
  return (req, res, next) => {
    const roleName = req.user?.role?.roleName;

    if (!roleName) {
      return res.status(403).json({ message: "Forbidden - No role assigned to user" });
    }

    if (!allowedRoles.includes(roleName)) {
      return res.status(403).json({ message: "Forbidden - You do not have the required role" });
    }

    next();
  };
};

//@description  Restrict a route to users whose role carries ALL of the given permission strings
//@usage        router.patch("/:id/approve", protectRoute, requirePermission("document:approve"), approveDocument)
export const requirePermission = (...requiredPermissions) => {
  return (req, res, next) => {
    const userPermissions = req.user?.role?.permissions || [];

    const hasAllPermissions = requiredPermissions.every((permission) =>
      userPermissions.includes(permission)
    );

    if (!hasAllPermissions) {
      return res.status(403).json({
        message: `Forbidden - Missing required permission(s): ${requiredPermissions.join(", ")}`,
      });
    }

    next();
  };
};