import {
  LOAD_PRODUCTS,
  SET_LISTVIEW,
  SET_GRIDVIEW,
  UPDATE_SORT,
  SORT_PRODUCTS,
  UPDATE_FILTERS,
  FILTER_PRODUCTS,
  CLEAR_FILTERS,
} from "../actions";

const filter_reducer = (state, action) => {
  if (action.type === LOAD_PRODUCTS) {
    const maxPrice = Math.max(...action.payload.map((p) => p.price));

    const minPrice = Math.min(...action.payload.map((p) => p.price));

    return {
      ...state,
      all_products: [...action.payload],
      filtered_products: [...action.payload],
      filters: {
        ...state.filters,
        max_price: maxPrice,
        min_price: minPrice,
        price: maxPrice,
      },
    };
  }
  if (action.type === SET_GRIDVIEW) {
    return { ...state, grid_view: true };
  }
  if (action.type === SET_LISTVIEW) {
    return { ...state, grid_view: false };
  }
  if (action.type === UPDATE_SORT) {
    return { ...state, sort: action.payload };
  }
  if (action.type === SORT_PRODUCTS) {
    const { sort, filtered_products } = state;
    if (sort === "price-lowest") {
      const sorted = filtered_products.sort((a, b) => a.price - b.price);
      return { ...state, filtered_products: sorted };
    }
    if (sort === "price-highest") {
      const sorted = filtered_products.sort((a, b) => b.price - a.price);
      return { ...state, filtered_products: sorted };
    }
    if (sort === "name-a") {
      console.log("sorting");
      const sorted = filtered_products.sort((a, b) =>
        a.name.localeCompare(b.name)
      );

      return { ...state, filtered_products: sorted };
    }
    if (sort === "name-z") {
      const sorted = filtered_products.sort((a, b) =>
        b.name.localeCompare(a.name)
      );
      return { ...state, filtered_products: sorted };
    }
  }

  if (action.type === UPDATE_FILTERS) {
    const { name, value } = action.payload;

    return { ...state, filters: { ...state.filters, [name]: value } };
  }

  if (action.type === FILTER_PRODUCTS) {
    const { all_products } = state;
    const { text, company, category, color, price, shipping } = state.filters;
    let tempProducts = [...all_products];

    if (text) {
      tempProducts = tempProducts.filter((product) => {
        return product.name.toLowerCase().startsWith(text);
      });
    }
    if (company !== "all") {
      tempProducts = tempProducts.filter((product) => {
        return product.company === company;
      });
    }
    if (category !== "all") {
      tempProducts = tempProducts.filter((product) => {
        return product.category === category;
      });
    }
    if (color !== "all") {
      tempProducts = tempProducts.filter((product) => {
        return product.colors.includes(color);
      });
    }

    tempProducts = tempProducts.filter((product) => {
      return product.price <= price;
    });

    if (shipping) {
      tempProducts = tempProducts.filter((product) => {
        return product.shipping === true;
      });
    }
    return { ...state, filtered_products: tempProducts };
  }
  if (action.type === CLEAR_FILTERS) {
    return {
      ...state,
      filters: {
        ...state.filters,
        text: "",
        company: "all",
        category: "all",
        color: "all",
        price: state.filters.max_price,

        shipping: false,
      },
    };
  }

  throw new Error(`No Matching "${action.type}" - action type`);
};

export default filter_reducer;
