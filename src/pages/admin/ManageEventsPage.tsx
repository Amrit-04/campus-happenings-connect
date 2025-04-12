
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '@/components/Layout';

// This is a placeholder that will redirect users away from the admin page
const ManageEventsPage = () => {
  const navigate = useNavigate();
  
  // Redirect all users to the home page
  useEffect(() => {
    navigate('/', { replace: true });
  }, [navigate]);
  
  return (
    <Layout>
      <div>Redirecting...</div>
    </Layout>
  );
};

export default ManageEventsPage;
