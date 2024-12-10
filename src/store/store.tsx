import { configureStore } from '@reduxjs/toolkit';
import orderReducer, { OrderState } from './orders';
import botsReducer, { BotsState } from './bots';

export type StoreType = {
  orders: OrderState;
  bots: BotsState;
};

const store = configureStore({
  reducer: {
    orders: orderReducer,
    bots: botsReducer,
  },
  devTools: true,
});

export default store;
