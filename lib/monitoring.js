// Teracom monitoring services.
//
// Written from Teracom's own monitoring documents (the 2019 Commercial
// Service Agreement / monitoring application form and the internal
// "Process for Monitoring" note), so every claim on these pages describes
// something the business actually does today.
//
// Three deliberate omissions, all of them load-bearing:
//
//  1. The control room is never named. Robert, 2026-09-23: monitoring is
//     presented as a Teracom service. The pages say "our control room",
//     which is what the customer's agreement with Teracom says too.
//  2. No prices. The rates in the 2019 form are stale, and an out-of-date
//     price on a public page is a misleading pricing claim, not a typo.
//     Every commercial question routes to a quote.
//  3. No response-time promise. The service agreement commits to
//     monitoring 24/7 and acting on the agreed alarm procedure; it does
//     not commit to a number of minutes, so neither do these pages.
//     Anything the website promises, the agreement has to back up.

export const monitoringServices = [
  {
    slug: 'alarm-monitoring',
    title: 'Alarm monitoring',
    seoTitle: 'Back-to-Base Alarm Monitoring Australia | Teracom Solutions',
    icon: 'alarm',
    summary:
      'Back-to-base monitoring of your alarm system, 24 hours a day, with a documented response for every signal type.',
    lead: 'Your alarm system is only as good as what happens after it goes off. Back-to-base monitoring puts a control room behind it, 24 hours a day.',
    description:
      'Back-to-base alarm monitoring for commercial and residential sites, with a documented response procedure for every signal your panel can send.',
    intro: [
      'When your panel sends a signal, it arrives at our control room within seconds and an operator works through the response procedure agreed with you when the site was set up. That procedure is yours, not a default: who gets called, in what order, what happens outside business hours, and whether a patrol attends before or after the call list is exhausted.',
      'We monitor the signals that matter and not just the obvious one. Burglary and perimeter zones, panic and duress, medical, fire where the panel reports it, cabinet and siren tamper, mains failure and low battery, and line or path failure so you find out when the connection drops rather than when you need it.',
    ],
    includes: [
      'Monitoring 24 hours a day, every day of the year',
      'A response procedure written for your site, not a default',
      'Alarm, duress, tamper, mains fail and path fail signals',
      'A nominated contact list you can change at any time',
      'Every signal and every action logged',
      'Escalation to emergency services where the procedure calls for it',
    ],
    considerations: [
      'Nominate at least three after-hours contacts. Two is the most common reason a response stalls at 2am.',
      'Tell us before you vacate or sell the site, change your phone or internet carrier, or change bank details.',
      'Keep the panel serviced and report faults, so a genuine alarm is not lost behind a known fault.',
      'False alarms cost money when they put a patrol or emergency services on the road. We will help you find the cause.',
    ],
  },
  {
    slug: 'cctv-monitoring',
    title: 'CCTV monitoring',
    seoTitle: 'CCTV & Video Monitoring Services Australia | Teracom Solutions',
    icon: 'camera',
    summary:
      'Cameras watched alongside the alarm, so an operator can see what triggered a detector before anyone is sent.',
    lead: 'A detector tells you something moved. A camera tells you what it was. Monitoring the two together is what stops you paying for a callout to a possum.',
    description:
      'CCTV and video monitoring for commercial sites, including video verification of alarm activations before a patrol or emergency response is dispatched.',
    intro: [
      'Video verification links your cameras to your alarm so that when a zone activates, the operator can look at what the camera saw at that moment before deciding what to do. A genuine intrusion gets a faster, better-informed response, because the operator can describe what is actually happening. A cat, a delivery driver or a branch in the wind gets stood down without a truck leaving the depot.',
      'We can also watch cameras on a schedule rather than only on an alarm, which suits sites that are empty overnight, yards and compounds where the fence is the first line of defence, and any site where the problem is people being somewhere they should not be rather than a door being forced.',
    ],
    includes: [
      'Video verification of alarm activations',
      'Scheduled monitoring for sites that are empty out of hours',
      'Works with the cameras and recorders we supply and install',
      'Fewer false callouts, because activations are checked before dispatch',
      'Images retained for 24 hours by default, longer by arrangement',
    ],
    considerations: [
      'Cameras need to cover the same areas as the detectors for verification to be worth anything.',
      'Night performance matters more than resolution. A 4K camera that cannot see in the dark verifies nothing.',
      'Bandwidth and remote access need to be planned in. We size this as part of the design.',
      'Recording people carries privacy obligations. Signage and sensible camera placement are part of the job.',
    ],
  },
  {
    slug: 'open-close-reporting',
    title: 'Open, close and schedule reporting',
    seoTitle: 'Alarm Open Close Reporting & Schedules | Teracom Solutions',
    icon: 'clock',
    summary:
      'Know who armed and disarmed your site, and when, with alerts if it happens outside the hours you set.',
    lead: 'Most sites are not broken into. They are opened by someone who should not be there, at a time nobody was watching.',
    description:
      'Open and close reporting for monitored alarm systems: arming and disarming logged by user, with schedules and late-to-close alerts.',
    intro: [
      'Open and close reporting logs every arm and disarm against the user who did it. Set the hours your site is expected to be opened and closed and the control room will tell you when that does not happen: a late close, an early open, a disarm on a Sunday, someone bypassing a zone they have never bypassed before.',
      'Separate schedules can be set for cleaners, contractors and holiday periods, so the people who legitimately come in out of hours do not generate a call every week while a genuine exception still does.',
    ],
    includes: [
      'Arm and disarm logged against individual user IDs',
      'Business hours, cleaners and holiday schedules kept separately',
      'Late-to-close and early-open alerts',
      'Zone bypass visibility',
      'Reports on request',
    ],
    considerations: [
      'User IDs have to be set up properly on the panel, one per person, or the log tells you nothing useful.',
      'Keep the user list current when staff leave. An orphaned code is a real risk.',
      'Schedules need reviewing when trading hours change, or you will be called about a normal day.',
    ],
  },
  {
    slug: 'patrol-response',
    title: 'Patrol response',
    seoTitle: 'Alarm Patrol Response & Guard Attendance | Teracom Solutions',
    icon: 'shield',
    summary:
      'A patrol attends when your contacts cannot be reached, or whenever your procedure says someone should go.',
    lead: 'At three in the morning, the honest answer to "can you go and check?" is often no. That is what a patrol is for.',
    description:
      'Patrol attendance for monitored sites, dispatched according to the response procedure agreed for the site.',
    intro: [
      'Patrol response sends a security officer to your site instead of you. When and why they go is set by your response procedure: some sites want a patrol on any confirmed activation, some only when the contact list has been exhausted, and some only for specific zones.',
      'The officer checks the property, reports what they find, and secures the site where they can. You get the report either way, including the nights when the answer is that everything was fine.',
    ],
    includes: [
      'Attendance according to your agreed procedure',
      'Dispatch when nominated contacts cannot be reached',
      'A report on what was found',
      'Charged per attendance, so you only pay when someone goes',
    ],
    considerations: [
      'Give us clear site directions and the nearest cross street. Time spent finding a driveway is time not spent checking the building.',
      'Keys and access arrangements need to be agreed in advance if you want the officer to get inside.',
      'Repeated attendances on the same false alarm are a fault to fix, not a cost to absorb.',
    ],
  },
  {
    slug: 'duress-and-lone-worker',
    title: 'Duress and lone worker monitoring',
    seoTitle: 'Duress Alarms & Lone Worker Monitoring | Teracom Solutions',
    icon: 'duress',
    summary:
      'Monitored duress buttons and personal devices for staff who work alone, late, or with the public.',
    lead: 'A duress button that nobody is watching is a light switch.',
    description:
      'Monitored duress alarms and personal duress devices for lone workers, handled under a separate response procedure to a standard intrusion alarm.',
    intro: [
      'Fixed duress buttons under a counter or at a reception desk, and personal duress devices for staff who are mobile or working alone, both report to the control room under their own response procedure. A duress signal is not treated like a door contact: the operator follows a procedure written for a person in trouble, not a building.',
      'This matters for retail and hospitality, clinics and community services, property managers doing inspections alone, and anyone whose staff open or close a site by themselves.',
    ],
    includes: [
      'Fixed duress buttons monitored alongside the alarm system',
      'Personal duress devices for mobile and lone workers',
      'A response procedure specific to duress, separate from intrusion',
      'Silent activation, so the signal does not escalate the situation',
    ],
    considerations: [
      'Staff need to know what happens when they press it, and to have pressed one in training at least once.',
      'Test duress devices on a schedule. They are the one alarm you cannot afford to discover is faulty.',
      'Lone worker safety is a work health and safety duty, not just a security preference.',
    ],
  },
];

