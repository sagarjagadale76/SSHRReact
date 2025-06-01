// ProtectedRoute.jsx
import { Navigate } from 'react-router-dom';
import { getCurrentUser } from "aws-amplify/auth"
import { useEffect } from "react"

// Component to protect routes based on permissions
export const ProtectedRoute = ({ children, requiredPermission, fallbackPath = "/dashboard" }) => {

    debugger;


  useEffect(() => {
    const checkUser = async () => {
    // Check if user is authenticated
        const currentUser = await getCurrentUser()
        const userData = localStorage.getItem('userdetails');
        if (currentUser && userData) {
            if (currentUser.signInDetails.loginId !== JSON.parse(userData).UserName) {
                // If the username does not match, clear localStorage and redirect to login
                localStorage.removeItem('userdetails');
                return <Navigate to="/login" replace />;
            }
        }
    }

    checkUser();
  
});

  
  // If not authenticated, redirect to login
//   if (user === null || user === undefined) {
//     return <Navigate to="/login" replace />;
//   }

  // If no specific permission required, just check authentication
  if (!requiredPermission) {
    return children;
  }

  // Get user permissions from localStorage
  const getUserPermissions = () => {
    try {
      const userData = localStorage.getItem('userdetails');
      if (userData) {
        const parsedUser = JSON.parse(userData);
        return parsedUser.Permissions || [];
      }
      return [];
    } catch (error) {
      console.error('Error parsing user permissions:', error);
      return [];
    }
  };

  const userPermissions = getUserPermissions();
  
  // Check if user has required permission
  const hasPermission = userPermissions.includes(requiredPermission);

  if (!hasPermission) {
    // Redirect to unauthorized page or fallback path
    return <Navigate to={fallbackPath} replace />;
  }

  return children;
};

// Hook to check permissions in components
export const usePermissions = () => {
  const getUserPermissions = () => {
    try {
      const userData = localStorage.getItem('userdetails');
      if (userData) {
        const parsedUser = JSON.parse(userData);
        return parsedUser.Permissions || [];
      }
      return [];
    } catch (error) {
      console.error('Error parsing user permissions:', error);
      return [];
    }
  };

  const hasPermission = (permission) => {
    const permissions = getUserPermissions();
    return permissions.includes(permission);
  };

  const hasAnyPermission = (permissionsList) => {
    const permissions = getUserPermissions();
    return permissionsList.some(permission => permissions.includes(permission));
  };

  const hasAllPermissions = (permissionsList) => {
    const permissions = getUserPermissions();
    return permissionsList.every(permission => permissions.includes(permission));
  };

  return {
    permissions: getUserPermissions(),
    hasPermission,
    hasAnyPermission,
    hasAllPermissions
  };
};

// Unauthorized component
export const Unauthorized = () => {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md text-center">
        <h1 className="text-2xl font-bold text-red-600 mb-4">Access Denied</h1>
        <p className="text-gray-600 mb-4">
          You don't have permission to access this page.
        </p>
        <button 
          onClick={() => window.history.back()}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Go Back
        </button>
      </div>
    </div>
  );
};