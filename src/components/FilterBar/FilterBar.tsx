import styles from './FilterBar.module.css';

interface Filter {
  id: string;
  label: string;
}

interface FilterBarProps {
  filters: Filter[];
  activeFilter: string;
  onChange: (filterId: string) => void;
}

export default function FilterBar({
  filters,
  activeFilter,
  onChange,
}: FilterBarProps) {
  return (
    <div
      className={styles.container}
      role="tablist"
      aria-label="Filtros"
    >
      <div className={styles.scrollArea}>
        {filters.map((filter) => {
          const isActive = filter.id === activeFilter;

          return (
            <button
              key={filter.id}
              type="button"
              role="tab"
              className={`${styles.chip} ${isActive ? styles.active : ''}`}
              aria-selected={isActive}
              tabIndex={isActive ? 0 : -1}
              onClick={() => onChange(filter.id)}
              onKeyDown={(e) => {
                const currentIndex = filters.findIndex((f) => f.id === filter.id);
                let nextIndex = -1;

                if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
                  e.preventDefault();
                  nextIndex = (currentIndex + 1) % filters.length;
                } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
                  e.preventDefault();
                  nextIndex = (currentIndex - 1 + filters.length) % filters.length;
                } else if (e.key === 'Home') {
                  e.preventDefault();
                  nextIndex = 0;
                } else if (e.key === 'End') {
                  e.preventDefault();
                  nextIndex = filters.length - 1;
                }

                if (nextIndex >= 0) {
                  onChange(filters[nextIndex].id);
                  // Focus the newly active tab
                  const container = e.currentTarget.parentElement;
                  if (container) {
                    const buttons = container.querySelectorAll<HTMLButtonElement>('[role="tab"]');
                    buttons[nextIndex]?.focus();
                  }
                }
              }}
            >
              {filter.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}
