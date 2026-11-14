const backups = `
The **Backups** page (System > Backups) backs up everything in the console to the Synology on the office network, so that it can all be put back after a failure.

### Setting it up (once)

1. On the Synology (DSM), make a shared folder for backups (for example **backups**) and a user that may read and write only there (for example **teracom-backup**).
2. In the console, **Connections**, Storage, **Backup NAS**: the Synology's address (10.0.0.10), the shared folder, the folder inside it (it starts as "Teracom website console"), the user and password, and a **backup passphrase** of at least 12 characters. Save, then **Test**: it signs in and writes and removes a small file.
3. Put the passphrase in Zoho Vault. Every backup is locked with it, and without it no backup can be opened. It is not inside the backups.
4. On **Backups**, check the schedule and press **Back up now** once.

### What goes in a backup

Each backup is a folder on the NAS named by its date and time, holding:

- **Database**: every console setting and Connection (keys still locked), staff and permissions, the Assistant's memory notes, chats, every step it took and the files it was given, its knowledge and skills, Ask Tera's library, leads, forms and their edits, orders, customers, products and prices.
- **Server settings**: the backend's settings file and the key that unlocks the saved keys, the Cloudflare tunnel, the services and timers, the crontab, the web search settings, local data and scripts, and which version of the code was running.
- **Files** (can be switched off): every uploaded file and the graphics library.
- **manifest.json**: the list of files with sizes and checksums. Nothing secret.

Every file is locked before it leaves the server and checked to open with the passphrase before it is copied. The code is on GitHub and is not copied.

### Schedule

Once a week (it starts as Sunday at 2 am in the console's time zone) or every day, and how many backups to keep (it starts at 8). Once there are more, the oldest backup this page made is removed from the NAS; nothing else there is touched. A scheduled backup that fails waits for the next scheduled time; press **Back up now** to try again sooner.

### When something goes wrong

A failed backup shows on this page in red with the reason, turns the Backup NAS card on Connections red, goes on the Audit log and is emailed to Robert. Click the line for every step it took.

### Putting it back

Opening a backup needs the passphrase and the small program scripts/open_backup.py in the website backend; the steps for restoring onto a new server are in the backend's docs/operations/site-backup.md.
`;

export default backups;
