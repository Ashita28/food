import React, { useMemo, useState } from 'react';
import styles from './componentStyles/revenueCard.module.css';
import {
  ResponsiveContainer,
  ComposedChart,
  Bar,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  Cell,
} from 'recharts';
import { useGetOrdersQuery } from '../redux/orderApi';

function getRangeStart(range) {
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

const RevenueCard = () => {
  const options = ['Daily', 'Weekly', 'Monthly', 'Yearly'];
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

  // Filter by date range
  const filtered = useMemo(() => {
    const start = getRangeStart(range);
    return orders.filter((o) => new Date(o.createdAt) >= start);
  }, [orders, range]);

  // Group revenue by selected range
  const chartData = useMemo(() => {
    if (!filtered.length) return [];

    const map = new Map();

    filtered.forEach((o) => {
      const date = new Date(o.createdAt);
      let keyLabel;

      if (range === 'Daily') {
        keyLabel = date.getHours() + ':00';
      } else if (range === 'Weekly') {
        keyLabel = date.toLocaleDateString('en-US', { weekday: 'short' }); 
      } else if (range === 'Monthly') {
        keyLabel = date.getDate().toString(); 
      } else {
        keyLabel = date.toLocaleString('en-US', { month: 'short' }); 
      }

      const prev = map.get(keyLabel) || 0;
      map.set(keyLabel, prev + (o.grandTotal || 0));
    });

    const orderedKeys = [...map.keys()];
    if (range === 'Weekly') {
      const weekOrder = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
      orderedKeys.sort((a, b) => weekOrder.indexOf(a) - weekOrder.indexOf(b));
    } else if (range === 'Monthly') {
      orderedKeys.sort((a, b) => Number(a) - Number(b));
    }

    return orderedKeys.map((label) => ({
      day: label,
      bar: Math.round(map.get(label) / 100) * 100,
      value: map.get(label),
    }));
  }, [filtered, range]);

  const highlightDay = useMemo(() => {
    if (!chartData.length) return null;
    return chartData[chartData.length - 1]?.day;
  }, [chartData]);

  const totalRevenue = useMemo(
    () => filtered.reduce((sum, o) => sum + (o.grandTotal || 0), 0),
    [filtered]
  );

  return (
    <div className={styles.card}>
      <div className={styles.cardHeader}>
        <div>
          <h3>Revenue</h3>
          <p>hijokplrngntop[gtgkoikokyhikoy[phokphnoy</p>
        </div>

        <select
          className={styles.dropDown}
          value={range}
          onChange={(e) => setRange(e.target.value)}
        >
          {options.map((option) => (
            <option key={option}>{option}</option>
          ))}
        </select>
      </div>

      <div className={styles.plotCard}>
        {isLoading ? (
          <p style={{ textAlign: 'center', marginTop: 30 }}>Loading revenue…</p>
        ) : isError ? (
          <p style={{ color: 'crimson', textAlign: 'center' }}>
            Failed to load revenue data
          </p>
        ) : chartData.length === 0 ? (
          <p style={{ textAlign: 'center', marginTop: 30 }}>No data available</p>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart
              data={chartData}
              margin={{ top: 12, right: 16, bottom: 12, left: 12 }}
            >
              <XAxis
                dataKey="day"
                axisLine={false}
                tickLine={false}
                interval={0}
                tick={{ fill: '#9aa0a6', fontSize: 12 }}
              />
              <YAxis hide domain={['dataMin - 5', 'dataMax + 5']} />

              <Tooltip
                cursor={{ fill: 'transparent' }}
                contentStyle={{ borderRadius: 12, border: '1px solid #eee' }}
                labelStyle={{ color: '#7b7e81' }}
                formatter={(val) => [`₹${val.toLocaleString('en-IN')}`, 'Revenue']}
              />

              <Bar dataKey="bar" barSize={26} radius={[8, 8, 8, 8]}>
                {chartData.map((d, i) => (
                  <Cell
                    key={i}
                    fill={d.day === highlightDay ? '#e8e8e8' : '#f6f6f6'}
                  />
                ))}
              </Bar>

              <Line
                type="monotone"
                dataKey="value"
                stroke="#222"
                strokeWidth={3}
                dot={false}
                strokeLinecap="round"
                activeDot={{ r: 4 }}
              />
            </ComposedChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
};

export default RevenueCard;
