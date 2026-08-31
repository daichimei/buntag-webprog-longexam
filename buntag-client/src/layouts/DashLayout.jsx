import AssessmentIcon from "@mui/icons-material/Assessment";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import DashboardIcon from "@mui/icons-material/Dashboard";
import Inventory2Icon from "@mui/icons-material/Inventory2";
import LaunchIcon from "@mui/icons-material/Launch";
import LogoutIcon from "@mui/icons-material/Logout";
import MenuIcon from "@mui/icons-material/Menu";
import MenuOpenIcon from "@mui/icons-material/MenuOpen";
import PeopleIcon from "@mui/icons-material/People";
import PersonIcon from "@mui/icons-material/Person";
import RateReviewIcon from "@mui/icons-material/RateReview";
import ReceiptLongIcon from "@mui/icons-material/ReceiptLong";

import MuiAppBar from "@mui/material/AppBar";
import Avatar from "@mui/material/Avatar";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import Divider from "@mui/material/Divider";
import MuiDrawer from "@mui/material/Drawer";
import IconButton from "@mui/material/IconButton";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";

import { styled, ThemeProvider, useTheme as useMuiTheme } from "@mui/material/styles";

import { useEffect, useState } from "react";
import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import dashboardTheme, { NU_GOLD, NU_NAVY, NU_NAVY_DARK } from "../theme";

const drawerWidth = 260;

const dashboardNavItems = [
    {
        label: "Dashboard",
        title: "Dashboard",
        to: "/dashboard",
        icon: DashboardIcon,
        roles: ["admin", "supplier"],
    },
    {
        label: "Reports",
        title: "Reports",
        to: "/dashboard/reports",
        icon: AssessmentIcon,
        roles: ["admin", "supplier"],
    },
    {
        label: "Products",
        title: "Products",
        to: "/dashboard/products",
        icon: Inventory2Icon,
        roles: ["admin", "supplier"],
    },
    {
        label: "Orders",
        title: "Orders",
        to: "/dashboard/orders",
        icon: ReceiptLongIcon,
        roles: ["admin", "supplier"],
    },
    {
        label: "Reviews",
        title: "Reviews",
        to: "/dashboard/reviews",
        icon: RateReviewIcon,
        roles: ["admin", "supplier"],
    },
    {
        label: "Users",
        title: "Users",
        to: "/dashboard/users",
        icon: PeopleIcon,
        roles: ["admin"], // admin only
    },
    {
        label: "Profile",
        title: "Profile",
        to: "/dashboard/profile",
        icon: PersonIcon,
        roles: ["admin", "supplier"],
    },
];

const roleLabel = { admin: "System Admin", supplier: "Supplier" };

const openedMixin = (theme) => ({
    width: drawerWidth,
    transition: theme.transitions.create("width", {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.enteringScreen,
    }),
    overflowX: "hidden",
});

const closedMixin = (theme) => ({
    transition: theme.transitions.create("width", {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
    }),
    overflowX: "hidden",
    width: `calc(${theme.spacing(7)} + 1px)`,
    [theme.breakpoints.up("sm")]: {
        width: `calc(${theme.spacing(8)} + 1px)`,
    },
});

const DrawerHeader = styled("div")(({ theme }) => ({
    display: "flex",
    alignItems: "center",
    justifyContent: "flex-end",
    padding: theme.spacing(0, 1),
    ...theme.mixins.toolbar,
}));

const AppBar = styled(MuiAppBar, {
    shouldForwardProp: (prop) => prop !== "open",
})(({ theme, open }) => ({
    zIndex: theme.zIndex.drawer + 1,
    transition: theme.transitions.create(["width", "margin"], {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
    }),
    ...(open && {
        marginLeft: drawerWidth,
        width: `calc(100% - ${drawerWidth}px)`,
        transition: theme.transitions.create(["width", "margin"], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.enteringScreen,
        }),
    }),
}));

const Drawer = styled(MuiDrawer, {
    shouldForwardProp: (prop) => prop !== "open",
})(({ theme, open }) => ({
    width: drawerWidth,
    flexShrink: 0,
    whiteSpace: "nowrap",
    boxSizing: "border-box",
    ...(open && {
        ...openedMixin(theme),
        "& .MuiDrawer-paper": openedMixin(theme),
    }),
    ...(!open && {
        ...closedMixin(theme),
        "& .MuiDrawer-paper": closedMixin(theme),
    }),
}));

