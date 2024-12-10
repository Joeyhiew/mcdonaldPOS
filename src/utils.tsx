import { Tag } from 'antd';
import { CustomerType } from './store/orders';

export const getUserTag = (userType: CustomerType) => {
  switch (userType) {
    case CustomerType.VIP:
      return <Tag color="gold">VIP</Tag>;
    case CustomerType.NORMAL:
      return <Tag color="blue">Normal</Tag>;
    default:
      return null;
  }
};
