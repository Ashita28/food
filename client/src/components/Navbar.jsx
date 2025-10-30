import React, { useEffect, useState } from "react";
import styles from "./componentsStyles/nav.module.css";
import { search_icon } from "../assets";
import { useSearch } from "../context/SearchContext";

const Navbar = () => {
  const [greeting, setGreeting] = useState("");
  const { search, setSearch } = useSearch();
  const [tempSearch, setTempSearch] = useState(search);

  useEffect(() => {
    const hour = new Date().getHours();
    if (hour >= 5 && hour < 12) setGreeting("Good morning");
    else if (hour >= 12 && hour < 17) setGreeting("Good afternoon");
    else if (hour >= 17 && hour < 21) setGreeting("Good evening");
    else setGreeting("Good night");
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      setSearch(tempSearch);
    }, 300);
    return () => clearTimeout(timer);
  }, [tempSearch, setSearch]);

  return (
    <nav className={styles.navbar}>
      <section className={styles.header}>
        <h1>{greeting}</h1>
        <p>Place your order here</p>
      </section>

      <section className={styles.search}>
        <img src={search_icon} alt="search icon" />
        <input
          type="text"
          placeholder="Search food..."
          value={tempSearch}
          onChange={(e) => setTempSearch(e.target.value)}
        />
      </section>
    </nav>
  );
};

export default Navbar;
