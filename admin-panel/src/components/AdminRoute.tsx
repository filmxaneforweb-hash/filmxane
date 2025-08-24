import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

interface AdminRouteProps {
  children: React.ReactNode;
}

const AdminRoute: React.FC<AdminRouteProps> = ({ children }) => {
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const checkAdminStatus = () => {
      try {
        console.log('🔍 AdminRoute: Checking admin status...')
        
        // localStorage'dan admin token'ını al
        const adminToken = localStorage.getItem('filmxane_admin_token');
        const userRole = localStorage.getItem('filmxane_user_role');
        const userEmail = localStorage.getItem('filmxane_user_email');

        console.log('🔍 AdminRoute: LocalStorage data:', {
          adminToken: adminToken ? 'EXISTS' : 'MISSING',
          userRole,
          userEmail
        });

        if (!adminToken || !userEmail) {
          console.log('❌ AdminRoute: No admin token or email found');
          setIsAdmin(false);
          setLoading(false);
          return;
        }

        // Role kontrolü
        if (userRole !== 'admin') {
          console.log('❌ AdminRoute: User is not admin, role:', userRole);
          setIsAdmin(false);
          setLoading(false);
          return;
        }

        console.log('✅ AdminRoute: Basic checks passed, verifying with backend...');

        // Backend'de admin rolünü doğrula
        fetch('http://localhost:3005/api/auth/verify-admin', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${adminToken}`
          },
          body: JSON.stringify({ email: userEmail })
        })
        .then(response => {
          console.log('📡 AdminRoute: Backend response status:', response.status);
          return response.json();
        })
        .then(data => {
          console.log('📡 AdminRoute: Backend response data:', data);
          
          if (data.success && data.isAdmin) {
            console.log('✅ AdminRoute: Admin access verified');
            setIsAdmin(true);
          } else {
            console.log('❌ AdminRoute: Admin access denied:', data);
            setIsAdmin(false);
          }
        })
        .catch(error => {
          console.error('❌ AdminRoute: Error verifying admin status:', error);
          // Backend hatası durumunda local kontrol ile devam et
          console.log('🔄 AdminRoute: Falling back to local admin check');
          setIsAdmin(true);
        })
        .finally(() => {
          setLoading(false);
        });

      } catch (error) {
        console.error('❌ AdminRoute: Error checking admin status:', error);
        setIsAdmin(false);
        setLoading(false);
      }
    };

    checkAdminStatus();
  }, [navigate]);

  // Loading durumu
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-white text-lg">Admin yetkisi kontrol ediliyor...</p>
        </div>
      </div>
    );
  }

  // Admin değilse admin login sayfasına yönlendir
  if (!isAdmin) {
    navigate('/admin');
    return null;
  }

  // Admin ise içeriği göster
  return <>{children}</>;
};

export default AdminRoute;
