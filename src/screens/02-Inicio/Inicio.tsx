import { useNavigate } from 'react-router-dom';
import { 
  Trees, 
  Map, 
  Accessibility, 
  Trash2, 
  PawPrint, 
  AlertTriangle,
  ChevronRight,
  ShieldAlert,
  Bath,
  Recycle,
  Star,
} from 'lucide-react';
import { useAvisos, usePontos } from '../../hooks/useOfflineData';
import { useAppStore } from '../../store/app-store';
import AlertBanner from '../../components/AlertBanner/AlertBanner';
import Card from '../../components/Card/Card';
import BottomNav from '../../components/BottomNav/BottomNav';
import styles from './Inicio.module.css';

export default function Inicio() {
  const navigate = useNavigate();
  const { data: avisosData } = useAvisos();
  const { data: pontosData } = usePontos();
  const capybaraDismissed = useAppStore((state) => state.capybaraAlertDismissed);
  const favoritePointIds = useAppStore((state) => state.favoritePointIds);

  const activeAviso = avisosData?.avisos?.find((a) => a.ativo);
  const favoritePoints = favoritePointIds
    .map((id) => pontosData?.pontos.find((point) => point.id === id))
    .filter((point): point is NonNullable<typeof point> => Boolean(point));

  const quickSearches = [
    { label: 'Banheiro', query: 'banheiro', Icon: Bath },
    { label: 'Entrada', query: 'entrada', Icon: Map },
    { label: 'Lixeira', query: 'lixeira', Icon: Recycle },
    { label: 'Acessibilidade', query: 'acessibilidade', Icon: Accessibility },
  ];

  const shortcuts = [
    {
      id: 'mapa',
      title: 'Mapa do parque',
      desc: 'Rotas acessíveis, banheiros e pontos de apoio',
      icon: Map,
      route: '/mapa',
      colorVar: 'var(--color-primary)',
    },
    {
      id: 'acessibilidade',
      title: 'Acessibilidade',
      desc: 'Status de banheiros, rampas e vagas preferenciais',
      icon: Accessibility,
      route: '/acessibilidade',
      colorVar: 'var(--color-primary)',
    },
    {
      id: 'descarte',
      title: 'Descarte correto',
      desc: 'Guia das 6 cores de lixeira (vai e não vai)',
      icon: Trash2,
      route: '/descarte',
      colorVar: 'var(--color-primary)',
    },
    {
      id: 'fauna',
      title: 'Fauna do parque',
      desc: 'Capivaras, aves e répteis catalogados',
      icon: PawPrint,
      route: '/fauna',
      colorVar: 'var(--color-primary)',
    },
    {
      id: 'denuncia',
      title: 'Denunciar',
      desc: 'Relate lixo, lixeira cheia ou barreira em 2 passos',
      icon: AlertTriangle,
      route: '/denuncia',
      colorVar: 'var(--color-warning)',
    },
  ];

  return (
    <div className={styles.screenWrapper}>
      <header className={styles.topHeader} role="banner">
        <div className={styles.headerLeft}>
          <div className={styles.logoBadge} aria-hidden="true">
            <Trees size={24} />
          </div>
          <div>
            <h1 className={styles.appName}>Trilha Clara</h1>
            <p className={styles.parkSub}>Parque Ecológico de Águas Claras, DF</p>
          </div>
        </div>
      </header>

      <main className={styles.mainContent} role="main" aria-label="Página inicial do Trilha Clara">
        <section className={styles.quickFindSection} aria-label="Encontrar rapidamente no parque">
          <h2 className={styles.sectionTitle}>O que você procura?</h2>
          <div className={styles.quickFindGrid}>
            {quickSearches.map(({ label, query, Icon }) => (
              <button
                key={query}
                type="button"
                className={styles.quickFindButton}
                onClick={() => navigate(`/mapa?buscar=${encodeURIComponent(query)}`)}
              >
                <Icon size={20} aria-hidden="true" />
                <span>{label}</span>
              </button>
            ))}
          </div>
          {favoritePoints.length > 0 && (
            <div className={styles.homeFavorites} aria-label="Lugares favoritos">
              <h3><Star size={15} fill="currentColor" aria-hidden="true" /> Favoritos</h3>
              <div>
                {favoritePoints.slice(0, 3).map((point) => (
                  <button
                    key={point.id}
                    type="button"
                    onClick={() => navigate(`/mapa?destino=${encodeURIComponent(point.id)}`)}
                  >
                    <Map size={15} aria-hidden="true" /> {point.nome}
                  </button>
                ))}
              </div>
            </div>
          )}
        </section>

        {/* Banner de Aviso Oficial */}
        {activeAviso && (
          <section className={styles.alertSection} aria-label="Aviso oficial do parque">
            <AlertBanner
              tipo={activeAviso.tipo as 'alerta' | 'info' | 'aviso'}
              titulo={activeAviso.titulo}
              mensagem={activeAviso.mensagem}
              acaoTexto={activeAviso.acao_texto}
              onAcao={() => navigate(activeAviso.acao_rota)}
            />
          </section>
        )}

        {/* Alerta de Capivaras (se não silenciado) */}
        {!capybaraDismissed && (
          <section aria-label="Alerta especial de fauna">
            <div 
              className={styles.capivaraBanner} 
              role="button" 
              tabIndex={0}
              onClick={() => navigate('/alerta-capivaras')}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  navigate('/alerta-capivaras');
                }
              }}
              aria-label="Alerta de capivaras na área. Clique para ver as 4 regras de segurança."
            >
              <div className={styles.capivaraIconBox} aria-hidden="true">
                <ShieldAlert size={24} />
              </div>
              <div className={styles.capivaraInfo}>
                <span className={styles.capivaraTag}>Alerta de fauna</span>
                <strong>Capivaras próximas ao lago</strong>
                <p>Mantenha 5m de distância e cão na coleira curta.</p>
              </div>
              <ChevronRight size={20} className={styles.arrowIcon} aria-hidden="true" />
            </div>
          </section>
        )}

        {/* Grade de Atalhos Principais */}
        <section className={styles.section} aria-label="Atalhos rápidos do parque">
          <h2 className={styles.sectionTitle}>Serviços do parque</h2>
          <div className={styles.grid}>
            {shortcuts.map((item) => {
              const Icon = item.icon;
              return (
                <Card
                  key={item.id}
                  onClick={() => navigate(item.route)}
                  ariaLabel={`${item.title}: ${item.desc}`}
                  className={styles.cardItem}
                >
                  <div className={styles.cardInner}>
                    <div className={styles.iconCircle}>
                      <Icon size={24} />
                    </div>
                    <div className={styles.cardBody}>
                      <h3 className={styles.cardTitle}>{item.title}</h3>
                      <p className={styles.cardDesc}>{item.desc}</p>
                    </div>
                    <div className={styles.cardActionRow}>
                      <span className={styles.accessText}>Acessar</span>
                      <ChevronRight size={18} aria-hidden="true" />
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>
        </section>

        {/* Resumo de Segurança e Acessibilidade */}
        <section className={styles.emergencyCard} aria-label="Informações de emergência e cuidado">
          <div className={styles.emergencyRow}>
            <span className={styles.emergencyTag}>Emergência</span>
            <p>Risco imediato ou incêndio no parque? Ligue <strong>193 (Bombeiros)</strong>.</p>
          </div>
        </section>
      </main>

      <BottomNav />
    </div>
  );
}
