export default `## Account

This page lets you manage your own sign-in settings for the admin console. You can set up two-step sign-in (also called two-factor authentication), and choose how long the system waits before signing you out automatically.

### How to get there

Click **Account** in the menu row at the top of any admin page.

### What you see

**Automatic sign-out settings**

This form shows your current automatic sign-out setting. You can change it to one of these times:

1. 5 minutes
2. 10 minutes
3. 15 minutes
4. 30 minutes
5. 1 hour
6. 2 hours
7. 4 hours
8. 8 hours

The time you choose is saved immediately. If the console has no activity for that long, it signs you out automatically.

When you are about to be signed out, a banner appears with a button to stay signed in.

**Two-factor sign-in status**

This card shows whether two-step sign-in is on or off for your account. If it's on, the card shows how many backup codes you have left.

If two-factor is off:

1. A button **Set up two-factor** lets you turn it on
2. The help text explains how to use an authenticator app like Google Authenticator or Microsoft Authenticator

If two-factor is on:

1. A button **Turn two-factor off** lets you turn it off
2. A message shows how many backup codes are left
3. Another message explains that a six-digit code is needed for every sign-in after your password

**Set up two-factor process**

This form appears when you click **Set up two-factor**. It has two main parts:

1. Add the secret to your app or vault
2. Confirm with a code

In the first part, there are two options for adding the secret:

1. A QR code to scan with an authenticator app
2. The secret key to enter by hand into a password manager such as Zoho Vault

Below the QR code and key, there are buttons to copy each. The key is formatted in groups of four characters separated by spaces.

In the second part:

1. A text box for entering the six-digit code that your app or vault shows now
2. Buttons to **Turn on** or **Cancel**

When you turn on two-factor, you see a card with your backup codes. Each code works once only. You must save these codes somewhere safe.

**Turn off two-factor**

This form appears when you click the **Turn two-factor off** button in the status card.

1. A text box for entering a current six-digit code or one of your backup codes
2. Buttons to **Turn off** or **Cancel**

**Change password**

| Field              | What to put in it                                             |
|--------------------|---------------------------------------------------------------|
| Current password   | Your existing password                                        |
| New password       | At least 12 characters, a mix of characters, not your email name and not the one you are using now |
| Confirm new password | Enter the new password again                                |
| Two-factor code    | Only when two-factor is on: enter the six-digit code from your authenticator app or a backup code |

Press **Change password** to save. A message shows "Your password has been changed." Other sessions are signed out.

### Step by step

**To turn on two-factor sign-in**

1. Click the **Set up two-factor** button in the status card
2. Choose one of these options:
   - Scan the QR code with an authenticator app like Google Authenticator or Microsoft Authenticator
   - Copy the secret key into a password manager such as Zoho Vault
3. Enter the six-digit code your app or vault shows now
4. Click **Turn on**
5. Save the backup codes shown in the next screen

**To turn off two-factor sign-in**

1. Click the **Turn two-factor off** button in the status card
2. Enter a current six-digit code or one of your backup codes
3. Click **Turn off**

**To change the automatic sign-out time**

1. Open **Account** in the menu row
2. In **Automatic sign-out**, choose how long the console may sit idle before signing you out:
   1. 5 minutes
   2. 10 minutes
   3. 15 minutes
   4. 30 minutes
   5. 1 hour
   6. 2 hours
   7. 4 hours
   8. 8 hours
3. Press **Save**
4. The countdown in the menu row starts from the new time

**To change your password**

1. Open **Account** in the menu row
2. In **Change password**, type your current password
3. Type the new password twice
4. If two-factor is on, type the code from your app or a backup code
5. Press **Change password**
6. You stay signed in, other sessions are signed out

### Good to know

- The automatic sign-out setting is yours alone and applies straight away
- Two-factor sign-in works with apps like Google Authenticator, Microsoft Authenticator, Authy, 1Password, or Zoho Vault
- Backup codes are shown only once when you turn on two-factor. Save them in a secure place such as a password manager
- If you lose your phone or vault, you can use a backup code to sign in
- Each backup code works only once

- If you run out of backup codes, an administrator must reset your two-factor settings on the server
- The system refreshes your session automatically when you do anything in the console (clicking, typing, scrolling)

### If something goes wrong

- "Unable to load your account from the backend." - Try again or contact support
- "The request failed." - Check your internet connection and try again
- "The setting was not saved." - Try saving again or contact support
- "Turn two-factor off for your account? A password alone will sign you in again." - This is a confirmation message before turning off two-factor, not an error
- "Your current password is not right." - Type the password you signed in with today. If you have forgotten it, ask the website administrator to reset it.
- "The new passwords do not match." - Type the new password again in both boxes; they must be the same.
- "Use at least 12 characters." - Choose a longer password. The page also refuses one that is your email name, the one you use now, only numbers, or the same few characters repeated, and says which.
- "Enter the six-digit code from your authenticator app, or a backup code." - Two-factor is on, so type the current code from your app or Zoho Vault, or one of your backup codes.
`;