import { useQuery } from "@tanstack/react-query";
import { generationsApi } from "../lib/api";
import type { Generation } from "../types";

interface UseGenerationsReturn {
  generations: Generation[];
  isLoading: boolean;
  error: unknown;
}

export function useGenerations(): UseGenerationsReturn {
  const {
    data: generationsData,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["generations"],
    queryFn: async () => {
      const response = await generationsApi.list();
      return response.data.generations;
    },
    retry: 1,
  });

  return {
    generations: generationsData || [],
    isLoading,
    error,
  };
}
