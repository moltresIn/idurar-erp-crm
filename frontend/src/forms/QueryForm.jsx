import React, { useState, useEffect } from 'react';
import { Form, Input, Select, Button, Spin } from 'antd';
import { useParams, useNavigate } from 'react-router-dom';
import request from '@/request/request';

const { Option } = Select;
const { TextArea } = Input;

const QueryForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [customers, setCustomers] = useState([]);

  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        const response = await request.get({ entity: 'customers' });
        setCustomers(response.customers || []);
      } catch (error) {
        console.error(error);
      }
    };
    fetchCustomers();

    if (id) {
      setLoading(true);
      request
        .get({ entity: `queries/${id}` })
        .then((data) => {
          form.setFieldsValue(data);
        })
        .catch((error) => {
          console.error(error);
        })
        .finally(() => setLoading(false));
    }
  }, [id, form]);

  const handleSubmit = async (values) => {
    setLoading(true);
    try {
      if (id) {
        await request.patch({ entity: `queries/${id}`, jsonData: values });
      } else {
        await request.post({ entity: 'queries', jsonData: values });
      }
      navigate('/queries');
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: '20px', maxWidth: '600px', margin: '0 auto' }}>
      {loading && <Spin tip="Loading..." />}
      <Form form={form} onFinish={handleSubmit} layout="vertical">
        <Form.Item
          label="Customer Name"
          name="customerName"
          rules={[{ required: true, message: 'Please select a customer' }]}
        >
          <Select placeholder="Select customer" showSearch optionFilterProp="children">
            {customers.map((customer) => (
              <Option key={customer._id} value={customer.name}>
                {customer.name}
              </Option>
            ))}
          </Select>
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
