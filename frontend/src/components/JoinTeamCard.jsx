// components/JoinTeamCard.jsx
function JoinTeamCard({ post, onContact }) {
  const levelMap = {
    beginner: 'Mới chơi',
    intermediate: 'Trung bình',
    advanced: 'Khá',
    pro: 'Giỏi'
  };
  const positionMap = {
    goalkeeper: 'Thủ môn',
    defender: 'Hậu vệ',
    midfielder: 'Tiền vệ',
    forward: 'Tiền đạo',
    any: 'Vị trí bất kỳ'
  };

  const formatDate = (dateStr) => {
    const d = new Date(dateStr);
    return `${d.getDate().toString().padStart(2, '0')}/${(d.getMonth()+1).toString().padStart(2, '0')}/${d.getFullYear()}`;
  };

  return (
    <div className="team-card" data-contact-name={post.contact_name} data-contact-phone={post.contact_phone}>
      <div className="team-header">
        <div className="team-type">Cần ghép đội</div>
        <div className="team-time">
          <div className="team-date">{formatDate(post.match_date)}</div>
          <div className="team-hour">{post.start_time.slice(0,5)}</div>
        </div>
      </div>
      <div className="team-details">
        <div className="team-detail-item">
          <i className="fas fa-futbol"></i>
          <span>Loại sân: Sân {post.field_type.replace('', '')} </span>
        </div>
        <div className="team-detail-item">
          <i className="fas fa-trophy"></i>
          <span>Trình độ: {levelMap[post.level]}</span>
        </div>
        <div className="team-detail-item">
          <i className="fas fa-user-friends"></i>
          <span>Cần: {post.players_needed} người</span>
        </div>
        <div className="team-detail-item">
          <i className="fas fa-running"></i>
          <span>Vị trí: {positionMap[post.position_needed]}</span>
        </div>
      </div>
      {post.description && <div className="team-note">{post.description}</div>}
      <div className="team-actions">
        <button className="join-btn">Xin đá ké</button>
        <button className="contact-btn" onClick={() => onContact({ name: post.contact_name, phone: post.contact_phone })}>
          Liên hệ
        </button>
      </div>
    </div>
  );
}

export default JoinTeamCard;
