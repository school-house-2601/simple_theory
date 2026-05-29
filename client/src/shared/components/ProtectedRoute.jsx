import { Navigate } from "react-router-dom";
import { useAuth } from "../../features/05-Auth/AuthContext";

export default function ProtectedRoute({ children }) {
    const { user } = useAuth();

    if (!user) {
        return <Navigate to="/login" replace />;
    }

    return children;
}