import React from 'react'
import { useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';
import Loader from '../layouts/Loader';

const ProtectedRoute = ({admin,children}) => {

    const {userAuthenticated,loading,user} = useSelector((state)=>state.auth);

    if(loading){return <Loader />}
    if(!userAuthenticated){
        return <Navigate to="/login" replace />;
    }

    if(admin && user?.role!== 'admin'){
      return <Navigate to="/" replace />;
    }
  return children;
}

export default ProtectedRoute
