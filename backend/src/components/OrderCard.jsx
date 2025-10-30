import React, { useEffect, useState } from 'react';
import styles from './componentStyles/orderCard.module.css';
import { timerIcon, foodIcon, dineDone, takeaway } from '../assets';

const OrderCard = ({ orderDetails }) => {
  if (!orderDetails) return <div className={styles.card}>No order details</div>;

  const {
    orderId,
    tableNo,
    orderTime,
    orderType,
    items = [],
    orderStatus,
    totalPrepMin = 0, 
    createdAt,
  } = orderDetails;

  const totalPrepSec = Math.max(0, Math.round(totalPrepMin * 60));
  const elapsedSec = (() => {
    try {
      const created = new Date(createdAt).getTime();
      const now = Date.now();
      return Math.max(0, Math.floor((now - created) / 1000));
    } catch {
      return 0;
    }
  })();

  const remainingSec = Math.max(0, totalPrepSec - elapsedSec);
  const remainingMinRounded = Math.ceil(remainingSec / 60); 

  const timerDone = remainingSec <= 0;

  const inType = orderType || 'Dine In';
  const typeKey = inType.toLowerCase().replace(/[^a-z0-9]+/g, '');
  const isDineIn = typeKey === 'dinein';
  const isTakeaway = typeKey === 'takeaway';

  const [patched, setPatched] = useState(false);

  useEffect(() => {
    const patchStatus = async () => {
      try {
        const newStatus = isDineIn ? 'done' : 'pickup';
        const res = await fetch(`${import.meta.env.VITE_API_URL}/orders/${orderId}/status`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ status: newStatus }),
        });
        if (!res.ok) throw new Error('Failed to patch order status');
        console.log(`✅ Order ${orderId} marked as ${newStatus}`);
        setPatched(true);
      } catch (err) {
        console.error('Auto-patch error:', err);
      }
    };

    if (timerDone && !patched && orderStatus?.toLowerCase() === 'processing') {
      patchStatus();
    }
  }, [timerDone, patched, orderId, isDineIn, orderStatus, isTakeaway]);

  const visualStatus = timerDone ? 'Completed' : (orderStatus || 'Processing');
  const statusKey = visualStatus.toLowerCase().replace(/[^a-z0-9]+/g, '');
  const cap = (s) => (s ? s.charAt(0).toUpperCase() + s.slice(1) : '');

  const cardBase = styles.orderCard;
  const combinedCardClass = styles[`${statusKey}${cap(typeKey)}`] || '';
  const typeClass = styles[typeKey] || '';
  const statusClass = styles[statusKey] || '';

  const typeSecClass = styles[`orderType${cap(typeKey)}`] || '';
  const typeSecCombinedClass =
    styles[`orderType${cap(typeKey)}Status${cap(statusKey)}`] || '';

  const statusLabelClass = styles[`status${statusKey}`] || '';
  const statusLabelComboClass =
    styles[`status${statusKey}${cap(typeKey)}`] || '';

  let statusIcon = timerIcon;
  if (timerDone && isDineIn) statusIcon = dineDone;
  else if (timerDone && isTakeaway) statusIcon = takeaway;

  const itemsCountText = `${items.length} ${items.length === 1 ? 'Item' : 'Items'}`;

  const rightBox = timerDone
    ? (isDineIn
        ? (<><p>Done</p><p>Served</p></>)
        : (<><p>Take Away</p><p>Not Picked up</p></>))
    : (<><p>{inType}</p><p>Ongoing: {remainingMinRounded} Min</p></>);

  return (
    <div className={`${cardBase} ${typeClass} ${statusClass} ${combinedCardClass}`}>
      <div className={styles.cardHeader}>
        <div className={styles.orderInfo}>
          <div>
            <div className={styles.orderIdSection}>
              <img src={foodIcon} alt="food" />
              <h3># {orderId}</h3>
            </div>

            <div className={styles.tableAndTime}>
              <p>Table-0{tableNo}</p>
              <p>{orderTime}</p>
            </div>
          </div>

          <div className={`${styles.orderTypeSec} ${typeSecClass} ${typeSecCombinedClass}`}>
            {rightBox}
          </div>
        </div>

        <h4>{itemsCountText}</h4>
      </div>

      <div className={styles.itemList}>
        <ul>
          {items.map((it, idx) => {
            const qty = it.quantity ?? it.quntity ?? 1;
            return <li key={idx}>{qty} × {it.name}</li>;
          })}
        </ul>
      </div>

      <div className={`${styles.statusLabel} ${statusLabelClass} ${statusLabelComboClass}`}>
        <p>{visualStatus}</p>
        <img src={statusIcon} alt={visualStatus} />
      </div>
    </div>
  );
};

export default OrderCard;
