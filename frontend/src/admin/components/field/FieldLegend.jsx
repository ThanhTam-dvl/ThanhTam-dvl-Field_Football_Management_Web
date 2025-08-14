// ====== frontend/src/admin/components/field/FieldLegend.jsx ======
const FieldLegend = () => {
  const legendItems = [
    { class: 'available', label: 'Trống' },
    { class: 'booked', label: 'Đã đặt' },
    { class: 'pending', label: 'Chờ duyệt' },
    { class: 'maintenance', label: 'Bảo trì' }
  ];

  return (
    <div className="admin-legend">
      {legendItems.map(item => (
        <div key={item.class} className="admin-legend-item">
          <div className={`admin-legend-color ${item.class}`}></div>
          <span>{item.label}</span>
        </div>
      ))}
    </div>
  );
};

export default FieldLegend;