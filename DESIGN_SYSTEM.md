# Faro — HD Play Design System

> **Purpose**: Reference for replicating Faro's "HD Play" aesthetic in any new project or component.

<div align="center">
  <img src="public/banner_faro.png" alt="Faro Banner" width="800" style="max-width: 100%; border-radius: 16px;">
</div>

<br />

<div align="center">
  <table>
    <tr>
      <td align="center" width="50%">
        <img src="public/learn_faro.png" alt="Learning Path" width="100%" style="border-radius: 12px;">
        <br />
        <sub><strong>Learning Path</strong> — Unit map with 3D lesson nodes</sub>
      </td>
      <td align="center" width="50%">
        <img src="public/lesson_faro.png" alt="Lesson Player" width="100%" style="border-radius: 12px;">
        <br />
        <sub><strong>Lesson Player</strong> — Challenge cards with tactile buttons</sub>
      </td>
    </tr>
    <tr>
      <td align="center" width="50%">
        <img src="public/shop_faro.png" alt="Shop" width="100%" style="border-radius: 12px;">
        <br />
        <sub><strong>Shop</strong> — Bento box cards with 3D press</sub>
      </td>
      <td align="center" width="50%">
        <img src="public/quests_faro.png" alt="Quests" width="100%" style="border-radius: 12px;">
        <br />
        <sub><strong>Quests</strong> — Gamified progress UI</sub>
      </td>
    </tr>
  </table>
</div>

## 1. Core Tokens

### 1.1 Brand Colors

| Token             | Hex       | HSL           | Usage                               |
| ----------------- | --------- | ------------- | ----------------------------------- |
| `duo-green`       | `#58cc02` | `115 83% 40%` | Primary CTA, success, active states |
| `duo-green-dark`  | `#46a302` | `115 83% 32%` | 3D border-bottom on green elements  |
| `duo-red`         | `#ff4b4b` | `0 100% 64%`  | Error, danger, heart loss           |
| `duo-red-dark`    | `#d63e3e` | `0 70% 50%`   | 3D border-bottom on red elements    |
| `duo-blue`        | `#0ea5e9` | `199 89% 48%` | Info, lessons, secondary actions    |
| `duo-blue-dark`   | `#0284c7` | `199 89% 38%` | 3D border-bottom on blue elements   |
| `duo-gold`        | `#f5b800` | `45 93% 58%`  | Premium/PRO, achievements           |
| `duo-purple`      | `#8b5cf6` | `270 67% 47%` | Super/streak, listening phase       |
| `duo-orange`      | `#FF9600` | —             | Writing phase, warnings             |
| `duo-orange-dark` | `#D67B00` | —             | 3D border-bottom on orange elements |
| `duo-violet`      | `#CE82FF` | —             | Listening phase accent              |

**Shadcn Theme Variables (Light):**

| Variable        | HSL Value           | Mapped To          |
| --------------- | ------------------- | ------------------ |
| `--background`  | `0 0% 100%`         | Page background    |
| `--foreground`  | `222.2 84% 4.9%`    | Text color         |
| `--primary`     | `115 83% 40%`       | Green CTA          |
| `--secondary`   | `199 89% 48%`       | Blue info          |
| `--destructive` | `0 100% 64%`        | Red danger         |
| `--muted`       | `210 40% 96.1%`     | Muted backgrounds  |
| `--border`      | `214.3 31.8% 91.4%` | Borders            |
| `--ring`        | `115 83% 40%`       | Focus rings        |
| `--radius`      | `0.75rem`           | Base border-radius |

**Surface Colors (Tailwind utilities):**

| Surface         | Class                              | Notes               |
| --------------- | ---------------------------------- | ------------------- |
| App background  | `bg-slate-50`                      | Applied on `<body>` |
| Card surface    | `bg-white`                         | All bento boxes     |
| Muted surface   | `bg-stone-50`, `bg-stone-100`      | Tags, pills         |
| Border standard | `border-stone-200`                 | Card borders        |
| Text primary    | `text-stone-700`, `text-stone-800` | Headings            |
| Text secondary  | `text-stone-400`, `text-stone-500` | Descriptions        |

### 1.2 Typography

| Property            | Value                                                                                                  |
| ------------------- | ------------------------------------------------------------------------------------------------------ |
| **Font Family**     | `Nunito` (Google Fonts)                                                                                |
| **Import**          | `@import url('https://fonts.googleapis.com/css2?family=Nunito:wght@400;500;600;700;800&display=swap')` |
| **Next.js Setup**   | `import { Nunito } from "next/font/google"`                                                            |
| **Tailwind Config** | `fontFamily: { sans: ["Nunito", "sans-serif"] }`                                                       |
| **Weights Used**    | 500 (medium), 700 (bold), 800 (extrabold), 900 (black)                                                 |

**Typography Patterns:**

