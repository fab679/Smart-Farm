const initialState: any = {
  cart: Array<any>(),
};

export const initializer = (initialValue = initialState) => {
  return {
    cart: JSON.parse(localStorage.getItem("cart") as string) || initialValue,
  };
};
