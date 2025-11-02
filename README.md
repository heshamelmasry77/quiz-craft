# 🧩 QuizCraft  
**An accessible quiz builder built with React, Redux Toolkit, TypeScript, and Vite.**

QuizCraft lets users **create, edit, validate, and preview quizzes** with support for single-choice, multiple-choice, and short-text questions — all saved locally in the browser with undo history, validation, and accessibility in mind.

---

## ⚙️ Tech Stack

| Category | Tools |
|-----------|-------|
| Frontend Framework | **React 19 + TypeScript + Vite** |
| State Management | **Redux Toolkit** |
| Styling | **Tailwind CSS** |
| Validation | **Zod** |
| Testing | **Vitest + Testing Library** (unit) / **Playwright** (E2E) |
| Code Quality | **ESLint + Prettier + Husky + lint-staged** |

---

## 🚀 Getting Started

### 1. Clone and install
```bash
git clone https://github.com/heshamelmasry77/quiz-craft
cd quiz-craft
npm install
```

### 2. Run the dev server
```bash
npm run dev
```
The app will be available at [http://localhost:5173](http://localhost:5173).

### 3. Run tests
- **Unit tests:**  
  ```bash
  npm run test
  ```
- **E2E tests (headless):**  
  ```bash
  npm run e2e
  ```
- **E2E tests (UI mode):**  
  ```bash
  npm run e2e:ui
  ```

> 📝 Note: The first time you run Playwright, install browsers using:
> ```bash
> npx playwright install
> ```

---

## 📁 Project Structure

```
quiz-craft/
├── public/               # Static assets
├── src/
│   ├── assets/           # Images, icons, etc.
│   ├── components/
│   │   └── ui/           # Shared UI components (Modal, Loader)
│   ├── lib/              # Utilities (storage, validation, I/O helpers)
│   ├── pages/            # Main pages (Builder, Preview, NotFound)
│   ├── shared/           # Layout and app shell
│   ├── store/            # Redux slices + hooks
│   │   └── __tests__/    # Unit tests for slices
│   ├── types/            # TypeScript types
│   ├── validation/       # Zod schemas
│   ├── index.css         # Tailwind base styles
│   ├── main.tsx          # Entry point
│   └── router.tsx        # Route configuration
│
├── e2e/                  # Playwright end-to-end tests
├── tests/                # Test setup configs
├── test-results/         # Playwright reports
├── .husky/               # Pre-commit hooks
├── eslint.config.js      # ESLint config
├── playwright.config.ts  # Playwright setup
├── vite.config.ts        # Vite setup
└── tsconfig.*.json       # TypeScript configs
```

---

## 🧠 Key Features

- 🧩 Create, edit, and delete quiz questions  
- 🔢 Single, multiple, and short-text types  
- ♻️ Undo history for structural changes  
- 💾 Auto-save to localStorage  
- ✅ Validation with Zod  
- 🔔 Confirmation modal before clearing  
- ♿ Accessible interface (`aria-*`, live regions, keyboard-friendly)  
- 🔄 Preview mode for quiz review  
- 🧪 Tested via Vitest & Playwright  

---

## ✅ Test Summary

| Test Type | Tool | Status |
|------------|------|--------|
| Unit Tests | Vitest | ✅ Passing |
| E2E Tests | Playwright | ✅ Passing (Headless & UI modes) |
| Linting | ESLint + Prettier | ✅ Clean |
| Pre-commit | Husky + lint-staged | ✅ Configured |

---

## 📄 License

MIT License © 2025 [Hesham El Masry](https://github.com/heshamelmasry77)
