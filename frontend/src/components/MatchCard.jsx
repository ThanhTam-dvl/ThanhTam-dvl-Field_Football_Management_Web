// components/MatchCard.jsx
function MatchCard({ match, onContact }) {
  const levelMap = {
    beginner: 'Mới chơi',
    intermediate: 'Trung bình',
    advanced: 'Khá',
    pro: 'Giỏi'
  };

  const ageText = match.age_min && match.age_max ? `${match.age_min}-${match.age_max} tuổi` : 'Tất cả';

  return (
    <div className="match-card">
      <div className="match-header">
        <div className="match-type">
          Sân {match.field_type} người
          {match.allow_join && <span className="team-join-badge">Ghép đội</span>}
        </div>
        <div className="match-time">
          <div className="match-date">{match.match_date}</div>
          <div className="match-hour">{match.time_slot}:00</div>
        </div>
      </div>
      <div className="match-details">
        <div className="match-detail-item">
          <i className="fas fa-trophy"></i>
          <span>Trình độ: {levelMap[match.level]}</span>
        </div>
        <div className="match-detail-item">
          <i className="fas fa-users"></i>
          <span>Độ tuổi: {ageText}</span>
        </div>
        <div className="match-detail-item">
          <i className="fas fa-user"></i>
          <span>Liên hệ: {match.contact_name}</span>
        </div>
      </div>
      {match.description && <div className="match-note">{match.description}</div>}
      <div className="match-actions">
        <button className="contact-btn" onClick={() => onContact({ name: match.contact_name, phone: match.contact_phone })}>
          <i className="fas fa-phone"></i> Liên hệ
        </button>
        {match.allow_join && (
          <button className="contact-btn join-team-btn">
            <i className="fas fa-user-plus"></i> Xin vào đội
          </button>
        )}
      </div>
    </div>
  );
}

export default MatchCard;
