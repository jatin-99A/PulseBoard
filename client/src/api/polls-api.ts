import apiClient from './axios-client';
import type { ApiResponse } from '../types/auth';
import type { Poll, CreatePollInput, PollAnalysis } from '../types/polls';

export const pollsApi = {
  createPoll: async (data: CreatePollInput): Promise<ApiResponse<Poll>> => {
    const res = await apiClient.post<ApiResponse<Poll>>('/polls/create', data);
    return res.data;
  },

  getAllPolls: async (): Promise<ApiResponse<Poll[]>> => {
    const res = await apiClient.get<ApiResponse<Poll[]>>('/polls');
    return res.data;
  },

  getSinglePoll: async (id: string): Promise<ApiResponse<Poll>> => {
    const res = await apiClient.get<ApiResponse<Poll>>(`/polls/${id}`);
    return res.data;
  },

  deletePoll: async (id: string): Promise<ApiResponse<{ id: string; deleted: boolean }>> => {
    const res = await apiClient.delete<ApiResponse<{ id: string; deleted: boolean }>>(`/polls/${id}`);
    return res.data;
  },

  getPollAnalysis: async (id: string): Promise<ApiResponse<PollAnalysis>> => {
    const res = await apiClient.get<ApiResponse<PollAnalysis>>(`/polls/${id}/analysis`);
    return res.data;
  },
};

export default pollsApi;