```
Page Title:     text-4xl font-black text-stone-800 tracking-tight
Section Head:   text-2xl font-black text-stone-700 uppercase tracking-tight
Card Title:     text-xl font-black text-stone-700
Body Text:      text-lg font-bold text-stone-500
Micro Label:    text-[10px] font-black uppercase tracking-widest text-stone-400
Badge/Pill:     text-xs font-black uppercase tracking-wider
```

### 1.3 Z-Index Scale

| Token           | Value  | Usage                              |
| --------------- | ------ | ---------------------------------- |
| `z-overlay`     | `60`   | Mobile nav backdrop, command menu  |
| `z-modal`       | `70`   | General modals                     |
| `z-toast`       | `80`   | Toasts, snackbars                  |
| `z-above-modal` | `90`   | Modal-on-modal (shop confirm)      |
| `z-supreme`     | `9999` | League ceremony (above everything) |

### 1.4 Border Radius Scale

| Usage               | Value                                         |
| ------------------- | --------------------------------------------- |
| Buttons             | `rounded-xl` (0.75rem) / `rounded-2xl` (1rem) |
| Cards / Bento Boxes | `rounded-3xl` (1.5rem) / `rounded-[2.5rem]`   |
| Avatars             | `rounded-full` / `rounded-[2rem]`             |
| Pills / Tags        | `rounded-xl` / `rounded-full`                 |

---

## 2. HD Play Textures & Backgrounds

### 2.1 Dotted Background Pattern

```html
<div
  aria-hidden="true"
  class="pointer-events-none absolute inset-0 z-0
            bg-[radial-gradient(#e5e7eb_2px,transparent_2px)]
            [background-size:24px_24px] opacity-40"
/>
```

### 2.2 Floating Decorative Blobs

```html
<!-- Green blob -->
<div
  class="absolute -left-32 top-10 z-0 h-96 w-96
            rounded-full bg-green-400/20 blur-3xl"
/>

<!-- Blue blob -->
<div
  class="absolute -right-32 top-1/2 z-0 h-96 w-96
            -translate-y-1/2 rounded-full bg-sky-400/15 blur-3xl"
/>
```

### 2.3 Grid Pattern (Alternative)

```html
<div
  class="absolute inset-0 opacity-[0.03] pointer-events-none"
  style="background-image: linear-gradient(#000 1px, transparent 1px),
            linear-gradient(90deg, #000 1px, transparent 1px);
            background-size: 20px 20px"
/>
```

---

## 3. Tactile Components ("The Juice")

### 3.1 Buttons

All buttons use the **3D Press Mechanic** — `border-b-*` for depth, `active:translate-y-*` for press effect.

#### Primary CTA (Green)

```
bg-green-500 text-white border-green-600 border-b-4
hover:bg-green-500/90
active:border-b-0 active:translate-y-[2px]
```

#### Massive Hero CTA

```
h-16 px-10 bg-[#58cc02] text-white text-xl font-black
rounded-2xl border-2 border-transparent
border-b-8 border-b-[#46a302]
hover:bg-[#61da02]
active:border-b-0 active:translate-y-2
transition-all uppercase tracking-widest shadow-md
```

#### Secondary CTA (Outline)

```
bg-white text-blue-500 font-bold uppercase tracking-wide
border-2 border-slate-200 border-b-4 h-12 rounded-xl
hover:bg-slate-50 hover:text-blue-600
active:border-b-2
```

#### Premium CTA (Gold)

```
bg-gradient-to-b from-amber-400 to-amber-500 text-white
border-amber-600 border-b-4
hover:from-amber-400/90 hover:to-amber-500/90
active:border-b-0 active:translate-y-[2px]
```

#### Danger CTA (Red)

```
bg-rose-500 text-white border-rose-600 border-b-4
hover:bg-rose-500/90
active:border-b-0 active:translate-y-[2px]
```

#### Icon Button

```
w-12 h-12 bg-white rounded-2xl
border-2 border-slate-200 border-b-[6px]
text-slate-400 hover:text-slate-600
hover:bg-slate-50
active:translate-y-1 active:border-b-[2px]
transition-all shadow-lg
```

### 3.2 Bento Boxes / Cards

#### Standard Bento

```
bg-white rounded-[2.5rem]
border-2 border-stone-200 border-b-8
shadow-sm
hover:shadow-md hover:-translate-y-1
active:translate-y-0 active:border-b-0
transition-all
```

#### HD Play Bento (Interactive)

```
bg-white rounded-[1.75rem]
border-2 border-slate-200 border-b-[6px]
p-5 shadow-sm
transition-all duration-300
hover:scale-[1.03] hover:-translate-y-1
hover:shadow-[0_8px_30px_rgba(88,204,2,0.25)]
hover:border-[#58CC02]/60
```

#### Hero Banner Bento

```
bg-white rounded-[2.5rem]
border-2 border-slate-200 border-b-[8px]
shadow-[0_15px_40px_-10px_rgba(0,0,0,0.05)]
p-8 md:p-10 overflow-hidden relative
```

### 3.3 Progress Bars

**Track:**

