import React, { useEffect, useReducer } from "react";
import { cartReducer } from "./Reducer";
import { initializer } from "./Initializer.client";
type contextData = {
  state: {
    cart: [];
  };
  dispatch: React.Dispatch<any>;
};

const Cart = React.createContext({} as contextData);
export default function Context({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(
    cartReducer,
    {
      cart: Array<any>(),
    },
    initializer
  );
  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(state.cart));
  }, [state.cart]);
  return <Cart.Provider value={{ state, dispatch }}>{children}</Cart.Provider>;
}

export const CartState = () => {
  return React.useContext(Cart);
};
