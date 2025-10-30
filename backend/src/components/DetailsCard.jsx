
import React from "react";
import { chefs, clients, currency, orderIcon } from "../assets";
import styles from "./componentStyles/details.module.css";
import { useGetAnalyticsSummaryQuery } from "../redux/analyticsApi";
import { useAdminSearch } from "../context/AdminSearchContext";

const normalize = (s = "") => s.toLowerCase().replace(/\s+/g, "");

const formatIndianNumber = (num = 0) => {
  if (isNaN(num)) return "₹0";

  if (num < 1000) return `₹${num}`; 
  if (num < 100000) return `₹${(num / 1000).toFixed(1)} K`; 
  if (num < 10000000) return `₹${(num / 100000).toFixed(2)} Lakh`; 
  return `₹${(num / 10000000).toFixed(2)} Crore`; 
};

const DetailsCard = () => {
  const { data, isLoading, isError } = useGetAnalyticsSummaryQuery();
  const { query } = useAdminSearch();

  const totalClients = data?.totalClients ?? 0;
  const totalRevenue = data?.totalRevenue ?? 0;
  const totalOrders = data?.totalOrders ?? 0;
  const totalChefs = data?.totalChefs ?? 4;

  const formattedRevenue = formatIndianNumber(totalRevenue);

  const details = [
    { key: "chefs", icon: chefs, qnt: totalChefs, datatype: "Total Chefs" },
    { key: "revenue", icon: currency, qnt: formattedRevenue, datatype: "Total Revenue" },
    { key: "orders", icon: orderIcon, qnt: totalOrders, datatype: "Total Orders" },
    { key: "clients", icon: clients, qnt: totalClients, datatype: "Total Clients" },
  ];

  if (isLoading) return <p>Loading analytics...</p>;
  if (isError) return <p style={{ color: "crimson" }}>Error loading analytics</p>;

  const nq = normalize(query);

  return (
    <div className={styles.detailsCard}>
      <ul className={styles.detailsList}>
        {details.map(({ key, icon, qnt, datatype }) => {
          const text = normalize(`${datatype} ${qnt}`);
          const match = !nq || text.includes(nq);
          return (
            <li
              key={key}
              className={`${styles.detailItem} ${match ? styles.highlight : styles.dimmed}`}
            >
              <img src={icon} alt={datatype} />
              <div>
                <h3>{qnt}</h3>
                <p>{datatype}</p>
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default DetailsCard;
