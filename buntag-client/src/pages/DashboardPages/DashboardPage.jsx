import Inventory2Icon from '@mui/icons-material/Inventory2';
import PeopleIcon from '@mui/icons-material/People';
import ReceiptLongIcon from '@mui/icons-material/ReceiptLong';
import StoreIcon from '@mui/icons-material/Store';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import { Card, CardContent, Grid, Typography } from '@mui/material';
import Box from '@mui/material/Box';
import { Gauge, gaugeClasses } from '@mui/x-charts/Gauge';
import { DataGrid } from '@mui/x-data-grid';
import 'leaflet/dist/leaflet.css';
import { useEffect, useState } from 'react';
import { MapContainer, Marker, Popup, TileLayer } from 'react-leaflet';
import { fetchAllOrders } from '../../services/OrderService';
import { fetchProducts } from '../../services/ProductService';
import { fetchUsers } from '../../services/UserService';
import { NU_GOLD, NU_NAVY, NU_NAVY_DARK } from '../../theme';

const columns = [
  { field: '_id', headerName: 'ID', width: 200 },
  { field: 'productName', headerName: 'Product', flex: 1 },
  { field: 'price', headerName: 'Price', width: 100, type: 'number' },
  { field: 'stock', headerName: 'Stock', width: 100, type: 'number' },
];

// Small stat card for the top row — icon, label, number
const StatCard = ({ icon, label, value, accent }) => (
  <Card sx={{ height: '100%' }}>
    <CardContent sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          width: 52,
          height: 52,
          borderRadius: '50%',
          bgcolor: accent,
          color: '#fff',
          flexShrink: 0,
        }}
      >
        {icon}
      </Box>
      <Box>
        <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 600 }}>
          {label}
        </Typography>
        <Typography variant="h5" sx={{ fontWeight: 700, color: NU_NAVY_DARK }}>
          {value}
        </Typography>
      </Box>
    </CardContent>
  </Card>
);

// Right-column colored card with a circular gauge — matches the reference's
// Attendance/Homework/Rating cards
const GaugeCard = ({ label, value, bg }) => (
  <Card sx={{ bgcolor: bg, color: '#fff', py: 2 }}>
    <CardContent
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        textAlign: 'center',
      }}
    >
      <Typography sx={{ fontWeight: 700, mb: 1 }}>{label}</Typography>
      <Gauge
        width={130}
        height={130}
        value={value}
        valueMax={100}
        text={({ value }) => `${value}%`}
        sx={{
          [`& .${gaugeClasses.valueText}`]: {
            fill: '#ffffff',
            fontSize: 22,
            fontWeight: 700,
          },
          [`& .${gaugeClasses.valueArc}`]: {
            fill: NU_GOLD,
          },
          [`& .${gaugeClasses.referenceArc}`]: {
            fill: 'rgba(255,255,255,0.25)',
          },
        }}
      />
    </CardContent>
  </Card>
);

function DashboardPage() {
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [totalUsers, setTotalUsers] = useState(0);
  const [loading, setLoading] = useState(true);
  const userRole = localStorage.getItem('role');

  useEffect(() => {
    const loadStats = async () => {
      try {
        const productRes = await fetchProducts({ limit: 100 });
        setProducts(productRes.data?.data || []);

        // Only admins can hit the users list
        if (userRole === 'admin') {
          const userRes = await fetchUsers();
          setTotalUsers(userRes.data?.length || 0);
        }

        const orderRes = await fetchAllOrders();
        setOrders(orderRes.data || []);
      } catch (error) {
        console.warn('Failed to load dashboard stats.', error);
      } finally {
        setLoading(false);
      }
    };
    loadStats();
  }, [userRole]);

  const totalProducts = products.length;
  const lowStockCount = products.filter((p) => p.stock <= 5).length;
  const outOfStockCount = products.filter((p) => p.stock === 0).length;
  const avgPrice = totalProducts
    ? (products.reduce((sum, p) => sum + (p.price || 0), 0) / totalProducts).toFixed(2)
    : 0;

  const stockHealth = totalProducts
    ? Math.round(((totalProducts - outOfStockCount) / totalProducts) * 100)
    : 0;
  const lowStockRate = totalProducts
    ? Math.round((lowStockCount / totalProducts) * 100)
    : 0;

  const totalOrders = orders.length;
  const pendingOrders = orders.filter((o) => o.status === 'Pending').length;
  const completedOrders = orders.filter((o) => o.status === 'Completed').length;
  const fulfillmentRate = totalOrders ? Math.round((completedOrders / totalOrders) * 100) : 0;

  return (
    <Box>
      {/* Top stat row */}
      <Grid container spacing={2.5} sx={{ mb: 3 }}>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <StatCard icon={<Inventory2Icon />} label="Total Products" value={totalProducts} accent={NU_NAVY} />
        </Grid>

        {userRole === 'admin' && (
          <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            <StatCard icon={<PeopleIcon />} label="Total Users" value={totalUsers} accent={NU_NAVY_DARK} />
          </Grid>
        )}

        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <StatCard icon={<StoreIcon />} label="Average Price" value={`₱${avgPrice}`} accent="#7c8fd6" />
        </Grid>

        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <StatCard
            icon={<WarningAmberIcon />}
            label="Low Stock Items"
            value={lowStockCount}
            accent="#c99a1c"
          />
        </Grid>

        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <StatCard
            icon={<ReceiptLongIcon />}
            label="Pending Orders"
            value={pendingOrders}
            accent="#b0447a"
          />
        </Grid>
      </Grid>

      {/* Main content: products table (left) + colored gauge cards (right), like the reference layout */}
      <Grid container spacing={2.5}>
        <Grid size={{ xs: 12, md: 8 }}>
          <Card sx={{ mb: 2.5, p: 2 }}>
            <Typography variant="h6" sx={{ mb: 2, color: NU_NAVY_DARK }}>
              Products Overview
            </Typography>
            <Box sx={{ height: 400, width: '100%' }}>
              <DataGrid
                rows={products}
                columns={columns}
                getRowId={(row) => row._id}
                loading={loading}
                initialState={{ pagination: { paginationModel: { pageSize: 5 } } }}
                pageSizeOptions={[5]}
                disableRowSelectionOnClick
                sx={{ border: 'none' }}
              />
            </Box>
          </Card>

          <Card sx={{ p: 2 }}>
            <Typography variant="h6" sx={{ mb: 2, color: NU_NAVY_DARK }}>
              Shop Location
            </Typography>
            <Box sx={{ height: 350, width: '100%', borderRadius: 3, overflow: 'hidden' }}>
              <MapContainer center={[14.604253, 120.994341]} zoom={13} style={{ height: '100%', width: '100%' }}>
                <TileLayer
                  attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                <Marker position={[14.604253, 120.994341]}>
                  <Popup>Store HQ</Popup>
                </Marker>
              </MapContainer>
            </Box>
          </Card>
        </Grid>

        <Grid size={{ xs: 12, md: 4 }}>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
            <GaugeCard label="Stock Health" value={stockHealth} bg="#0060de" />
            <GaugeCard label="Low Stock Rate" value={lowStockRate} bg={NU_GOLD} />
            <GaugeCard label="Order Fulfillment" value={fulfillmentRate} bg="#7c8fd6" />
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
}

export default DashboardPage;