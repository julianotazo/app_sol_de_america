import { NavLink } from 'react-router-dom';
import logo from '../../public/sol_de_america.png'; // poné el nombre correcto del archivo

export default function Sidebar() {
  return (
    <aside className="w-64 bg-sol-blue text-white h-screen p-4 flex flex-col">
      {/* Logo */}
      <div className="flex flex-col items-center mb-8">
        <img src={logo} alt="Escudo Sol de América" className="w-28 mb-2" />
        <h2 className="text-lg font-semibold text-white tracking-wide">
          Sol de América
        </h2>
      </div>

      {/* Links */}
      <nav className="flex flex-col gap-2 text-white">
        <NavLink
          to="/dashboard"
          className={({ isActive }) =>
            `p-2 rounded-md text-sm font-medium ${
              isActive ? 'bg-sol-yellow text-black' : 'hover:bg-blue-800'
            }`
          }
        >
          Inicio
        </NavLink>

        <NavLink
          to="/jugadores"
          className={({ isActive }) =>
            `p-2 rounded-md text-sm font-medium ${
              isActive ? 'bg-sol-yellow text-black' : 'hover:bg-blue-800'
            }`
          }
        >
          Jugadores
        </NavLink>

        <NavLink
          to="/socios"
          className={({ isActive }) =>
            `p-2 rounded-md text-sm font-medium ${
              isActive ? 'bg-sol-yellow text-black' : 'hover:bg-blue-800'
            }`
          }
        >
          Socios
        </NavLink>

        <NavLink
          to="/sedes"
          className={({ isActive }) =>
            `p-2 rounded-md text-sm font-medium ${
              isActive ? 'bg-sol-yellow text-black' : 'hover:bg-blue-800'
            }`
          }
        >
          Sedes
        </NavLink>

        <NavLink
          to="/personal"
          className={({ isActive }) =>
            `p-2 rounded-md text-sm font-medium ${
              isActive ? 'bg-sol-yellow text-black' : 'hover:bg-blue-800'
            }`
          }
        >
          Personal
        </NavLink>
      </nav>
    </aside>
  );
}