const DashLayoutContent = () => {
    const theme = useMuiTheme();
    const [open, setOpen] = useState(true);
    const location = useLocation();
    const navigate = useNavigate();
    const { user, logout } = useAuth();

    const userRole = localStorage.getItem("role");
    const userName = localStorage.getItem("name") || "there";
    const firstName = userName.split(" ")[0];

    // Redirect rules, run as a side effect (not during render)
    useEffect(() => {
        if (!userRole) {
            navigate("/signin", { replace: true });
            return;
        }
        // Customers can see everything EXCEPT the dashboard
        if (userRole === "customer") {
            navigate("/", { replace: true });
        }
    }, [userRole, navigate]);

    // Filter nav items by role (Users tab: admin only; rest: admin + supplier)
    const navItems = dashboardNavItems.filter((item) =>
        item.roles.includes(userRole)
    );

    const handleDrawerOpen = () => setOpen(true);
    const handleDrawerClose = () => setOpen(false);

    const handleLogout = () => {
        logout();
        navigate("/");
    };

    // While the redirect effect above is resolving, render nothing
    if (!userRole || userRole === "customer") {
        return null;
    }

    return (
        <Box sx={{ display: "flex", bgcolor: "background.default", minHeight: "100vh" }}>
            <CssBaseline />

            <AppBar position="fixed" open={open} elevation={0}>
                <Toolbar sx={{ gap: 1 }}>
                    <IconButton
                        color="inherit"
                        aria-label="toggle drawer"
                        onClick={open ? handleDrawerClose : handleDrawerOpen}
                        edge="start"
                    >
                        {open ? <MenuOpenIcon /> : <MenuIcon />}
                    </IconButton>

                    <Typography variant="h6" noWrap component="div" sx={{ flexGrow: 1, fontWeight: 700 }}>
                        Hello, {firstName}!
                    </Typography>

                    <Button
                        variant="outlined"
                        component={Link}
                        to="/"
                        startIcon={<LaunchIcon />}
                        sx={{ borderColor: NU_NAVY, color: NU_NAVY }}
                    >
                        View Storefront
                    </Button>

                    <Button
                        variant="contained"
                        color="secondary"
                        onClick={handleLogout}
                        startIcon={<LogoutIcon />}
                    >
                        Logout
                    </Button>
                </Toolbar>
            </AppBar>

            <Drawer variant="permanent" open={open}>
                <DrawerHeader>
                    <IconButton onClick={handleDrawerClose}>
                        {theme.direction === "rtl" ? <ChevronRightIcon /> : <ChevronLeftIcon />}
                    </IconButton>
                </DrawerHeader>

                {open && (
                    <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", px: 2, pb: 3 }}>
                        <Avatar
                            src={user?.profilePicture || undefined}
                            sx={{ width: 64, height: 64, bgcolor: NU_NAVY, fontWeight: 700, fontSize: 24 }}
                        >
                            {firstName.charAt(0).toUpperCase()}
                        </Avatar>
                        <Typography sx={{ mt: 1.5, fontWeight: 700, color: NU_NAVY_DARK }}>
                            {userName}
                        </Typography>
                        <Typography variant="caption" sx={{ color: "text.secondary", fontWeight: 600, letterSpacing: 0.5 }}>
                            {roleLabel[userRole] || userRole}
                        </Typography>
                    </Box>
                )}

                <Divider sx={{ mx: 2, mb: 1 }} />

                <List sx={{ px: 1.5 }}>
                    {navItems.map(({ label, to, icon: Icon }) => {
                        const isSelected = location.pathname === to;
                        return (
                            <ListItem key={to} disablePadding sx={{ display: "block", mb: 0.5 }}>
                                <ListItemButton
                                    component={Link}
                                    to={to}
                                    selected={isSelected}
                                    sx={{
                                        minHeight: 48,
                                        px: 2,
                                        borderRadius: 999,
                                        justifyContent: open ? "initial" : "center",
                                        color: isSelected ? NU_NAVY_DARK : NU_NAVY_DARK,
                                        bgcolor: isSelected ? NU_GOLD : "transparent",
                                        boxShadow: isSelected ? "0 2px 8px rgba(255, 211, 28, 0.5)" : "none",
                                        transition: "background-color 0.15s ease, box-shadow 0.15s ease",
                                        "&:hover": {
                                            bgcolor: isSelected ? NU_GOLD : "rgba(53, 64, 142, 0.08)",
                                        },
                                        "&.Mui-selected": {
                                            bgcolor: NU_GOLD,
                                        },
                                        "&.Mui-selected:hover": {
                                            bgcolor: NU_GOLD,
                                            filter: "brightness(0.96)",
                                        },
                                    }}
                                >
                                    <ListItemIcon
                                        sx={{
                                            minWidth: 0,
                                            mr: open ? 2 : "auto",
                                            justifyContent: "center",
                                            color: NU_NAVY_DARK,
                                        }}
                                    >
                                        <Icon />
                                    </ListItemIcon>
                                    <ListItemText
                                        primary={label}
                                        sx={{ opacity: open ? 1 : 0 }}
                                        primaryTypographyProps={{ fontWeight: isSelected ? 700 : 500 }}
                                    />
                                </ListItemButton>
                            </ListItem>
                        );
                    })}
                </List>
            </Drawer>

            <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
                <DrawerHeader />
                <Outlet />
            </Box>
        </Box>
    );
};

const DashLayout = () => (
    <ThemeProvider theme={dashboardTheme}>
        <DashLayoutContent />
    </ThemeProvider>
);

export default DashLayout;