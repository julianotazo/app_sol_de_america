export default function Navbar() {
  return (
    <header className="h-16 bg-white shadow flex items-center justify-between px-6">
      <h1 className="text-xl font-semibold text-sol-blue">Panel del Club</h1>

      <div className="flex items-center gap-3">
        <span className="font-medium text-sol-blue">Agostina</span>
        <img
          src="https://ui-avatars.com/api/?name=A+G&background=0047AB&color=fff"
          alt="avatar"
          className="w-10 h-10 rounded-full border-2 border-sol-blue"
        />
      </div>
    </header>
  );
}