// How the panel talks to the control room. Every path here is one Teracom
// already provisions; polling intervals are from the current service options.
export const connectionPaths = [
  {
    name: 'Dialler',
    detail:
      'The traditional path over a fixed telephone line. Cheapest to run, and still appropriate on some sites, but it only reports when it has something to say -- if the line is cut you find out when the alarm fails to arrive.',
  },
  {
    name: 'Dual-SIM 4G',
    detail:
      'A wireless path with two carriers in one unit, polled as often as every 20 seconds. If the path drops, the control room knows in seconds rather than at the next alarm. The usual choice for a commercial site today.',
  },
  {
    name: 'IP',
    detail:
      'Reporting over your existing internet connection, supported natively by several common panels. Fast and inexpensive, and normally paired with a wireless path so one outage does not take monitoring with it.',
  },
  {
    name: 'Multipath',
    detail:
      'Two independent paths, continuously supervised, for sites where a loss of monitoring is itself the incident. Insurance requirements and higher security classifications usually land here.',
  },
];

export const monitoringSteps = [
  {
    title: 'Assess',
    text: 'We look at the panel you have, how the site is used and what you are actually protecting, then recommend a monitoring path that fits -- not the most expensive one.',
  },
  {
    title: 'Apply',
    text: 'We complete the monitoring application together: contacts and their authority, arming schedules, the zone list and what should happen for each signal.',
  },
  {
    title: 'Connect',
    text: 'Any communicator required is supplied and configured, the panel is programmed, and the site is registered with the control room.',
  },
  {
    title: 'Commission',
    text: 'On site, every documented zone is tested -- an alarm and a restore on each, plus siren and cabinet tampers, and arm/disarm reports where schedules are used. Nothing goes live untested.',
  },
  {
    title: 'Monitor',
    text: 'The site is monitored from that point on. Contact changes, schedule changes and reports are handled by us, so you have one number to call.',
  },
];

