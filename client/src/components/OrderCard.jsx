import React from 'react';
import { order_remove } from '../assets';
import styles from './componentsStyles/orderCard.module.css';

const OrderCard = ({ id, name, price, image, qty, onInc, onDec, onRemove }) => {
  return (
    <div className={styles.orderContainer}>
      <div className={styles.orderCard}>
        <div className={styles.foodItem}>
          <img src={image} alt={name} />
        </div>

        <div className={styles.orderDetails}>
          <div className={styles.topRow}>
            <h4 className={styles.title}>{name}</h4>

            <button
              className={styles.removeBtn}
              aria-label="Remove item"
              onClick={() => onRemove?.(id)}
            >
              <img src={order_remove} alt="remove icon" />
            </button>
          </div>

          <p className={styles.price}>₹ {price}</p>

          <div className={styles.qnt}>
            <button
              className={`${styles.qntBtn} ${styles.muted}`}
              aria-label="Decrease"
              onClick={() => onDec?.(id)}
            >
              −
            </button>
            <p className={styles.qntValue}>{qty}</p>
            <button
              className={styles.qntBtn}
              aria-label="Increase"
              onClick={() => onInc?.(id)}
            >
              +
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderCard;
