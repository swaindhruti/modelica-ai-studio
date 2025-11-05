# Custom React Hooks

This directory contains custom React hooks for the Modelia AI Studio web client.

## Available Hooks

### `useGenerate`

Handles AI generation creation with automatic retry logic and error handling.

**Location:** `src/hooks/useGenerate.ts`

**Usage:**

```tsx
import { useGenerate } from "@/hooks";

function MyComponent() {
  const {
    generateMutation,
    latestGeneration,
    setLatestGeneration,
    handleGenerate,
  } = useGenerate();

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleGenerate({
      prompt: "A beautiful landscape",
      style: "photorealistic",
      imageUrl: "https://res.cloudinary.com/...", // optional
    });
  };

  return (
    <div>
      <button onClick={onSubmit}>
        {generateMutation.isPending ? "Generating..." : "Generate"}
      </button>
      {latestGeneration && (
        <img src={latestGeneration.imageUrl} alt={latestGeneration.prompt} />
      )}
    </div>
  );
}
```

**Returns:**

- `generateMutation` - TanStack Query mutation object
  - `isPending` - Boolean indicating if generation is in progress
  - `isError` - Boolean indicating if there was an error
  - `mutate()` - Function to trigger generation manually
- `latestGeneration` - The most recent generation result
- `setLatestGeneration` - Function to update or clear latest generation
- `handleGenerate(data)` - Simplified function to create a generation

**Features:**

- Automatic retry on 503 errors (up to 3 times)
- Toast notifications for success/error states
- Zod validation error parsing
- Query cache invalidation on success

---

### `useImageUpload`

Manages Cloudinary file upload flow with direct client-side upload.

**Location:** `src/hooks/useImageUpload.ts`

**Usage:**

```tsx
import { useImageUpload } from "@/hooks";

function MyComponent() {
  const { imageUrl, imagePreview, upload, isUploading, clearImage } =
    useImageUpload();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      upload(file);
    }
  };

  return (
    <div>
      <input type="file" onChange={handleFileChange} disabled={isUploading} />
      {imagePreview && <img src={imagePreview} alt="Preview" />}
      <button onClick={clearImage}>Clear Image</button>
    </div>
  );
}
```

**Returns:**

- `imageUrl` - The Cloudinary secure URL of the uploaded image
- `imagePreview` - Preview URL for displaying the image
- `uploadInputRef` - Ref for the hidden file input element
- `upload(file)` - Function to upload a file to Cloudinary
- `isUploading` - Boolean indicating upload progress
- `handleUploadSuccess(result)` - Success handler (for internal use)
- `handleUploadError(error)` - Error handler (for internal use)
- `setImagePreview(url)` - Manually set preview URL
- `clearImage()` - Clear both imageUrl and imagePreview
- `setImageUrl(url)` - Manually set the image URL

**Features:**

- Direct upload to Cloudinary (no server involvement)
- Toast notifications on success/error
- Preview state management
- TypeScript type safety
- Upload progress tracking

---

### `useGenerations`

Fetches the user's generation history.

**Location:** `src/hooks/useGenerations.ts`

**Usage:**

```tsx
import { useGenerations } from "@/hooks";

function MyComponent() {
  const { generations, isLoading, error } = useGenerations();

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error loading generations</div>;

  return (
    <div>
      {generations.map((gen) => (
        <div key={gen.id}>
          <h3>{gen.prompt}</h3>
          <img src={gen.imageUrl} alt={gen.prompt} />
        </div>
      ))}
    </div>
  );
}
```

**Returns:**

- `generations` - Array of generation objects (empty array if loading)
- `isLoading` - Boolean indicating if data is being fetched
- `error` - Error object if fetch failed

**Features:**

- Automatic caching via TanStack Query
- Retry logic (1 attempt)
- Returns empty array while loading (no undefined checks needed)

---

## Benefits of Custom Hooks

### 1. **Code Reusability**

Extract complex logic from components, making them reusable across different parts of the app.

### 2. **Separation of Concerns**

Keep components focused on UI rendering while hooks handle business logic.

### 3. **Easier Testing**

Hooks can be tested in isolation without rendering components.

### 4. **Type Safety**

All hooks are fully typed with TypeScript, providing excellent IDE support.

### 5. **Consistent Error Handling**

Centralized error handling with toast notifications.

### 6. **Simplified Components**

Components become cleaner and easier to understand.

## Example: Before and After

### Before (Inline Logic)

```tsx
function StudioPage() {
  const [imageUrl, setImageUrl] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const uploadInputRef = useRef(null);

  const authenticator = async () => {
    try {
      const response = await generationsApi.getImagekitAuth();
      return response.data;
    } catch (error) {
      console.error("ImageKit auth error:", error);
      throw new Error("Failed to authenticate with ImageKit");
    }
  };

  const onUploadSuccess = (res) => {
    setImageUrl(res.url);
    setImagePreview(res.url);
    toast.success("Image uploaded successfully!");
  };

  const generateMutation = useMutation({
    mutationFn: async (data) => {
      const response = await generationsApi.create(data);
      return response.data;
    },
    onSuccess: (data) => {
      toast.success("Generation created!");
      // ... more logic
    },
    onError: (error) => {
      // ... complex error handling
    },
  });

  // 100+ lines of component logic...
}
```

### After (With Custom Hooks)

```tsx
function StudioPage() {
  const { imageUrl, uploadInputRef, authenticator, handleUploadSuccess } =
    useImageUpload();
  const { handleGenerate, generateMutation, latestGeneration } = useGenerate();
  const { generations, isLoading } = useGenerations();

  const onSubmit = (e) => {
    e.preventDefault();
    handleGenerate({ prompt, style, imageUrl });
  };

  // Clean, focused component code
}
```

## Testing Custom Hooks

Hooks can be tested using `@testing-library/react-hooks`:

```tsx
import { renderHook, act } from "@testing-library/react-hooks";
import { useImageUpload } from "./useImageUpload";

test("should handle upload success", () => {
  const { result } = renderHook(() => useImageUpload());

  act(() => {
    result.current.handleUploadSuccess({
      url: "https://example.com/image.jpg",
      // ... other properties
    });
  });

  expect(result.current.imageUrl).toBe("https://example.com/image.jpg");
});
```

## Best Practices

1. **Keep hooks focused** - Each hook should have a single responsibility
2. **Use TypeScript** - Define clear interfaces for return types
3. **Handle errors** - Always include error handling in async operations
4. **Document** - Add JSDoc comments for complex hooks
5. **Test** - Write unit tests for hook logic

## Contributing

When adding new hooks:

1. Create the hook file in `src/hooks/`
2. Export it from `src/hooks/index.ts`
3. Add documentation to this README
4. Write tests if the hook contains complex logic
5. Update components to use the new hook
