# Tara Tagalog

Your own Tagalog course: 8 units, 34 lessons, about 300 words and phrases. Plain HTML, CSS and JavaScript. No server, paid service, build step or API key.

## Your next steps

You need only a web browser and a free GitHub account. There is nothing to buy or install from an app store.

1. Unzip `tara-tagalog.zip`.
2. Put the files on GitHub Pages (section A).
3. Add the app to your iPhone home screen (section B).
4. Open it **from the home screen icon** and turn on backup (section C).
5. Start Unit 1.

Do step 4 inside the home screen app. On iPhone, Safari and the home screen app can keep separate saved data.

## A. Put it online for free (GitHub Pages)

A computer is easiest. GitHub's menu names can change over time.

1. Create a free account at https://github.com and verify your email.
2. Select **+** (top right), then **New repository**.
3. Name it `tara-tagalog`. Choose **Public** (free Pages needs a public repository). Create it.
4. On the empty repository page, select **uploading an existing file** (or **Add file → Upload files**).
5. Open the unzipped folder, select **all the files inside it**, and drag them in. `index.html` must be at the top level of the repository, not inside a folder.
6. Select **Commit changes**.
7. Open **Settings → Pages**. Under **Build and deployment**, choose **Deploy from a branch**, then branch **main** and folder **/ (root)**. Select **Save**.
8. Wait a few minutes and refresh that page. Your address will look like `https://YOUR-USERNAME.github.io/tara-tagalog/`.

On an iPhone only: tap the zip in the Files app to unzip it, then use Safari for the same steps. At step 5, choose the files with the file picker. If a menu is missing, request the desktop website.

Your code and lessons are public. **Your progress and token are not uploaded to the repository.** Never put a token or backup file in it.

## B. Install it on your iPhone

1. Open your address in **Safari**.
2. Tap the **Share** button (you may need to open the **•••** menu first).
3. Tap **Add to Home Screen** (scroll or tap **More** if you don't see it). If you see an **Open as Web App** switch, leave it on. Tap **Add**.
4. While online, open Tara from the new icon and wait a few seconds so it can save itself for offline use.
5. To test: turn on Airplane Mode, close the app and reopen it. Then turn Airplane Mode off.

Android: open the address in Chrome, open the menu, then **Install app** or **Add to Home screen**.

## C. Keeping your progress

Progress saves automatically on your device after every answer. **Clearing browser or website data erases that copy, and no web app can stop this.** Deleting the home screen app can erase it too. To get progress back you need a copy somewhere else.

### Automatic cloud backup (recommended)

This saves to a secret Gist in your own GitHub account.

1. In Tara, open **Settings → Automatic cloud backup**.
2. Follow the **Create a classic token** link, or go to GitHub → Settings → Developer settings → Personal access tokens → **Tokens (classic)** → Generate new token (classic).
3. Tick **only** `gist`. Choose an expiry. A longer one means less upkeep, but a stolen token would work for longer.
4. Copy the token and **save it in a password manager**. GitHub shows it only once.
5. Paste it into Tara and tap **Connect and back up**.
6. Check that it says **Last successful backup** with the current time.

**After clearing your data or getting a new phone:** open your Tara address, reinstall it if needed, go to Settings, paste a token from the **same GitHub account**, and connect. A new token works if you lost the old one. Tara finds your backup and restores it.

How it protects you:
- It backs up a few seconds after progress changes. Offline changes are sent when you're online with the app open (it also retries when you next open it).
- Each backup first combines the cloud copy with the device copy, so an empty browser doesn't overwrite your history.
- Gists keep earlier revisions, which you can view on https://gist.github.com.

Limits:
- Anything earned after the **last successful backup** is lost if the data is erased first. Check the time in Settings now and then.
- When the token expires, backups stop and Tara shows a warning. Create a new token, then **Disconnect** and connect again.
- You would lose the cloud copy if you deleted the Gist or lost your GitHub account. Save a backup file occasionally as a second copy.
- If you use two devices at the same moment, totals for the same day keep the higher number rather than adding them. A badge or XP is not removed by combining.
- A "secret" Gist is unlisted, not private. Anyone who has its exact link can read it. It holds your study history and the name you entered, never your token.
- The token can read and change **all** your Gists. It stays in this browser's storage. Other sites you publish under the same `YOUR-USERNAME.github.io` address share that storage, so only publish code there that you trust. Revoke the token on GitHub if your device is lost.

### Backup file

**Settings → Save backup file.** On iPhone, choose **Save to Files** and pick iCloud Drive. **Copy as text** is an alternative. To restore, use **Choose a backup file** or paste the text. A file only contains progress up to the moment you saved it.

**Reset progress** erases this device and disconnects cloud backup. It leaves the cloud copy alone, so reconnecting brings the old progress back. For a permanent fresh start, also delete the Gist on GitHub.

## D. Audio

Audio is **computer-generated** by your device's text-to-speech. There are no native-speaker recordings.

Whether a Filipino voice exists depends on your device and system version. In Tara, check **Settings → Audio** for a voice marked **★ Filipino** and tap **Test voice**. Without one, another language's voice may be used and will mispronounce words. In that case, turn off **Listening exercises** and rely on real speakers. Offline audio needs a voice stored on the device.

A good habit: ask a family member to say each lesson's new words, then copy them.

## E. About the lessons

The lessons were written with AI assistance. A second AI review pass corrected pronunciation guides, grammar notes and some answers. **No native speaker or teacher has checked them**, and neither pass checked them against a dictionary. Stress guides are the part to be most careful with. Usage varies by family and region.

This is a beginner foundation. It teaches useful phrases and the main grammar patterns, but understanding fast family conversation also takes lots of listening and speaking with people.

## F. How the app works

| Item | Rule |
|---|---|
| XP | 10 for a correct first try (a matching set counts once). 5 after a retry, for a repeated question or with listening text shown. |
| Bonuses | Lesson 20, perfect lesson 10, unit 50 (once), daily challenge 30 (once a day), first flashcard round of the day 5 |
| Completing a lesson | At least 70% of questions answered correctly, retries included |
| Streak | Any day with at least 1 XP. The calendar marks goal days separately. |
| Levels | Level 2 at 100 XP, 3 at 300, 4 at 600, and so on |
| Review | A missed item is due the same day. Answer it correctly on three review days (spaced 1 and then 3 days apart) to clear it. |

Typed translations accept the listed wordings. Another correct wording may be marked wrong. In that case, use **My answer also means this**.

## G. Run it on your computer (optional)

Double-clicking `index.html` runs the lessons. Offline installation needs a web address, so use GitHub Pages for that. Some browsers treat saved data differently for local files, so don't rely on that for real progress. If you already have Python (free), you can run `python3 -m http.server 8000` in the folder and open http://localhost:8000.

## H. Files

| File | Purpose |
|---|---|
| `index.html`, `styles.css` | Page and design |
| `content-1.js` to `content-4.js` | All lessons (two units each) |
| `exercises.js` | Builds exercises and checks answers |
| `app.js` | Screens, lessons, rewards |
| `store.js` | Saving, streaks, review |
| `sync.js` | Optional cloud backup |
| `audio.js` | Speech and sound effects |
| `sw.js`, `manifest.webmanifest`, icons | Offline use and installation |
| `ADDING-LESSONS.md` | How to add lessons |

**To update the app:** upload the changed files to the same repository. Open the app while online, then close and reopen it. Updating files doesn't erase progress. Keeping the same web address matters, because a new address starts with empty storage.
