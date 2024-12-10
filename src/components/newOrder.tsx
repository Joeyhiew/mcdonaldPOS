import { useState } from 'react';
import { Button, Checkbox, Form, Radio, Modal } from 'antd';
import type { FormProps } from 'antd';
import { useDispatch, useSelector } from 'react-redux';
import {
  addNormalOrder,
  addVIPOrder,
  CustomerType,
  OrderStatus,
  OrderType,
} from '../store/orders';
import { StoreType } from '../store/store';

type FieldType = {
  customerType: CustomerType;
  items: string[];
};

const CreateNewOrder = () => {
  const dispatch = useDispatch();
  const lastOrderId = useSelector(
    (state: StoreType) => state.orders.lastOrderId
  );
  const [open, setOpen] = useState(false);

  const handleOpenOrderModal = () => {
    setOpen(true);
  };
  const handleCloseOrderModal = () => {
    setOpen(false);
  };

  const handleAddOrder = (order: OrderType) => {
    if (order.customerType === CustomerType.VIP) {
      dispatch(addVIPOrder({ newOrder: order }));
    } else {
      dispatch(addNormalOrder({ newOrder: order }));
    }
  };

  const getNewOrderId = () => {
    return lastOrderId + 1;
  };

  const onFinish: FormProps<FieldType>['onFinish'] = (values) => {
    handleCloseOrderModal();
    const newOrder: OrderType = {
      id: getNewOrderId(),
      customerType: values.customerType,
      items: values.items,
      status: OrderStatus.PENDING,
    };
    handleAddOrder(newOrder);
  };

  const onFinishFailed: FormProps<FieldType>['onFinishFailed'] = (
    errorInfo
  ) => {
    console.log('Failed:', errorInfo);
  };

  return (
    <>
      <Button onClick={handleOpenOrderModal}>Create new order</Button>
      <Modal
        open={open}
        title="Create a new order"
        okText="Create order"
        cancelText="Cancel"
        okButtonProps={{ autoFocus: true, htmlType: 'submit' }}
        onCancel={handleCloseOrderModal}
        destroyOnClose
        modalRender={(dom) => (
          <Form
            name="basic"
            labelCol={{ span: 8 }}
            wrapperCol={{ span: 16 }}
            style={{ maxWidth: 600 }}
            layout="vertical"
            initialValues={{ remember: true }}
            onFinish={onFinish}
            onFinishFailed={onFinishFailed}
            autoComplete="off"
          >
            {dom}
          </Form>
        )}
      >
        <Form.Item<FieldType>
          name="customerType"
          label="Select membership"
          rules={[{ required: true, message: 'Please select user type' }]}
        >
          <Radio.Group>
            <Radio value={CustomerType.VIP}>VIP</Radio>
            <Radio value={CustomerType.NORMAL}>Normal</Radio>
          </Radio.Group>
        </Form.Item>

        <Form.Item<FieldType>
          name="items"
          label="Select food"
          rules={[
            { required: true, message: 'Please select at least 1 food item' },
          ]}
        >
          <Checkbox.Group>
            <Checkbox value="apple">Apple</Checkbox>
            <Checkbox value="banana">Banana</Checkbox>
            <Checkbox value="orange">Orange</Checkbox>
          </Checkbox.Group>
        </Form.Item>
      </Modal>
    </>
  );
};
export default CreateNewOrder;
