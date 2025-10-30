import React from 'react';
import styles from './componentStyles/nav.module.css';
import { down_arrow, logo } from '../assets';
import { useAdminSearch } from '../context/AdminSearchContext'; 

const Navbar = ({ selectedPage = 'analytics' }) => {
  const { query, setQuery } = useAdminSearch();

  const placeholders = {
    analytics: 'Search (e.g. total chefs, revenue, summary)',
    products: 'Search',
  };
  const placeholder = placeholders[selectedPage] || 'Filter...';

  return (
    <nav className={styles.navbar}>
      <div className={styles.logoContainer}>
        <img src={logo} alt='logo' />
      </div>

      {selectedPage === 'orders' ? (
        <h1 className={styles.orderHeading}>Order Line</h1>
      ) : (
        selectedPage !== 'tables' && (
          <div className={styles.searchBox}>
            <input
              placeholder={placeholder}
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
            <div>
              <img src={down_arrow} alt='downward arrow' />
            </div>
          </div>
        )
      )}
    </nav>
  );
};

export default Navbar;
