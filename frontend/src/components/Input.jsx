export default function Input({ label, ...props }) {
  return (
    <label style={{ display: 'block', marginBottom: 12 }}>
      {label && <div style={{ marginBottom: 4 }}>{label}</div>}
      <input
        {...props}
        style={{
          width: '100%',
          padding: '10px 12px',
          border: '1px solid #ccc',
          borderRadius: 8
        }}
      />
    </label>
  );
}
