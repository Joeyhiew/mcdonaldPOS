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
  status: OrderStatus;
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
            console.log(
              'pengin',
              state.pendingOrders,
              processingIndex,
              processingOrder
            );

            state.pendingOrders.splice(processingIndex, 1);
            console.log('pengin', state.pendingOrders);
            state.processingOrders.push(processingOrder);
            console.log('processing', state.processingOrders);
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
      const order = state.pendingOrders.find((order) => order.id === orderId);
      if (order) {
        order.status = status;
      }
    },
  },
});

export const { addNormalOrder, addVIPOrder, updateOrderStatus } =
  orderSlice.actions;

export default orderSlice.reducer;