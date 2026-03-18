# MTLWorldCup

## Update & Run Workflow

When pulling updates from Claude's branch and running locally:

```bash
git fetch origin
git merge origin/claude/fix-payment-scroll-issue-BKZxT
git push origin main
npm install
npm run dev
```

Run these commands in sequence. The app runs at http://localhost:3000.

## Email Notifications

- Uses Resend API for email notifications
- Free tier with `onboarding@resend.dev` sender can only send to the email associated with the Resend account
- To send to any address, verify a custom domain in Resend
- Admin email: mtlworldcup@gmail.com
