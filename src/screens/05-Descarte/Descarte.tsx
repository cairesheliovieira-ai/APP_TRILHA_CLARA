import { useNavigate } from 'react-router-dom';
import { 
  Trash2, 
  Check, 
  X, 
  MapPin, 
  AlertTriangle, 
  Luggage
} from 'lucide-react';
import { useResiduos } from '../../hooks/useOfflineData';
import { useAppStore } from '../../store/app-store';
import Button from '../../components/Button/Button';
import BottomNav from '../../components/BottomNav/BottomNav';
import styles from './Descarte.module.css';

export default function Descarte() {
  const navigate = useNavigate();
  const { data: residuosData } = useResiduos();
  const activeWasteColor = useAppStore((state) => state.activeWasteColor);
  const setActiveWasteColor = useAppStore((state) => state.setActiveWasteColor);
  const setReportDraft = useAppStore((state) => state.setReportDraft);

  const categorias = residuosData?.categorias || [];
  const currentCategory = categorias.find((c) => c.cor === activeWasteColor) || categorias[0];

  const handleDenunciarLixeira = () => {
    setReportDraft({
      tipo: 'Lixeira cheia',
      local: 'Próximo à trilha ou ponto de coleta',
      detalhes: 'Lixeira necessitando de recolhimento ou manutenção.',
    });
    navigate('/denuncia');
  };

  return (
    <div className={styles.screenWrapper}>
      <header className={styles.header}>
        <div className={styles.headerTitleGroup}>
          <Trash2 size={26} className={styles.headerIcon} aria-hidden="true" />
          <h1 className={styles.title}>Descarte correto</h1>
        </div>
        <p className={styles.subtitle}>
          Selecione a cor da lixeira para ver o que vai e o que não vai.
        </p>

        {/* Seletor horizontal das 6 cores */}
        <div className={styles.colorSelector} role="tablist" aria-label="Cores de descarte">
          {categorias.map((cat) => {
            const isSelected = cat.cor === (currentCategory?.cor || 'azul');
            return (
              <button
                key={cat.cor}
                type="button"
                role="tab"
                aria-selected={isSelected}
                className={`${styles.colorChip} ${isSelected ? styles.activeChip : ''}`}
                onClick={() => setActiveWasteColor(cat.cor)}
                aria-label={`Lixeira ${cat.cor}, ${cat.material}`}
              >
                <span
                  className={styles.colorDot}
                  style={{ backgroundColor: `var(--color-lixeira-${cat.cor})` }}
                  aria-hidden="true"
                />
                <span className={styles.chipText}>{cat.material}</span>
              </button>
            );
          })}
        </div>
      </header>

      <main className={styles.mainContent} role="main" aria-label="Detalhes de descarte selecionado">
        {currentCategory && (
          <section
            className={styles.activeWasteBox}
            aria-label={`Instruções para ${currentCategory.material}`}
          >
            {/* Cabeçalho da Cor Selecionada */}
            <div className={styles.categoryBanner}>
              <div
                className={styles.categoryIndicator}
                style={{ backgroundColor: `var(--color-lixeira-${currentCategory.cor})` }}
                aria-hidden="true"
              />
              <div>
                <h2 className={styles.categoryTitle}>
                  Lixeira {currentCategory.cor.toUpperCase()} — {currentCategory.material}
                </h2>
                <span className={styles.standardLabel}>Padrão CONAMA de separação</span>
              </div>
            </div>

            {/* Painel Vai e Não Vai */}
            <div className={styles.listsGrid}>
              {/* O que VAI */}
              <div className={styles.cardVai}>
                <div className={styles.cardHeaderVai}>
                  <div className={styles.badgeVaiIcon} aria-hidden="true">
                    <Check size={18} />
                  </div>
                  <h3 className={styles.listHeadingVai}>VAI (Pode descartar)</h3>
                </div>
                <ul className={styles.itemsList}>
                  {currentCategory.vai.map((item, i) => (
                    <li key={i} className={styles.itemRow}>
                      <Check size={16} className={styles.checkIcon} aria-hidden="true" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* O que NÃO VAI */}
              <div className={styles.cardNaoVai}>
                <div className={styles.cardHeaderNaoVai}>
                  <div className={styles.badgeNaoVaiIcon} aria-hidden="true">
                    <X size={18} />
                  </div>
                  <h3 className={styles.listHeadingNaoVai}>NÃO VAI (Evite aqui)</h3>
                </div>
                <ul className={styles.itemsList}>
                  {currentCategory.nao_vai.map((item, i) => (
                    <li key={i} className={styles.itemRow}>
                      <X size={16} className={styles.xIcon} aria-hidden="true" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </section>
        )}

        {/* Dica da Mochila */}
        <section className={styles.tipBox} aria-label="Dica de cuidado com o parque">
          <div className={styles.tipIconBox} aria-hidden="true">
            <Luggage size={24} />
          </div>
          <div className={styles.tipBody}>
            <strong>Não achou lixeira perto? Guarde na mochila!</strong>
            <p>
              O lixo abandonado no parque atrai pragas e intoxica capivaras e aves nativas. Descarte no posto de coleta mais próximo.
            </p>
          </div>
        </section>

        {/* Atalhos Rápidos */}
        <section className={styles.actionsSection} aria-label="Ações relacionadas a resíduos">
          <Button
            variant="outline"
            fullWidth
            icon={<MapPin size={18} />}
            onClick={() => navigate('/mapa')}
            ariaLabel="Ver pontos de coleta seletiva e lixeiras no mapa"
          >
            Ver pontos de coleta no mapa
          </Button>

          <Button
            variant="secondary"
            fullWidth
            icon={<AlertTriangle size={18} />}
            onClick={handleDenunciarLixeira}
            ariaLabel="Denunciar lixeira cheia, danificada ou faltando"
          >
            Denunciar lixeira cheia ou faltando
          </Button>
        </section>
      </main>

      <BottomNav />
    </div>
  );
}
