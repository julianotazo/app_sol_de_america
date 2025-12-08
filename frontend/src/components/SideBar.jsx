import { NavLink } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { resolveRole } from '../utils/roles';
import logo from '../../public/sol_de_america.png';

export default function Sidebar() {
  const user = useAuthStore((state) => state.user);
  const token = useAuthStore((state) => state.token);

  const role = resolveRole(user, token);
  const isAdmin = role === 'admin';

  const links = isAdmin
    ? [
        { to: '/dashboard', label: 'Inicio' },
        { to: '/jugadores', label: 'Jugadores' },
        { to: '/socios', label: 'Socios' },
        { to: '/sedes', label: 'Sedes' },
        { to: '/personal', label: 'Personal' }
      ]
    : [
        { to: '/bienvenida', label: 'Inicio' },
        { to: '/perfil', label: 'Perfil Personal' }
      ];

  return (
    <aside className="w-64 bg-sol-blue text-white h-screen sticky top-0 p-4 flex flex-col flex-shrink-0">
      {/* Logo */}
      <div className="flex flex-col items-center mb-8">
        <img src={logo} alt="Escudo Sol de América" className="w-28 mb-2" />
        <h2 className="text-lg font-semibold text-white tracking-wide">
          Sol de América
        </h2>
      </div>

      {/* Links */}
      <nav className="flex flex-col gap-2 text-white">
        {links.map(({ to, label }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              `p-2 rounded-md text-sm font-medium ${
                isActive ? 'bg-sol-yellow text-black' : 'hover:bg-blue-800'
              }`
            }
          >
            {label}
          </NavLink>
        ))}
      </nav>
    </aside>
  );
}
