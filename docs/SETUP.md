# Setup guide — from download to Vercel

## 1. Create the project folder and open it in VS Code

1. Download Credit-Pulse-Academy-Nextjs-v2.zip.
2. On Windows, right-click it and choose Extract All. Keep the extracted files together.
3. Open VS Code. Choose File → Open Folder.
4. Select the extracted credit-pulse-academy folder. It must directly contain package.json. Do not open the parent Downloads folder.
5. Install Node.js 24 LTS from https://nodejs.org and restart VS Code after installation.
6. If you prefer to create the files manually, use docs/FOLDER-STRUCTURE.txt and the complete Credit-Pulse-Academy-SOURCE-CODE.md supplied with the download. Create each named file in its corresponding folder and paste its entire code. The ZIP already contains every file, so manual copying is optional.

## 2. Install dependencies and start the site

Choose Terminal → New Terminal in VS Code. Run each command separately:

```bash
node --version
```

This checks that Node.js is installed. This project recommends v24.x and supports Node 22 or newer.

```bash
npm install
```

This downloads the exact dependencies recorded in package-lock.json. Wait for it to finish. You only need to repeat it when dependencies change.

```bash
npm run dev
```

This starts the local development server. Leave that terminal running while using the site. Editing a source file refreshes the page automatically.

**Local demo needs no .env.local and no npm run db:setup.** This avoids the earlier invalid-email setup failure.

## 3. Preview locally

Open http://localhost:3000 in your browser. If the terminal shows a different port, use the address printed there.

Sign in with:

- Member: member@creditpulse.demo / LearnWithPulse2026!
- Admin: admin@creditpulse.demo / ManageWithPulse2026!

Passwords are case-sensitive and include the exclamation mark. Use an incognito window for the admin while the member is signed in elsewhere.

Review the Silver member dashboard, open lesson 1 to inspect the full content template, preview Gold, complete the Silver sample lessons, and submit a reapplication. In the admin window, open Approval queue and enter a verification reference before approving the request. Gold becomes accessible after approval.

For a production-style local preview:

```bash
npm run build
npm start
```

Set DEMO_MODE=true in .env.local before npm start if you want a production-style demo. The development demo default is deliberately disabled in production unless you explicitly enable it.

Press Ctrl+C in the terminal to stop a running server.

## 4. Push to GitHub

Install Git from https://git-scm.com if it is not installed. Create a GitHub account at https://github.com. On GitHub, create a new empty private repository named credit-pulse-academy. Leave the add README, .gitignore, and license boxes unchecked because this project already includes its own files.

In the project terminal:

```bash
git init
git add .
git commit -m "Build Credit Pulse Academy"
git branch -M main
git remote add origin https://github.com/YOUR-USERNAME/credit-pulse-academy.git
git push -u origin main
```

Replace YOUR-USERNAME with your actual GitHub username. GitHub or VS Code may open a sign-in prompt. The .gitignore excludes dependencies, builds, and local secrets.

What these commands do:

- git init creates local version history.
- git add . stages the project files.
- git commit records the first version.
- git branch -M main names the primary branch.
- git remote add origin connects your local folder to your GitHub repository.
- git push uploads the code.

If Git asks for your identity:

```bash
git config --global user.name "Your Name"
git config --global user.email "your-email@example.com"
```

Then repeat the commit and push.

For future changes:

```bash
git add .
git commit -m "Describe your update"
git push
```

## 5. Connect GitHub to Vercel

### Design-preview deployment

1. Sign in at https://vercel.com with GitHub.
2. Choose Add New → Project, import your repository, and grant access if prompted.
3. Framework Preset should be Next.js. Root Directory should be the folder containing package.json; it is normally the repository root when you pushed the extracted project itself.
4. Use Node.js 24.x in Project Settings if available. Keep the default build command npm run build.
5. Add DEMO_MODE=true under Environment Variables for the environments you plan to preview.
6. Click Deploy. Open the Vercel URL when the deployment finishes.
7. For a password-protected team preview, use Vercel Deployment Protection when available for your plan.

The public demo uses shared fixture accounts and temporary in-memory changes. A deployment restart or a different server instance can reset demo progress or sessions. PostgreSQL mode is required for real members.

### Real-member deployment

1. Create a PostgreSQL database through a provider such as Neon or a compatible Vercel Marketplace integration. Copy its provider-supplied pooled connection string, including the provider’s SSL settings. Do not disable certificate validation in application code.
2. In VS Code, copy .env.example to .env.local. On Windows PowerShell:

```powershell
Copy-Item .env.example .env.local
```

3. Edit .env.local with your actual values:

```dotenv
DEMO_MODE=false
DATABASE_URL=your-provider-supplied-postgresql-connection-string
APP_URL=http://localhost:3000
ADMIN_EMAIL=your-real-admin-email@example.com
ADMIN_PASSWORD=your-own-password-of-at-least-12-characters
```

The strings above explain what goes in each field; replace them. An address such as creditpulse@local is invalid. ADMIN_EMAIL must include a complete domain.

4. Run:

```bash
npm run db:setup
```

