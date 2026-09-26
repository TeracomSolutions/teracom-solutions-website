'use client';

import { useState } from 'react';

import AdminHelpIcon from './AdminHelpIcon';
import AdminScoutTaskManager from './AdminScoutTaskManager';
import AdminReviewQueueTable from './AdminReviewQueueTable';

// The Scout page: two task tabs and the review queue. Copied from the
// Global Platform's app/(admin)/scout/page.js.
const TABS = [
  { key: 'website_intelligence', label: 'Website' },
  { key: 'operating_systems', label: 'Operating Systems' },
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
          <p>Scout is where you track research work you want done -- either a one-off lookup or something you want checked on a schedule. Creating a task records what you want researched and when it comes back due. Research only runs when someone clicks <strong>Run research</strong> on an active task: an AI researcher gathers sources and writes a report, a second AI critic reviews it, and the result lands in the <strong>Review Queue</strong> tab for a staff member to approve or reject. Nothing runs on its own schedule, and nothing here changes live website content or Operating System packs automatically.</p>
          <h4>Tabs</h4>
          <p><strong>Website</strong> -- tasks about content/data for this website (e.g. &quot;check competitor X&apos;s pricing page&quot;, &quot;find new case studies for the security industry&quot;). <strong>Operating Systems</strong> -- tasks about researching improvements or additions to an Operating System pack (e.g. &quot;find the latest Gallagher integration docs&quot;). Each tab has its own independent task list -- a task created on one tab never appears on the other. <strong>Review Queue</strong> -- finished research runs from both tabs, waiting for approval; click Review to open one.</p>
          <h4>Add new task -- fields</h4>
          <ul>
            <li><strong>Task title</strong> -- required. A short name for what you want researched, e.g. &quot;Weekly competitor pricing check&quot; or &quot;Find Inner Range API changelog&quot;. This is the only thing shown in the list, so make it specific enough to recognise later.</li>
            <li><strong>Target</strong> -- optional free text: a URL, company name, product, or topic to focus the research on, e.g. &quot;https://competitor.com/pricing&quot; or &quot;Gallagher Command Centre&quot;. Run research uses the target as the research question (or the task title if the target is blank), so write it as the question you want answered. Leave it blank for a more open-ended task (e.g. &quot;keep an eye on new AI regulation news&quot;). Worked Operating Systems example: Task title &quot;Enhance Technical Support OS&quot;, Target &quot;Gallagher Command Centre support docs, Inner Range Integriti knowledge base, common alarm/access-control troubleshooting and escalation procedures&quot; -- naming the real sites/topics the research should actually pull from.</li>
            <li><strong>Recurrence</strong> -- how often this task should come back due: <strong>Once</strong> (a single task -- once marked complete it is done for good), <strong>Daily / Weekly / Monthly</strong> (once marked complete, a new pending task for the same title/target is automatically created with its next due date advanced by that interval, so the task keeps reappearing).</li>
          </ul>
          <h4>Recurring tasks</h4>
          <p>Every task whose recurrence is Daily/Weekly/Monthly, whether or not it is currently due -- this table is the standing schedule, not just what&apos;s due right now. Shows its recurrence interval, current status, and when it last ran.</p>
          <h4>Active tasks</h4>
          <p>Every task -- once-off or recurring -- that is currently pending or running, i.e. not yet marked complete. This is your real to-do list for this tab.</p>
          <h4>Buttons</h4>
          <ul>
            <li><strong>Create Task</strong> -- adds the task using the three fields above and clears the form.</li>
            <li><strong>Mark complete</strong> -- you click this yourself once you&apos;ve actually done the research. For a Once task, it disappears from Active tasks for good. For a recurring task, it disappears from Active tasks and a fresh pending task with the same title/target reappears once the next interval is due.</li>
            <li><strong>Cancel</strong> -- removes the task entirely, with a confirmation prompt first. Use this for a task that&apos;s no longer needed, not for one you&apos;ve completed.</li>
            <li><strong>Run research</strong> -- after a confirmation prompt, starts an AI research run for the task. It can take several minutes; its status shows in the Latest run column, and a finished run appears in the Review Queue tab for approval.</li>
          </ul>
          <h4>History</h4>
          <p>Finished tasks: marked complete, or failed.</p>
          <h4>Review Queue tab</h4>
          <ul>
            <li>Every finished research run waiting for a decision, from both tabs: the research question, which AI models did the research and the critique, and when it ran.</li>
            <li><strong>Review</strong> opens the run: its report, the critic&apos;s critique (or the error if it failed), and <strong>Approve</strong> / <strong>Reject</strong>, each with optional notes. The decision and notes are saved on the run and recorded in the audit log.</li>
            <li>Approving records that the research is good; it doesn&apos;t change the website or any Operating System pack by itself.</li>
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

      {activeTab === 'operating_systems' && <AdminScoutTaskManager section="operating_systems" />}

      {activeTab === 'review' && (
        <>
          <p className="lead">
            Finished research runs waiting for a staff member to approve or reject them. Start a
            run from an active task on the Website or Operating Systems tab.
          </p>
          <AdminReviewQueueTable />
        </>
      )}
    </div>
  );
}
