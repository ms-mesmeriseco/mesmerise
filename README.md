This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.js`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

## Quiz tracking (Meta)

Every quiz sends the same Meta events. To add tracking to a new quiz:

1. Export a `QUIZ_NAME` from the quiz's `quizData.js`.
2. In the quiz component, `const meta = useQuizTracking(QUIZ_NAME)` (from `@/lib/metaPixel`), then:
   - call `meta.markStarted()` in every answer handler (sends `QuizStart` once, on the first answer)
   - send `metaEventIds: meta.eventIds()` in the details-form POST body
   - call `meta.trackLead()` only after that POST succeeds (the one `Lead` per quiz)
   - pass `viewEventId={meta.viewEventId}` to the results component
3. In the results component, call `useResultsView(QUIZ_NAME, viewEventId)` (sends `ViewContent`; shared results links get a fresh ID).
4. In the quiz's API route, add `sendQuizEvents(req, { quizName: QUIZ_NAME, eventIds: body.metaEventIds, email, firstName })` (from `@/lib/metaCapi`) to the post-submission tasks. This sends the Conversions API copies with the same event IDs, so Meta deduplicates them.

Needs `FB_CAPI_ACCESS_TOKEN` (and optionally `FB_CAPI_TEST_EVENT_CODE` while testing in Events Manager).