```
h-7 sm:h-9 bg-slate-100 rounded-2xl
border-2 border-slate-200/80
shadow-[inset_0_2px_10px_rgba(0,0,0,0.05)]
overflow-hidden relative
```

**Fill:**

```
bg-[#58CC02] shadow-[#58CC02]/40
rounded-2xl border-r-[4px] border-white/30
shadow-[0_0_20px_rgba(0,0,0,0.1)]
transition-all duration-1000 ease-out
```

### 3.4 Lesson Nodes (Game Map)

**Active Node (Golden Jewel):**

```
w-[84px] h-[84px] sm:w-[96px] sm:h-[96px]
bg-yellow-400 rounded-full
border-4 border-yellow-500 border-b-[10px] border-b-yellow-600
shadow-[0_10px_20px_rgba(250,204,21,0.5)]
ring-4 ring-yellow-400/50
hover:-translate-y-2 hover:scale-105
active:scale-95 active:translate-y-2 active:border-b-[4px]
```

**Completed Node:**

```
w-[64px] h-[64px] sm:w-[72px] sm:h-[72px]
rounded-full border-4 border-b-2 shadow-sm
hover:scale-105 active:scale-95 transition-all
```

**Locked Node:**

```
w-[64px] h-[64px] sm:w-[72px] sm:h-[72px]
bg-stone-200 rounded-full
border-4 border-white border-b-[6px] border-b-stone-300
shadow-sm cursor-not-allowed
```

### 3.5 Sidebar

**Active:**

```
bg-[#ddf4ff] border-2 border-b-4 border-[#147bb0]
```

**Inactive:**

```
text-gray-400 hover:text-gray-600 hover:bg-gray-100
border-2 border-transparent hover:border-gray-200 hover:border-b-4
```

---

## 4. Animations & Keyframes

### 4.1 CSS Keyframes (globals.css)

```css
@keyframes shake {
  0%,
  100% {
    transform: translateX(0);
  }
  10%,
  30%,
  50%,
  70%,
  90% {
    transform: translateX(-5px);
  }
  20%,
  40%,
  60%,
  80% {
    transform: translateX(5px);
  }
}

@keyframes bounce-success {
  0%,
  100% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.1);
  }
}

@keyframes pulse-heart {
  0%,
  100% {
    transform: scale(1);
  }
  50% {
    transform: scale(0.7);
  }
}

@keyframes lessonNodeIn {
  from {
    opacity: 0;
    transform: translateY(12px) scale(0.85);
  }
  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

@keyframes shimmer {
  0% {
    transform: translateX(-150%) skewX(12deg);
  }
  100% {
    transform: translateX(150%) skewX(12deg);
  }
}

@keyframes breathe {
  0%,
  100% {
    transform: scale(1) translateY(0);
  }
  50% {
    transform: scale(1.04) translateY(-4px);
  }
}

@keyframes float {
  0%,
  100% {
    transform: translateY(0) rotate(0deg);
    opacity: 0.6;
  }
  50% {
    transform: translateY(-8px) rotate(10deg);
    opacity: 0.9;
  }
}
```

### 4.2 Utility Classes

```css
.shake {
  animation: shake 0.5s ease-in-out;
}
.bounce-success {
  animation: bounce-success 0.5s ease-in-out;
}
.pulse-heart {
  animation: pulse-heart 0.3s ease-in-out;
}
.perspective-1000 {
  perspective: 1000px;
}
.transform-style-3d {
  transform-style: preserve-3d;
}
.rotate-y-180 {
  transform: rotateY(180deg);
}
.backface-hidden {
  backface-visibility: hidden;
}
```

---

## 5. Island Theme Palette (Unit Cards)

| Index | Background | Text      | Dark (Border) | Trail     |
| ----- | ---------- | --------- | ------------- | --------- |
| 0     | `#ddf4ff`  | `#1899d6` | `#147bb0`     | `#a3dffd` |
| 1     | `#f0f8e2`  | `#58cc02` | `#46a302`     | `#c7ebb1` |
| 2     | `#ffecf0`  | `#ff4b4b` | `#ea2b2b`     | `#ffc1cc` |
| 3     | `#fff0d4`  | `#ff9600` | `#d67b00`     | `#ffe0a3` |
| 4     | `#eeecff`  | `#ce82ff` | `#a547d9`     | `#dcb8ff` |

---

## 6. Dependencies

| Package                    | Purpose                                |
| -------------------------- | -------------------------------------- |
| `tailwindcss`              | Utility CSS framework                  |
| `tailwindcss-animate`      | `animate-in`, `fade-in` utilities      |
| `class-variance-authority` | Button variant system (CVA)            |
| `clsx` + `tailwind-merge`  | `cn()` utility for conditional classes |
| `framer-motion`            | Page transitions, animations           |
| `lucide-react`             | Icon library                           |
| `next/font/google`         | Nunito font loading                    |

---

> **Last updated**: 2026-07-02 · **Source files**: `tailwind.config.ts`, `globals.css`, `button.tsx`, `sidebar.tsx`
