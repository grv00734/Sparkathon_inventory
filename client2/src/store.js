import { configureStore } from '@reduxjs/toolkit';
import exampleReducer from './reducers/exampleReducer'; // Make sure this file exists or change to your real reducer

const store = configureStore({
  reducer: {
    example: exampleReducer,
  },
});

export default store;

