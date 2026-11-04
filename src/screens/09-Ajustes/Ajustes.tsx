import { useNavigate } from 'react-router-dom';
import { 
  Settings, 
  Contrast, 
  Type, 
  ZapOff, 
  BatteryLow, 
  UserCheck,
  Clock, 
  ShieldCheck
} from 'lucide-react';
import { useAppStore } from '../../store/app-store';
import StatusBadge from '../../components/StatusBadge/StatusBadge';
import Card from '../../components/Card/Card';
import Button from '../../components/Button/Button';
import BottomNav from '../../components/BottomNav/BottomNav';
import styles from './Ajustes.module.css';

export default function Ajustes() {
  const navigate = useNavigate();
  const theme = useAppStore((state) => state.theme);
  const setTheme = useAppStore((state) => state.setTheme);
  const textSize = useAppStore((state) => state.textSize);
  const setTextSize = useAppStore((state) => state.setTextSize);
  const reduceMotion = useAppStore((state) => state.reduceMotion);
  const setReduceMotion = useAppStore((state) => state.setReduceMotion);
  const economyMode = useAppStore((state) => state.economyMode);
  const setEconomyMode = useAppStore((state) => state.setEconomyMode);
  const denuncias = useAppStore((state) => state.denuncias);

  const isHighContrast = theme === 'high-contrast';
  const isLargeText = textSize === 'large';

  const toggleContrast = () => {
    setTheme(isHighContrast ? 'default' : 'high-contrast');
  };

  const toggleTextSize = () => {
    setTextSize(isLargeText ? 'default' : 'large');
  };

  const toggleReduceMotion = () => {
    setReduceMotion(!reduceMotion);
  };

  const toggleEconomy = () => {
    setEconomyMode(!economyMode);
  };

  return (
    <div className={styles.screenWrapper}>
      <header className={styles.header}>
        <div className={styles.headerTitleGroup}>
          <Settings size={26} className={styles.headerIcon} aria-hidden="true" />
          <h1 className={styles.title}>Ajustes e Acessibilidade</h1>
        </div>
        <p className={styles.subtitle}>
          Personalize a legibilidade e veja o histórico das suas denúncias anônimas.
        </p>
      </header>

      <main className={styles.mainContent} role="main" aria-label="Ajustes de acessibilidade do app">
        {/* Seção de Controles de Acessibilidade */}
        <section className={styles.settingsSection} aria-label="Opções visuais e de interação">
          <h2 className={styles.sectionHeading}>Visão e navegação</h2>

          <div className={styles.settingsList}>
            {/* 1. Alto Contraste */}
            <div className={styles.settingItem}>
              <div className={styles.settingInfo}>
                <div className={styles.settingIconBox} aria-hidden="true">
                  <Contrast size={22} />
                </div>
                <div>
                  <strong className={styles.settingTitle}>Alto contraste (preto e amarelo)</strong>
                  <p className={styles.settingDesc}>
                    Fundo 100% preto com texto e bordas em amarelo de alto contraste (≥ 7:1) para luz solar forte.
                  </p>
                </div>
              </div>
              <button
                type="button"
                role="switch"
                aria-checked={isHighContrast}
                className={`${styles.toggleSwitch} ${isHighContrast ? styles.toggleOn : ''}`}
                onClick={toggleContrast}
                aria-label="Ativar modo de alto contraste preto e amarelo"
              >
                <span className={styles.toggleThumb} />
              </button>
            </div>

            {/* 2. Texto Maior */}
            <div className={styles.settingItem}>
              <div className={styles.settingInfo}>
                <div className={styles.settingIconBox} aria-hidden="true">
                  <Type size={22} />
                </div>
                <div>
                  <strong className={styles.settingTitle}>Texto maior (+30%)</strong>
                  <p className={styles.settingDesc}>
                    Aumenta títulos e corpos de texto mantendo o espaçamento sem quebras.
                  </p>
                </div>
              </div>
              <button
                type="button"
                role="switch"
                aria-checked={isLargeText}
                className={`${styles.toggleSwitch} ${isLargeText ? styles.toggleOn : ''}`}
                onClick={toggleTextSize}
                aria-label="Ativar modo de texto maior"
              >
                <span className={styles.toggleThumb} />
              </button>
            </div>

            {/* 3. Reduzir Animações */}
            <div className={styles.settingItem}>
              <div className={styles.settingInfo}>
                <div className={styles.settingIconBox} aria-hidden="true">
                  <ZapOff size={22} />
                </div>
                <div>
                  <strong className={styles.settingTitle}>Reduzir animações e transições</strong>
                  <p className={styles.settingDesc}>
                    Evita movimentos rápidos na tela para reduzir fadiga visual e labirintite.
                  </p>
                </div>
              </div>
              <button
                type="button"
                role="switch"
                aria-checked={reduceMotion}
                className={`${styles.toggleSwitch} ${reduceMotion ? styles.toggleOn : ''}`}
                onClick={toggleReduceMotion}
                aria-label="Ativar redução de animações"
              >
                <span className={styles.toggleThumb} />
              </button>
            </div>

            {/* 4. Modo Econômico */}
            <div className={styles.settingItem}>
              <div className={styles.settingInfo}>
                <div className={styles.settingIconBox} aria-hidden="true">
                  <BatteryLow size={22} />
                </div>
                <div>
                  <strong className={styles.settingTitle}>Modo economia de bateria / offline</strong>
                  <p className={styles.settingDesc}>
                    Bloqueia requisições secundárias e força leitura apenas do cache local do aparelho.
                  </p>
                </div>
              </div>
              <button
                type="button"
                role="switch"
                aria-checked={economyMode}
                className={`${styles.toggleSwitch} ${economyMode ? styles.toggleOn : ''}`}
                onClick={toggleEconomy}
                aria-label="Ativar modo de economia de bateria"
              >
                <span className={styles.toggleThumb} />
              </button>
            </div>

            {/* 5. Uso Sem Cadastro (Sempre Ativo) */}
            <div className={styles.settingItem}>
              <div className={styles.settingInfo}>
                <div className={styles.settingIconBox} aria-hidden="true">
                  <UserCheck size={22} />
                </div>
                <div>
                  <strong className={styles.settingTitle}>Uso sem cadastro (Ativo)</strong>
                  <p className={styles.settingDesc}>
                    Este aplicativo não possui tela de login, cadastro nem rastreamento de dados pessoais.
                  </p>
                </div>
              </div>
              <span className={styles.alwaysOnBadge} aria-label="Recurso permanente">
                Sempre ligado
              </span>
            </div>
          </div>
        </section>

        {/* Prévia ao Vivo */}
        <section className={styles.previewSection} aria-label="Prévia visual do tema atual">
          <h2 className={styles.sectionHeading}>Prévia ao vivo do tema</h2>
          <Card className={styles.previewCard}>
            <div className={styles.previewHeader}>
              <span className={styles.previewChip}>Exemplo de cartão</span>
              <StatusBadge status="disponivel" />
            </div>
            <h3 className={styles.previewTitle}>Trilha do Bosque — Trecho Pavimentado</h3>
            <p className={styles.previewText}>
              Assim é como os textos e botões são exibidos com suas configurações atuais de contraste e tamanho.
            </p>
            <div className={styles.previewActions}>
              <Button variant="primary" size="sm">Botão Principal</Button>
              <Button variant="outline" size="sm">Botão Secundário</Button>
            </div>
          </Card>
        </section>

        {/* Minhas Denúncias Salvas Localmente */}
        <section className={styles.reportsSection} aria-label="Histórico local de denúncias">
          <div className={styles.reportsHeader}>
            <h2 className={styles.sectionHeading}>Minhas denúncias ({denuncias.length})</h2>
            <span className={styles.reportsSub}>Salvas somente neste aparelho</span>
          </div>

          {denuncias.length === 0 ? (
            <div className={styles.emptyReportsBox}>
              <ShieldCheck size={32} className={styles.emptyIcon} aria-hidden="true" />
              <strong>Nenhuma denúncia feita ainda</strong>
              <p>Quando você relatar lixeira cheia ou barreira, o protocolo aparecerá aqui.</p>
              <Button
                variant="outline"
                size="sm"
                onClick={() => navigate('/denuncia')}
                ariaLabel="Criar primeira denúncia"
              >
                Fazer uma denúncia
              </Button>
            </div>
          ) : (
            <div className={styles.reportsGrid}>
              {denuncias.map((d) => (
                <Card key={d.id} className={styles.reportHistoryCard}>
                  <div className={styles.reportHistHeader}>
                    <div>
                      <strong className={styles.reportProtocol}>{d.protocolo}</strong>
                      <span className={styles.reportDate}>
                        {new Date(d.criadaEm).toLocaleDateString('pt-BR')} • {d.tipo}
                      </span>
                    </div>
                    <span className={styles.statusChipRecebida}>
                      <Clock size={12} aria-hidden="true" />
                      Recebida
                    </span>
                  </div>
                  <p className={styles.reportLocalText}>
                    <strong>Local:</strong> {d.local}
                  </p>
                  <p className={styles.reportDetailText}>
                    {d.detalhes}
                  </p>
                </Card>
              ))}
            </div>
          )}
        </section>
      </main>

      <BottomNav />
    </div>
  );
}
