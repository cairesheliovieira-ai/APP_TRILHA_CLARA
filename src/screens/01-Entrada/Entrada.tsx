import { useNavigate } from 'react-router-dom';
import { Trees, ShieldCheck, WifiOff, Eye } from 'lucide-react';
import { useAppStore } from '../../store/app-store';
import Button from '../../components/Button/Button';
import styles from './Entrada.module.css';

export default function Entrada() {
  const navigate = useNavigate();
  const setHasEntered = useAppStore((state) => state.setHasEntered);

  const handleEntrar = () => {
    setHasEntered(true);
    navigate('/inicio');
  };

  return (
    <main className={styles.container} role="main" aria-label="Boas-vindas ao Trilha Clara">
      <div className={styles.content}>
        <div className={styles.header}>
          <div className={styles.iconCircle} aria-hidden="true">
            <Trees size={44} className={styles.heroIcon} />
          </div>
          <h1 className={styles.title}>Trilha Clara</h1>
          <p className={styles.subtitle}>
            Um parque limpo, seguro e para todos
          </p>
          <span className={styles.badgeParque}>Parque Ecológico de Águas Claras</span>
        </div>

        <section className={styles.benefitsSection} aria-label="Benefícios do aplicativo">
          <div className={styles.benefitItem}>
            <div className={styles.benefitIconWrapper} aria-hidden="true">
              <ShieldCheck size={24} />
            </div>
            <div className={styles.benefitText}>
              <strong>Sem cadastro e sem login</strong>
              <p>Abra e use direto. Denúncias podem ser feitas de forma 100% anônima.</p>
            </div>
          </div>

          <div className={styles.benefitItem}>
            <div className={styles.benefitIconWrapper} aria-hidden="true">
              <WifiOff size={24} />
            </div>
            <div className={styles.benefitText}>
              <strong>Funciona sem internet (offline)</strong>
              <p>Mapa esquemático, guia de descarte, fauna e rotas acessíveis salvos no seu aparelho.</p>
            </div>
          </div>

          <div className={styles.benefitItem}>
            <div className={styles.benefitIconWrapper} aria-hidden="true">
              <Eye size={24} />
            </div>
            <div className={styles.benefitText}>
              <strong>Acessibilidade em primeiro lugar</strong>
              <p>Alto contraste preto e amarelo, texto ampliado até 200% e total compatibilidade com leitores de tela.</p>
            </div>
          </div>
        </section>

        <div className={styles.actions}>
          <Button
            variant="primary"
            size="lg"
            fullWidth
            onClick={handleEntrar}
            ariaLabel="Entrar no parque e abrir o guia Trilha Clara"
          >
            Entrar no parque
          </Button>
          <p className={styles.disclaimer}>
            Sem cadastro. Funciona com leitor de tela (TalkBack / VoiceOver).
          </p>
        </div>
      </div>
    </main>
  );
}
