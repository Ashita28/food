import React, { createContext, useContext, useEffect, useMemo, useReducer } from "react";

const CartCtx = createContext();

const initialState = {
  items: [],
};

function reducer(state, action) {
  switch (action.type) {
    case "INIT": {
      return action.payload || initialState;
    }
    case "ADD": {
      const { id, name, price, image, avgPrepTime } = action.payload;
      const idx = state.items.findIndex((it) => it.id === id);
      if (idx >= 0) {
        const items = [...state.items];
        items[idx] = { ...items[idx], qty: items[idx].qty + 1 };
        return { ...state, items };
      }
      return {
        ...state,
        items: [...state.items, { id, name, price, image, qty: 1, avgPrepTime }],
      };
    }
    case "INC": {
      const items = state.items.map((it) =>
        it.id === action.payload ? { ...it, qty: it.qty + 1 } : it
      );
      return { ...state, items };
    }
    case "DEC": {
      const items = state.items
        .map((it) =>
          it.id === action.payload ? { ...it, qty: Math.max(0, it.qty - 1) } : it
        )
        .filter((it) => it.qty > 0);
      return { ...state, items };
    }
    case "REMOVE": {
      const items = state.items.filter((it) => it.id !== action.payload);
      return { ...state, items };
    }
    case "CLEAR": {
      return initialState;
    }
    default:
      return state;
  }
}

export const CartProvider = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initialState);

  useEffect(() => {
    try {
      const raw = localStorage.getItem("cart_v1");
      if (raw) dispatch({ type: "INIT", payload: JSON.parse(raw) });
    } catch {}
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem("cart_v1", JSON.stringify(state));
    } catch {}
  }, [state]);

  const addItem   = (item) => dispatch({ type: "ADD", payload: item });
  const inc       = (id)   => dispatch({ type: "INC", payload: id });
  const dec       = (id)   => dispatch({ type: "DEC", payload: id });
  const removeItem= (id)   => dispatch({ type: "REMOVE", payload: id });
  const clear     = ()     => dispatch({ type: "CLEAR" });

  const totals = useMemo(() => {
    const itemTotal = state.items.reduce((sum, it) => sum + Number(it.price) * it.qty, 0);
    const delivery  = state.items.length ? 50 : 0;
    const taxes     = +(itemTotal * 0.05).toFixed(2);
    const grandTotal= itemTotal + delivery + taxes;
    return { itemTotal, delivery, taxes, grandTotal };
  }, [state.items]);

  const value = { cart: state, addItem, inc, dec, removeItem, clear, totals };
  return <CartCtx.Provider value={value}>{children}</CartCtx.Provider>;
};

export const useCart = () => {
  const ctx = useContext(CartCtx);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
};
