import React from 'react';
import styles from './componentsStyles/productCard.module.css';

const ProductCard = ({ products = [], onAdd }) => {
  if (!Array.isArray(products) || products.length === 0) {
    return <p>No products available.</p>;
  }

  return (
    <div className={styles.cardContainer}>
      {products.map((item) => (
        <div key={item.id} className={styles.card}>
          <img src={item.image} alt={item.name} className={styles.productImage} />

          <section className={styles.cardDetails}>
            <div className={styles.cardInfo}>
              <p className={styles.productName}>{item.name}</p>
              <p className={styles.productPrice}>₹ {item.price}</p>
            </div>

            <button
              className={styles.addButton}
              onClick={() => onAdd && onAdd(item)}
              aria-label={`Add ${item.name}`}
              title={`Add ${item.name}`}
            >
              +
            </button>
          </section>
        </div>
      ))}
    </div>
  );
};

export default ProductCard;
