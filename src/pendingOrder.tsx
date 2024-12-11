import { useSelector } from 'react-redux';
import { Card } from 'antd';
import { getUserTag } from './utils';
import { StoreType } from './store/store';
import CreateNewOrder from './components/newOrder';

const Order = () => {
  // retrieve existing orders from order store
  const orders = useSelector((state: StoreType) => state.orders.pendingOrders);
  const hasOrders = orders.length > 0;

  return (
    <div
      className="flex-1 border rounded-lg h-full p-8"
      style={{ backgroundColor: 'white' }}
    >
      <div className="flex justify-between mb-4">
        <h1 className="text-theme-yellow font-bold text-2xl">Orders</h1>
        <CreateNewOrder />
      </div>
      {hasOrders ? (
        <div className="flex flex-col gap-4 h-[calc(100%-48px)] overflow-y-scroll">
          {orders.map((order) => (
            <Card
              key={order.id}
              size="small"
              title={`Order #${order.id}`}
              extra={getUserTag(order.customerType)}
              className="w-[calc(100%-15px)]"
            >
              {order.items?.map((item) => <div key={item}>{item}</div>)}
            </Card>
          ))}
        </div>
      ) : (
        <div className="h-full flex justify-center items-center text-slate-400">
          No orders. Go create one!
        </div>
      )}
    </div>
  );
};

export default Order;
