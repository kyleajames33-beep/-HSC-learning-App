# Question Sync Setup Guide

## Quick Start: 3 Steps to Sync Questions from Google Sheets

Your Google Sheet is already set up and shared! Follow these 3 steps to complete the setup.

---

## Step 1: Download credentials.json (2 minutes)

1. Go to **Google Cloud Console**: https://console.cloud.google.com
2. Select your project: **hsc-learn-470407**
3. Go to **IAM & Admin** > **Service Accounts**
4. Find your service account:
   ```
   hsc-app-sheet-reader@hsc-learn-470407.iam.gserviceaccount.com
   ```
5. Click the **Actions menu (⋮)** next to the service account
6. Select **Manage Keys**
7. Click **Add Key** > **Create new key**
8. Choose **JSON** format
9. Click **Create** - a JSON file will download
10. **Save this file** as:
    ```
    C:\HSC-Learning-App\mobile-ui-agent\credentials.json
    ```

**Important:** Keep this file secure! Don't commit it to git.

---

## Step 2: Install Google Sheets dependency (1 minute)

Open terminal in the `mobile-ui-agent` folder and run:

```bash
cd C:\HSC-Learning-App\mobile-ui-agent
npm install googleapis
```

---

## Step 3: Create .env file (1 minute)

Create a file called `.env` in the `mobile-ui-agent` folder:

**Path:** `C:\HSC-Learning-App\mobile-ui-agent\.env`

**Content:**
```bash
GOOGLE_SHEET_ID=1ceTKCDXxpMq50uCpgyWgpJ0Hmv4pLMzcj12fSYibR7A
GOOGLE_CREDENTIALS=./credentials.json
```

---

## Step 4: Verify Setup (30 seconds)

Run the setup verification script:

```bash
cd C:\HSC-Learning-App\mobile-ui-agent

# Windows
set GOOGLE_SHEET_ID=1ceTKCDXxpMq50uCpgyWgpJ0Hmv4pLMzcj12fSYibR7A
npm run setup:sheets

# OR on Mac/Linux
GOOGLE_SHEET_ID=1ceTKCDXxpMq50uCpgyWgpJ0Hmv4pLMzcj12fSYibR7A npm run setup:sheets
```

**Expected output:**
```
🔐 Google Sheets Authentication Setup
============================================================
Sheet ID: 1ceTKCDXxpMq50uCpgyWgpJ0Hmv4pLMzcj12fSYibR7A
Credentials path: C:\HSC-Learning-App\mobile-ui-agent\credentials.json

1️⃣  Checking credentials file...
✅ credentials.json found at: C:\HSC-Learning-App\mobile-ui-agent\credentials.json
✅ Service account email: hsc-app-sheet-reader@hsc-learn-470407.iam.gserviceaccount.com

2️⃣  Verifying credentials format...
✅ Service account email: hsc-app-sheet-reader@hsc-learn-470407.iam.gserviceaccount.com

3️⃣  Testing Google Sheets API authentication...
✅ Authenticated successfully with Google Sheets API

4️⃣  Testing access to your sheet...
✅ Can access sheet: HSC questions page 1
✅ Found 2 rows (including header)
✅ Found 18 columns in header row
✅ Column headers match expected format

📊 Sheet info:
   - Total rows: 2 (1 data rows + 1 header)
   - Sheet name: HSC questions page 1
   - Approved questions: 1/1

============================================================
🎉 Setup complete! Everything is configured correctly.

Next steps:
  1. Add questions to your Google Sheet
  2. Run: npm run sync:questions:dry-run  (preview changes)
  3. Run: npm run sync:questions          (sync for real)
```

---

## ✅ You're Ready!

If you see the success message above, you can now:

### Sync Questions

```bash
cd C:\HSC-Learning-App\mobile-ui-agent

# Preview what will be synced (doesn't write files)
set GOOGLE_SHEET_ID=1ceTKCDXxpMq50uCpgyWgpJ0Hmv4pLMzcj12fSYibR7A
npm run sync:questions:dry-run

# Sync for real
set GOOGLE_SHEET_ID=1ceTKCDXxpMq50uCpgyWgpJ0Hmv4pLMzcj12fSYibR7A
npm run sync:questions
```

**Output:**
```
🔄 Starting question sync from Google Sheets...

✅ Authenticated successfully
✅ Fetched 2 rows
✅ Parsed 1 approved questions
✅ No duplicates found
✅ All questions valid

📁 Writing files...
   ✅ ../../chemistry-agent/questions/module5/5.1.1/quickQuiz.json (1 questions)

📊 Sync Summary:
================

Chemistry: 1 questions
  Module 5 → 5.1.1: 1 questions
================

🎉 Sync completed successfully!
```

---

## 🎯 Current Status

✅ Google Sheet created and shared
✅ Sheet has correct columns (18 columns)
✅ Service account created and shared
⏳ Need to download credentials.json
⏳ Need to install googleapis
⏳ Need to create .env file

**Complete Steps 1-3 above, then you're ready to sync!**

---

## Troubleshooting

### Error: "credentials.json not found"

**Fix:**
- Download credentials.json from Google Cloud Console (Step 1 above)
- Place it in: `C:\HSC-Learning-App\mobile-ui-agent\credentials.json`
- Run setup script again

### Error: "Access denied to sheet"

**Fix:**
- Your sheet is already shared correctly ✅
- This shouldn't happen, but if it does:
  1. Open: https://docs.google.com/spreadsheets/d/1ceTKCDXxpMq50uCpgyWgpJ0Hmv4pLMzcj12fSYibR7A/edit
  2. Click "Share"
  3. Verify `hsc-app-sheet-reader@hsc-learn-470407.iam.gserviceaccount.com` is listed
  4. Permission should be: "Viewer"

### Error: "GOOGLE_SHEET_ID not set"

**Fix:**
- Create `.env` file in mobile-ui-agent folder (Step 3 above)
- Add: `GOOGLE_SHEET_ID=1ceTKCDXxpMq50uCpgyWgpJ0Hmv4pLMzcj12fSYibR7A`

### Error: "Row X: Correct answer not found in options"

**Fix:**
- Open your Google Sheet
- Check row X, column K (answer)
- Make sure the text matches one of the options (columns G-J) **exactly**
- Check capitalization and spelling

Example:
```
❌ Wrong:
  option_b: "Dynamic equilibrium"
  answer: "dynamic equilibrium"  (lowercase - won't match!)

✅ Correct:
  option_b: "Dynamic equilibrium"
  answer: "Dynamic equilibrium"  (exact match!)
```

---

## Next: Add More Questions

Once setup is complete, see [QUESTION_SYNC_GUIDE.md](./QUESTION_SYNC_GUIDE.md) for:
- How to add questions to your sheet
- Question format and templates
- Validation rules
- Common mistakes to avoid

