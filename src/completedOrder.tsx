import { useSelector } from 'react-redux';
import { StoreType } from './store/store';
import { Card } from 'antd';
import { getUserTag } from './utils';

const CompletedOrder = () => {
  const orders = useSelector(
    (state: StoreType) => state.orders.completedOrders
  );
  const hasOrders = orders.length > 0;

  return (
    <div
      className="flex-1 border rounded-lg h-full p-8"
      style={{ backgroundColor: 'white' }}
    >
      <div className="flex justify-between mb-4">
        <h1 className="text-theme-yellow font-bold text-2xl">
          Completed orders
        </h1>
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
          No completed orders.
        </div>
      )}
    </div>
  );
};
export default CompletedOrder;
