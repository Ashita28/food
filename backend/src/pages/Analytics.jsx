// src/pages/Analytics.jsx
import React from 'react';
import { DetailsCard, RevenueCard, SummaryCard, TableAssign } from '../components';
import styles from './pagesStyles/analytics.module.css';
import ChefOrderTable from '../components/ChefOrderTable';
import { useAdminSearch } from '../context/AdminSearchContext';

const normalize = (s = '') => s.toLowerCase().replace(/\s+/g, '');

const Analytics = () => {
  const { query } = useAdminSearch();
  const nq = normalize(query);

  // Helper: show a block if its visible label matches the query (case/space-insensitive).
  // Empty query => show everything.
  const shouldShow = (labelText) => {
    if (!nq) return true;
    return normalize(labelText).includes(nq);
  };

  // Visible labels for each block (what the user actually sees)
  const LABELS = {
    summary: 'Order Summary',
    revenue: 'Revenue',
    table: 'Table Assign',
  };

  return (
    <div className={styles.analyticsPage}>
      <header className={styles.heading}>
        <h1>Analytics</h1>
      </header>

      {/* DetailsCard handles per-tile highlight/dim itself, so never blur the whole group */}
      <DetailsCard />

      <section className={styles.cards}>
        <div
          className={`${styles.sectionWrapper} ${
            shouldShow(LABELS.summary) ? '' : styles.blurred
          }`}
        >
          <SummaryCard />
        </div>

        <div
          className={`${styles.sectionWrapper} ${
            shouldShow(LABELS.revenue) ? '' : styles.blurred
          }`}
        >
          <RevenueCard />
        </div>

        <div
          className={`${styles.sectionWrapper} ${
            shouldShow(LABELS.table) ? '' : styles.blurred
          }`}
        >
          <TableAssign />
        </div>
      </section>

      {/* ChefOrderTable is always visible (never blurred) */}
      <ChefOrderTable />
    </div>
  );
};

export default Analytics;
