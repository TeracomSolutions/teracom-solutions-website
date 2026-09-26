'use client';

import { useState } from 'react';

import AdminHelpIcon from './AdminHelpIcon';
import AdminScoutTaskManager from './AdminScoutTaskManager';
import AdminReviewQueueTable from './AdminReviewQueueTable';

// The Scout page: website research tasks and the review queue. The
// platform's Operating Systems tab is gone -- it had nothing to do with
// this website (Robert, 2026-09-26). The stored section key stays
// "website_intelligence" so existing tasks keep their history.
const TABS = [
  { key: 'website_intelligence', label: 'Website Research' },
  { key: 'review', label: 'Review Queue' },
];

export default function AdminScoutTabs({ initialTab }) {
  // ?tab= keeps the chosen tab across a refresh and lets other pages link
  // straight to the Review Queue.
  const [activeTab, setActiveTab] = useState(
    TABS.some((tab) => tab.key === initialTab) ? initialTab : 'website_intelligence'
  );

  function selectTab(key) {
    setActiveTab(key);
    window.history.replaceState(null, '', key === 'website_intelligence' ? '/admin/scout' : `/admin/scout?tab=${key}`);
  }

  return (
    <div>
      <h1 className="admin-heading">
        Scout
        <AdminHelpIcon>
          <h4>What this section is for</h4>
          <p>Scout is where you track research work you want done for the website -- either a one-off lookup or something you want checked on a schedule. Creating a task records what you want researched and when it comes back due. Research runs when someone clicks <strong>Run research</strong> on an active task, or, for a recurring task, when its due time arrives: an AI researcher gathers sources and writes a report, a second AI critic reviews it, and the result lands in the <strong>Review Queue</strong> tab for a staff member to approve or reject. Nothing here changes live website content automatically.</p>
          <h4>Add new task -- fields</h4>
          <ul>
            <li><strong>Task title</strong> -- required. A short name for what you want researched, e.g. &quot;Weekly competitor pricing check&quot; or &quot;Find Inner Range API changelog&quot;.</li>
            <li><strong>Target</strong> -- optional free text: a URL, company name, product, or topic to focus the research on. Run research uses the target as the research question (or the task title if the target is blank), so write it as the question you want answered.</li>
            <li><strong>Recurrence</strong> -- <strong>Once</strong> (a single task -- once marked complete it is done for good), or <strong>Daily / Weekly / Monthly</strong> (once a run completes, a new pending task for the same title/target is created with its next due date advanced by that interval).</li>
          </ul>
          <h4>Recurring tasks</h4>
          <p>Every task whose recurrence is Daily/Weekly/Monthly, whether or not it is currently due -- the standing schedule. Shows its recurrence interval, current status, and when it last ran.</p>
          <h4>Active tasks</h4>
          <p>Every task -- once-off or recurring -- that is currently pending or running. This is the to-do list.</p>
          <h4>Buttons</h4>
          <ul>
            <li><strong>Create Task</strong> -- adds the task using the three fields above and clears the form.</li>
            <li><strong>Mark complete</strong> -- for research you did yourself. For a Once task, it disappears from Active tasks for good; for a recurring task, a fresh pending task reappears once the next interval is due.</li>
            <li><strong>Cancel</strong> -- removes the task entirely, with a confirmation prompt first.</li>
            <li><strong>Run research</strong> -- after a confirmation prompt, starts an AI research run for the task. It can take several minutes; its status shows in the Latest run column, and a finished run appears in the Review Queue tab for approval.</li>
          </ul>
          <h4>History</h4>
          <p>Finished tasks: marked complete, or failed.</p>
          <h4>Review Queue tab</h4>
          <ul>
            <li>Every finished research run waiting for a decision: the research question, which AI models did the research and the critique, and when it ran.</li>
            <li><strong>Review</strong> opens the run: its report, the critic&apos;s critique (or the error if it failed), and <strong>Approve</strong> / <strong>Reject</strong>, each with optional notes. The decision and notes are saved on the run and recorded in the audit log.</li>
            <li><strong>Refresh</strong> and <strong>Auto-refresh</strong> reload the queue.</li>
          </ul>
          <h4>AI providers</h4>
          <p>Research runs on whichever providers are configured under <strong>AI Connections</strong>: a local Ollama host first, then Anthropic, OpenAI and Groq as fallbacks.</p>
        </AdminHelpIcon>
      </h1>

      <div className="admin-tabs" role="tablist">
        {TABS.map((tab) => (
          <button
            key={tab.key}
            type="button"
            role="tab"
            aria-selected={activeTab === tab.key}
            onClick={() => selectTab(tab.key)}
            className={activeTab === tab.key ? 'admin-tab active' : 'admin-tab'}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {activeTab === 'website_intelligence' && <AdminScoutTaskManager section="website_intelligence" />}

      {activeTab === 'review' && (
        <>
          <p className="lead">
            Finished research runs waiting for a staff member to approve or reject them. Start a
            run from an active task on the Website Research tab.
          </p>
          <AdminReviewQueueTable />
        </>
      )}
    </div>
  );
}
