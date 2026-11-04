import { useLocation, useNavigate } from 'react-router-dom';
import { Home, Map, Trash2, AlertTriangle, Settings } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import styles from './BottomNav.module.css';

interface Tab {
  path: string;
  label: string;
  Icon: LucideIcon;
}

const tabs: Tab[] = [
  { path: '/inicio', label: 'Início', Icon: Home },
  { path: '/mapa', label: 'Mapa', Icon: Map },
  { path: '/descarte', label: 'Descarte', Icon: Trash2 },
  { path: '/denuncia', label: 'Denunciar', Icon: AlertTriangle },
  { path: '/ajustes', label: 'Ajustes', Icon: Settings },
];

export default function BottomNav() {
  const location = useLocation();
  const navigate = useNavigate();

  return (
    <nav
      className={styles.nav}
      role="navigation"
      aria-label="Menu principal"
    >
      <ul className={styles.list}>
        {tabs.map(({ path, label, Icon }) => {
          const isActive = location.pathname === path
            || location.pathname.startsWith(`${path}/`);

          return (
            <li key={path} className={styles.item}>
              <button
                type="button"
                className={`${styles.tab} ${isActive ? styles.active : ''}`}
                onClick={() => navigate(path)}
                aria-current={isActive ? 'page' : undefined}
                aria-label={label}
              >
                <Icon
                  size={24}
                  aria-hidden="true"
                  className={styles.icon}
                />
                <span className={styles.label}>{label}</span>
              </button>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
