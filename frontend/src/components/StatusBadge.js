/**
 * StatusBadge.js — Visual badge for complaint status and urgency.
 */

import { Clock, Loader2, CheckCircle2, XCircle } from 'lucide-react';

const statusConfig = {
  PENDING:     { label: 'Pending',     className: 'badge badge-pending',    icon: Clock },
  IN_PROGRESS: { label: 'In Progress', className: 'badge badge-inprogress', icon: Loader2 },
  RESOLVED:    { label: 'Resolved',    className: 'badge badge-resolved',   icon: CheckCircle2 },
  REJECTED:    { label: 'Rejected',    className: 'badge badge-rejected',   icon: XCircle },
};

const urgencyConfig = {
  low:      { label: 'Low',      className: 'badge urgency-low' },
  medium:   { label: 'Medium',   className: 'badge urgency-medium' },
  high:     { label: 'High',     className: 'badge urgency-high' },
  critical: { label: 'Critical', className: 'badge urgency-critical' },
};

export function StatusBadge({ status }) {
  const config = statusConfig[status] || statusConfig.PENDING;
  const Icon = config.icon;
  return (
    <span className={config.className}>
      <Icon size={11} />
      {config.label}
    </span>
  );
}

export function UrgencyBadge({ urgency }) {
  const config = urgencyConfig[urgency?.toLowerCase()] || urgencyConfig.low;
  return <span className={config.className}>{config.label}</span>;
}

export default StatusBadge;
