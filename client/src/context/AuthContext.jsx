import React, { createContext, useContext, useState, useEffect } from 'react';
import { getMe, passwordLogin, verifyOtpAndLogin } from '../services/api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [wishlist, setWishlist] = useState(() => {
    try {
      const saved = localStorage.getItem('shikhar360_wishlist');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Default comparison matching Part 1 mockup: Amity, Manipal, Chandigarh
  const [compareList, setCompareList] = useState([
    {
      id: 6,
      slug: 'amity-university',
      name: 'Amity University',
      city: 'Noida',
      state: 'Uttar Pradesh',
      rating: 4.2,
      reviewCount: 512,
      logoUrl: 'https://images.unsplash.com/photo-1564981797816-1043664bf78d?w=120&auto=format&fit=crop&q=80'
    },
    {
      id: 7,
      slug: 'manipal-university',
      name: 'Manipal University',
      city: 'Jaipur',
      state: 'Rajasthan',
      rating: 4.1,
      reviewCount: 436,
      logoUrl: 'https://images.unsplash.com/photo-1590012314607-cda9d9b699ae?w=120&auto=format&fit=crop&q=80'
    },
    {
      id: 8,
      slug: 'chandigarh-university',
      name: 'Chandigarh University',
      city: 'Mohali',
      state: 'Punjab',
      rating: 4.0,
      reviewCount: 398,
      logoUrl: 'https://images.unsplash.com/photo-1576495199011-eb94736d05d6?w=120&auto=format&fit=crop&q=80'
    }
  ]);

  const [counsellingModalOpen, setCounsellingModalOpen] = useState(false);
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [selectedCity, setSelectedCity] = useState('Indore');
  const [cityModalOpen, setCityModalOpen] = useState(false);

  useEffect(() => {
    checkLoggedInUser();
  }, []);

  const checkLoggedInUser = async () => {
    const token = localStorage.getItem('shikhar360_token');
    if (!token) {
      setLoading(false);
      return;
    }
    const res = await getMe();
    if (res && res.success && res.user) {
      setUser(res.user);
    } else {
      localStorage.removeItem('shikhar360_token');
      setUser(null);
    }
    setLoading(false);
  };

  const handlePasswordLogin = async (identifier, password) => {
    const res = await passwordLogin(identifier, password);
    if (res.success && res.tokens?.accessToken) {
      localStorage.setItem('shikhar360_token', res.tokens.accessToken);
      setUser(res.user);
      return { success: true, user: res.user };
    }
    return { success: false, message: res.message || 'Login failed' };
  };

  const handleOtpLogin = async (phone, otp, fullName, roleName) => {
    const res = await verifyOtpAndLogin(phone, otp, fullName, roleName);
    if (res.success && res.tokens?.accessToken) {
      localStorage.setItem('shikhar360_token', res.tokens.accessToken);
      setUser(res.user);
      return { success: true, user: res.user };
    }
    return { success: false, message: res.message || 'Verification failed' };
  };

  const logout = () => {
    localStorage.removeItem('shikhar360_token');
    setUser(null);
  };

  const toggleWishlist = (college) => {
    setWishlist(prev => {
      const exists = prev.some(item => item.id === college.id);
      const updated = exists ? prev.filter(item => item.id !== college.id) : [...prev, college];
      localStorage.setItem('shikhar360_wishlist', JSON.stringify(updated));
      return updated;
    });
  };

  const removeFromCompare = (collegeId) => {
    setCompareList(prev => prev.filter(c => c.id !== collegeId));
  };

  const clearCompare = () => {
    setCompareList([]);
  };

  const addToCompare = (college) => {
    if (compareList.length >= 4) {
      alert('You can compare up to 4 colleges at a time.');
      return;
    }
    if (!compareList.some(c => c.id === college.id)) {
      setCompareList([...compareList, college]);
    }
  };

  // Demo switcher to test all 9 dashboards directly
  const switchRoleDemo = (roleName) => {
    const roleProfiles = {
      super_admin: { id: 1, fullName: 'Super Admin', email: 'superadmin@shikhar360.in', phone: '9999900001', role: 'super_admin' },
      admin: { id: 2, fullName: 'Admissions Admin', email: 'admin@shikhar360.in', phone: '9999900002', role: 'admin' },
      counsellor: { id: 3, fullName: 'Rajesh Sharma', email: 'counsellor@shikhar360.in', phone: '9999900003', role: 'counsellor' },
      college_rep: { id: 4, fullName: 'Amity University Rep', email: 'amity.rep@shikhar360.in', phone: '9999900004', role: 'college_rep', tenantId: 6, tenantCollege: { id: 6, name: 'Amity University', slug: 'amity-university' } },
      faculty: { id: 5, fullName: 'Prof. Deepak Verma', email: 'faculty@shikhar360.in', phone: '9999900005', role: 'faculty', tenantId: 6 },
      accounts: { id: 6, fullName: 'Sunil Mehta (Accounts)', email: 'accounts@shikhar360.in', phone: '9999900006', role: 'accounts', tenantId: 6 },
      student: { id: 7, fullName: 'Priya Sharma', email: 'student@shikhar360.in', phone: '9999999999', role: 'student', tenantId: 6 },
      parent: { id: 8, fullName: 'Mr. Ramesh Sharma (Parent)', email: 'parent@shikhar360.in', phone: '9999900008', role: 'parent', tenantId: 6 },
      partner: { id: 9, fullName: 'Vikram Patel (Partner)', email: 'partner@shikhar360.in', phone: '9999900009', role: 'partner' },
    };

    if (roleProfiles[roleName]) {
      setUser(roleProfiles[roleName]);
    }
  };

  return (
    <AuthContext.Provider value={{
      user,
      loading,
      loginWithPassword: handlePasswordLogin,
      loginWithOtp: handleOtpLogin,
      logout,
      switchRoleDemo,
      wishlist,
      toggleWishlist,
      compareList,
      addToCompare,
      removeFromCompare,
      clearCompare,
      counsellingModalOpen,
      setCounsellingModalOpen,
      authModalOpen,
      setAuthModalOpen,
      selectedCity,
      setSelectedCity,
      cityModalOpen,
      setCityModalOpen
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
