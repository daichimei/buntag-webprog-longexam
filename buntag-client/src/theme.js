import { createTheme } from '@mui/material/styles';

// NU Bulldogs brand colors — same tokens already used on the storefront
// (ProfilePage avatar background, CartPage total banner) so the whole app
// shares one consistent palette instead of two different blues.
export const NU_NAVY = '#35408e';
export const NU_NAVY_DARK = '#242c63';
export const NU_GOLD = '#ffd31c';
export const NU_CREAM = '#f6f5f1';
export const NU_GOLD_DARK = '#a88704';

const dashboardTheme = createTheme({
    palette: {
        primary: {
            main: NU_NAVY,
            dark: NU_NAVY_DARK,
            contrastText: '#ffffff',
        },
        secondary: {
            main: NU_GOLD,
            contrastText: NU_NAVY_DARK,
        },
        tertiary: {
            main: NU_GOLD_DARK
        },
        background: {
            default: NU_CREAM,
            paper: '#ffffff',
        },
        text: {
            primary: NU_NAVY_DARK,
        },
    },
    shape: {
        borderRadius: 16,
    },
    typography: {
        fontFamily: 'inherit', // inherit the app's existing font instead of MUI's default
        h4: { fontWeight: 700 },
        h5: { fontWeight: 700 },
        h6: { fontWeight: 700 },
    },
    components: {
        MuiPaper: {
            styleOverrides: {
                root: {
                    borderRadius: 20,
                },
            },
        },
        MuiCard: {
            styleOverrides: {
                root: {
                    borderRadius: 20,
                    boxShadow: '0 4px 24px rgba(36, 44, 99, 0.08)',
                },
            },
        },
        MuiButton: {
            styleOverrides: {
                root: {
                    borderRadius: 999,
                    textTransform: 'none',
                    fontWeight: 600,
                },
            },
        },
        MuiChip: {
            styleOverrides: {
                root: {
                    fontWeight: 600,
                },
            },
        },
        MuiDrawer: {
            styleOverrides: {
                paper: {
                    border: 'none',
                    backgroundColor: '#ffffff',
                },
            },
        },
        MuiAppBar: {
            styleOverrides: {
                root: {
                    backgroundColor: '#ffffff',
                    color: NU_NAVY_DARK,
                    boxShadow: '0 2px 12px rgba(36, 44, 99, 0.06)',
                },
            },
        },
    },
});

export default dashboardTheme;
