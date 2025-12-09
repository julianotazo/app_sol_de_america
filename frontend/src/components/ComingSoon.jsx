export default function ComingSoon({ title }) {
  return (
    <div className="bg-white p-8 rounded-xl shadow text-center space-y-4">
      <h2 className="text-2xl font-bold text-sol-blue">{title}</h2>
      <p className="text-gray-600 text-lg">
        Pantalla o función en desarrollo, proximamente estará lista.
      </p>
    </div>
  );
}
