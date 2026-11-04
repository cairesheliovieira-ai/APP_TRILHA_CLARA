import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  AlertTriangle, 
  Trash2, 
  Flame, 
  HelpCircle, 
  MapPin, 
  Phone, 
  LocateFixed,
  PawPrint,
  Route
} from 'lucide-react';
import { useAppStore } from '../../store/app-store';
import Button from '../../components/Button/Button';
import BottomNav from '../../components/BottomNav/BottomNav';
import styles from './DenunciaPasso1.module.css';

interface TipoOption {
  id: string;
  label: string;
  desc: string;
  icon: React.ComponentType<{ size?: number; className?: string }>;
}

const tipos: TipoOption[] = [
  { id: 'Lixo no chão', label: 'Lixo espalhado', desc: 'Resíduos deixados fora da lixeira ou na mata', icon: Trash2 },
  { id: 'Lixeira cheia', label: 'Lixeira cheia / danificada', desc: 'Transbordando ou quebrada', icon: AlertTriangle },
  { id: 'Animal em risco', label: 'Animal em risco / ferido', desc: 'Capivara, ave ou réptil precisando de socorro', icon: PawPrint },
  { id: 'Queimada ou fogo', label: 'Fogo ou fumaça', desc: 'Foco de incêndio na vegetação', icon: Flame },
  { id: 'Trilha danificada', label: 'Trilha ou barreira', desc: 'Buraco, calçada quebrada ou piso tátil danificado', icon: Route },
  { id: 'Outro', label: 'Outro problema', desc: 'Vandalismo, iluminação apagada, etc.', icon: HelpCircle },
];

export default function DenunciaPasso1() {
  const navigate = useNavigate();
  const draft = useAppStore((state) => state.reportDraft);
  const setReportDraft = useAppStore((state) => state.setReportDraft);

  const [tipo, setTipo] = useState<string>(draft?.tipo || '');
  const [local, setLocal] = useState<string>(draft?.local || '');
  const [coordenadas, setCoordenadas] = useState<{ lat: number; lng: number } | undefined>(
    draft?.coordenadas
  );
  const [locLoading, setLocLoading] = useState(false);
  const [locStatus, setLocStatus] = useState<string | null>(null);

  useEffect(() => {
    if (draft?.tipo && !tipo) setTipo(draft.tipo);
    if (draft?.local && !local) setLocal(draft.local);
  }, [draft]);

  const handleUseLocation = () => {
    if (!navigator.geolocation) {
      setLocStatus('Geolocalização não suportada no seu navegador.');
      return;
    }

    setLocLoading(true);
    setLocStatus('Obtendo sinal GPS...');

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const lat = pos.coords.latitude;
        const lng = pos.coords.longitude;
        setCoordenadas({ lat, lng });
        const gpsText = `GPS: ${lat.toFixed(5)}, ${lng.toFixed(5)} (Próximo à sua posição)`;
        setLocal(gpsText);
        setLocLoading(false);
        setLocStatus('Localização obtida com sucesso.');
      },
      (err) => {
        setLocLoading(false);
        setLocStatus(`Não foi possível obter GPS (${err.message}). Digite o local manualmente.`);
      },
      { timeout: 10000, enableHighAccuracy: true }
    );
  };

  const handleContinue = () => {
    if (!tipo || !local.trim()) return;

    setReportDraft({
      ...draft,
      tipo,
      local: local.trim(),
      usarLocalizacao: Boolean(coordenadas),
      coordenadas,
    });

    navigate('/denuncia/detalhes');
  };

  const isFormValid = Boolean(tipo && local.trim());

  return (
    <div className={styles.screenWrapper}>
      <header className={styles.header}>
        <div className={styles.headerTitleGroup}>
          <AlertTriangle size={26} className={styles.headerIcon} aria-hidden="true" />
          <div>
            <h1 className={styles.title}>Fazer denúncia</h1>
            <span className={styles.stepBadge}>Passo 1 de 2 • Tipo e local</span>
          </div>
        </div>

        {/* Barra de Progresso Acessível */}
        <div 
          className={styles.progressBar} 
          role="progressbar" 
          aria-valuenow={50} 
          aria-valuemin={0} 
          aria-valuemax={100}
          aria-label="Progresso da denúncia: 50%"
        >
          <div className={styles.progressFill} style={{ width: '50%' }} />
        </div>
      </header>

      <main className={styles.mainContent} role="main" aria-label="Formulário de denúncia - Passo 1">
        {/* Banner de Risco Imediato */}
        <div className={styles.urgentBanner} role="alert">
          <div className={styles.urgentIcon} aria-hidden="true">
            <Phone size={22} />
          </div>
          <div className={styles.urgentText}>
            <strong>Risco imediato à vida ou fogo ativo?</strong>
            <p>Não espere o app. Ligue imediatamente para <strong>193 (Corpo de Bombeiros)</strong>.</p>
          </div>
        </div>

        {/* Seleção do Tipo */}
        <fieldset className={styles.fieldset}>
          <legend className={styles.fieldLegend}>
            1. Qual é o tipo de ocorrência? <span className={styles.required}>*</span>
          </legend>

          <div className={styles.typesGrid} role="radiogroup" aria-label="Tipos de ocorrência">
            {tipos.map((item) => {
              const Icon = item.icon;
              const isSelected = tipo === item.id;
              return (
                <div
                  key={item.id}
                  role="radio"
                  aria-checked={isSelected}
                  tabIndex={0}
                  className={`${styles.typeCard} ${isSelected ? styles.typeSelected : ''}`}
                  onClick={() => setTipo(item.id)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      setTipo(item.id);
                    }
                  }}
                >
                  <div className={styles.typeIconBox} aria-hidden="true">
                    <Icon size={22} />
                  </div>
                  <div className={styles.typeContent}>
                    <strong className={styles.typeTitle}>{item.label}</strong>
                    <span className={styles.typeDesc}>{item.desc}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </fieldset>

        {/* Campo Localização */}
        <div className={styles.inputGroup}>
          <label htmlFor="local-input" className={styles.label}>
            2. Onde está o problema no parque? <span className={styles.required}>*</span>
          </label>
          <p className={styles.inputHelp}>
            Ex.: Próximo à ponte de madeira do lago, ao lado da lixeira verde, ou use o GPS.
          </p>

          <div className={styles.locationControls}>
            <input
              id="local-input"
              type="text"
              className={styles.textInput}
              placeholder="Descreva o local de referência..."
              value={local}
              onChange={(e) => setLocal(e.target.value)}
              required
            />

            <Button
              variant="outline"
              size="md"
              icon={<LocateFixed size={18} />}
              onClick={handleUseLocation}
              disabled={locLoading}
              ariaLabel="Usar minha localização GPS atual"
            >
              {locLoading ? 'Obtendo GPS...' : 'Usar minha localização'}
            </Button>
          </div>

          {locStatus && (
            <div className={styles.locStatusMsg} role="status">
              <MapPin size={16} aria-hidden="true" />
              <span>{locStatus}</span>
            </div>
          )}
        </div>

        {/* Botão Avançar */}
        <div className={styles.footerActions}>
          <Button
            variant="primary"
            size="lg"
            fullWidth
            onClick={handleContinue}
            disabled={!isFormValid}
            ariaLabel="Continuar para o passo 2 de detalhes"
          >
            Continuar para detalhes (Passo 2)
          </Button>
          <p className={styles.privacyNote}>
            Nenhuma informação pessoal é solicitada ou gravada.
          </p>
        </div>
      </main>

      <BottomNav />
    </div>
  );
}
