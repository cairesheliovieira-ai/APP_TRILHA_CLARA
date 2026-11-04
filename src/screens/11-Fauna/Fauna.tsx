import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  PawPrint, 
  ChevronRight, 
  Sparkles, 
  Info
} from 'lucide-react';
import { useFauna } from '../../hooks/useOfflineData';
import FilterBar from '../../components/FilterBar/FilterBar';
import Card from '../../components/Card/Card';
import BottomNav from '../../components/BottomNav/BottomNav';
import styles from './Fauna.module.css';

export default function Fauna() {
  const navigate = useNavigate();
  const { data: faunaData, loading } = useFauna();
  const [activeCategory, setActiveCategory] = useState('todos');

  const filters = [
    { id: 'todos', label: 'Todos' },
    { id: 'mamiferos', label: 'Mamíferos' },
    { id: 'aves', label: 'Aves' },
    { id: 'repteis', label: 'Répteis' },
  ];

  const animais = faunaData?.animais || [];

  const filteredAnimais = animais.filter((a) => {
    if (activeCategory === 'todos') return true;
    return a.categoria.toLowerCase() === activeCategory.toLowerCase();
  });

  const maisVistaHoje = animais.find((a) => a.mais_vista_hoje);

  const getEmojiCategory = (categoria: string) => {
    switch (categoria.toLowerCase()) {
      case 'mamiferos': return '🦫';
      case 'aves': return '🐦';
      case 'repteis': return '🦎';
      default: return '🐾';
    }
  };

  return (
    <div className={styles.screenWrapper}>
      <header className={styles.header}>
        <div className={styles.headerTitleGroup}>
          <PawPrint size={26} className={styles.headerIcon} aria-hidden="true" />
          <h1 className={styles.title}>Fauna do parque</h1>
        </div>
        <p className={styles.subtitle}>
          Conheça as espécies silvestres que habitam a reserva de Águas Claras.
        </p>

        <div className={styles.filterWrapper}>
          <FilterBar
            filters={filters}
            activeFilter={activeCategory}
            onChange={setActiveCategory}
          />
        </div>
      </header>

      <main className={styles.mainContent} role="main" aria-label="Espécies da fauna de Águas Claras">
        {/* Banner Destaque: Mais vista hoje */}
        {maisVistaHoje && activeCategory === 'todos' && (
          <section aria-label="Espécie mais avistada hoje">
            <Card
              className={styles.featuredCard}
              onClick={() => navigate(`/fauna/${maisVistaHoje.id}`)}
              ariaLabel={`Mais vista hoje: ${maisVistaHoje.nome}. Clique para abrir ficha.`}
            >
              <div className={styles.featuredHeader}>
                <span className={styles.featuredBadge}>
                  <Sparkles size={14} aria-hidden="true" />
                  Mais vista hoje no parque
                </span>
                <span className={styles.categoryPill}>
                  {maisVistaHoje.categoria}
                </span>
              </div>

              <div className={styles.featuredBody}>
                <div className={styles.avatarEmoji} aria-hidden="true">
                  {getEmojiCategory(maisVistaHoje.categoria)}
                </div>
                <div className={styles.featuredText}>
                  <h2 className={styles.featuredName}>{maisVistaHoje.nome}</h2>
                  <em className={styles.scientificName}>{maisVistaHoje.nome_cientifico}</em>
                  <p className={styles.featuredDesc}>{maisVistaHoje.caracteristica}</p>
                </div>
              </div>

              <div className={styles.featuredAction}>
                <span>Ver ficha completa e regras de aproximação</span>
                <ChevronRight size={18} aria-hidden="true" />
              </div>
            </Card>
          </section>
        )}

        {/* Lista de Animais */}
        <section className={styles.listSection} aria-label="Catálogo de animais">
          <div className={styles.listHeader}>
            <h2 className={styles.sectionHeading}>
              Espécies catalogadas ({filteredAnimais.length})
            </h2>
            <span className={styles.listSubtitle}>Toque para ver a ficha</span>
          </div>

          {loading && (
            <div className={styles.loadingBox} role="status">
              Carregando catálogo de fauna...
            </div>
          )}

          <div className={styles.animalsGrid}>
            {filteredAnimais.map((animal) => (
              <Card
                key={animal.id}
                className={styles.animalCard}
                onClick={() => navigate(`/fauna/${animal.id}`)}
                ariaLabel={`Animal ${animal.nome}, ${animal.categoria}. Clique para abrir ficha.`}
              >
                <div className={styles.animalCardRow}>
                  <div className={styles.animalAvatar} aria-hidden="true">
                    {getEmojiCategory(animal.categoria)}
                  </div>
                  <div className={styles.animalInfo}>
                    <div className={styles.animalTitleRow}>
                      <h3 className={styles.animalName}>{animal.nome}</h3>
                      <span className={styles.animalPill}>{animal.categoria}</span>
                    </div>
                    <em className={styles.scientificSub}>{animal.nome_cientifico}</em>
                    <p className={styles.dietText}>
                      <strong>Alimentação:</strong> {animal.come}
                    </p>
                  </div>
                  <ChevronRight size={20} className={styles.arrowIcon} aria-hidden="true" />
                </div>
              </Card>
            ))}
          </div>
        </section>

        {/* Lembrete de Proteção */}
        <div className={styles.protectionNotice}>
          <Info size={18} className={styles.noticeIcon} aria-hidden="true" />
          <p>
            Todos os animais do parque são silvestres e protegidos por lei. Nunca tente capturar, alimentar ou assustar a fauna.
          </p>
        </div>
      </main>

      <BottomNav />
    </div>
  );
}
