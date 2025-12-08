import { useEffect } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import Sidebar from './SideBar';
import Navbar from './NavBar';
import { meRequest } from '../services/auth';
import { useAuthStore } from '../store/authStore';

export default function Layout() {
  const token = useAuthStore((state) => state.token);
  const user = useAuthStore((state) => state.user);
  const setUser = useAuthStore((state) => state.setUser);
  const logout = useAuthStore((state) => state.logout);
  const navigate = useNavigate();

  useEffect(() => {
    const loadUser = async () => {
      try {
        const me = await meRequest();
        setUser(me.user ?? me);
      } catch {
        logout();
        navigate('/');
      }
    };

    if (token && !user) {
      loadUser();
    }
  }, [token, user, setUser, logout, navigate]);

  return (
    <div className="flex">
      <Sidebar />

      <div className="flex-1 flex flex-col">
        <Navbar />

        <main className="p-6 bg-gray-100 min-h-screen">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
