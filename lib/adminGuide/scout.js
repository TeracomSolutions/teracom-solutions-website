export default `## Scout

Scout is where you track research work you want done for the website. You can do a one-off lookup or set up tasks that are checked on a schedule. Creating a task records what you want researched and when it comes back due. Research runs when someone clicks Run research on an active task, or, for a recurring task, when its due time arrives. An AI researcher gathers sources and writes a report, a second AI critic reviews it, and the result lands in the Review Queue tab for a staff member to approve or reject.

### How to get there

Go to the Scout section from the main menu. There are two tabs: Website Research and Review Queue. The Website Research tab is the default view.

### What you see

**Add new task form**

- Task title (required)
- Target (optional free text)
- Recurrence (Once, Daily, Weekly, Monthly)
- Create Task button

**Recurring tasks table**

- Task: Name of the task
- Target: The research target
- Recurrence: How often it runs
- Status: What is happening with this recurring task
- Last run: When it last ran
- Latest run: Status of the most recent run

**History table**

- Task: Name of the task
- Target: The research target
- Recurrence: How often it ran
- Status: What happened to this task
- Last run: When it last ran
- Latest run: Status of the most recent run

**Active tasks table**

- Task: Name of the task
- Target: The research target
- Status: What is happening with this active task
- Latest run: Status of the most recent run
- Created: When the task was created
- Actions: Buttons to Mark complete, Cancel, and Run research

**Status labels and what they mean**

- Once: A one-off task that runs once
- Daily: Runs every day
- Weekly: Runs every week
- Monthly: Runs every month
- Active: Task is pending or running
- Completed: Task is finished (not shown in active tasks)
- Failed: Task had an error during execution
- Running: Task is currently executing
- Needs review: Research is complete and waiting for staff approval
- Approved: Staff approved the research report
- Rejected: Staff rejected the research report

**Buttons**

- Create Task: Adds the task using the three fields above and clears the form
- Mark complete: For research you did yourself. For a Once task, it disappears from Active tasks for good; for a recurring task, a fresh pending task reappears once the next interval is due
- Cancel: Removes the task entirely, with a confirmation prompt first
- Run research: After a confirmation prompt, starts an AI research run for the task. It can take several minutes; its status shows in the Latest run column, and a finished run appears in the Review Queue tab for approval
- Approve: Saves the decision to approve the research report and records it in the audit log
- Reject: Saves the decision to reject the research report and records it in the audit log

**Review Queue tab**

This tab shows all finished research runs waiting for staff to approve or reject them. Each row has:

- Query: What was researched
- Researcher: The AI model that did the research
- Critic: The AI model that reviewed the research
- Created: When the run started
- Review button: Opens the run details page

**Review Run Detail page**

- Query: What was researched
- Status: Current status of this run
- Researcher: The AI provider and model that did the research
- Critic: The AI provider and model that reviewed the research
- Started: When the run started
- Report: The full research report in markdown format
- Critique: The critic's review or comments about the report
- Approve button: Saves the decision to approve the research report
- Reject button: Saves the decision to reject the research report

**Error messages**

- Research run not found.
- Unable to load this research run.
- Unable to load the tasks. Your session may have expired -- sign in again.
- The request failed.
- Unable to cancel the task.
- Failed to load the review queue.

### Step by step

**To create a new research task**
1. Click Website Research tab if not already selected
2. Fill in the Task title field with a short name for what you want researched
3. Optionally fill in the Target field with a URL, company name, product, or topic to focus the research on
4. Select recurrence from the dropdown (Once, Daily, Weekly, Monthly)
5. Click Create Task button

**To run research now for an active task**
1. In the Active tasks table, find the task you want to run
2. Click Run research button in the Actions column for that task
3. Confirm the action in the popup dialog
4. Wait for the research to complete (this can take several minutes)
5. The status updates in the Latest run column
6. When complete, the run appears in the Review Queue tab

**To approve a research report**
1. Click Review Queue tab
2. Find the report you want to review
3. Click Review button for that row
4. On the detail page, click Approve button
5. Enter optional approval notes in the prompt dialog
6. Click OK to save the decision

### Good to know

- Recurring tasks automatically create a new pending task when they complete their run
- Running tasks refresh automatically every 20 seconds until complete
- The Review Queue tab auto-refreshes
- Tasks with status Running update automatically every 20 seconds
- Once tasks are removed from the Active tasks list after completion
- Cancelled tasks are permanently deleted
- Research runs on whichever AI providers are configured under AI Connections: a local Ollama host first, then Anthropic, OpenAI and Groq as fallbacks

### If something goes wrong

- Error message "Unable to load the tasks. Your session may have expired -- sign in again." appears if your session times out
- Error message "The request failed." or similar appears for API connection issues
- Error message "Failed to load the review queue." appears when loading the Review Queue tab fails
- Error message "Unable to cancel the task." appears when cancelling a task fails
- If a research run fails, the error message is shown in the Failed status column of the table
- If a run fails, you can see the detailed error on the Review Run Detail page under the Error heading
`;