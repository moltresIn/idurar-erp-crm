import React, { useState, useEffect } from 'react';
import { Table, Button, Pagination, Select, Spin, message } from 'antd';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const { Option } = Select;

const QueryList = () => {
  const [queries, setQueries] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [statusFilter, setStatusFilter] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

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
        <Button type="primary" onClick={() => navigate(`/queries/${record._id}`)}>
          Edit
        </Button>
      ),
    },
  ];

  return (
    <div style={{ padding: '20px', maxWidth: '1000px', margin: '0 auto' }}>
      {loading && <Spin tip="Loading..." />}
      {error && <p style={{ color: 'red' }}>{error}</p>}
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
