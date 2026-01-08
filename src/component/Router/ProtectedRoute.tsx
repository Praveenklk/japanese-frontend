import { Navigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

type Role = "ADMIN" | "USER";

type Props = {
  children: JSX.Element;
  roles?: Role[];
};

const ProtectedRoute = ({ children, roles }: Props) => {
  const { user, loading } = useAuth();

  if (loading) {
    return <p>Loading...</p>;
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (roles && !roles.includes(user.role)) {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default ProtectedRoute;
