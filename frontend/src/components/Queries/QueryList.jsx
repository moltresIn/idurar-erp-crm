import React, { useState, useEffect } from 'react';
import { Table, Button, Pagination, Select, Spin } from 'antd';
import { useNavigate } from 'react-router-dom';
import request from '@/request/request'; // Your request utility

const { Option } = Select;

const QueryList = () => {
  const [queries, setQueries] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [statusFilter, setStatusFilter] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetchQueries();
  }, [page, statusFilter]);

  const fetchQueries = async () => {
    setLoading(true);
    try {
      const response = await request.get({
        entity: `queries?page=${page}&limit=10${statusFilter ? `&status=${statusFilter}` : ''}`,
      });
      setQueries(response.queries || []);
      setTotalPages(response.pages || 1);
    } catch (error) {
      // Handled by request.errorHandler
    } finally {
      setLoading(false);
    }
  };

  const columns = [
    {
      title: 'Customer Name',
      dataIndex: 'customerName',
      key: 'customerName',
    },
    {
      title: 'Description',
      dataIndex: 'description',
      key: 'description',
    },
    {
      title: 'Created Date',
      dataIndex: 'createdDate',
      key: 'createdDate',
      render: (date) => new Date(date).toLocaleDateString(),
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
    },
    {
      title: 'Resolution',
      dataIndex: 'resolution',
      key: 'resolution',
      render: (text) => (text ? `${text.substring(0, 50)}...` : ''),
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_, record) => (
        <>
          <Button
            type="primary"
            onClick={() => navigate(`/queries/${record._id}`)}
            style={{ marginRight: 8 }}
          >
            Edit
          </Button>
          <Button type="default" onClick={() => navigate(`/queries/${record._id}/notes`)}>
            View Notes
          </Button>
        </>
      ),
    },
  ];

  return (
    <div style={{ padding: '20px', maxWidth: '1000px', margin: '0 auto' }}>
      {loading && <Spin tip="Loading..." />}
      <div style={{ marginBottom: '16px' }}>
        <Select
          style={{ width: 200 }}
          value={statusFilter}
          onChange={(value) => setStatusFilter(value)}
          placeholder="Filter by status"
          allowClear
        >
          <Option value="">All Statuses</Option>
          <Option value="Open">Open</Option>
          <Option value="InProgress">InProgress</Option>
          <Option value="Closed">Closed</Option>
        </Select>
        <Button
          type="primary"
          style={{ marginLeft: '16px' }}
          onClick={() => navigate('/queries/new')}
        >
          Add Query
        </Button>
      </div>
      <Table columns={columns} dataSource={queries} rowKey="_id" pagination={false} bordered />
      <Pagination
        current={page}
        total={totalPages * 10}
        pageSize={10}
        onChange={(newPage) => setPage(newPage)}
        style={{ marginTop: '16px', textAlign: 'right' }}
      />
    </div>
  );
};

export default QueryList;
