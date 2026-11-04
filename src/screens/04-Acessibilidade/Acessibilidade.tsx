import { useNavigate } from 'react-router-dom';
import { 
  Accessibility, 
  Map, 
  AlertCircle, 
  Info,
  Footprints,
  Car,
  Bath,
  ArrowUpRight
} from 'lucide-react';
import StatusBadge, { type Status } from '../../components/StatusBadge/StatusBadge';
import Card from '../../components/Card/Card';
import Button from '../../components/Button/Button';
import BottomNav from '../../components/BottomNav/BottomNav';
import { useAppStore } from '../../store/app-store';
import styles from './Acessibilidade.module.css';

interface AccessItem {
  id: string;
  titulo: string;
  categoria: string;
  descricao: string;
  status: Status;
  statusDetalhe: string;
  localizacao: string;
  icone: React.ComponentType<{ size?: number; className?: string }>;
}

export default function Acessibilidade() {
  const navigate = useNavigate();
  const setReportDraft = useAppStore((state) => state.setReportDraft);

  const items: AccessItem[] = [
    {
      id: 'banheiro-pcd',
      titulo: 'Banheiro acessível (PCD)',
      categoria: 'Sanitários',
      descricao: 'Barra de apoio, porta larga (90cm) e pia rebaixada. Chave disponível no posto.',
      status: 'disponivel',
      statusDetalhe: 'Aberto e higienizado',
      localizacao: 'Ao lado da administração / entrada principal',
      icone: Bath,
    },
    {
      id: 'vagas-pcd',
      titulo: 'Vagas preferenciais',
      categoria: 'Estacionamento',
      descricao: '6 vagas demarcadas com sinalização horizontal e vertical próximas à guarita.',
      status: 'pode_lotar',
      statusDetalhe: 'Maior procura entre 17h e 19h',
      localizacao: 'Estacionamento da Entrada 1',
      icone: Car,
    },
    {
      id: 'rampa-lago',
      titulo: 'Rampa de acesso ao lago',
      categoria: 'Acesso',
      descricao: 'Inclinação suave com corrimão duplo contínuo e piso antiderrapante.',
      status: 'disponivel',
      statusDetalhe: 'Sem obstáculos no trajeto',
      localizacao: 'Trilha do Bosque até o deck',
      icone: ArrowUpRight,
    },
    {
      id: 'piso-tátil',
      titulo: 'Piso tátil direcional e de alerta',
      categoria: 'Sinalização tátil',
      descricao: 'Conexão entre a parada de ônibus, guarita e acesso ao centro de convivência.',
      status: 'precisa_atencao',
      statusDetalhe: 'Trecho com placa solta perto da quadra',
      localizacao: 'Entrada Sul / Alameda das Acácias',
      icone: Footprints,
    },
    {
      id: 'rota-acessivel',
      titulo: 'Rota acessível principal',
      categoria: 'Circulação',
      descricao: 'Pavimento em concreto liso sem degraus para cadeiras de rodas e carrinhos de bebê.',
      status: 'disponivel',
      statusDetalhe: 'Trilha desobstruída em toda a extensão',
      localizacao: 'Circuito interno do lago (2,1 km)',
      icone: Accessibility,
    },
  ];

  const handleRelatarBarreira = (item?: AccessItem) => {
    setReportDraft({
      tipo: 'Trilha danificada',
      local: item ? `${item.titulo} (${item.localizacao})` : 'Parque Ecológico de Águas Claras',
      detalhes: item ? `Barreira arquitetônica relatada em: ${item.titulo}. ` : '',
    });
    navigate('/denuncia');
  };

  return (
    <div className={styles.screenWrapper}>
      <header className={styles.header}>
        <div className={styles.headerTitleGroup}>
          <Accessibility size={26} className={styles.headerIcon} aria-hidden="true" />
          <h1 className={styles.title}>Acessibilidade</h1>
        </div>
        <p className={styles.subtitle}>
          Rotas, sanitários e estruturas com foco em inclusão e autonomia de todos.
        </p>
      </header>

      <main className={styles.mainContent} role="main" aria-label="Recursos de acessibilidade no parque">
        {/* Banner Informativo */}
        <section className={styles.infoBox} aria-label="Compromisso de acessibilidade">
          <Info size={20} className={styles.infoIcon} aria-hidden="true" />
          <p className={styles.infoText}>
            Encontrou calçada obstruída, piso tátil danificado ou banheiro trancado? Você pode relatar anonimamente.
          </p>
        </section>

        {/* Lista de Recursos com Status */}
        <section className={styles.listSection} aria-label="Instalações e rotas acessíveis">
          <div className={styles.cardsGrid}>
            {items.map((item) => {
              const Icon = item.icone;
              return (
                <Card
                  key={item.id}
                  className={styles.accessCard}
                  ariaLabel={`${item.titulo}: ${item.statusDetalhe}`}
                >
                  <div className={styles.cardHeader}>
                    <div className={styles.itemTitleArea}>
                      <div className={styles.iconBox} aria-hidden="true">
                        <Icon size={22} />
                      </div>
                      <div>
                        <span className={styles.categoryTag}>{item.categoria}</span>
                        <h2 className={styles.cardHeading}>{item.titulo}</h2>
                      </div>
                    </div>
                    <StatusBadge status={item.status} />
                  </div>

                  <p className={styles.itemDescription}>{item.descricao}</p>

                  <div className={styles.statusNote}>
                    <strong>Condição atual:</strong> {item.statusDetalhe}
                  </div>

                  <div className={styles.cardActions}>
                    <Button
                      variant="outline"
                      size="sm"
                      icon={<Map size={16} />}
                      onClick={() => navigate('/mapa')}
                      ariaLabel={`Ver ${item.titulo} no mapa`}
                    >
                      Ver no mapa
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleRelatarBarreira(item)}
                      ariaLabel={`Relatar problema com ${item.titulo}`}
                    >
                      Relatar barreira
                    </Button>
                  </div>
                </Card>
              );
            })}
          </div>
        </section>

        {/* Botão em destaque de Relatar Barreira */}
        <section className={styles.reportBarrierSection} aria-label="Ação rápida de cidadania">
          <div className={styles.barrierCta}>
            <div className={styles.barrierIcon} aria-hidden="true">
              <AlertCircle size={28} />
            </div>
            <div className={styles.barrierText}>
              <strong>Identificou outra barreira de acessibilidade?</strong>
              <p>Envie fotos e descrição sem precisar se cadastrar.</p>
            </div>
          </div>
          <Button
            variant="primary"
            size="lg"
            fullWidth
            onClick={() => handleRelatarBarreira()}
            ariaLabel="Relatar uma nova barreira de acessibilidade"
          >
            Relatar uma barreira
          </Button>
        </section>
      </main>

      <BottomNav />
    </div>
  );
}
