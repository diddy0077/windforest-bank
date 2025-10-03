import { useContext } from "react";
import { Navigate } from "react-router-dom";
import { UserContext } from "./UserContext";

function AdminRoute({ children }) {
  const { currentUser } = useContext(UserContext);

  if (!currentUser || currentUser.role !== "admin") {
    return <Navigate to="/" replace />;
  }

  return children;
}

export default AdminRoute