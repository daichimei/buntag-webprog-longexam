import {
    Box,
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Rating,
    Stack,
    TextField,
    Typography,
} from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import { useEffect, useState } from 'react';
import { deleteReview, fetchAllReviews, updateReview } from '../../services/ReviewService';

const DashReviewsPage = () => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(null);
  const [editForm, setEditForm] = useState({ rating: 5, comment: '' });

  const loadReviews = async () => {
    try {
      setLoading(true);
      const { data } = await fetchAllReviews();
      setReviews(data);
    } catch (error) {
      console.error('Failed to load reviews', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadReviews();
  }, []);

  const openEdit = (review) => {
    setEditing(review);
    setEditForm({ rating: review.rating, comment: review.comment || '' });
  };

  const handleSaveEdit = async () => {
    try {
      await updateReview(editing._id, editForm);
      setEditing(null);
      loadReviews();
    } catch (error) {
      console.error('Failed to update review', error);
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteReview(id);
      loadReviews();
    } catch (error) {
      console.error('Failed to delete review', error);
    }
  };

  const columns = [
    { field: '_id', headerName: 'ID', width: 200 },
    {
      field: 'product',
      headerName: 'Product',
      flex: 1,
      valueGetter: (_, row) => row.product?.productName || '—',
    },
    {
      field: 'user',
      headerName: 'Customer',
      flex: 1,
      valueGetter: (_, row) => row.user?.name || 'Unknown',
    },
    {
      field: 'rating',
      headerName: 'Rating',
      width: 140,
      renderCell: ({ row }) => <Rating value={row.rating} readOnly size="small" />,
    },
    { field: 'comment', headerName: 'Comment', flex: 1.5 },
    {
      field: 'createdAt',
      headerName: 'Date',
      width: 140,
      valueGetter: (_, row) => new Date(row.createdAt).toLocaleDateString(),
    },
    {
      field: 'actions',
      headerName: 'Actions',
      width: 180,
      sortable: false,
      renderCell: ({ row }) => (
        <Stack direction="row" spacing={1}>
          <Button size="small" variant="outlined" onClick={() => openEdit(row)}>
            Edit
          </Button>
          <Button size="small" variant="outlined" color="error" onClick={() => handleDelete(row._id)}>
            Delete
          </Button>
        </Stack>
      ),
    },
  ];

  return (
    <Box sx={{ width: '100%' }}>
      <Typography variant="h4" sx={{ mb: 3 }}>
        Customer Reviews
      </Typography>

      <Box sx={{ height: 550, width: '100%' }}>
        <DataGrid
          rows={reviews}
          columns={columns}
          getRowId={(row) => row._id}
          loading={loading}
          disableRowSelectionOnClick
          pageSizeOptions={[10, 20]}
          initialState={{ pagination: { paginationModel: { pageSize: 10 } } }}
        />
      </Box>

      <Dialog open={Boolean(editing)} onClose={() => setEditing(null)} fullWidth maxWidth="sm">
        <DialogTitle>Edit Review</DialogTitle>
        <DialogContent>
          <Stack spacing={2} sx={{ pt: 1 }}>
            <Rating
              value={editForm.rating}
              onChange={(_, value) => setEditForm((prev) => ({ ...prev, rating: value }))}
            />
            <TextField
              label="Comment"
              multiline
              rows={4}
              fullWidth
              value={editForm.comment}
              onChange={(e) => setEditForm((prev) => ({ ...prev, comment: e.target.value }))}
            />
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEditing(null)}>Cancel</Button>
          <Button variant="contained" onClick={handleSaveEdit}>
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default DashReviewsPage;
