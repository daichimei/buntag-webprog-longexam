import AddCircleIcon from '@mui/icons-material/AddCircle';
import {
    Alert,
    Box,
    Button,
    Checkbox,
    FormControlLabel,
    MenuItem,
    Modal,
    Select,
    Snackbar,
    Stack,
    TextField,
    Typography,
} from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import { useEffect, useState } from 'react';

import { fetchCategories } from '../../services/CategoryService';
import {
    createProduct,
    deleteProduct,
    fetchProducts,
    updateProduct,
} from '../../services/ProductService';

const modalStyle = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 700,
    maxWidth: '90%',
    maxHeight: '90vh',
    overflowY: 'auto',
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4,
};

const blankProduct = {
    productName: '',
    description: '',
    price: '',
    stock: 0,
    image: '',
    category: '',
    isActive: true,
};

const DashProductListPage = () => {
    const [open, setOpen] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [editProductId, setEditProductId] = useState(null);

    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]);

    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');

    const [newProduct, setNewProduct] = useState(blankProduct);
    const [errorMessage, setErrorMessage] = useState('');
    const [successMessage, setSuccessMessage] = useState('');

    // =========================
    // LOAD PRODUCTS
    // =========================
    const loadProducts = async () => {
        try {
            setLoading(true);

            const response = await fetchProducts({
                limit: 100,
            });

            setProducts(response?.data?.data || []);
        } catch (error) {
            console.error('Failed to load products:', error);

            setErrorMessage(
                error?.response?.data?.message ||
                    'Failed to load products.'
            );
        } finally {
            setLoading(false);
        }
    };

    // =========================
    // LOAD CATEGORIES
    // =========================
    const loadCategories = async () => {
        try {
            const response = await fetchCategories();

            // Adjust depending on your CategoryService response.
            const categoryData =
                response?.data?.data ||
                response?.data ||
                [];

            setCategories(categoryData);
        } catch (error) {
            console.error('Failed to load categories:', error);

            setErrorMessage(
                error?.response?.data?.message ||
                    'Failed to load categories.'
            );
        }
    };

    useEffect(() => {
        loadProducts();
        loadCategories();
    }, []);

    // =========================
    // ADD PRODUCT
    // =========================
    const handleOpen = () => {
        setIsEditing(false);
        setEditProductId(null);
        setNewProduct({ ...blankProduct });
        setOpen(true);
    };

    // =========================
    // CLOSE MODAL
    // =========================
    const handleClose = () => {
        if (saving) return;

        setOpen(false);
        setIsEditing(false);
        setEditProductId(null);
        setNewProduct({ ...blankProduct });
    };

    // =========================
    // EDIT PRODUCT
    // =========================
    const handleEdit = (id) => {
        console.log('Editing product:', id);

        const productToEdit = products.find(
            (product) => product._id === id
        );

        if (!productToEdit) {
            console.error('Product not found:', id);

            setErrorMessage('Product could not be found.');
            return;
        }

        console.log('Product selected for editing:', productToEdit);

        setNewProduct({
            productName: productToEdit.productName || '',
            description: productToEdit.description || '',
            price: productToEdit.price ?? '',
            stock: productToEdit.stock ?? 0,
            image: productToEdit.image || '',

            // IMPORTANT:
            // category may be populated object OR just an ID.
            category:
                productToEdit.category?._id ||
                productToEdit.category ||
                '',

            isActive:
                productToEdit.isActive !== undefined
                    ? productToEdit.isActive
                    : true,
        });

        setEditProductId(id);
        setIsEditing(true);
        setOpen(true);
    };

    // =========================
    // INPUT CHANGE
    // =========================
    const handleChange = (event) => {
        const { name, value } = event.target;

        setNewProduct((previous) => ({
            ...previous,
            [name]: value,
        }));
    };

    // =========================
    // SAVE PRODUCT
    // =========================
    const handleSaveProduct = async () => {
        try {
            setSaving(true);

            // Build ONLY fields allowed by the backend.
            const payload = {
                productName: newProduct.productName.trim(),
                description: newProduct.description.trim(),
                price: Number(newProduct.price),
                stock: Number(newProduct.stock),
                image: newProduct.image?.trim() || '',
                category: newProduct.category,
                isActive: Boolean(newProduct.isActive),
            };

            console.log('Saving product:', {
                isEditing,
                editProductId,
                payload,
            });

            // Basic validation
            if (!payload.productName) {
                setErrorMessage('Product name is required.');
                return;
            }

            if (!payload.category) {
                setErrorMessage('Please select a category.');
                return;
            }

            if (Number.isNaN(payload.price) || payload.price < 0) {
                setErrorMessage('Please enter a valid price.');
                return;
            }

            if (Number.isNaN(payload.stock) || payload.stock < 0) {
                setErrorMessage('Please enter a valid stock quantity.');
                return;
            }

            // =========================
            // UPDATE
            // =========================
            if (isEditing) {
                if (!editProductId) {
                    setErrorMessage(
                        'Product ID is missing. Cannot update product.'
                    );
                    return;
                }

                const response = await updateProduct(
                    editProductId,
                    payload
                );

                console.log('Update response:', response);

                setSuccessMessage(
                    'Product updated successfully.'
                );
            }

            // =========================
            // CREATE
            // =========================
            else {
                const response = await createProduct(payload);

                console.log('Create response:', response);

                setSuccessMessage(
                    'Product created successfully.'
                );
            }

            // Refresh product list
            await loadProducts();

            // Close modal
            handleClose();
        } catch (error) {
            console.error(
                'Error saving product:',
                error
            );

            const message =
                error?.response?.data?.message ||
                error?.message ||
                'Error saving product. Please try again.';

            setErrorMessage(message);
        } finally {
            setSaving(false);
        }
    };

    // =========================
    // DELETE PRODUCT
    // =========================
    const handleDelete = async (id) => {
        try {
            const confirmed = window.confirm(
                'Are you sure you want to delete this product?'
            );

            if (!confirmed) {
                return;
            }

            await deleteProduct(id);

            await loadProducts();

            setSuccessMessage(
                'Product deleted successfully.'
            );
        } catch (error) {
            console.error(
                'Error deleting product:',
                error
            );

            const message =
                error?.response?.data?.message ||
                error?.message ||
                'Error deleting product. Please try again.';

            setErrorMessage(message);
        }
    };

    // =========================
    // FILTER
    // =========================
    const filteredProducts = products.filter((product) => {
        const search = searchTerm.toLowerCase();

        const matchesSearch =
            product.productName
                ?.toLowerCase()
                .includes(search) ||
            product.description
                ?.toLowerCase()
                .includes(search);

        const matchesStatus =
            statusFilter === 'all' ||
            (statusFilter === 'active' &&
                product.isActive) ||
            (statusFilter === 'inactive' &&
                !product.isActive);

        return matchesSearch && matchesStatus;
    });

    // =========================
    // DATAGRID COLUMNS
    // =========================
    const columns = [
        {
            field: '_id',
            headerName: 'ID',
            width: 230,
        },

        {
            field: 'image',
            headerName: 'Image',
            width: 80,

            renderCell: (params) =>
                params.value ? (
                    <img
                        src={params.value}
                        alt={params.row.productName || 'product'}
                        style={{
                            width: '40px',
                            height: '40px',
                            objectFit: 'cover',
                        }}
                    />
                ) : null,
        },

        {
            field: 'productName',
            headerName: 'Name',
            flex: 1,
            minWidth: 150,
        },

        {
            field: 'price',
            headerName: 'Price',
            width: 100,
            type: 'number',
        },

        {
            field: 'stock',
            headerName: 'Stock',
            width: 100,
            type: 'number',
        },

        {
            field: 'category',
            headerName: 'Category',
            width: 150,

            valueGetter: (_, row) =>
                row.category?.categoryName || '—',
        },

        {
            field: 'isActive',
            headerName: 'Status',
            width: 100,

            renderCell: ({ row }) => (
                <span
                    style={{
                        color: row.isActive
                            ? 'green'
                            : 'gray',
                    }}
                >
                    {row.isActive
                        ? 'Active'
                        : 'Inactive'}
                </span>
            ),
        },

        {
            field: 'actions',
            headerName: 'Actions',
            width: 180,

            sortable: false,
            filterable: false,

            renderCell: (params) => (
                <Box
                    sx={{
                        display: 'flex',
                        gap: 1,
                        alignItems: 'center',
                        height: '100%',
                    }}
                >
                    <Button
                        variant="contained"
                        size="small"
                        onClick={() =>
                            handleEdit(params.row._id)
                        }
                    >
                        Edit
                    </Button>

                    <Button
                        variant="outlined"
                        size="small"
                        color="error"
                        onClick={() =>
                            handleDelete(params.row._id)
                        }
                    >
                        Delete
                    </Button>
                </Box>
            ),
        },
    ];

    return (
        <>
            {/* =========================
                HEADER
            ========================= */}
            <Stack
                direction="row"
                sx={{
                    marginBottom: 5,
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                }}
            >
                <Typography
                    variant="h6"
                    fontWeight="bold"
                    sx={{ color: '#35408e' }}
                >
                    Products
                </Typography>

                <Box
                    sx={{
                        display: 'flex',
                        gap: 2,
                    }}
                >
                    <TextField
                        placeholder="Search Products"
                        variant="outlined"
                        size="small"
                        value={searchTerm}
                        onChange={(e) =>
                            setSearchTerm(e.target.value)
                        }
                    />

                    <Select
                        value={statusFilter}
                        onChange={(e) =>
                            setStatusFilter(e.target.value)
                        }
                        size="small"
                    >
                        <MenuItem value="all">
                            All Statuses
                        </MenuItem>

                        <MenuItem value="active">
                            Active
                        </MenuItem>

                        <MenuItem value="inactive">
                            Inactive
                        </MenuItem>
                    </Select>

                    <Button
                        variant="contained"
                        startIcon={<AddCircleIcon />}
                        onClick={handleOpen}
                    >
                        Add Product
                    </Button>
                </Box>
            </Stack>

            {/* =========================
                PRODUCT TABLE
            ========================= */}
            <Box
                sx={{
                    height: 500,
                    width: '100%',
                    mb: 5,
                }}
            >
                <DataGrid
                    rows={filteredProducts}
                    columns={columns}
                    getRowId={(row) => row._id}
                    pageSizeOptions={[10, 20, 50]}
                    initialState={{
                        pagination: {
                            paginationModel: {
                                pageSize: 10,
                            },
                        },
                    }}
                    disableRowSelectionOnClick
                    loading={loading}
                />
            </Box>

            {/* =========================
                ADD / EDIT MODAL
            ========================= */}
            <Modal
                open={open}
                onClose={handleClose}
            >
                <Box sx={modalStyle}>
                    <Typography variant="h4">
                        {isEditing
                            ? 'Edit Product'
                            : 'Add Product'}
                    </Typography>

                    <Stack
                        direction="column"
                        spacing={3}
                        sx={{ mt: 2 }}
                    >
                        <TextField
                            fullWidth
                            name="productName"
                            label="Product Name"
                            variant="standard"
                            value={
                                newProduct.productName
                            }
                            onChange={handleChange}
                        />

                        <TextField
                            fullWidth
                            name="description"
                            label="Description"
                            variant="standard"
                            multiline
                            rows={3}
                            value={
                                newProduct.description
                            }
                            onChange={handleChange}
                        />

                        <Stack
                            direction="row"
                            spacing={2}
                        >
                            <TextField
                                fullWidth
                                name="price"
                                label="Price"
                                type="number"
                                variant="standard"
                                value={
                                    newProduct.price
                                }
                                onChange={handleChange}
                            />

                            <TextField
                                fullWidth
                                name="stock"
                                label="Stock"
                                type="number"
                                variant="standard"
                                value={
                                    newProduct.stock
                                }
                                onChange={handleChange}
                            />
                        </Stack>

                        <TextField
                            fullWidth
                            name="image"
                            label="Image URL"
                            variant="standard"
                            value={
                                newProduct.image || ''
                            }
                            onChange={handleChange}
                        />

                        <TextField
                            select
                            fullWidth
                            name="category"
                            label="Category"
                            variant="standard"
                            value={
                                newProduct.category || ''
                            }
                            onChange={handleChange}
                        >
                            {categories.map((cat) => (
                                <MenuItem
                                    key={cat._id}
                                    value={cat._id}
                                >
                                    {cat.categoryName}
                                </MenuItem>
                            ))}
                        </TextField>

                        <FormControlLabel
                            control={
                                <Checkbox
                                    checked={
                                        Boolean(
                                            newProduct.isActive
                                        )
                                    }
                                    onChange={(e) =>
                                        setNewProduct(
                                            (previous) => ({
                                                ...previous,
                                                isActive:
                                                    e.target
                                                        .checked,
                                            })
                                        )
                                    }
                                />
                            }
                            label="Active"
                        />
                    </Stack>

                    <Stack
                        spacing={2}
                        direction="row"
                        sx={{ mt: 3 }}
                    >
                        <Button
                            variant="outlined"
                            onClick={handleClose}
                            disabled={saving}
                        >
                            Cancel
                        </Button>

                        <Button
                            variant="contained"
                            onClick={
                                handleSaveProduct
                            }
                            disabled={saving}
                        >
                            {saving
                                ? 'Saving...'
                                : isEditing
                                ? 'Save Changes'
                                : 'Add'}
                        </Button>
                    </Stack>
                </Box>
            </Modal>

            {/* =========================
                ERROR
            ========================= */}
            <Snackbar
                open={Boolean(errorMessage)}
                autoHideDuration={5000}
                onClose={() =>
                    setErrorMessage('')
                }
                anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'center',
                }}
            >
                <Alert
                    onClose={() =>
                        setErrorMessage('')
                    }
                    severity="error"
                    variant="filled"
                >
                    {errorMessage}
                </Alert>
            </Snackbar>

            {/* =========================
                SUCCESS
            ========================= */}
            <Snackbar
                open={Boolean(successMessage)}
                autoHideDuration={3000}
                onClose={() =>
                    setSuccessMessage('')
                }
                anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'center',
                }}
            >
                <Alert
                    onClose={() =>
                        setSuccessMessage('')
                    }
                    severity="success"
                    variant="filled"
                >
                    {successMessage}
                </Alert>
            </Snackbar>
        </>
    );
};

export default DashProductListPage;