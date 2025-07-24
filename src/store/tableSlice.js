import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  data: [],
};

export const tableSlice = createSlice({
  name: "table",
  initialState,
  reducers: {
    setData: (state, action) => {
      state.data = action.payload;
    },
    addEntry: (state, action) => {
      state.data.unshift(action.payload);
    },
    updateEntry: (state, action) => {
      const { id, updated } = action.payload;
      const index = state.data.findIndex((entry) => entry.id === id);
      if (index !== -1) {
        state.data[index] = { ...state.data[index], ...updated };
      }
    },
  },
});

export const { setData, addEntry, updateEntry } = tableSlice.actions;
export default tableSlice.reducer;
