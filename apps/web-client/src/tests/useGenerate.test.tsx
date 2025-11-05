import { describe, it, expect, vi, beforeEach } from "vitest";
import { renderHook, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useGenerate } from "../hooks/useGenerate";
import { generationsApi } from "../lib/api";
import type { ReactNode } from "react";

// Mock the API
vi.mock("../lib/api", () => ({
  generationsApi: {
    create: vi.fn(),
  },
}));

// Mock react-hot-toast
vi.mock("react-hot-toast", () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn(),
  },
  default: {
    success: vi.fn(),
    error: vi.fn(),
  },
}));

describe("useGenerate Hook", () => {
  let queryClient: QueryClient;

  beforeEach(() => {
    queryClient = new QueryClient({
      defaultOptions: {
        queries: { retry: false },
        mutations: { retry: false },
      },
    });
    vi.clearAllMocks();
  });

  const wrapper = ({ children }: { children: ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );

  it("initializes with null latestGeneration", () => {
    const { result } = renderHook(() => useGenerate(), { wrapper });
    expect(result.current.latestGeneration).toBeNull();
  });

  it("provides handleGenerate function", () => {
    const { result } = renderHook(() => useGenerate(), { wrapper });
    expect(typeof result.current.handleGenerate).toBe("function");
  });

  it("provides cancelGenerate function", () => {
    const { result } = renderHook(() => useGenerate(), { wrapper });
    expect(typeof result.current.cancelGenerate).toBe("function");
  });

  it("handleGenerate validates prompt", () => {
    const { result } = renderHook(() => useGenerate(), { wrapper });
    
    result.current.handleGenerate({ prompt: "" });
    
    expect(result.current.generateMutation.isPending).toBe(false);
  });

  it("successfully generates with valid data", async () => {
    const mockGeneration = {
      generation: {
        id: 1,
        prompt: "test prompt",
        style: "photorealistic",
        status: "completed",
        userId: 1,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    };

    vi.mocked(generationsApi.create).mockResolvedValue({
      data: mockGeneration,
    } as any);

    const { result } = renderHook(() => useGenerate(), { wrapper });

    result.current.handleGenerate({ prompt: "test prompt" });

    await waitFor(() => {
      expect(result.current.generateMutation.isSuccess).toBe(true);
    });

    expect(result.current.latestGeneration).toEqual(mockGeneration.generation);
  });

  it("handles abort/cancel", () => {
    const { result } = renderHook(() => useGenerate(), { wrapper });
    
    // Should not throw error when called
    expect(() => result.current.cancelGenerate()).not.toThrow();
  });
});
