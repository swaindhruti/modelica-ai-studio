import { useState, useRef } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { UseMutationResult } from "@tanstack/react-query";
import { toast } from "react-hot-toast";
import { generationsApi } from "../lib/api";
import type { ApiError, Generation } from "../types";

interface GenerateData {
  prompt: string;
  style?: string;
  imageUrl?: string;
}

interface GenerateResponse {
  generation: Generation;
}

interface UseGenerateReturn {
  generateMutation: UseMutationResult<GenerateResponse, ApiError, GenerateData>;
  latestGeneration: Generation | null;
  setLatestGeneration: (generation: Generation | null) => void;
  handleGenerate: (data: GenerateData) => void;
  cancelGenerate: () => void;
}

export function useGenerate(): UseGenerateReturn {
  const [latestGeneration, setLatestGeneration] = useState<Generation | null>(
    null
  );
  const queryClient = useQueryClient();
  const abortControllerRef = useRef<AbortController | null>(null);

  const generateMutation = useMutation<
    GenerateResponse,
    ApiError,
    GenerateData
  >({
    mutationFn: (data) => {
      // Create a new AbortController for this request
      abortControllerRef.current = new AbortController();
      return generationsApi
        .create(data, abortControllerRef.current.signal)
        .then((res) => res.data);
    },
    retry: (failureCount, error: ApiError) => {
      // Retry up to 3 times only for 503 errors
      if (error?.response?.status === 503 && failureCount < 3) {
        toast.error(`Model overloaded. Retry ${failureCount + 1}/3...`);
        return true;
      }
      return false;
    },
    retryDelay: (attemptIndex) => {
      // Exponential backoff: 1s, 2s, 4s
      const delay = Math.min(1000 * Math.pow(2, attemptIndex), 10000);
      return delay;
    },
    onSuccess: (data) => {
      toast.success("Generation created successfully!");

      // Store the latest generation to display
      setLatestGeneration(data.generation);

      // Invalidate and refetch generations
      queryClient.invalidateQueries({ queryKey: ["generations"] });
    },
    onError: (error: ApiError) => {
      console.error("Generation error:", error);

      if (error.name === "CanceledError" || error.code === "ERR_CANCELED") {
        toast.error("Generation cancelled");
      } else if (error?.response?.status === 503) {
        toast.error("🔥 Model overloaded! Please try again in a moment.");
      } else if (error?.response?.status === 401) {
        toast.error("Authentication failed. Please login again.");
      } else if (error?.response?.status === 400) {
        // Handle Zod validation errors or bad request
        const errorData = error?.response?.data as Record<string, unknown>;
        let errorMessage = "Invalid request";

        if (errorData?.error) {
          // If error is a string, use it
          if (typeof errorData.error === "string") {
            errorMessage = errorData.error;
          }
          // If it's a Zod error object, extract the message
          else if (
            typeof errorData.error === "object" &&
            errorData.error !== null
          ) {
            const errObj = errorData.error as Record<string, unknown>;
            if (errObj.message && typeof errObj.message === "string") {
              errorMessage = errObj.message;
            }
            // If it's an array of issues (Zod format)
            else if (Array.isArray(errObj.issues)) {
              errorMessage = errObj.issues
                .map((issue: Record<string, unknown>) => issue.message)
                .filter((msg): msg is string => typeof msg === "string")
                .join(", ");
            }
          }
        } else if (
          errorData?.message &&
          typeof errorData.message === "string"
        ) {
          errorMessage = errorData.message;
        }

        toast.error(errorMessage);
      } else if (!error?.response) {
        toast.error(
          "Network error. Please check your connection and that the backend server is running."
        );
      } else {
        const errorMsg =
          error?.response?.data?.error ||
          error?.response?.data?.message ||
          "Generation failed";
        toast.error(
          typeof errorMsg === "string" ? errorMsg : "Generation failed"
        );
      }
    },
  });

  const handleGenerate = (data: GenerateData) => {
    if (!data.prompt.trim()) {
      toast.error("Please enter a prompt");
      return;
    }
    generateMutation.mutate(data);
  };

  const cancelGenerate = () => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      abortControllerRef.current = null;
      toast.error("Generation cancelled");
    }
  };

  return {
    generateMutation,
    latestGeneration,
    setLatestGeneration,
    handleGenerate,
    cancelGenerate,
  };
}
