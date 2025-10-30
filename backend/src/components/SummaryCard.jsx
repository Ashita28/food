import React, { useMemo, useState } from 'react';
import styles from './componentStyles/summaryCard.module.css';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';
import { useGetOrdersQuery } from '../redux/orderApi';

const OPTIONS = ['Daily', 'Weekly', 'Monthly', 'Yearly'];

function rangeStart(range) {
  const now = new Date();
  const d = new Date(now);

  if (range === 'Daily') {
    d.setHours(0, 0, 0, 0);
    return d;
  }
  if (range === 'Weekly') {
    const day = d.getDay(); 
    const diffToMon = (day === 0 ? -6 : 1 - day);
    d.setDate(d.getDate() + diffToMon);
    d.setHours(0, 0, 0, 0);
    return d;
  }
  if (range === 'Monthly') {
    return new Date(d.getFullYear(), d.getMonth(), 1, 0, 0, 0, 0);
  }
  return new Date(d.getFullYear(), 0, 1, 0, 0, 0, 0);
}

const pad2 = (n) => String(n).padStart(2, '0');

const SummaryCard = () => {
  const [range, setRange] = useState('Daily');

  const { data, isLoading, isError } = useGetOrdersQuery(
    { sort: '-createdAt', limit: 500 },
    {
      pollingInterval: 5000,
      refetchOnFocus: true,
      refetchOnReconnect: true,
    }
  );

  const orders = data?.orders ?? [];

  const filtered = useMemo(() => {
    const start = rangeStart(range);
    return orders.filter((o) => {
      const created = o?.createdAt ? new Date(o.createdAt) : null;
      return created && created >= start;
    });
  }, [orders, range]);

  const servedCount = useMemo(
    () => filtered.filter((o) => o.status === 'done' || o.status === 'pickup').length,
    [filtered]
  );
  const dineInCount = useMemo(
    () => filtered.filter((o) => o.orderType === 'dine-in').length,
    [filtered]
  );
  const takeawayCount = useMemo(
    () => filtered.filter((o) => o.orderType === 'takeaway').length,
    [filtered]
  );

  const totalOrders = Math.max(1, filtered.length);

  const chartData = useMemo(
    () => [
      { name: 'Take Away', value: takeawayCount, color: '#9EA2A8' },
      { name: 'Served',    value: servedCount,   color: '#6C6E73' },
      { name: 'Dine in',   value: dineInCount,   color: '#2F3134' },
    ],
    [takeawayCount, servedCount, dineInCount]
  );

  const pct = (val) => Math.round((val / totalOrders) * 100);

  return (
    <div className={styles.card}>
      <div className={styles.cardHeader}>
        <div className={styles.headerLeft}>
          <h3>Order Summary</h3>
          <p title="Auto-updating breakdown for the selected period">
            hijoklprngntop[gtgkoikokyhikoy[phokphnoy
          </p>
        </div>

        <select
          className={styles.dropDown}
          value={range}
          onChange={(e) => setRange(e.target.value)}
        >
          {OPTIONS.map((option) => (
            <option key={option}>{option}</option>
          ))}
        </select>
      </div>

      <div className={styles.orderDetail}>
        <div className={styles.detail}>
          <p>{pad2(servedCount)}</p>
          <p>Served</p>
        </div>

        <div className={styles.detail}>
          <p>{pad2(dineInCount)}</p>
          <p>Dine In</p>
        </div>

        <div className={styles.detail}>
          <p>{pad2(takeawayCount)}</p>
          <p>Take Away</p>
        </div>
      </div>

      <div className={styles.visualData}>
        <div className={styles.pieWrap}>
          <ResponsiveContainer width="100%" height={110}>
            <PieChart>
              <Pie
                data={chartData}
                dataKey="value"
                innerRadius={34}
                outerRadius={50}
                startAngle={90}
                endAngle={450}
                paddingAngle={3}
                stroke="none"
                cx="50%"
                cy="50%"
              >
                {chartData.map((entry, idx) => (
                  <Cell key={`cell-${idx}`} fill={entry.color} />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className={styles.dataList}>
          {chartData.map((item) => (
            <div key={item.name} className={styles.dataRow}>
              <div className={styles.label}>{item.name}</div>
              <div className={styles.percent}>({pct(item.value)}%)</div>
              <div className={styles.barTrack}>
                <div
                  className={styles.barFill}
                  style={{ width: `${pct(item.value)}%`, backgroundColor: item.color }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {isLoading && <p className={styles.hint}>Loading summary…</p>}
      {isError && <p className={styles.err}>Failed to load orders.</p>}
    </div>
  );
};

export default SummaryCard;
