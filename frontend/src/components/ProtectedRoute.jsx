import React, { useEffect } from "react";
import { Navigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { setAuthUser, clearAuthUser } from "../../redux/userSlice";

const ProtectedRoute = ({ children }) => {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user.authUser);

  useEffect(() => {
    // ✅ Restore user from localStorage on refresh
    const storedUser = localStorage.getItem("authUser");
    if (!user && storedUser) {
      dispatch(setAuthUser(JSON.parse(storedUser)));
    }
  }, [user, dispatch]);

  // ✅ If no user found anywhere → redirect to login
  if (!user && !localStorage.getItem("authUser")) {
    dispatch(clearAuthUser());
    return <Navigate to="/login" replace />;
  }

  // ✅ Otherwise, allow access
  return children;
};

export default ProtectedRoute;
