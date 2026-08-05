# Template Mẫu: React Component (No-Icon Rule)

```tsx
import React from 'react';

interface ExampleProps {
  title: string;
}

export const ExampleComponent: React.FC<ExampleProps> = ({ title }) => {
  return (
    <div className="border border-border p-4 bg-background text-foreground rounded-lg">
      <span className="font-serif font-bold">{title}</span>
    </div>
  );
};
```
