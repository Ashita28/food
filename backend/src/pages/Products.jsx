import React, { useMemo, useState } from 'react';
import { ProductCard } from '../components';
import styles from './pagesStyles/products.module.css';
import { useGetFoodsQuery } from '../redux/foodApi';

const range = (start, end) => Array.from({ length: end - start + 1 }, (_, i) => start + i);

const Products = () => {
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(12);

  const queryArgs = useMemo(() => ({
    page,
    limit,
    sort: '-createdAt',
  }), [page, limit]);

  const { data, isLoading, isFetching, isError, error } = useGetFoodsQuery(queryArgs);

  const items = data?.items || [];
  const totalPages = data?.pages || 1;
  const totalItems = data?.total || 0;
  const currentPage = data?.page || page;

  const canPrev = currentPage > 1;
  const canNext = currentPage < totalPages;

  const windowSize = 5;
  const start = Math.max(1, currentPage - Math.floor(windowSize / 2));
  const end = Math.min(totalPages, start + windowSize - 1);
  const pagesToShow = range(start, end);

  return (
    <div className={styles.productsPage}>
      <div className={styles.headerBar}>
        <h1>Products</h1>

        <div className={styles.controls}>
          <label className={styles.pageSize}>
            Per page:
            <select
              value={limit}
              onChange={(e) => {
                setLimit(Number(e.target.value));
                setPage(1); 
              }}
            >
              <option value={6}>6</option>
              <option value={12}>12</option>
              <option value={24}>24</option>
              <option value={48}>48</option>
            </select>
          </label>
        </div>
      </div>

      {isLoading ? (
        <div className={styles.stateBox}><p>Loading products…</p></div>
      ) : isError ? (
        <div className={styles.stateBox}>
          <p style={{ color: 'crimson' }}>{error?.data?.error || 'Failed to load products'}</p>
        </div>
      ) : (
        <>
          <section className={styles.cardContainer} aria-busy={isFetching}>
            {items.length === 0 ? (
              <p>No products found.</p>
            ) : (
              items.map((prod) => <ProductCard key={prod._id} product={prod} />)
            )}
          </section>

          {/* Pagination */}
          {totalPages > 1 && (
            <nav className={styles.pagination} aria-label="Pagination">
              <button
                className={styles.pagerBtn}
                disabled={!canPrev}
                onClick={() => setPage(1)}
              >
                « First
              </button>
              <button
                className={styles.pagerBtn}
                disabled={!canPrev}
                onClick={() => setPage((p) => Math.max(1, p - 1))}
              >
                ‹ Prev
              </button>

              <ul className={styles.pageList}>
                {pagesToShow.map((p) => (
                  <li key={p}>
                    <button
                      className={`${styles.pageBtn} ${p === currentPage ? styles.activePage : ''}`}
                      aria-current={p === currentPage ? 'page' : undefined}
                      onClick={() => setPage(p)}
                    >
                      {p}
                    </button>
                  </li>
                ))}
              </ul>

              <button
                className={styles.pagerBtn}
                disabled={!canNext}
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              >
                Next ›
              </button>
              <button
                className={styles.pagerBtn}
                disabled={!canNext}
                onClick={() => setPage(totalPages)}
              >
                Last »
              </button>
            </nav>
          )}

          {/* Readout */}
          <div className={styles.paginationInfo}>
            Page {currentPage} of {totalPages} — {totalItems} items
          </div>
        </>
      )}
    </div>
  );
};

export default Products;
