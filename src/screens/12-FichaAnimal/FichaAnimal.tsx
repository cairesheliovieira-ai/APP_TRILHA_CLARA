import { useParams, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  Utensils, 
  Sparkles, 
  ShieldAlert, 
  Globe2, 
  Info
} from 'lucide-react';
import { useFauna } from '../../hooks/useOfflineData';
import Card from '../../components/Card/Card';
import Button from '../../components/Button/Button';
import BottomNav from '../../components/BottomNav/BottomNav';
import styles from './FichaAnimal.module.css';

export default function FichaAnimal() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { data: faunaData, loading } = useFauna();

  const animal = faunaData?.animais?.find((a) => a.id === id);

  const getEmojiCategory = (categoria?: string) => {
    switch (categoria?.toLowerCase()) {
      case 'mamiferos': return '🦫';
      case 'aves': return '🐦';
      case 'repteis': return '🦎';
      default: return '🐾';
    }
  };

  if (loading) {
    return (
      <div className={styles.screenWrapper}>
        <div className={styles.loadingBox}>Carregando informações da espécie...</div>
        <BottomNav />
      </div>
    );
  }

  if (!animal) {
    return (
      <div className={styles.screenWrapper}>
        <div className={styles.notFoundBox}>
          <h2>Espécie não encontrada</h2>
          <p>O animal solicitado não está no catálogo local do parque.</p>
          <Button variant="primary" onClick={() => navigate('/fauna')}>
            Voltar para Fauna
          </Button>
        </div>
        <BottomNav />
      </div>
    );
  }

  return (
    <div className={styles.screenWrapper}>
      {/* Barra Superior */}
      <header className={styles.header}>
        <button
          type="button"
          className={styles.backButton}
          onClick={() => navigate('/fauna')}
          aria-label="Voltar para a lista de animais"
        >
          <ArrowLeft size={22} />
          <span>Fauna</span>
        </button>
      </header>

      <main className={styles.mainContent} role="main" aria-label={`Ficha técnica de ${animal.nome}`}>
        {/* Bloco Hero da Espécie */}
        <section className={styles.heroSection} aria-label="Identificação da espécie">
          <div className={styles.avatarLarge} aria-hidden="true">
            {getEmojiCategory(animal.categoria)}
          </div>
          <span className={styles.categoryBadge}>{animal.categoria}</span>
          <h1 className={styles.animalTitle}>{animal.nome}</h1>
          <p className={styles.scientificTitle}>{animal.nome_cientifico}</p>
        </section>

        {/* Como Agir (Destaque Principal de Segurança) */}
        <section className={styles.safetyCard} aria-label="Como agir ao encontrar este animal">
          <div className={styles.safetyHeader}>
            <div className={styles.safetyIconBox} aria-hidden="true">
              <ShieldAlert size={24} />
            </div>
            <div>
              <span className={styles.safetyTag}>Orientação do Parque</span>
              <h2 className={styles.safetyHeading}>Como agir ao avistar</h2>
            </div>
          </div>
          <p className={styles.safetyContent}>{animal.como_agir}</p>
        </section>

        {/* Detalhes Técnicos em Cartões */}
        <div className={styles.detailsGrid}>
          {/* O que come */}
          <Card className={styles.infoCard}>
            <div className={styles.cardHeaderSmall}>
              <Utensils size={18} className={styles.fieldIcon} aria-hidden="true" />
              <h3 className={styles.fieldLabel}>Alimentação</h3>
            </div>
            <p className={styles.fieldValue}>{animal.come}</p>
          </Card>

          {/* Características */}
          <Card className={styles.infoCard}>
            <div className={styles.cardHeaderSmall}>
              <Info size={18} className={styles.fieldIcon} aria-hidden="true" />
              <h3 className={styles.fieldLabel}>Características</h3>
            </div>
            <p className={styles.fieldValue}>{animal.caracteristica}</p>
          </Card>

          {/* Origem */}
          <Card className={styles.infoCard}>
            <div className={styles.cardHeaderSmall}>
              <Globe2 size={18} className={styles.fieldIcon} aria-hidden="true" />
              <h3 className={styles.fieldLabel}>Origem e Habitat</h3>
            </div>
            <p className={styles.fieldValue}>{animal.origem}</p>
          </Card>

          {/* Curiosidade */}
          <Card className={styles.infoCard}>
            <div className={styles.cardHeaderSmall}>
              <Sparkles size={18} className={styles.fieldIcon} aria-hidden="true" />
              <h3 className={styles.fieldLabel}>Curiosidade do Parque</h3>
            </div>
            <p className={styles.fieldValue}>{animal.curiosidade}</p>
          </Card>
        </div>

        {/* Rodapé com Fonte Honesta */}
        <footer className={styles.sourceFooter}>
          <p>
            <strong>{animal.fonte}</strong>
          </p>
          <p className={styles.sourceDisclaimer}>
            Informações educativas elaboradas para visitantes do Parque Ecológico de Águas Claras (DF).
          </p>
        </footer>
      </main>

      <BottomNav />
    </div>
  );
}
