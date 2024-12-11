import { Button, Card, Tag, Progress } from 'antd';
import { useDispatch, useSelector } from 'react-redux';
import { addBots, BotStatus, removeBots, updateBotStatus } from './store/bots';
import { StoreType } from './store/store';
import { useEffect, useState } from 'react';
import {
  addUnprocessedNormalOrder,
  addUnprocessedVIPOrder,
  CustomerType,
  OrderStatus,
  updateOrderStatus,
} from './store/orders';

const Cook = () => {
  const [timer, setTimer] = useState(new Map());
  const dispatch = useDispatch();
  const bots = useSelector((state: StoreType) => state.bots.bots);
  const pendingOrders = useSelector(
    (state: StoreType) => state.orders.pendingOrders
  );
  const processingOrders = useSelector(
    (state: StoreType) => state.orders.processingOrders
  );

  const freeBots = bots.filter((bot) => bot.status === BotStatus.IDLE);

  useEffect(() => {
    if (freeBots.length > 0 && pendingOrders.length > 0) {
      const orderId = pendingOrders[0].id;
      const botId = freeBots[0].id;

      // set bot to busy
      setBotToBusy(orderId, botId);

      // set order status to processing
      setOrderToProcessing(orderId);

      // set interval to update progress bar every 0.1sec
      updateProgressBar(orderId, botId);

      // simulate cooking time
      setCookingTimer(orderId, botId);
    }
  }, [freeBots, pendingOrders]);

  function setBotToBusy(orderId: number, botId: number) {
    dispatch(
      updateBotStatus({
        orderId: orderId,
        status: BotStatus.BUSY,
        botId: botId,
        progress: 0,
      })
    );
  }

  function setOrderToProcessing(orderId: number) {
    dispatch(
      updateOrderStatus({
        orderId: orderId,
        status: OrderStatus.PROCESSING,
      })
    );
  }

  function updateProgressBar(orderId: number, botId: number) {
    let progress = 0;
    const interval = setInterval(() => {
      progress += 1;
      dispatch(
        updateBotStatus({
          orderId: orderId,
          status: BotStatus.BUSY,
          botId: botId,
          progress,
        })
      );
      if (progress >= 100) {
        clearInterval(interval);
      }
    }, 100);
  }

  function setCookingTimer(orderId: number, botId: number) {
    const timerId = setTimeout(() => {
      // set order to complete
      dispatch(
        updateOrderStatus({
          orderId: orderId,
          status: OrderStatus.COMPLETE,
        })
      );
      // set bot to idle
      dispatch(
        updateBotStatus({
          orderId: null,
          status: BotStatus.IDLE,
          botId: botId,
          progress: null,
        })
      );
    }, 10000);
    const newTimerData = new Map(timer);
    newTimerData.set(botId, timerId);
    setTimer(newTimerData);
  }
    
    function shouldDisableRemoveBot() {
      return bots.length === 0;
    }

  const handleAddBot = () => {
    dispatch(addBots());
  };

  const handleRemoveBot = () => {
    const botToBeRemoved = bots[bots.length - 1];
    const processingOrderId = botToBeRemoved.orderId;
    const processingOrder = processingOrders.find(
      (order) => order.id === processingOrderId
    );
    // cancel timer
    if (timer.has(botToBeRemoved.id)) {
      clearTimeout(timer.get(botToBeRemoved.id));
      const newTimerData = new Map(timer);
      newTimerData.delete(botToBeRemoved.id);
      setTimer(newTimerData);
    }
    // if bot is currently processing an order, add it to the pending queue before destroying bot
    if (processingOrder) {
      const isVIP = processingOrder.customerType === CustomerType.VIP;
      if (isVIP) {
        dispatch(addUnprocessedVIPOrder({ newOrder: processingOrder }));
      } else {
        dispatch(addUnprocessedNormalOrder({ newOrder: processingOrder }));
      }
    }
    dispatch(removeBots());
  };

  const getBotTag = (status: BotStatus) => {
    switch (status) {
      case BotStatus.IDLE:
        return <Tag color="green">IDLE</Tag>;
      case BotStatus.BUSY:
        return <Tag color="red">BUSY</Tag>;
      default:
        return;
    }
  };

  return (
    <div
      className="flex-1 border rounded-lg h-full p-8"
      style={{ backgroundColor: 'white' }}
    >
      <div className="flex justify-between">
        <h1 className="text-theme-yellow font-bold text-2xl mb-4">Kitchen</h1>
        <div className="flex gap-2">
          <Button onClick={handleAddBot}>+ Bot</Button>
                  <Button onClick={handleRemoveBot} disabled={shouldDisableRemoveBot()}>- Bot</Button>
        </div>
      </div>
      <>
        {bots.length === 0 ? (
          <div className="h-full flex justify-center items-center text-slate-400">
            No cooking bots. Go create some!
          </div>
        ) : (
          <div className='flex flex-col gap-4 h-[calc(100%-48px)] overflow-y-scroll'>
            {bots?.map((bot) => (
              <Card
                key={bot.id}
                title={`Bot ${bot.id}`}
                extra={getBotTag(bot.status)}
              >
                {bot.status === BotStatus.IDLE ? (
                  <div>Bot is free</div>
                ) : (
                  <div>
                    <div>
                      <h3>Order # {bot.orderId}</h3>
                    </div>
                    {bot.progress && <Progress percent={bot.progress} />}
                  </div>
                )}
              </Card>
            ))}
          </div>
        )}
      </>
    </div>
  );
};
export default Cook;
