import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ImageUpload } from "../components/ImageUpload";

describe("ImageUpload Component", () => {
  const mockOnImageSelect = vi.fn();
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
      mutations: { retry: false },
    },
  });

  beforeEach(() => {
    vi.clearAllMocks();
  });

  const renderComponent = (preview: string | null = null) => {
    return render(
      <QueryClientProvider client={queryClient}>
        <ImageUpload onImageSelect={mockOnImageSelect} preview={preview} />
      </QueryClientProvider>
    );
  };

  it("renders upload area with instructions", () => {
    renderComponent();
    expect(screen.getByText(/Upload Image/i)).toBeInTheDocument();
    expect(screen.getByText(/Click to upload/i)).toBeInTheDocument();
    expect(screen.getByText(/PNG or JPEG/i)).toBeInTheDocument();
  });

  it("shows preview when image is provided", () => {
    const previewUrl = "data:image/png;base64,test";
    renderComponent(previewUrl);

    const img = screen.getByAltText("Preview");
    expect(img).toBeInTheDocument();
    expect(img).toHaveAttribute("src", previewUrl);
  });

  it("displays change image text when preview exists", () => {
    const previewUrl = "data:image/png;base64,test";
    renderComponent(previewUrl);

    expect(
      screen.getByText(/Click or drag to change image/i)
    ).toBeInTheDocument();
  });

  it("accepts file input click", () => {
    renderComponent();
    const input = screen.getByLabelText(
      /Upload image file/i
    ) as HTMLInputElement;
    expect(input).toBeInTheDocument();
    expect(input.type).toBe("file");
    expect(input.accept).toBe("image/jpeg,image/png");
  });
});
