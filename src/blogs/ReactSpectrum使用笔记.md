- 设置主题色

```tsx
import { defaultTheme } from '@adobe/react-spectrum';
<Provider theme={defaultTheme}>
  <YourApp />
</Provider>;
```

有两个内置主题 defaultTheme 和 darkTheme，会根据系统的主题色（prefers-color-scheme media query）来决定使用对应主题中的颜色值。
