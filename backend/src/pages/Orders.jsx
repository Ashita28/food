// src/pages/Orders.jsx
import React, { useEffect, useMemo, useState } from "react";
import { OrderCard } from "../components";
import styles from "./pagesStyles/order.module.css";
import { useGetOrdersQuery } from "../redux/orderApi";

const pad2 = (n) => String(n).padStart(2, "0");
const hhmm = (iso) => {
  try {
    const d = new Date(iso);
    return `${pad2(d.getHours())}:${pad2(d.getMinutes())}`;
  } catch {
    return "--:--";
  }
};

// normalize backend order → OrderCard prop shape
const toCardShape = (ord) => {
  const items = (ord?.items || []).map((it) => ({
    name: it?.name || "",
    quntity: Number(it?.qnt || 0),
    avgPrepTime: Number(it?.avgPrepTime || 0),
  }));

  const totalPrepMin = items.reduce((sum, it) => sum + (it.avgPrepTime || 0), 0);

  return {
    orderId: ord?.shortId || ord?._id?.slice(-3) || "—",
    tableNo: ord?.tableNo ?? "--",
    orderTime: hhmm(ord?.createdAt),
    createdAt: ord?.createdAt,
    orderType: (ord?.orderType || "dine-in")
      .replace("-", "")
      .replace(/\b\w/g, (m) => m.toUpperCase())
      .replace("Dinein", "Dine In")
      .replace("Takeaway", "Takeaway"),
    items,
    totalPrepMin,
    orderStatus: (ord?.status || "processing").replace(/\b\w/g, (m) => m.toUpperCase()),
  };
};

// helpers for today's window in LOCAL time
const startOfToday = () => {
  const d = new Date();
  d.setHours(0, 0, 0, 0);
  return d;
};
const startOfTomorrow = () => {
  const d = startOfToday();
  d.setDate(d.getDate() + 1);
  return d;
};

const Orders = () => {
  // client-side pagination for the *filtered* (today) list
  const [page, setPage] = useState(1);
  const viewLimit = 8;

  // Fetch a generous page from the server so we don't miss any of today's orders
  // (server-side filtering by date isn't available in the current controller)
  const { data, isLoading, isError, error, refetch } = useGetOrdersQuery({
    sort: "-createdAt",
    limit: 500,   // big enough buffer for today's load
    page: 1,
  });

  // Filter server results to only "today" (local time)
  const todayCards = useMemo(() => {
    const start = startOfToday();
    const end = startOfTomorrow();
    const list = (data?.orders || []).filter((o) => {
      if (!o?.createdAt) return false;
      const t = new Date(o.createdAt);
      return t >= start && t < end;
    });
    return list.map(toCardShape);
  }, [data]);

  // derive pagination from filtered list
  const totalOrders = todayCards.length;
  const totalPages = Math.max(1, Math.ceil(totalOrders / viewLimit));
  const pageSafe = Math.min(page, totalPages);

  useEffect(() => {
    // if data changes and current page is out of bounds, snap back
    if (page !== pageSafe) setPage(pageSafe);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [totalPages]);

  const paginated = useMemo(() => {
    const startIdx = (pageSafe - 1) * viewLimit;
    return todayCards.slice(startIdx, startIdx + viewLimit);
  }, [todayCards, pageSafe]);

  // handlers
  const handlePrev = () => pageSafe > 1 && setPage((p) => p - 1);
  const handleNext = () => pageSafe < totalPages && setPage((p) => p + 1);
  const handleRefresh = () => refetch();

  // Render
  return (
    <div className={styles.ordersWrapper}>
      <div
        className={styles.ordersPage}
        style={{ display: "flex", gap: "1rem", flexWrap: "wrap" }}
      >
        {isLoading && <p>Loading orders…</p>}
        {isError && (
          <p style={{ color: "crimson" }}>
            {error?.data?.error || "Failed to load orders"}
          </p>
        )}

        {!isLoading && !isError && totalOrders === 0 && (
          <p>No orders for today.</p>
        )}

        {!isLoading &&
          !isError &&
          paginated.map((od) => <OrderCard key={`${od.orderId}-${od.createdAt}`} orderDetails={od} />)}
      </div>

      {/* Client-side Pagination Controls (for today's list) */}
      {!isLoading && !isError && totalPages > 1 && (
        <div
          style={{
            marginTop: "1.5rem",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            gap: "1rem",
          }}
        >
          <button
            onClick={handlePrev}
            disabled={pageSafe <= 1}
            style={{
              background: "#eee",
              padding: "0.5rem 1rem",
              borderRadius: "6px",
              cursor: pageSafe > 1 ? "pointer" : "not-allowed",
              opacity: pageSafe > 1 ? 1 : 0.5,
            }}
          >
            ← Prev
          </button>

          <span>
            Page <b>{pageSafe}</b> of <b>{totalPages}</b> ({totalOrders} today)
          </span>

          <button
            onClick={handleNext}
            disabled={pageSafe >= totalPages}
            style={{
              background: "#eee",
              padding: "0.5rem 1rem",
              borderRadius: "6px",
              cursor: pageSafe < totalPages ? "pointer" : "not-allowed",
              opacity: pageSafe < totalPages ? 1 : 0.5,
            }}
          >
            Next →
          </button>

          <button
            onClick={handleRefresh}
            style={{
              background: "#dff0d8",
              padding: "0.5rem 1rem",
              borderRadius: "6px",
              cursor: "pointer",
            }}
          >
            Refresh
          </button>
        </div>
      )}
    </div>
  );
};

export default Orders;
