import React from 'react';
import styles from './componentStyles/productCard.module.css';

const ProductCard = ({ product }) => {
  if (!product) return null;

  const {
    itemImage,
    name,
    description,
    price,
    avgPrepTime,
    category,
    stock,
    rating,
  } = product;

  return (
    <div className={styles.productCard}>
      <div className={styles.imageContainer}>
        {itemImage ? <img src={itemImage} alt={name} /> : <div className={styles.imgPlaceholder} />}
      </div>

      <div className={styles.productDetails}>
        <p><strong>Name:</strong> {name}</p>
        {description ? <p><strong>Description:</strong> {description}</p> : null}
        <p><strong>Price:</strong> ₹{Number(price).toFixed(2)}</p>
        <p><strong>Average Prep Time:</strong> {avgPrepTime} mins</p>
        <p><strong>Category:</strong> {category}</p>
        <p><strong>In Stock:</strong> {stock ? 'Yes' : 'No'}</p>
        {typeof rating === 'number' ? <p><strong>Rating:</strong> {rating} ⭐</p> : null}
      </div>
    </div>
  );
};

export default ProductCard;
