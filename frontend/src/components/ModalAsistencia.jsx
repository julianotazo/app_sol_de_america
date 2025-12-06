export default function ModalAsistencia({ isOpen, onClose, onConfirm, socio }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-xl w-full max-w-md shadow-lg border-t-4 border-sol-blue">
        <h2 className="text-xl font-bold text-sol-blue">
          Registrar asistencia
        </h2>

        <p className="mt-4">
          ¿Confirmás la asistencia de{' '}
          <strong>
            {socio?.first_name} {socio?.last_name}
          </strong>
          ?
        </p>

        <div className="flex justify-end mt-6 gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-200 rounded-md hover:bg-gray-300"
          >
            Cancelar
          </button>

          <button
            onClick={onConfirm}
            className="px-4 py-2 bg-sol-blue text-white rounded-md hover:bg-blue-800"
          >
            Confirmar
          </button>
        </div>
      </div>
    </div>
  );
}
