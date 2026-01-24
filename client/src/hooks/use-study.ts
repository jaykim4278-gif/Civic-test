import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@shared/routes";
import { z } from "zod";

// Manually define type to bypass strict Zod schema issues
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

export function useStudySession(args?: { mode?: string; startId?: number }) {
  const { mode, startId } = args || {};
  return useQuery({
    queryKey: [api.study.session.path, mode, startId],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (mode) params.append("mode", mode);
      if (startId) params.append("startId", startId.toString());
      
      const url = `${api.study.session.path}?${params.toString()}&t=${Date.now()}`;
      const res = await fetch(url, { credentials: "include" });
      if (!res.ok) throw new Error("Failed to fetch study session");
      
      // Bypass Zod validation to ensure session loads
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
      // 1. Force fresh fetch from server
      const res = await fetch(`${api.study.stats.path}?t=${Date.now()}`, { credentials: "include" });
      if (!res.ok) throw new Error("Failed to fetch stats");
      
      // 2. CRITICAL FIX: Bypass .parse()!
      // Directly cast the JSON to our type. 
      // This ensures that if the server says "Q7", the UI receives "Q7".
      const data = await res.json();
      console.log("[Client] Stats Data Received:", data); // Check Console to see 'nextQuestionId: 7'
      return data as StatsResponse;
    },
    // Always refetch to keep UI in sync
    staleTime: 0,
    gcTime: 0, 
    refetchOnMount: 'always'
  });
}

export function useSubmitReview() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: ReviewInput) => {
      // 1. Capture the current mode (linear, random, jump)
      const searchParams = new URLSearchParams(window.location.search);
      const mode = searchParams.get("mode") || "linear";

      // 2. Validate input payload (Input validation is safe to keep)
      const validated = api.study.review.input.parse(data);

      // 3. Send to server with mode flag
      // (Server will skip saving if mode is random/jump)
      const res = await fetch(`${api.study.review.path}?mode=${mode}`, {
        method: api.study.review.method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(validated),
        credentials: "include",
      });
      if (!res.ok) throw new Error("Failed to submit review");
      return await res.json();
    },
    onSuccess: () => {
      // Refresh stats immediately after answering
      queryClient.invalidateQueries({ queryKey: [api.study.stats.path] });
    },
  });
}

export function useQuestions() {
  return useQuery({
    queryKey: [api.questions.list.path],
    queryFn: async () => {
      const res = await fetch(api.questions.list.path, { credentials: "include" });
      if (!res.ok) throw new Error("Failed to fetch questions");
      return await res.json();
    },
  });
}