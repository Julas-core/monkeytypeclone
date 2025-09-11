# TypeSpeed Development Guidelines

## Tech Stack Overview

- **Next.js 15** - App Router with React Server Components architecture
- **TypeScript** - Strict type checking enforced
- **Tailwind CSS** - Primary styling solution with CSS variables
- **shadcn/ui** - Primary component library (DO NOT MODIFY source components)
- **Radix UI** - Accessible primitive components
- **Framer Motion** - All animations and transitions
- **Lucide** - Icon library (preferred over SVG imports)
- **Biome** - Formatting/linting (replaces ESLint/Prettier)

## Library Usage Rules

### UI Components
1. **shadcn/ui Components**  
   - Use for all base components (buttons, cards, inputs)
   - Create new components in `src/components/ui` using `npx shadcn-ui add`
   - Never modify source files in `components/ui` - create wrapper components instead

2. **Radix Primitives**  
   - Use for complex interactive elements requiring accessibility:
     - Dropdown menus
     - Dialogs/modals
     - Accordions
     - Tabs

### Styling
1. **Tailwind CSS**  
   - Use utility classes directly in JSX
   - Prefer `cn()` utility for conditional classes
   - Custom CSS ONLY allowed in:
     - Global animations
     - Complex responsive layouts
     - Theme variable overrides

### Animations
1. **Framer Motion**  
   - Required for ALL animations
   - Use `motion` components instead of CSS transitions
   - Preferred patterns:
    ```tsx
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    />
    ```

### Icons
1. **Lucide Icons**  
   - Import from `lucide-react`
   - Preferred over SVG files
   - Example:
    ```tsx
    import { Keyboard } from 'lucide-react'
    <Keyboard className="h-4 w-4" />
    ```

### State Management
1. **React State**  
   - Use local state (`useState`) for component-specific state
   - Use Context API for global theme/UI state
   - **NO** external state libraries (Redux/Zustand) without approval

### Forms
1. **Native HTML Forms**  
   - Use for simple forms
   - Combine with `useState` for controlled components
   - For complex forms, create custom hooks in `src/lib/hooks`

### HTTP Client
1. **Native Fetch API**  
   - Use for all API calls
   - Create wrapper utilities in `src/lib/api`

### Prohibited
❌ Material UI  
❌ Bootstrap  
❌ Styled Components  
❌ CSS-in-JS libraries  
❌ jQuery or legacy frameworks

## Component Architecture
- **Atomic Design**  
  - Atoms: `src/components/ui` (shadcn)  
  - Molecules: `src/components/[component-name]`  
  - Pages: `src/pages`  

## Performance Rules
1. **Dynamic Imports**  
   - Use for components above the fold:
    ```tsx
    const Settings = dynamic(() => import('@/components/Settings'))
    ```
2. **Static Assets**  
   - Images: Next.js Image component required
   - SVGs: Inline as JSX components

## Code Quality
1. **TypeScript**  
   - Strict mode enforced
   - No `any` types allowed
2. **Biome Formatting**  
   - Run `bun run format` before committing