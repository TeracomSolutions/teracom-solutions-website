export default {
  slug: 'what-is-a-ups',
  title: 'What is a UPS (uninterruptible power supply)?',
  description:
    'A UPS keeps equipment running through a blackout and cleans up poor power. The three types, how to size one, and how long the battery really lasts.',
  published: '2026-10-09',
  related: [
    { label: 'UPS products', href: '/store/ups' },
    { label: 'PowerShield', href: '/brands/powershield' },
    { label: 'Contact us', href: '/contact' },
  ],
  blocks: [
    {
      type: 'p',
      text: 'A UPS, or uninterruptible power supply, is a battery backup that sits between the power point and your equipment. When the mains power fails or dips, the UPS takes over from its battery straight away, so computers, recorders and network gear keep running, or shut down safely, instead of crashing.',
    },
    { type: 'h2', text: 'What a UPS protects against' },
    {
      type: 'ul',
      items: [
        { term: 'Blackouts', text: 'A complete loss of power.' },
        { term: 'Brownouts (sags)', text: 'The voltage drops below normal for a while.' },
        { term: 'Surges and spikes', text: 'Short bursts of high voltage.' },
        { term: 'Electrical noise', text: 'Small fluctuations and interference in the supply.' },
      ],
    },
    { type: 'p', text: 'Not every type of UPS protects against all four equally. The three main types are described next.' },
    { type: 'h2', text: 'The three main types' },
    { type: 'h3', text: 'Standby (offline)' },
    {
      type: 'p',
      text: 'The equipment runs straight from the mains. If the power fails, the UPS switches to its battery within a few milliseconds. It is the simplest and cheapest type, with basic surge protection, and suits home computers, a small router and similar gear.',
    },
    { type: 'h3', text: 'Line-interactive' },
    {
      type: 'p',
      text: 'Like a standby UPS, but with a voltage-regulating circuit that corrects mild over-voltage and under-voltage without using the battery. This is the usual choice for small offices, network cabinets, CCTV recorders and NAS devices, where the power is not always clean. Using the battery less often also helps it last longer.',
    },
    { type: 'h3', text: 'Online (double conversion)' },
    {
      type: 'p',
      text: 'Always converts the incoming power to DC and back to clean AC, so the equipment is isolated from the mains and there is no switchover at all. It gives the cleanest power and is used for servers and critical or sensitive equipment. It costs more, makes more heat and uses a little more energy.',
    },
    { type: 'h2', text: 'How to size a UPS' },
    {
      type: 'ol',
      items: [
        { term: 'List the load', text: 'Find the power use of each item you will plug in, in watts, on its label or in its manual.' },
        { term: 'Add headroom', text: 'Add the figures up, then allow 20 to 30 per cent extra, so the UPS is never running flat out.' },
        { term: 'Look at watts, not only VA', text: 'VA is the apparent power. The watts a UPS can actually deliver are lower, often 60 to 90 per cent of the VA figure, depending on the model.' },
        { term: 'Decide how long it must run', text: 'A UPS battery is rated in minutes at a given load, and the runtime falls quickly as the load rises. For a longer runtime, choose a larger UPS or add battery modules.' },
        { term: 'Check the output waveform', text: 'Equipment with active power-factor-corrected power supplies, such as many servers and some high-end computers, can misbehave on a UPS that gives a stepped (simulated) sine wave. Choose pure sine wave output for these.' },
      ],
    },
    {
      type: 'p',
      text: 'Do not plug laser printers, heaters, kettles or other heavy loads into a UPS. They draw far more power than a small UPS can supply, and they are not worth protecting.',
    },
    { type: 'h2', text: 'What the runtime really means' },
    {
      type: 'p',
      text: 'Most small and medium UPS units are designed to bridge a short outage, to give equipment time to shut down cleanly, or to ride out brief interruptions. They are not designed to run a site for hours. If you need hours of backup, you need a much larger battery system or a generator, and it is worth talking to a specialist.',
    },
    { type: 'h2', text: 'Battery life and care' },
    {
      type: 'ul',
      items: [
        'Sealed lead-acid batteries, used in most UPS units, usually last about three to five years, and heat shortens that. Lithium-ion batteries can last longer, at a higher price.',
        'Keep the UPS in a cool, ventilated spot, out of direct sun.',
        'Test it. Most have a self-test, and a real power-off test once a year shows how long it will really run. Replace the battery when the UPS reports it is weak or when it reaches the end of its expected life.',
        'Install the maker’s shutdown software, so computers and servers shut down cleanly before the battery runs flat.',
      ],
    },
    { type: 'h2', text: 'Where a UPS matters most for security systems' },
    {
      type: 'ul',
      items: [
        { term: 'Video recorders', text: 'An NVR or DVR that loses power while it is writing can lose recordings or damage its hard drives.' },
        { term: 'PoE switches', text: 'They power the cameras, so the cameras go down with the switch.' },
        { term: 'NAS and servers', text: 'They are sensitive to sudden power loss and need to shut down cleanly.' },
        { term: 'Routers and modems', text: 'Without them, remote viewing and alarm reporting over the internet stop.' },
        { term: 'Access control and alarm panels', text: 'Most have their own backup battery, but the network equipment around them does not.' },
      ],
    },
    {
      type: 'p',
      text: 'Teracom Solutions supplies UPS units, including PowerShield. Contact us with the equipment you want to protect and how long you need it to run, and we will help you choose the right size.',
    },
  ],
};
