export const FETCH_ORDERS_HISTORY = "FETCH_ORDERS_HISTORY";
export const fetchOrdersHistoryAction = (orders) => {
    return {
        type: "FETCH_ORDERS_HISTORY",
        payload: orders
    }
}


export const FETCH_PRODUCTS_IN_CART = "FETCH_PRODUCTS_IN_CART";
export const fetchProductsInCartAction = (products) => {
    return {
        type: "FETCH_PRODUCTS_IN_CART",
        payload: products
    }
}
export const FETCH_PRODUCTS_IN_LIKE = "FETCH_PRODUCTS_IN_LIKE";
export const fetchProductsInLikeAction = (products) => {
    return {
        type: "FETCH_PRODUCTS_IN_LIKE",
        payload: products
    }
}
// signinのアクション
export const SIGN_IN = "SIGN_IN";
export const signInAction = (userState) => {
  return {
    type: "SIGN_IN",
    payload: {
      customer_id: userState.customer_id,
      payment_method_id: userState.payment_method_id,
      isSignedIn: true,
      email: userState.email,
      // roleカラムを追加
      role: userState.role,
      uid: userState.uid,
      username: userState.username
    }
  }
};

export const SIGN_OUT = "SIGN_OUT";
export const signOutAction = () => {
  return {
    type: "SIGN_OUT",
    payload: {
      isSignedIn: false,
      role: "",
      uid: "",
      username: ""
    }
  }
};
export const UPDATE_USER_STATE = "UPDATE_USER_STATE";
export const updateUserStateAction = (userState) => {
  return {
    type: "UPDATE_USER_STATE",
    payload: userState
  }
};