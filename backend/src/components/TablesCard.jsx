import React from 'react';
import styles from './componentStyles/tableCard.module.css';
import { delTable as delIcon, chair } from '../assets';

const TablesCard = ({ table, onDelete }) => {
  if (!table) return null;
  const { _id, tableName, tableNum, chairs: chairCount, isOccupied, currentOrder } = table;

  const twoDigit = (n) => n.toString().padStart(2, '0');
  const assigned = isOccupied || Boolean(currentOrder);

  return (
    <div className={styles.tableCard}>
      <div className={styles.tableCardData}>
        <img
          className={styles.delBtn}
          src={delIcon}
          alt="delete icon"
          title={assigned ? 'Cannot delete: table assigned' : 'Delete table'}
          onClick={() => !assigned && onDelete?.(_id)}
          role="button"
          style={{ cursor: assigned ? 'not-allowed' : 'pointer', opacity: assigned ? 0.45 : 1 }}
        />

        <div className={styles.tableInfo}>
          <h3>{tableName || 'Table'}</h3>
          <p>{twoDigit(tableNum)}</p>
        </div>

        <div className={styles.chairInfo} title={`Chairs: ${twoDigit(chairCount)}`}>
          <img src={chair} alt="chair icon" />
          <p>{twoDigit(chairCount)}</p>
        </div>
      </div>

      <div className={styles.tableMeta} aria-hidden="true" />
    </div>
  );
};

export default TablesCard;
