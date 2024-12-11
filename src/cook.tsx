import { Button, Card, Tag } from 'antd';
import { useDispatch, useSelector } from 'react-redux';
import { addBots, BotStatus, removeBots, updateBotStatus } from './store/bots';
import { StoreType } from './store/store';
import { useEffect } from 'react';
import {
  addNormalOrder,
  addVIPOrder,
  CustomerType,
  OrderStatus,
  updateOrderStatus,
} from './store/orders';

const Cook = () => {
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
      const order = pendingOrders[0];
      const targetBot = freeBots[0];

      // set bot to busy
      dispatch(
        updateBotStatus({
          orderId: order.id,
          status: BotStatus.BUSY,
          botId: targetBot.id,
        })
      );
      // set order status to processing
      dispatch(
        updateOrderStatus({
          orderId: order.id,
          status: OrderStatus.PROCESSING,
        })
      );

      // simulate cooking time and set order to complete and bot to idle
      setTimeout(() => {
        dispatch(
          updateOrderStatus({
            orderId: order.id,
            status: OrderStatus.COMPLETE,
          })
        );
        dispatch(
          updateBotStatus({
            orderId: null,
            status: BotStatus.IDLE,
            botId: targetBot.id,
          })
        );
      }, 10000);
    }
  }, [freeBots, pendingOrders]);

  const handleAddBot = () => {
    dispatch(addBots());
  };

  const handleRemoveBot = () => {
    const botToBeRemoved = bots[bots.length - 1];
    const processingOrderId = botToBeRemoved.orderId;
    const processingOrder = processingOrders.find(
      (order) => order.id === processingOrderId
    );
    // if bot is currently processing an order, add it to the pending queue before destroying bot
    if (processingOrder) {
      const isVIP = processingOrder.customerType === CustomerType.VIP;
      if (isVIP) {
        dispatch(addVIPOrder({ newOrder: processingOrder }));
      } else {
        dispatch(addNormalOrder({ newOrder: processingOrder }));
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
          <Button onClick={handleRemoveBot}>- Bot</Button>
        </div>
      </div>
      <>
        {bots.length === 0 ? (
          <div className="h-full flex justify-center items-center text-slate-400">
            No cooking bots. Go create some!
          </div>
        ) : (
          <>
            {bots?.map((bot) => (
                <Card key={bot.id} title={`Bot ${bot.id}`} extra={getBotTag(bot.status)}>
                {bot.status === BotStatus.IDLE ? (
                  <div>Bot is free</div>
                ) : (
                  <div>
                    <div>
                      <h3>Order # {bot.orderId}</h3>
                    </div>
                  </div>
                )}
              </Card>
            ))}
          </>
        )}
      </>
    </div>
  );
};
export default Cook;
