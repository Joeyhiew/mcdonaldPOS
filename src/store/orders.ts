import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export enum OrderStatus {
  PENDING = 'PENDING',
  PROCESSING = 'PROCESSING',
  COMPLETE = 'COMPLETE',
}

export enum CustomerType {
  VIP = 'VIP',
  NORMAL = 'NORMAL',
}

export type OrderType = {
  id: number;
  customerType: CustomerType;
  items: string[];
};

export type OrderState = {
  pendingOrders: OrderType[];
  processingOrders: OrderType[];
  completedOrders: OrderType[];
  lastOrderId: number;
};

const initialState: OrderState = {
  pendingOrders: [],
  processingOrders: [],
  completedOrders: [],
  lastOrderId: 0,
};

export type AddOrderPayloadType = {
  newOrder: OrderType;
};

export type UpdateOrderStatusPayloadType = {
  orderId: number;
  status: OrderStatus;
};

export const orderSlice = createSlice({
  name: 'orders',
  initialState,
  reducers: {
    addNormalOrder: (state, action: PayloadAction<AddOrderPayloadType>) => {
      const { newOrder } = action.payload;
      // insert normal order at the end of array
      state.pendingOrders.push(newOrder);
      state.lastOrderId++;
    },
    addUnprocessedNormalOrder: (
      state,
      action: PayloadAction<AddOrderPayloadType>
    ) => {
      const { newOrder } = action.payload;
      // insert normal order at the front of normal orders
      const lastVIPIndex = state.pendingOrders.findLastIndex(
        (order) => order.customerType === CustomerType.VIP
      );
      state.pendingOrders.splice(lastVIPIndex + 1, 0, newOrder);
    },
    addVIPOrder: (state, action: PayloadAction<AddOrderPayloadType>) => {
      const lastVIPIndex = state.pendingOrders.findLastIndex(
        (order) => order.customerType === CustomerType.VIP
      );
      const { newOrder } = action.payload;
      // if no VIP order, insert at the beginning
      // if there exists VIP orders, insert after the last VIP order
      state.pendingOrders.splice(lastVIPIndex + 1, 0, newOrder);
      state.lastOrderId++;
    },
    addUnprocessedVIPOrder: (
      state,
      action: PayloadAction<AddOrderPayloadType>
    ) => {
      const { newOrder } = action.payload;
      // insert unprocessed VIP order at the front of the queue
      state.pendingOrders.splice(0, 0, newOrder);
    },
    updateOrderStatus: (
      state,
      action: PayloadAction<UpdateOrderStatusPayloadType>
    ) => {
      const { orderId, status } = action.payload;
      switch (status) {
        case OrderStatus.PENDING:
          // move order from processing to pending
          const pendingIndex = state.processingOrders.findIndex(
            (order) => order.id === orderId
          );
          if (pendingIndex !== -1) {
            const pendingOrder = state.pendingOrders[pendingIndex];
            state.processingOrders.splice(pendingIndex, 1);
            const isVIP = pendingOrder.customerType === CustomerType.VIP;
            if (isVIP) {
              state.pendingOrders.unshift(pendingOrder);
            } else {
              state.pendingOrders.push(pendingOrder);
            }
          }
          break;
        case OrderStatus.PROCESSING:
          // move order from pending to processing
          const processingIndex = state.pendingOrders.findIndex(
            (order) => order.id === orderId
          );
          if (processingIndex !== -1) {
            const processingOrder = state.pendingOrders[processingIndex];

            state.pendingOrders.splice(processingIndex, 1);
            state.processingOrders.push(processingOrder);
          }
          break;
        case OrderStatus.COMPLETE:
          // move order from processing to completed
          const completedIndex = state.processingOrders.findIndex(
            (order) => order.id === orderId
          );
          if (completedIndex !== -1) {
            const completedOrder = state.processingOrders[completedIndex];
            state.processingOrders.splice(completedIndex, 1);
            state.completedOrders.push(completedOrder);
          }
          break;
      }
    },
  },
});

export const {
  addNormalOrder,
  addVIPOrder,
  updateOrderStatus,
  addUnprocessedNormalOrder,
  addUnprocessedVIPOrder,
} = orderSlice.actions;

export default orderSlice.reducer;
