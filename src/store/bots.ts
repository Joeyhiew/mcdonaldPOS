import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export enum BotStatus {
  IDLE = 'IDLE',
  BUSY = 'BUSY',
}

export type Bots = {
  id: number;
  status: BotStatus;
  orderId: number | null;
};

export type BotsState = {
  bots: Bots[];
  lastBotId: number;
};

const initialState: BotsState = {
  bots: [],
  lastBotId: 0,
};

export type UpdateBotStatusPayloadType = {
  botId: number;
  status: BotStatus;
  orderId: number | null;
};

export const botsSlice = createSlice({
  name: 'bots',
  initialState,
  reducers: {
    addBots: (state) => {
      const newBotId = state.lastBotId + 1;
      state.lastBotId = newBotId;
      const newBot = {
        id: newBotId,
        status: BotStatus.IDLE,
        orderId: null,
      };
      state.bots = [...state.bots, newBot];
    },
    removeBots: (state) => {
      // remove the last bot at the end of the array, since FIFO
      state.bots.pop();
    },
    updateBotStatus: (
      state,
      action: PayloadAction<UpdateBotStatusPayloadType>
    ) => {
      const { botId, status, orderId } = action.payload;
      state.bots = state.bots.map((bot) => {
        if (bot.id === botId) {
          return {
            ...bot,
            status,
            orderId,
          };
        }
        return bot;
      });
    },
    setStatusToBusyThenIdle: (state, action) => {
      const { botId, orderId } = action.payload;
      state.bots?.map((bot) => {
        if (bot.id === botId) {
          return {
            ...bot,
            status: BotStatus.BUSY,
            orderId,
          };
        }
      });

      setTimeout(() => {
        state.bots?.map((bot) => {
          if (bot.id === botId) {
            return {
              ...bot,
              status: BotStatus.IDLE,
              orderId: null,
            };
          }
        });
      }, 10000);
    },
  },
});

export const { addBots, removeBots, setStatusToBusyThenIdle, updateBotStatus } =
  botsSlice.actions;

export default botsSlice.reducer;
