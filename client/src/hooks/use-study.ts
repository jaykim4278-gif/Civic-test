import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@shared/routes";
import { z } from "zod";

type StatsResponse = {
  totalQuestions: number;
  masteredCount: number;
  currentStreak: number;
  hardCount: number;
  nextQuestionId: number;
  totalLearned: number;
  dueToday: number;
};
type ReviewInput = z.infer<typeof api.study.review.input>;

// Helper to get headers with User ID
const getHeaders = () => {
  const userId = localStorage.getItem("civics_user_id") || "1";
  return {
    "Content-Type": "application/json",
    "x-user-id": userId
  };
};

export function useStudySession(args?: { mode?: string; startId?: number }) {
  const { mode, startId } = args || {};
  return useQuery({
    queryKey: [api.study.session.path, mode, startId],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (mode) params.append("mode", mode);
      if (startId) params.append("startId", startId.toString());
      
      // Add timestamp to prevent caching
      const url = `${api.study.session.path}?${params.toString()}&t=${Date.now()}`;
      const res = await fetch(url, { 
        credentials: "include",
        headers: getHeaders() 
      });
      if (!res.ok) throw new Error("Failed to fetch study session");
      return (await res.json()) as any;
    },
    staleTime: 0, 
    refetchOnWindowFocus: false,
  });
}

export function useStudyStats() {
  return useQuery({
    queryKey: [api.study.stats.path],
    queryFn: async () => {
      // Add timestamp to force fresh fetch
      const res = await fetch(`${api.study.stats.path}?t=${Date.now()}`, { 
        credentials: "include",
        headers: getHeaders()
      });
      if (!res.ok) throw new Error("Failed to fetch stats");
      
      const data = await res.json();
      return data as StatsResponse;
    },
    // CRITICAL: Always treat data as stale so it refetches on home screen mount
    staleTime: 0,
    gcTime: 0, 
    refetchOnMount: 'always'
  });
}

export function useSubmitReview() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: ReviewInput) => {
      // 1. Get current mode from URL
      const searchParams = new URLSearchParams(window.location.search);
      const mode = searchParams.get("mode") || "linear";

      // 2. Validate Input
      const validated = api.study.review.input.parse(data);

      // 3. Send request with Headers
      const res = await fetch(`${api.study.review.path}?mode=${mode}`, {
        method: api.study.review.method,
        headers: getHeaders(), // Include User ID
        body: JSON.stringify(validated),
        credentials: "include",
      });
      if (!res.ok) throw new Error("Failed to submit review");
      return await res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [api.study.stats.path] });
    },
  });
}

export function useQuestions() {
  return useQuery({
    queryKey: [api.questions.list.path],
    queryFn: async () => {
      const res = await fetch(api.questions.list.path, { 
        credentials: "include",
        headers: getHeaders()
      });
      if (!res.ok) throw new Error("Failed to fetch questions");
      return await res.json();
    },
  });
}
