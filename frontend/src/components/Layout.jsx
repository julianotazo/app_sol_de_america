import Sidebar from './SideBar';
import Navbar from './NavBar';
import { Outlet } from 'react-router-dom';

export default function Layout() {
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
