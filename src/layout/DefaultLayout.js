// import React from 'react';
// import { Navigate } from 'react-router-dom';
// import { isAuthenticated } from '../utils/auth';
// import { AppAside, AppContent, AppSidebar,AppHeader } from '../components/index';

// const DefaultLayout = () => {
//   if (!isAuthenticated()) {
//     return <Navigate to="/login" />;
//   }

//   return (
//     <>
//       <AppSidebar />
//       <div className="wrapper d-flex flex-column min-vh-100">
//         <AppHeader />
//         <div className="body flex-grow-1">
//           <AppContent />
//         </div>
//       </div>
//       <AppAside />
//     </>
//   );
// };

// export default DefaultLayout;

import React, { useEffect, useState } from 'react';
import { AppAside, AppContent, AppSidebar, AppHeader } from '../components/index';
import { useNavigate } from 'react-router-dom';

import Login from '../views/pages/login/Login';
import axiosInstance from 'src/axiosInstance';

const DefaultLayout = () => {
  // const [auth, setAuth] = useState(false); 
  const [auth, setAuth] = useState(true); 
  const navigate = useNavigate();

  useEffect(() => {
    axiosInstance.get('/')
      .then(res => {
        if (res.status === 200 && res.data.valid) {
          setAuth(true);
        } else {
          setAuth(false);
          navigate('/login');
        }
      })
      .catch(err => {
        console.error('Error during authentication:', err);
        setAuth(false);
        navigate('/login');
      });
  }, [navigate]);

  return (
    <div>
      {auth ? (
        <div>
          <AppSidebar />
          <div className="wrapper d-flex flex-column min-vh-100">
            <AppHeader />
            <div className="body flex-grow-1">
              <AppContent />
            </div>
          </div>
          <AppAside />
        </div>
      ) : (
        <Login />
      )}
    </div>
  );
};

export default DefaultLayout;
