# Working in this repository

This is part of the public Teracom Solutions website. It is live and public.

## The one rule that must never be broken

On the development host, this directory is an **sshfs mount of another
machine (VM 101)**. It is not a local checkout.

**Never run `rm -rf` on this directory or anything above it.** A recursive
delete here deletes the live website on the other server. There is no undo and
no local copy.

Check what a path actually is before any destructive command. If a command
would remove more than the single file you intend, do not run it.

## Before you say it works

Load the affected page and look at it. A 200 status code proves nothing — a
login page, an error page and a terms wall all return 200.

## Style

Match the file you are editing. Australian English throughout. No emoji.
Plain and businesslike — this is a company website, not a marketing
experiment.

## If you are unsure

Say so and stop. This is the public face of the company.
