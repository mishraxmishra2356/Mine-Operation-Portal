# MineSafe – Mine Operations Portal (frontend)

React 19 + Vite + React Router + Chart.js.

```
npm install
npm run dev      # development
npm run build    # production build
```

## Structure
- `src/data/mockData.js` – all demo data in one place (swap for API calls when the backend exists)
- `src/utils/helpers.js` – formatting and status/tone helpers
- `src/components/` – layout, `DataTable`, `Badge`, `StatCard`, `ShiftChart`
- `src/context/AuthContext.jsx` – placeholder auth (localStorage). Replace with real server login.
- `src/styles/` – `main.css` (layout/theme) and `components.css` (tables, badges, forms)

Note: the PPV estimator on the Blasting page is a screening tool only; calibrate its constants per site.
