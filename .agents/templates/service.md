# Template Mẫu: Frontend Service / React Query Hook

```typescript
import { useQuery } from '@tanstack/react-query';

export const useExampleService = (id: string) => {
  return useQuery({
    queryKey: ['example', id],
    queryFn: () => fetchExampleApi(id),
  });
};
```
