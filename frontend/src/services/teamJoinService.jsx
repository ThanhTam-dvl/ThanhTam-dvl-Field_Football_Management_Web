// services/teamJoinService.js
import API from './api';

export const fetchTeamJoinPosts = async (filter = {}) => {
  const res = await API.get('/team-join', { params: filter });
  return res.data;
};

export const createTeamJoinPost = async (data) => {
  const res = await API.post('/team-join', data);
  return res.data;
};
