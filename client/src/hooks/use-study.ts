import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@shared/routes";
import { z } from "zod";

type StatsResponse = z.infer<typeof api.study.stats.responses[200]>;
type ReviewInput = z.infer<typeof api.study.review.input>;

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
      const res = await fetch(url, { credentials: "include" });
      if (!res.ok) throw new Error("Failed to fetch study session");
      return api.study.session.responses[200].parse(await res.json());
    },
    staleTime: Infinity, 
    refetchOnWindowFocus: false,
  });
}

export function useStudyStats() {
  return useQuery({
    queryKey: [api.study.stats.path],
    queryFn: async () => {
      // Add timestamp to force fresh fetch
      const res = await fetch(`${api.study.stats.path}?t=${Date.now()}`, { credentials: "include" });
      if (!res.ok) throw new Error("Failed to fetch stats");
      return api.study.stats.responses[200].parse(await res.json());
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
      const validated = api.study.review.input.parse(data);
      const res = await fetch(api.study.review.path, {
        method: api.study.review.method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(validated),
        credentials: "include",
      });
      if (!res.ok) throw new Error("Failed to submit review");
      return api.study.review.responses[200].parse(await res.json());
    },
    onSuccess: () => {
      // Immediately invalidate stats to update UI
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
      return api.questions.list.responses[200].parse(await res.json());
    },
  });
}