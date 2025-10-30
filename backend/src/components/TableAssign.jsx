import React, { useMemo } from 'react';
import styles from './componentStyles/tableAssign.module.css';
import { useGetTablesQuery } from '../redux/tablesApi';

const twoDigit = (n) => n.toString().padStart(2, '0');

const TableAssign = () => {
  const { data, isLoading, isError, error } = useGetTablesQuery({
    sort: 'tableNum',
    dir: 'asc',
    limit: 500,
  });

  const items = useMemo(() => data?.items ?? [], [data]);

  return (
    <div className={styles.card}>
      <div className={styles.cardHeader}>
        <h3>Tables</h3>

        <div className={styles.headerContent}>
          <div className={styles.sub}>
            <div className={styles.reserved}></div>
            <p>Reserved</p>
          </div>

          <div className={styles.sub}>
            <div className={styles.avail}></div>
            <p>Available</p>
          </div>
        </div>
      </div>

      {isLoading && <div style={{ padding: '8px 0' }}>Loading tables…</div>}
      {isError && (
        <div style={{ color: 'crimson', padding: '8px 0' }}>
          {error?.data?.error || 'Failed to load tables'}
        </div>
      )}

      <div className={styles.grid}>
        {!isLoading && !isError && items.length === 0 && (
          <div style={{ gridColumn: '1 / -1', textAlign: 'center', opacity: 0.7 }}>
            No tables yet. Create some in the Tables page.
          </div>
        )}

        {items.map((t) => {
          const isAssigned = t.isOccupied || Boolean(t.currentOrder);
          const displayName = t.tableName && t.tableName.trim() ? t.tableName.trim() : 'Table';

          return (
            <div
              key={t._id}
              className={`${styles.tableBox} ${isAssigned ? styles.tableReserved : styles.tableAvailable}`}
              title={
                isAssigned
                  ? `Assigned${t.currentOrder ? ` • Order ${String(t.currentOrder).slice(-6)}` : ''}`
                  : 'Available'
              }
            >
              <span className={styles.tableLabel}>{displayName}</span>
              <span className={styles.tableNum}>{twoDigit(t.tableNum)}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default TableAssign;
