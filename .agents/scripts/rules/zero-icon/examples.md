# Examples for ZERO_ICON Rule

## ❌ Incorrect (Banned)
```tsx
import { SearchIcon } from 'lucide-react';

export function Header() {
  return <button><SearchIcon /> Search</button>;
}
```

## ✅ Correct (Allowed)
```tsx
export function Header() {
  return <button>[ Search... ]</button>;
}
```
