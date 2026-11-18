# Contributing to the Karkaii frontend

Short version: **branch off `main`, keep it short-lived, open a PR, merge it within a day or two.**
No more `Stage` branch - that's what was causing most of our merge conflicts (weeks of parallel work
landing on both sides at once, often in the exact same files like `teacher-grid`, `teacher-details`,
or the header). Small, frequent merges almost never conflict.

## The workflow

```bash
# 1. Always start from the latest main
git checkout main
git pull origin main

# 2. Create your branch for ONE task/issue - name it so others know what it's for
git checkout -b feature/short-description      # new work
git checkout -b fix/short-description          # bug fix

# 3. Work, commit normally
git add <files>
git commit -m "..."

# 4. Before opening (or updating) your PR, pull main into your branch so YOU resolve
#    any conflict while the change is still fresh in your head - not someone else, weeks later.
git fetch origin
git merge origin/main
# fix anything that conflicts, then:
npm run build   # tsc -b && vite build - catches type errors too
git add <resolved files>
git commit   # finishes the merge commit
git push

# 5. Open the PR on GitHub: base = main, compare = your branch.
#    (This is what "PR to main" means - you can't open a PR without a branch, there's no shortcut
#    that skips having one. The branch itself should just not live long.)
```

## What's required before a PR can merge

`main` is protected. A PR cannot merge until:

- **CI passes** - `.github/workflows/ci.yml` runs the production build (`tsc -b && vite build`) on
  every PR. A red check blocks the merge button. (`npm run lint` also runs but is informational
  only for now - there's a backlog of ~180 pre-existing lint errors to clear before it can be a
  hard gate; please don't add new ones in your PR.)
- **At least one approval** from someone else.
- **Linear history** (use `git merge origin/main` into your branch as shown above, not the other
  way around).

## Rules of thumb that avoid most conflicts

- **One task per branch.** Don't pile three unrelated changes into one branch - review gets harder
  and conflicts get wider.
- **Small PRs, merged fast.** A branch open for two weeks has had two weeks to drift from `main`.
  A branch open for a day almost never conflicts.
- **Pull `main` into your branch daily** if your PR is taking more than a day, not just once at the
  end. Conflicts caught in small pieces, right when you made the change, are trivial. Conflicts
  caught after two weeks, across 50 files, are how whole features end up needing to be re-resolved
  file by file at merge time.
- **Never commit a file with `<<<<<<<` / `=======` / `>>>>>>>` left in it.** If you see those
  markers after a merge, the merge isn't done - resolve them, then run `npm run build` before
  committing. If you're not sure which side is right, ask, don't guess.
- **Talk to each other before touching the same file.** Shared, high-traffic files - `src/core/common/header/index.tsx`,
  `src/features/auth/roleHome.ts`, anything under `teacher-grid`/`teacher-details`/`teacher-list` -
  are where conflicts have hit hardest. If you know someone else is deep in one, say so before you
  start editing it too.
- **Don't change `.env.production`** unless you mean to change what the live build does - it's
  tracked in git on purpose (no secrets in it, just public `VITE_*` build config) so CI builds
  correctly from a clean checkout. `.env.development` / `.env.local` stay local and gitignored.

## Local checks before you push

```bash
npm run build   # tsc -b && vite build - the same check CI runs
npm run lint     # not a merge gate yet, but keep new code clean
```

## Deploying

Deploys are automatic: merging to `main` triggers `.github/workflows/deploy.yml`, which builds in
real-API mode (`.env.production`), ships to the droplet, swaps it in atomically, and rolls back
automatically if the smoke test fails. You don't deploy manually.
