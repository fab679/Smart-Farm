export const cartReducer = (state: any, action: any) => {
  switch (action.type) {
    case "ADD_TO_CART":
      return {
        ...state,
        cart: [...state.cart, { ...action.payload, qty: action.payload.qty,total:action.payload.qty * action.payload.price }],
      };
    case "REMOVE_FROM_CART":
      return {
        ...state,
        cart: state.cart.filter((item: any) => item.id !== action.payload.id),
      };
    case "CHANGE_QUANTITY":
      return {
        ...state,
        cart: state.cart.map((item: any) => {
          if (item.id === action.payload.id) {
            return { ...item, qty: action.payload.qty, total: action.payload.qty * item.price };
          }
          return item;
        }),
      };

    case "CLEAR_CART":
      return { ...state, cart: [] };

    default:
      return state;
  }
};
