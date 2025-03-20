// import React from 'react'
// import { AppAside, AppContent, AppSidebar, AppFooter, AppHeader } from '../components/index'

// const DefaultLayout = () => {
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
//   )
// }

// export default DefaultLayout



import React from 'react';
import { Navigate } from 'react-router-dom';
import { isAuthenticated } from '../utils/auth';
import { AppAside, AppContent, AppSidebar,AppHeader } from '../components/index';

const DefaultLayout = () => {
  if (!isAuthenticated()) {
    return <Navigate to="/login" />;
  }

  return (
    <>
      <AppSidebar />
      <div className="wrapper d-flex flex-column min-vh-100">
        <AppHeader />
        <div className="body flex-grow-1">
          <AppContent />
        </div>
      </div>
      <AppAside />
    </>
  );
};

export default DefaultLayout;
