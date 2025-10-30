import React, { useEffect, useMemo } from "react";
import styles from "./componentStyles/cheforderTable.module.css";
import {
  useGetChefsQuery,
  useAssignChefMutation,
  useCreateChefsMutation,
} from "../redux/chefsApi";

const FIXED_CHEF_NAMES = ["Manesh", "Pritam", "Yash", "Tenzen"];

const ChefOrderTable = () => {
  const { data, isLoading, isError, error, refetch } = useGetChefsQuery(undefined, {
    pollingInterval: 3000, 
    refetchOnFocus: true,
    refetchOnReconnect: true,
  });

  const [assignChef, { isLoading: assigning }] = useAssignChefMutation();
  const [createChefs] = useCreateChefsMutation();

  useEffect(() => {
    if (!isLoading && !isError && (data?.total ?? 0) === 0) {
      (async () => {
        try {
          await createChefs(
            FIXED_CHEF_NAMES.map((name) => ({ name, noOfOrdersTaken: 0 }))
          );
          refetch();
        } catch (e) {
          console.error("Seeding chefs failed:", e);
        }
      })();
    }
  }, [isLoading, isError, data?.total, createChefs, refetch]);

  const nameToCount = useMemo(() => {
    const map = new Map();
    (data?.chefs ?? []).forEach((c) => map.set(c.name, c.noOfOrdersTaken));
    return map;
  }, [data]);

  const rows = useMemo(
    () =>
      FIXED_CHEF_NAMES.map((name) => ({
        name,
        noOfOrdersTaken: nameToCount.get(name) ?? 0,
      })),
    [nameToCount]
  );

  const handleAssign = async () => {
    const res = await assignChef();
    if ("error" in res) {
      console.error(res.error);
    } else {
      refetch();
    }
  };

  if (isLoading) {
    return (
      <div className={styles.tableContainer}>
        <p>Loading chefs…</p>
      </div>
    );
  }

  if (isError) {
    return (
      <div className={styles.tableContainer}>
        <p style={{ color: "crimson" }}>
          {error?.data?.error || "Failed to load chef data"}
        </p>
      </div>
    );
  }

  return (
    <div className={styles.tableContainer}>
      <table className={styles.chefTable}>
        <thead>
          <tr>
            <th>Chef Name</th>
            <th>Orders Taken</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((chef) => (
            <tr key={chef.name}>
              <td>{chef.name}</td>
              <td>{chef.noOfOrdersTaken}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ChefOrderTable;
