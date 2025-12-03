export default function DashboardPage() {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-sol-blue">Dashboard del Club</h2>

      {/* Tarjetas */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-xl shadow border-l-4 border-sol-blue">
          <h3 className="text-sol-blue font-semibold text-lg">Jugadores</h3>
          <p className="text-3xl font-bold mt-2">120</p>
        </div>

        <div className="bg-white p-6 rounded-xl shadow border-l-4 border-sol-yellow">
          <h3 className="text-sol-blue font-semibold text-lg">Planteles</h3>
          <p className="text-3xl font-bold mt-2">8</p>
        </div>

        <div className="bg-white p-6 rounded-xl shadow border-l-4 border-sol-orange">
          <h3 className="text-sol-blue font-semibold text-lg">
            Próximos eventos
          </h3>
          <p className="text-lg mt-2">3 entrenamientos</p>
        </div>
      </div>
    </div>
  );
}
