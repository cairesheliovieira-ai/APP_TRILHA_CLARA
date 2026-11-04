import { useNavigate } from 'react-router-dom';
import { 
  ShieldAlert, 
  Ban, 
  Hand, 
  Ruler, 
  Dog, 
  Check, 
  PawPrint,
  X
} from 'lucide-react';
import { useAppStore } from '../../store/app-store';
import Button from '../../components/Button/Button';
import styles from './AlertaCapivaras.module.css';

export default function AlertaCapivaras() {
  const navigate = useNavigate();
  const setCapybaraAlertDismissed = useAppStore((state) => state.setCapybaraAlertDismissed);

  const handleEntendi = () => {
    setCapybaraAlertDismissed(true);
    navigate(-1);
  };

  const handleConhecer = () => {
    setCapybaraAlertDismissed(true);
    navigate('/fauna');
  };

  const regras = [
    {
      num: 1,
      titulo: 'Não alimentar os animais',
      desc: 'Comida humana como pão e biscoito adoece as capivaras e desequilibra a dieta natural.',
      icon: Ban,
    },
    {
      num: 2,
      titulo: 'Não tocar nem fazer selfies encostando',
      desc: 'São animais silvestres protegidos. Podem reagir agressivamente para proteger filhotes.',
      icon: Hand,
    },
    {
      num: 3,
      titulo: 'Mantenha pelo menos 5 metros de distância',
      desc: 'Permita que o bando se desloque livremente até a água sem se sentir encurralado.',
      icon: Ruler,
    },
    {
      num: 4,
      titulo: 'Cão sempre na coleira curta',
      desc: 'Cães soltos provocam estresse extremo na fauna e podem sofrer mordidas graves.',
      icon: Dog,
    },
  ];

  return (
    <div 
      className={styles.overlay} 
      role="region" 
      aria-label="Aviso de segurança: Capivaras do Parque Ecológico de Águas Claras"
    >
      <div className={styles.modalCard}>
        {/* Fechar */}
        <button
          type="button"
          className={styles.closeBtn}
          onClick={handleEntendi}
          aria-label="Fechar aviso de capivaras"
        >
          <X size={24} />
        </button>

        {/* Cabeçalho */}
        <div className={styles.header}>
          <div className={styles.iconCircle} aria-hidden="true">
            <ShieldAlert size={40} className={styles.alertIcon} />
          </div>
          <span className={styles.warningTag}>Fauna Silvestre do Parque</span>
          <h1 className={styles.title}>Alerta: Capivaras na Trilha</h1>
          <p className={styles.subtitle}>
            Você está no habitat natural das capivaras (Hydrochoerus hydrochaeris). Siga as 4 regras de ouro para um passeio seguro:
          </p>
        </div>

        {/* 4 Regras */}
        <div className={styles.rulesList}>
          {regras.map((r) => {
            const Icon = r.icon;
            return (
              <div key={r.num} className={styles.ruleCard}>
                <div className={styles.ruleIconBox} aria-hidden="true">
                  <Icon size={22} />
                </div>
                <div className={styles.ruleText}>
                  <strong className={styles.ruleTitle}>
                    {r.num}. {r.titulo}
                  </strong>
                  <p className={styles.ruleDesc}>{r.desc}</p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Fonte */}
        <p className={styles.sourceText}>
          Fonte: Brasília Ambiental (a conferir) • Lei de Proteção à Fauna nº 5.197/67
        </p>

        {/* Botões */}
        <div className={styles.actions}>
          <Button
            variant="primary"
            size="lg"
            fullWidth
            icon={<Check size={20} />}
            onClick={handleEntendi}
            ariaLabel="Entendi as regras de segurança com as capivaras"
          >
            Entendi, vou respeitar
          </Button>

          <Button
            variant="outline"
            size="md"
            fullWidth
            icon={<PawPrint size={18} />}
            onClick={handleConhecer}
            ariaLabel="Conhecer as capivaras e outros animais na ficha de fauna"
          >
            Conhecer os animais do parque
          </Button>
        </div>
      </div>
    </div>
  );
}
