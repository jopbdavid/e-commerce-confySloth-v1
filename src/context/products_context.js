import axios from "axios";
import React, { useContext, useEffect, useReducer } from "react";
import reducer from "../reducers/products_reducer";
import { single_product_url, products_url as url } from "../utils/constants";
import {
  SIDEBAR_OPEN,
  SIDEBAR_CLOSE,
  GET_PRODUCTS_BEGIN,
  GET_PRODUCTS_SUCCESS,
  GET_PRODUCTS_ERROR,
  GET_SINGLE_PRODUCT_BEGIN,
  GET_SINGLE_PRODUCT_SUCCESS,
  GET_SINGLE_PRODUCT_ERROR,
} from "../actions";

const initialState = {
  isSidebarOpen: false,
  products_loading: false,
  products_error: false,
  products: [],
  featured_products: [],
  singleProduct_loading: false,
  singleProduct_error: false,
  singleProduct: [],
};

const ProductsContext = React.createContext();

export const ProductsProvider = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initialState);

  const openSidebar = () => {
    dispatch({ type: SIDEBAR_OPEN });
  };

  const closeSidebar = () => {
    dispatch({ type: SIDEBAR_CLOSE });
  };

  const getProductsBegin = () => {
    dispatch({ type: GET_PRODUCTS_BEGIN });
  };

  const getProductsSuccess = (products) => {
    dispatch({ type: GET_PRODUCTS_SUCCESS, payload: products });
  };

  const getProductsError = () => {
    dispatch({ type: GET_PRODUCTS_ERROR });
  };

  const fetchProducts = async (url) => {
    try {
      getProductsBegin();
      const response = await axios.get(url);
      const products = response.data;
      getProductsSuccess(products);
    } catch (error) {
      getProductsError();
    }
  };

  const fetchSingleProduct = async (id) => {
    try {
      dispatch({ type: GET_SINGLE_PRODUCT_BEGIN });
      const response = await axios.get(`${single_product_url}${id}`);
      const product = response.data;

      dispatch({ type: GET_SINGLE_PRODUCT_SUCCESS, payload: product });
    } catch (error) {
      dispatch({ type: GET_SINGLE_PRODUCT_ERROR });
    }
  };

  useEffect(() => {
    fetchProducts(url);
  }, []);

  return (
    <ProductsContext.Provider
      value={{
        ...state,
        openSidebar,
        closeSidebar,
        getProductsBegin,
        getProductsSuccess,
        getProductsError,
        fetchSingleProduct,
      }}
    >
      {children}
    </ProductsContext.Provider>
  );
};
// make sure use
export const useProductsContext = () => {
  return useContext(ProductsContext);
};
