import { ROLE_CLASSES, STATUS_CONFIG } from "./utils.js";

export const StatusStamp = ({ status }) => {
  const config = STATUS_CONFIG[status?.toLowerCase()];
  if (!config) return null;
  const Icon = config.icon;
  return (
    <span
      className={`inline-flex items-center gap-1 px-2 py-0.5 rounded border text-[11px] font-semibold uppercase tracking-wide -rotate-2 ${config.classes}`}
    >
      <Icon className="size-3" />
      {config.label}
    </span>
  );
};

export const RoleBadge = ({ roleName }) => (
  <span
    className={`inline-flex items-center px-2 py-0.5 rounded border text-[11px] font-semibold ${
      ROLE_CLASSES[roleName] || ROLE_CLASSES.Employee
    }`}
  >
    {roleName}
  </span>
);