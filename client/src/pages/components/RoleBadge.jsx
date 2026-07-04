import { ROLE_CLASSES } from "../../lib/constants.js";

const RoleBadge = ({ roleName }) => (
  <span
    className={`inline-flex items-center px-2 py-0.5 rounded border text-[11px] font-semibold ${
      ROLE_CLASSES[roleName] || ROLE_CLASSES.Employee
    }`}
  >
    {roleName}
  </span>
);

export default RoleBadge;