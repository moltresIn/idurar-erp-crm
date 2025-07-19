import React, { useState } from 'react';
import { Form, Input, Select, Button, Spin } from 'antd';

const { Option } = Select;
const { TextArea } = Input;

const QueryForm = () => {
  const [form] = Form.useForm(); // Ant Design form hook
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const handleSubmit = async (values) => {
    console.log(values);
  };

  return (
    <div style={{ padding: '20px', maxWidth: '600px', margin: '0 auto' }}>
      {loading && <Spin tip="Loading..." />}
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <Form form={form} onFinish={handleSubmit} layout="vertical">
        <Form.Item
          label="Customer Name"
          name="customerName"
          rules={[{ required: true, message: 'Please enter customer name' }]}
        >
          <Input placeholder="Enter customer name" />
        </Form.Item>
        <Form.Item
          label="Description"
          name="description"
          rules={[{ required: true, message: 'Please enter description' }]}
        >
          <TextArea rows={4} placeholder="Enter description" />
        </Form.Item>
        <Form.Item label="Status" name="status" initialValue="Open">
          <Select>
            <Option value="Open">Open</Option>
            <Option value="InProgress">InProgress</Option>
            <Option value="Closed">Closed</Option>
          </Select>
        </Form.Item>
        <Form.Item label="Resolution" name="resolution">
          <TextArea rows={4} placeholder="Enter resolution" />
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit" loading={loading}>
            Save
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default QueryForm;
