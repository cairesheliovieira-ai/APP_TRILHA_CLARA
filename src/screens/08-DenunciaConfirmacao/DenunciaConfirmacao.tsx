import { useNavigate } from 'react-router-dom';
import { 
  CheckCircle2, 
  Clock, 
  Check, 
  ShieldCheck, 
  Copy,
  Plus
} from 'lucide-react';
import { useAppStore } from '../../store/app-store';
import Button from '../../components/Button/Button';
import BottomNav from '../../components/BottomNav/BottomNav';
import styles from './DenunciaConfirmacao.module.css';

export default function DenunciaConfirmacao() {
  const navigate = useNavigate();
  const denuncias = useAppStore((state) => state.denuncias);
  const lastDenuncia = denuncias[denuncias.length - 1];

  const protocolo = lastDenuncia?.protocolo || 'TC-20261103-DEMO';

  const handleCopyProtocol = () => {
    navigator.clipboard?.writeText(protocolo);
    alert(`Protocolo ${protocolo} copiado para a área de transferência!`);
  };

  return (
    <div className={styles.screenWrapper}>
      <main className={styles.mainContent} role="main" aria-label="Confirmação e protocolo da denúncia">
        {/* Ícone e Título de Sucesso */}
        <div className={styles.successHeader}>
          <div className={styles.iconCircle} aria-hidden="true">
            <CheckCircle2 size={48} className={styles.checkIcon} />
          </div>
          <h1 className={styles.title}>Denúncia enviada!</h1>
          <p className={styles.subtitle}>
            Sua contribuição ajuda a manter o Parque Ecológico de Águas Claras bem cuidado e seguro.
          </p>
        </div>

        {/* Card do Protocolo */}
        <div className={styles.protocolCard} aria-label={`Protocolo oficial: ${protocolo}`}>
          <span className={styles.protocolLabel}>Número de Protocolo</span>
          <div className={styles.protocolRow}>
            <span className={styles.protocolCode}>{protocolo}</span>
            <button
              type="button"
              className={styles.copyBtn}
              onClick={handleCopyProtocol}
              aria-label="Copiar número do protocolo"
            >
              <Copy size={18} />
              <span>Copiar</span>
            </button>
          </div>
          <div className={styles.anonStatus}>
            <ShieldCheck size={16} aria-hidden="true" />
            <span>Denúncia registrada de forma anônima e segura</span>
          </div>
        </div>

        {/* Linha do Tempo (Recebida -> Em Análise -> Resolvida) */}
        <section className={styles.timelineSection} aria-label="Linha do tempo do atendimento">
          <h2 className={styles.timelineTitle}>Linha de acompanhamento</h2>

          <ol className={styles.timelineList}>
            {/* Etapa 1 */}
            <li className={`${styles.timelineStep} ${styles.stepDone}`}>
              <div className={styles.stepMarker}>
                <Check size={14} aria-hidden="true" />
              </div>
              <div className={styles.stepContent}>
                <strong className={styles.stepName}>1. Recebida</strong>
                <span className={styles.stepDesc}>Registrada no sistema local de zeladoria</span>
                <span className={styles.stepDate}>Hoje, {new Date().toLocaleTimeString().slice(0, 5)}</span>
              </div>
            </li>

            {/* Etapa 2 */}
            <li className={`${styles.timelineStep} ${styles.stepCurrent}`}>
              <div className={styles.stepMarker}>
                <Clock size={14} aria-hidden="true" />
              </div>
              <div className={styles.stepContent}>
                <strong className={styles.stepName}>2. Em análise</strong>
                <span className={styles.stepDesc}>Encaminhada para triagem e vistoria de campo</span>
                <span className={styles.stepDate}>Aguardando vistoria</span>
              </div>
            </li>

            {/* Etapa 3 */}
            <li className={styles.timelineStep}>
              <div className={styles.stepMarker}>
                <span className={styles.stepNumber}>3</span>
              </div>
              <div className={styles.stepContent}>
                <strong className={styles.stepName}>3. Resolvida</strong>
                <span className={styles.stepDesc}>Serviço ou reparo executado pela equipe</span>
                <span className={styles.stepDate}>Previsão: 2 a 5 dias úteis</span>
              </div>
            </li>
          </ol>
        </section>

        {/* Detalhes do envio */}
        {lastDenuncia && (
          <div className={styles.detailsBox}>
            <h3 className={styles.detailsTitle}>Resumo do relato</h3>
            <p><strong>Tipo:</strong> {lastDenuncia.tipo}</p>
            <p><strong>Local:</strong> {lastDenuncia.local}</p>
            <p><strong>Detalhes:</strong> {lastDenuncia.detalhes}</p>
          </div>
        )}

        {/* Ações */}
        <div className={styles.actions}>
          <Button
            variant="primary"
            size="lg"
            fullWidth
            onClick={() => navigate('/inicio')}
            ariaLabel="Voltar para a página inicial"
          >
            Voltar ao início
          </Button>

          <Button
            variant="outline"
            size="md"
            fullWidth
            icon={<Plus size={18} />}
            onClick={() => navigate('/denuncia')}
            ariaLabel="Fazer uma nova denúncia"
          >
            Fazer outra denúncia
          </Button>
        </div>
      </main>

      <BottomNav />
    </div>
  );
}
