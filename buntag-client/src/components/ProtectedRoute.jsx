import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

// roles of  allowed roles are admin and supplier
const ProtectedRoute = ({ children, roles }) => {
    const { user } = useAuth();
    const location = useLocation();

    if (!user) {
        return <Navigate to="/signin" replace state={{ from: location.pathname }} />;
    }

    if (roles && !roles.includes(user.role)) {
        // Logged in, wrong role = bounce to home
        const fallback = user.role === 'customer' ? '/' : '/dashboard';
        return <Navigate to={fallback} replace />;
    }

    return children;
};

export default ProtectedRoute;