export const monitoringFaqs = [
  {
    question: 'What does back-to-base monitoring actually mean?',
    answer:
      'It means your alarm system reports to a control room that is staffed 24 hours a day, rather than only sounding a siren at the site. When a signal arrives, an operator works through the response procedure agreed for your site -- calling your nominated contacts, sending a patrol, or escalating to emergency services.',
  },
  {
    question: 'Can you monitor the alarm system I already have?',
    answer:
      'Usually, yes. Most commercial panels installed in the last fifteen years can report to a control room, sometimes as they are and sometimes with a communicator added. We check the panel before quoting rather than assuming, and we will tell you if replacing it is the more sensible option.',
  },
  {
    question: 'Do I still need a phone line?',
    answer:
      'Not for most sites. A dialler needs a working outgoing fixed line, which is exactly why fewer sites use one now. A dual-SIM 4G or IP path does not, and is supervised as well -- meaning the control room notices if the path fails, instead of finding out at the next alarm.',
  },
  {
    question: 'What is polling, and why does it matter?',
    answer:
      'Polling is the connection checking in with the control room at a set interval, from once a day down to every 20 seconds depending on the service. The shorter the interval, the sooner a cut or failed path is noticed. It is the difference between a monitored connection and an assumed one.',
  },
  {
    question: 'What happens if you cannot reach anyone on my contact list?',
    answer:
      'Whatever your procedure says. Most sites nominate a patrol attendance when the list is exhausted, and we recommend at least three after-hours contacts -- two is the most common reason a response stalls in the middle of the night.',
  },
  {
    question: 'Can I change my contacts or schedules later?',
    answer:
      'Yes, at any time, and you should whenever staff change. Contact us and we will update the control room record. Keeping that list current is the single most useful thing a customer can do.',
  },
  {
    question: 'How is monitoring billed?',
    answer:
      'Monitoring is charged at a fixed rate for the service you choose, payable in advance. There is no card surcharge. Optional extras are charged only when used, and so are call-outs outside business hours, additional site visits, reprogramming, decommissioning at the end, and any cost emergency services charge us for attending your site. We tell you the rate before doing chargeable work. Ask us for current rates.',
  },
  {
    question: 'How long am I committed for?',
    // Describes the agreement in force today. Terms v3.0 (effective
    // 1 November 2026) moves monitoring to month-to-month after the first
    // year with cancellation on 30 days notice at any time -- update this,
    // and add the full pre-purchase disclosure set, when those take effect.
    answer:
      'Monitoring starts with an initial 12-month term and the agreement renews after that. The notice you need to give to cancel, and what applies if you cancel early, are set out in your monitoring agreement. We take you through those before you sign rather than leaving you to find them afterwards, and we are happy to send you the agreement to read first.',
  },
  {
    question: 'Does monitoring replace insurance?',
    answer:
      'No, and anyone who tells you otherwise is selling something. Monitoring reduces risk and shortens the time between something happening and someone acting on it. It cannot prevent a break-in or a fire, and it depends on power, networks and equipment that can fail. Keep your insurance.',
  },
  {
    question: 'What do I need to provide on site?',
    answer:
      'Mains power for the panel and its backup supply, safe access for our technician, and a working connection path -- a fixed line for a dialler, or adequate mobile or internet coverage for a wireless or IP path. We confirm all of this before the site goes live.',
  },
];

export function findMonitoringService(slug) {
  return monitoringServices.find((service) => service.slug === slug);
}

export function monitoringPath(service) {
  return service ? `/monitoring/${service.slug}` : '/monitoring';
}