This creates tables and your initial administrator. It prints the administrator email but never the password. It does not reset an existing account’s password. Sign in using the password you chose.

5. In Vercel, set DEMO_MODE=false, DATABASE_URL to the same database connection, and APP_URL to your exact production origin, for example https://your-project.vercel.app. APP_URL has no path or trailing slash. ADMIN_EMAIL and ADMIN_PASSWORD are only needed for your local setup script; do not add them to the deployed runtime.
6. Redeploy so the new environment values take effect.
7. Log in as your administrator. Create a member with the verified initial tier. That member chooses one published course. Only lesson 1 is published in real-account mode until you finish and publish the other lessons.
8. Configure the support email, deadline window, and confirmed reward wording in Admin → Settings.
9. When adding a custom domain, update APP_URL to that exact domain and redeploy. Use the configured domain for sign-in and forms. For a separate Vercel preview environment, set APP_URL to its stable preview origin or leave it unset to use the request origin.

Pushing later GitHub commits triggers a Vercel deployment through the Git integration. Official reference: https://vercel.com/docs/git/vercel-for-github and https://vercel.com/docs/frameworks/full-stack/nextjs.

## 6. Common errors and fixes

| Problem                                        | What to do                                                                                                                                                                                 |
| ---------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| npm or node is not recognized                  | Install Node.js 24 LTS, close VS Code completely, and reopen it.                                                                                                                           |
| PowerShell says npm.ps1 cannot run             | Use npm.cmd instead of npm, or select Command Prompt as your VS Code terminal. No system-wide policy change is necessary.                                                                  |
| Cannot find package.json / ENOENT              | Open the extracted credit-pulse-academy folder, not its parent.                                                                                                                            |
| Port 3000 is in use                            | Stop the previous server with Ctrl+C, or run npm run dev -- --port 3001 and open http://localhost:3001.                                                                                    |
| Email or password incorrect                    | In demo mode use the exact credentials above. In database mode use the credentials you created. Restarting does not reset a real account password.                                         |
| Invalid email during setup                     | Replace ADMIN_EMAIL with a full address, such as admin@example.com. An unfinished value or creditpulse@local will fail.                                                                    |
| Too many attempts                              | Wait 15 minutes. For the temporary local demo only, stopping and restarting the server resets its in-memory attempt count. Real-account protection stays in PostgreSQL.                    |
| Failed to reach the server / Failed to fetch   | Make sure npm run dev is still running; use the same origin printed in the terminal; inspect the terminal for the actual error. Check whether a browser extension is blocking the request. |
| Different-site request message                 | APP_URL must match the browser’s exact scheme, hostname, and port. localhost and 127.0.0.1 are different origins. Restart or redeploy after changing it.                                   |
| Database is not configured                     | For a Vercel design preview set DEMO_MODE=true. For real members set DATABASE_URL and DEMO_MODE=false.                                                                                     |
| relation cp_accounts does not exist            | Run npm run db:setup against the same database used by your server.                                                                                                                        |
| Database connection or TLS error               | Recopy the provider’s full connection string. Verify its username, password, database, hostname, and required SSL options. Use the supplied pooled connection on Vercel.                   |
| Vercel build cannot find the app               | Check Root Directory points to the directory containing package.json.                                                                                                                      |
| Changes disappear                              | You are in demo mode. Enable PostgreSQL mode for durable member data.                                                                                                                      |
| Gold remains locked after submitting a request | This is expected. An administrator must record verified cash-back approval.                                                                                                                |
| Lesson shows In preparation                    | Its content is unpublished. Complete the lesson in Admin → Curriculum and publish it.                                                                                                      |
| Another next dev server is already running     | Stop the earlier project terminal with Ctrl+C before starting a second server in the same folder.                                                                                          |
| Windows path contains spaces                   | Open the folder through VS Code. If typing cd manually, put the path in quotes.                                                                                                            |

Run npm run typecheck, npm test, and npm run build before pushing a substantial code change. The first checks types, the second checks the delivery rules, and the third checks the production compilation.

## Optional browser regression test

The project includes a Playwright test for member login, mobile navigation, locked-tier protection, and verified admin approval. After npm install, run:

```bash
npx playwright install chromium
npm run test:e2e
```

The test starts a separate temporary demo server on port 3020 and stops it afterward. These test credentials are fixture accounts only. No real cash-back review or email is sent.

## v3 content and design update

Use a fresh extracted folder for v3. The authoritative syllabus is content/curriculum.json. It contains every exact title from docs/Structured-Courses.pdf. The source first lesson is content/credit-score-lesson.json. Admin → Curriculum now offers six course tabs; lesson 1 uses a complete structured JSON editor, and template lessons use the paragraph editor. Publishing controls content availability; membership tier controls access separately.

Start with the demo credentials in README.md. The old website's shared password is not an account password for this new app. Real accounts use the email and password you create through the administrator or database setup script.

Source lesson check-in answers are stored in the account's enrollment. The source reward sentence is reproduced, but eligibility and payment require Credit Pulse confirmation and a fulfillment integration.
