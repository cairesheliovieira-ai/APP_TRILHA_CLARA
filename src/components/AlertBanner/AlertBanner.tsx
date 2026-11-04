import { AlertTriangle, Info, Bell } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import styles from './AlertBanner.module.css';

type BannerTipo = 'alerta' | 'info' | 'aviso';

interface AlertBannerProps {
  tipo: BannerTipo;
  titulo: string;
  mensagem: string;
  acaoTexto?: string;
  onAcao?: () => void;
}

interface TipoConfig {
  Icon: LucideIcon;
  className: string;
  role: 'alert' | 'status';
}

const tipoMap: Record<BannerTipo, TipoConfig> = {
  alerta: {
    Icon: AlertTriangle,
    className: 'alerta',
    role: 'alert',
  },
  info: {
    Icon: Info,
    className: 'info',
    role: 'status',
  },
  aviso: {
    Icon: Bell,
    className: 'aviso',
    role: 'status',
  },
};

export default function AlertBanner({
  tipo,
  titulo,
  mensagem,
  acaoTexto,
  onAcao,
}: AlertBannerProps) {
  const { Icon, className: tipoClass, role } = tipoMap[tipo];

  return (
    <div
      className={`${styles.banner} ${styles[tipoClass]}`}
      role={role}
      aria-label={titulo}
    >
      <div className={styles.iconWrapper}>
        <Icon size={24} aria-hidden="true" />
      </div>

      <div className={styles.content}>
        <p className={styles.titulo}>{titulo}</p>
        <p className={styles.mensagem}>{mensagem}</p>
      </div>

      {acaoTexto && onAcao && (
        <button
          type="button"
          className={styles.action}
          onClick={onAcao}
          aria-label={acaoTexto}
        >
          {acaoTexto}
        </button>
      )}
    </div>
  );
}
