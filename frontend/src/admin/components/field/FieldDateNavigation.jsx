// ====== frontend/src/admin/components/field/FieldDateNavigation.jsx ======
const FieldDateNavigation = ({ currentDate, onChangeDate, onGoToToday, formatDate }) => {
  return (
    <div className="admin-date-navigation">
      <button className="admin-nav-btn" onClick={() => onChangeDate(-1)}>
        <i className="fas fa-chevron-left"></i>
      </button>
      <div className="admin-current-date">
        <h2>{formatDate(currentDate)}</h2>
        <button className="admin-today-btn" onClick={onGoToToday}>
          Hôm nay
        </button>
      </div>
      <button className="admin-nav-btn" onClick={() => onChangeDate(1)}>
        <i className="fas fa-chevron-right"></i>
      </button>
    </div>
  );
};

export default FieldDateNavigation;
