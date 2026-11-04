import { CheckCircle, AlertCircle, XCircle } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import styles from './StatusBadge.module.css';

export type Status = 'disponivel' | 'pode_lotar' | 'precisa_atencao';

interface StatusConfig {
  Icon: LucideIcon;
  label: string;
  className: string;
}

const statusMap: Record<Status, StatusConfig> = {
  disponivel: {
    Icon: CheckCircle,
    label: 'Disponível',
    className: 'disponivel',
  },
  pode_lotar: {
    Icon: AlertCircle,
    label: 'Pode lotar',
    className: 'podeLotar',
  },
  precisa_atencao: {
    Icon: XCircle,
    label: 'Precisa de atenção',
    className: 'precisaAtencao',
  },
};

interface StatusBadgeProps {
  status: Status;
  /** Optional className for the outer wrapper */
  className?: string;
}

export default function StatusBadge({ status, className }: StatusBadgeProps) {
  const { Icon, label, className: statusClass } = statusMap[status];

  return (
    <span
      className={`${styles.badge} ${styles[statusClass]} ${className ?? ''}`}
      role="status"
      aria-label={label}
    >
      <Icon size={16} aria-hidden="true" className={styles.icon} />
      <span className={styles.text}>{label}</span>
    </span>
  );
}
