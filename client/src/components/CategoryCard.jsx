import React from 'react';
import styles from './componentsStyles/categoryCard.module.css';

const CategoryCard = ({ data = [], onSelect, active }) => {
  return (
    <div className={styles.categoryContainer}>
      {data.map((c, idx) => {
        const isActive = active === c.label;
        return (
          <button
            key={`${c.label}-${idx}`}
            type="button"
            className={`${styles.card} ${isActive ? styles.active : ''}`}
            title={c.label}
            onClick={() => onSelect?.(c.label)}
            aria-pressed={isActive}
          >
            <img src={c.image} alt={c.label} />
            <p>{c.label}</p>
          </button>
        );
      })}
    </div>
  );
};

export default CategoryCard;
