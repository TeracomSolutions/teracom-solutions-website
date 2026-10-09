export default {
  slug: 'what-is-access-control',
  title: 'What is access control?',
  description:
    'Access control decides who can go through which door, and when. The parts of an electronic system, how it works, and what to ask before you plan one.',
  published: '2026-10-09',
  related: [
    { label: 'Access control products', href: '/store/access-control' },
    { label: 'Access control services', href: '/services/access-control' },
    { label: 'Tecom Challenger', href: '/brands/tecom-challenger' },
    { label: 'Contact us', href: '/contact' },
  ],
  blocks: [
    {
      type: 'p',
      text: 'Access control is the system that decides who may go through a door, gate or other entry point, and when. Instead of a key that anyone can copy and pass on, a person presents a credential (a card, fob, PIN, phone or fingerprint) and the system checks it before it unlocks. Every decision is recorded.',
    },
    { type: 'h2', text: 'What an access control system is made of' },
    {
      type: 'ul',
      items: [
        { term: 'Credentials', text: 'What people carry or know: cards and fobs, PINs, a mobile credential on a phone, or a biometric such as a fingerprint or face.' },
        { term: 'Readers', text: 'The device at the door that reads the credential. Some also have a keypad.' },
        { term: 'Controller', text: 'The brain. It holds the rules, checks a credential against who is allowed through that door at that time, decides whether to unlock, and keeps the record of events.' },
        { term: 'Locking hardware', text: 'What actually secures the door: an electric strike, an electromagnetic lock (maglock) or an electrified lock set. The right choice depends on the door and the building requirements.' },
        { term: 'Door monitoring and exit devices', text: 'A door contact tells the system whether the door is closed, open or held open. An exit button or motion sensor lets people out.' },
        { term: 'Power supply', text: 'A power supply with a backup battery, so the doors keep working through a power cut.' },
        { term: 'Software', text: 'Where you add people, set which doors and times they can use, and run reports.' },
      ],
    },
    { type: 'h2', text: 'How a door decision is made' },
    {
      type: 'ol',
      items: [
        'A person presents a credential to the reader.',
        'The reader passes the credential data to the controller.',
        'The controller checks that the credential is valid, that the person is allowed through that door, and that the time is within their permitted hours.',
        'If yes, the controller releases the lock for a few seconds and logs the entry. If not, the door stays locked and the attempt is logged.',
        'The door contact confirms the door has closed again. If the door is propped open or forced, the system can raise an alarm.',
      ],
    },
    { type: 'h2', text: 'Choosing credentials' },
    {
      type: 'p',
      text: 'Not all cards are equal. Older 125 kHz proximity cards are simple and cheap, but many can be copied with inexpensive equipment. Modern 13.56 MHz smart cards and mobile credentials use encryption and are much harder to clone. For a new system, choose a modern credential technology even if you are starting with only a few users.',
    },
    {
      type: 'p',
      text: 'PIN-only keypads are the cheapest way to start, but PINs are easily shared, so they suit low-risk doors best. Biometrics tie the credential to the person, at the cost of more expensive readers and a need to think about privacy.',
    },
    { type: 'h2', text: 'Locks, power failure and safety' },
    {
      type: 'p',
      text: 'How a door behaves when the power fails matters. A fail-secure lock stays locked without power. A fail-safe lock unlocks. People must always be able to get out of a building in an emergency, and each door has to meet the building code and fire safety requirements for that building, so lock choice and wiring should be planned and installed by a licensed professional. Never defeat or block a fire exit for the sake of security.',
    },
    { type: 'h2', text: 'Standalone, networked and cloud systems' },
    {
      type: 'ul',
      items: [
        { term: 'Standalone', text: 'Each reader holds its own list of users. Fine for one or two doors, but every change has to be made at the door and there is no central record.' },
        { term: 'Networked', text: 'Controllers connect to a central server, so one change updates every door and you get a full audit trail. The usual choice for a business with more than a few doors.' },
        { term: 'Cloud-managed', text: 'The management is hosted online and used in a browser or app. It suits multi-site businesses and those without IT staff, usually for a subscription.' },
      ],
    },
    { type: 'h2', text: 'Where access control goes further' },
    {
      type: 'p',
      text: 'Access control rarely stands alone. It can be linked to the intruder alarm (arm the alarm when the last person leaves), to CCTV (mark the video when a door is forced), to lifts and car park gates, and to visitor management and time and attendance.',
    },
    { type: 'h2', text: 'Questions to ask before you plan a system' },
    {
      type: 'ul',
      items: [
        'Which doors need control, and who needs to use each one?',
        'Do you need to know who went where, or only to keep people out?',
        'How many people come and go, and how often do staff change?',
        'What do the building and fire requirements say for each door?',
        'Do you want to manage it yourself, or have it managed for you?',
        'Will it grow to more doors or more sites?',
      ],
    },
    {
      type: 'p',
      text: 'Teracom Solutions supplies and installs access control systems, including products from Tecom Challenger, Inner Range, Kantech and HID. Contact us with a description of your site and we will help you work out what you need.',
    },
  ],
};