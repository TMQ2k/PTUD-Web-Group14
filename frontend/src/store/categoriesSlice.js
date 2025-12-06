import { createSlice } from "@reduxjs/toolkit";

const categoriesSlice = createSlice({
  name: "categories",
  initialState: {
    categories: [],
    loading: false,
    error: null,
  },
  reducers: {
    setCategories: (state, action) => {
      state.categories = action.payload; // Mảng danh mục
      state.loading = false;
      state.error = null;
    },
    setCategoriesLoading: (state) => {
      state.loading = true;
      state.error = null;
    },
    setCategoriesError: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
  },
});

export const { setCategories, setCategoriesLoading, setCategoriesError } =
  categoriesSlice.actions;
export default categoriesSlice.reducer;
