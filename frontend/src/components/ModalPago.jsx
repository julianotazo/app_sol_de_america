import { useState } from 'react';

export default function ModalPago({ isOpen, onClose, onConfirm }) {
  const [monto, setMonto] = useState('');

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-xl w-full max-w-md shadow-lg border-t-4 border-sol-yellow">
        <h2 className="text-xl font-bold text-sol-blue">Registrar Pago</h2>

        <div className="mt-4 flex flex-col gap-3">
          <label className="text-sm font-medium">Monto</label>
          <input
            type="number"
            value={monto}
            onChange={(e) => setMonto(e.target.value)}
            placeholder="Ej: 5000"
            className="p-2 border rounded-lg"
          />
        </div>

        <div className="flex justify-end mt-6 gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-200 rounded-md hover:bg-gray-300"
          >
            Cancelar
          </button>

          <button
            onClick={() => onConfirm(monto)}
            className="px-4 py-2 bg-sol-yellow text-black rounded-md hover:bg-yellow-400 font-medium"
          >
            Confirmar
          </button>
        </div>
      </div>
    </div>
  );
}
