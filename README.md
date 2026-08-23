# SevaSetu

SevaSetu is a MERN government-service discovery app built around one principle: **users describe the task; they should not need to know how government is organised.** Natural-language queries are classified into intent IDs, then resolved exclusively against a trusted backend registry.

## Trust architecture

`query → intent classifier → trusted registry lookup → validated registry URL → service card`

The classifier never supplies URLs or display metadata. Redirects are accepted only when they are HTTPS and match the allowlist in `backend/services/urlValidator.js`. The app does not collect identity numbers, OTPs, credentials, or financial details. Deep links should be re-verified before production (see `TODO(URL-VERIFY)` in the registry).

## Run locally

Requirements: Node.js 20+ and optionally MongoDB. Without MongoDB, the API safely falls back to the bundled trusted registry.

```bash
npm install
npm run install:all
copy backend\.env.example backend\.env
copy frontend\.env.example frontend\.env
npm run dev
```

Open `http://localhost:5173`. The API runs at `http://localhost:5000`.

To persist the registry in MongoDB:

```bash
npm run seed --prefix backend
```

Run verification:

```bash
npm test
npm run build
```

## API

- `POST /api/search` with `{ "query": "show my PF balance" }`
- `GET /api/services?category=Transport`
- `GET /api/health`

Search responses use `result`, `clarification`, or `no_result` types. The classifier currently uses a phrase/token scoring fallback and exposes a provider seam in `intentClassifier.js` for a future OpenAI or other model adapter. Any adapter must return only `{ intent, confidence }`, and its intent must still resolve against the registry.
