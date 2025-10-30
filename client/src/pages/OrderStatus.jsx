import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { check } from "../assets";
import styles from "./pagesStyles/status.module.css";

const OrderStatus = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { success = false, message = "" } = location.state || {};
  const [seconds, setSeconds] = useState(success ? 3 : 5);

  useEffect(() => {
    const timer = setInterval(() => {
      setSeconds((s) => {
        if (s <= 1) {
          clearInterval(timer);
          navigate("/");
          return 0;
        }
        return s - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [navigate]);

  return (
    <div
      className={`${styles.statusPage} ${
        success ? styles.success : styles.failure
      }`}
      role="status"
      aria-live="polite"
    >
      <div className={styles.centerWrap}>
        <h1 className={styles.title}>
          {success ? "Thanks For Ordering!" : "Order Failed"}
        </h1>

        <div className={styles.checkWrap}>
          {success ? (
            <img src={check} alt="success" className={styles.checkIcon} />
          ) : (
            <span className={styles.crossIcon}>×</span>
          )}
        </div>

        {!success && (
          <p className={styles.errorMsg}>
            {message || "Something went wrong. Please try again."}
          </p>
        )}
      </div>

      <p className={styles.countdown}>
        Redirecting in {seconds} second{seconds !== 1 ? "s" : ""}
      </p>
    </div>
  );
};

export default OrderStatus;
