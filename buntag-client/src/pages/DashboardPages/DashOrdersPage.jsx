import { Box, Button, Chip, MenuItem, Select, Stack, Typography } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import { useEffect, useState } from 'react';
import { fetchAllOrders, updateOrderStatus } from '../../services/OrderService';

const nextStatusMap = {
  Pending: 'Confirmed',
  Confirmed: 'Ready for Claiming',
  'Ready for Claiming': 'Completed',
};

const statusColor = {
  Pending: 'warning',
  Confirmed: 'info',
  'Ready for Claiming': 'secondary',
  Completed: 'success',
  Cancelled: 'default',
};

const DashOrdersPage = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('all');

  const loadOrders = async () => {
    try {
      setLoading(true);
      const { data } = await fetchAllOrders();
      setOrders(data);
    } catch (error) {
      console.error('Failed to load orders', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadOrders();
  }, []);

  const handleAdvance = async (id, current) => {
    const next = nextStatusMap[current];
    if (!next) return;
    try {
      await updateOrderStatus(id, next);
      loadOrders();
    } catch (error) {
      console.error('Failed to update order status', error);
    }
  };

  const handleCancel = async (id) => {
    try {
      await updateOrderStatus(id, 'Cancelled');
      loadOrders();
    } catch (error) {
      console.error('Failed to cancel order', error);
    }
  };

  const filteredOrders =
    statusFilter === 'all' ? orders : orders.filter((o) => o.status === statusFilter);

  const columns = [
    { field: '_id', headerName: 'Order ID', width: 220 },
    {
      field: 'customer',
      headerName: 'Customer',
      flex: 1,
      valueGetter: (_, row) => row.user?.name || 'Unknown',
    },
    {
      field: 'items',
      headerName: 'Items',
      flex: 1.4,
      valueGetter: (_, row) =>
        row.products.map((p) => `${p.product?.productName || 'Product'} x${p.quantity}`).join(', '),
    },
    { field: 'totalAmount', headerName: 'Total', width: 110, type: 'number' },
    {
      field: 'status',
      headerName: 'Status',
      width: 170,
      renderCell: ({ row }) => <Chip size="small" label={row.status} color={statusColor[row.status] || 'default'} />,
    },
    {
      field: 'actions',
      headerName: 'Actions',
      width: 260,
      sortable: false,
      renderCell: ({ row }) => (
        <Stack direction="row" spacing={1}>
          {nextStatusMap[row.status] && (
            <Button size="small" variant="contained" onClick={() => handleAdvance(row._id, row.status)}>
              Mark {nextStatusMap[row.status]}
            </Button>
          )}
          {row.status !== 'Completed' && row.status !== 'Cancelled' && (
            <Button size="small" variant="outlined" color="error" onClick={() => handleCancel(row._id)}>
              Cancel
            </Button>
          )}
        </Stack>
      ),
    },
  ];

  return (
    <Box sx={{ width: '100%' }}>
      <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 2 }}>
        <Typography variant="h4">Orders</Typography>
        <Select size="small" value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
          <MenuItem value="all">All Statuses</MenuItem>
          <MenuItem value="Pending">Pending</MenuItem>
          <MenuItem value="Confirmed">Confirmed</MenuItem>
          <MenuItem value="Ready for Claiming">Ready for Claiming</MenuItem>
          <MenuItem value="Completed">Completed</MenuItem>
          <MenuItem value="Cancelled">Cancelled</MenuItem>
        </Select>
      </Box>

      <Box sx={{ height: 550, width: '100%' }}>
        <DataGrid
          rows={filteredOrders}
          columns={columns}
          getRowId={(row) => row._id}
          loading={loading}
          disableRowSelectionOnClick
          pageSizeOptions={[10, 20]}
          initialState={{ pagination: { paginationModel: { pageSize: 10 } } }}
        />
      </Box>
    </Box>
  );
};

export default DashOrdersPage;
