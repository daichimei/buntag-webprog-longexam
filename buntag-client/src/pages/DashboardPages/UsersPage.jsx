import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import {
  Alert,
  Box,
  Button,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  InputAdornment,
  MenuItem,
  Paper,
  Stack,
  TextField,
  Typography,
  useMediaQuery
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { DataGrid } from '@mui/x-data-grid';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  createUser,
  deleteUser,
  fetchUsers,
  updateUser,
} from '../../services/UserService';

const roles = ['customer', 'supplier', 'admin'];

const blankForm = {
  name: '',
  email: '',
  role: 'customer',
  password: '',
  address: '',
  isActive: true,
};

const labelize = (value) =>
  value ? `${value.charAt(0).toUpperCase()}${value.slice(1)}` : '';

const UsersPage = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const navigate = useNavigate();
  const userRole = localStorage.getItem('role');
  const [users, setUsers] = useState([]);
  const [modal, setModal] = useState({ open: false, id: null });
  const [form, setForm] = useState(blankForm);
  const [error, setError] = useState({});
  const [pageError, setPageError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({ role: 'all', status: 'all' });

  const resetForm = () => {
    setForm({ ...blankForm });
    setError({});
  };

  const loadUsers = async () => {
    try {
      const response = await fetchUsers();
      setUsers(Array.isArray(response.data) ? response.data : []);
    } catch (err) {
      console.error('Failed to fetch users:', err);
      setPageError('Failed to load users from database.');
    }
  };

  useEffect(() => {
    // Only admins may access this page — matches the backend RBAC
    if (userRole !== 'admin') {
      navigate('/dashboard');
      return;
    }
    loadUsers();
  }, [userRole, navigate]);

  if (userRole !== 'admin') {
    return (
      <Alert severity="error">
        You do not have permission to access the Users page.
      </Alert>
    );
  }

  const openModal = (user) => {
    setModal({ open: true, id: user?._id ?? null });
    // Never prefill the password field when editing
    setForm(user ? { ...blankForm, ...user, password: '' } : { ...blankForm });
    setError({});
  };

  const closeModal = () => {
    setModal({ open: false, id: null });
    setShowPassword(false);
    resetForm();
  };

  const handleChange = ({ target: { name, value, checked, type } }) => {
    setForm((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
    if (error[name]) {
      setError((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const validate = () => {
    const nextErrors = {};
    const email = form.email.trim().toLowerCase();
    const isNewUser = !modal.id;

    [
      ['name', 'Name'],
      ['email', 'Email'],
      ['role', 'Role'],
      ['address', 'Address'],
    ].forEach(([key, label]) => {
      if (!String(form[key] ?? '').trim()) {
        nextErrors[key] = `${label} is required.`;
      }
    });

    if (!nextErrors.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      nextErrors.email = 'Email is not valid.';
    }

    if (!nextErrors.email && users.some((user) => user._id !== modal.id && user.email === email)) {
      nextErrors.email = 'Email already exists.';
    }

    // Password is required when creating a new user; optional on edit (leave blank to keep current)
    if (isNewUser && !form.password) {
      nextErrors.password = 'Password is required.';
    }
    if (form.password && form.password.length < 8) {
      nextErrors.password = 'Password must be at least 8 characters long.';
    }

    return nextErrors;
  };

  const handleSaveUser = async (event) => {
    event.preventDefault();
    const nextErrors = validate();
    if (Object.keys(nextErrors).length) {
      setError(nextErrors);
      return;
    }

    try {
      const payload = { ...form };
      if (modal.id && !payload.password) {
        delete payload.password; // don't overwrite with blank on edit
      }

      if (modal.id) {
        await updateUser(modal.id, payload);
      } else {
        await createUser(payload);
      }
      await loadUsers();
      closeModal();
    } catch (err) {
      setPageError(err?.response?.data?.message || 'Failed to save user.');
      console.error('Error saving user', err);
    }
  };

  const handleDeleteUser = async (id) => {
    try {
      await deleteUser(id);
      await loadUsers();
      closeModal();
    } catch (err) {
      console.error('Error deleting user', err);
    }
  };

  const toggleStatus = async (id) => {
    const user = users.find((u) => u._id === id);
    if (user) {
      await updateUser(id, { isActive: !user.isActive });
      await loadUsers();
    }
  };

  const fieldProps = (name, label, extra = {}) => ({
    name,
    label,
    value: form[name],
    onChange: handleChange,
    error: Boolean(error[name]),
    helperText: error[name],
    fullWidth: true,
    ...extra,
  });

  const columns = [
    { field: '_id', headerName: 'ID', width: 220 },
    {
      field: 'name',
      headerName: 'Name',
      flex: 1,
      minWidth: 160,
      renderCell: ({ value }) => (
        <Box
          sx={{
            whiteSpace: 'normal',
            wordBreak: 'break-word',
            lineHeight: 1.3,
            py: 1,
          }}
        >
          {value}
        </Box>
      ),
    },
    { field: 'email', headerName: 'Email', flex: 1.1, minWidth: 220 },
    { field: 'address', headerName: 'Address', flex: 1, minWidth: 180 },
    {
      field: 'role',
      headerName: 'Role',
      minWidth: 120,
      renderCell: ({ row }) => {
        const role = labelize(row.role);
        let color = 'default';
        if (role === 'Admin') color = 'error';
        if (role === 'Supplier') color = 'primary';
        return <Chip size="small" label={role} color={color} />;
      },
    },
    {
      field: 'isActive',
      headerName: 'Status',
      minWidth: 120,
      renderCell: ({ row }) => (
        <Chip
          size="small"
          label={row.isActive ? 'Active' : 'Inactive'}
          color={row.isActive ? 'success' : 'default'}
          variant={row.isActive ? 'filled' : 'outlined'}
        />
      ),
    },
    {
      field: 'actions',
      headerName: 'Actions',
      minWidth: 220,
      sortable: false,
      renderCell: ({ row }) => (
        <Stack direction="row" spacing={1} sx={{ py: 0.5 }}>
          <Button variant="outlined" size="small" onClick={() => openModal(row)}>
            Edit
          </Button>
          <Button
            size="small"
            variant="contained"
            color={row.isActive ? 'warning' : 'success'}
            onClick={() => toggleStatus(row._id)}
          >
            {row.isActive ? 'Disable' : 'Activate'}
          </Button>
        </Stack>
      ),
    },
  ];

  const filteredUsers = users.filter((user) => {
    const matchesSearch = searchTerm
      ? `${user.name} ${user.email}`.toLowerCase().includes(searchTerm.toLowerCase())
      : true;
    const matchesRole = filters.role !== 'all' ? user.role === filters.role : true;
    const matchesStatus =
      filters.status !== 'all'
        ? filters.status === 'active'
          ? user.isActive
          : !user.isActive
        : true;
    return matchesSearch && matchesRole && matchesStatus;
  });

  return (
    <Box sx={{ width: '100%', minWidth: 0 }}>
      <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 2, flexWrap: 'wrap' }}>
        <Typography variant="h4" sx={{ color: '#35408e' }}>Users</Typography>

        <Stack direction="row" spacing={2} alignItems="center">
          <TextField
            size="small"
            placeholder="Search users..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />

          <TextField
            select
            size="small"
            value={filters.role}
            onChange={(e) => setFilters((prev) => ({ ...prev, role: e.target.value }))}
          >
            <MenuItem value="all">All Roles</MenuItem>
            {roles.map((role) => (
              <MenuItem key={role} value={role}>
                {labelize(role)}
              </MenuItem>
            ))}
          </TextField>

          <TextField
            select
            size="small"
            value={filters.status}
            onChange={(e) => setFilters((prev) => ({ ...prev, status: e.target.value }))}
          >
            <MenuItem value="all">All Status</MenuItem>
            <MenuItem value="active">Active</MenuItem>
            <MenuItem value="inactive">Inactive</MenuItem>
          </TextField>
        </Stack>

        <Button variant="contained" onClick={() => openModal()}>
          Add User
        </Button>
      </Box>

      {pageError ? (
        <Alert severity="error" sx={{ mb: 2 }}>
          {pageError}
        </Alert>
      ) : null}

      <Paper sx={{ p: { xs: 1.5, sm: 2 }, minWidth: 0, overflow: 'hidden' }}>
        {filteredUsers.length ? (
          <Box sx={{ height: { xs: 460, sm: 520 }, width: '100%', minWidth: 0 }}>
            <DataGrid
              rows={filteredUsers}
              columns={columns}
              getRowId={(row) => row._id}
              getRowHeight={() => 'auto'}
              disableRowSelectionOnClick
              pageSizeOptions={[5, 10]}
              initialState={{ pagination: { paginationModel: { pageSize: 10, page: 0 } } }}
              sx={{ minWidth: 0, '& .MuiDataGrid-row, & .MuiDataGrid-columnHeader': { outline: 'none' } }}
            />
          </Box>
        ) : (
          <Alert severity="info">No users found. Use Add User to create your first record.</Alert>
        )}
      </Paper>

      <Dialog open={modal.open} onClose={closeModal} fullWidth fullScreen={isMobile} maxWidth="sm">
        <Box component="form" onSubmit={handleSaveUser}>
          <DialogTitle>{modal.id ? 'Edit User' : 'Add User'}</DialogTitle>
          <DialogContent dividers sx={{ px: { xs: 2, sm: 3 } }}>
            <Stack spacing={2} sx={{ pt: 1 }}>
              <TextField {...fieldProps('name', 'Name')} />
              <TextField {...fieldProps('email', 'Email', { type: 'email' })} />
              <TextField {...fieldProps('role', 'Role', { select: true })}>
                {roles.map((role) => (
                  <MenuItem key={role} value={role}>
                    {labelize(role)}
                  </MenuItem>
                ))}
              </TextField>
              <TextField {...fieldProps('address', 'Address', { multiline: true, rows: 2 })} />
              <TextField
                {...fieldProps('password', modal.id ? 'New Password (leave blank to keep current)' : 'Password', {
                  type: showPassword ? 'text' : 'password',
                  slotProps: {
                    input: {
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton
                            edge="end"
                            onClick={() => setShowPassword((prev) => !prev)}
                            onMouseDown={(event) => event.preventDefault()}
                            aria-label={showPassword ? 'Hide password' : 'Show password'}
                          >
                            {showPassword ? <VisibilityOff /> : <Visibility />}
                          </IconButton>
                        </InputAdornment>
                      ),
                    },
                  },
                })}
              />
            </Stack>
          </DialogContent>

          <DialogActions sx={{ px: 3, py: 2 }}>
            <Button onClick={closeModal}>Cancel</Button>
            <Button type="submit" variant="contained">
              {modal.id ? 'Update User' : 'Save User'}
            </Button>
            {modal.id && (
              <Button size="small" variant="contained" color="error" onClick={() => handleDeleteUser(modal.id)}>
                Delete
              </Button>
            )}
          </DialogActions>
        </Box>
      </Dialog>
    </Box>
  );
};

export default UsersPage;