const guide = `## About

Which versions of the console and the backend are running, and what changed in each, so you can tell that a website copy has been updated.

### How to get there

Click **About** at the bottom of the main menu.

### What you see

The product and site name, the **version** (for example 1.2.0), when it was released, the **commit** it was built from, the build time and the environment, followed by the **Backend versions** history with the plain-English notes of every release. The **Console** card and the **Console versions** list do the same for the console itself, and each list has a **Show** filter (all versions, the latest 5, or the last 30 days).

### Good to know

- Two copies of the backend (for example the Teracom website and Luneva) are on the same release only when both the version and the commit match.
- Every release that is deployed gets a new version number; the notes come from the changelog of the copy that is actually running.
`;

export default guide;