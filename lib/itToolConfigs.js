// Field/result definitions for the PC, server and rack calculators, rendered
// by components/tools/ConfigCalculator.js. The maths is in lib/itCalculators.js.
import { fmt } from '@/lib/calcFormat';
import { RAID_CHOICES, pcPowerSupply, rackSizeHeat, recordingServer, virtualServer } from '@/lib/itCalculators';

export const itToolConfigs = {
  'pc-power-supply-calculator': {
    fields: [
      { id: 'cpuWatts', label: 'Processor power (TDP, W)', type: 'number', default: '125', step: '5', hint: "From the processor's datasheet. Use the boost or PL2 figure if it lists one." },
      { id: 'cpus', label: 'Number of processors', type: 'number', default: '1', step: '1' },
      { id: 'gpuWatts', label: 'Graphics card power (W, 0 for none)', type: 'number', default: '0', step: '10' },
      { id: 'gpus', label: 'Number of graphics cards', type: 'number', default: '1', step: '1' },
      { id: 'hdds', label: 'Hard drives', type: 'number', default: '2', step: '1' },
      { id: 'ssds', label: 'SSDs', type: 'number', default: '1', step: '1' },
      { id: 'ramSticks', label: 'Memory modules', type: 'number', default: '2', step: '1' },
      { id: 'fans', label: 'Case fans', type: 'number', default: '3', step: '1' },
      { id: 'boardWatts', label: 'Motherboard and other cards (W)', type: 'number', default: '50', step: '5' },
      { id: 'headroomPercent', label: 'Headroom (%)', type: 'number', default: '30', step: '5', hint: 'Keeps the supply in its efficient range and allows for upgrades.' },
    ],
    compute: (v) => pcPowerSupply(v),
    results: (r) => [
      { label: 'Estimated full load', value: `${fmt(r.loadWatts, 0)} W` },
      { label: 'Supply needed with headroom', value: `${fmt(r.neededWatts, 0)} W` },
      { label: 'Power supply to buy', value: r.psuWatts ? `${fmt(r.psuWatts, 0)} W` : 'More than 2,000 W: use redundant server supplies' },
      { label: 'Drawn from the wall at full load', value: `${fmt(r.wallWatts, 0)} W` },
      { label: 'UPS to protect it', value: `at least ${fmt(r.upsVa, 0)} VA` },
    ],
    note: 'Drives use about 8 W (hard drive) and 4 W (SSD), memory modules about 4 W and fans about 3 W. Processors can draw more than their TDP while boosting; graphics card makers state a recommended supply size, which wins if it is larger.',
  },

  'cctv-recording-server-calculator': {
    fields: [
      { id: 'cameras', label: 'Number of cameras', type: 'number', default: '32', step: '1' },
      { id: 'bitrateMbps', label: 'Recording bitrate per camera (Mbps)', type: 'number', default: '4', step: '0.5', hint: 'Use the CCTV Bitrate Calculator if you are not sure.' },
      { id: 'hoursPerDay', label: 'Recording hours per day', type: 'number', default: '24', step: '1' },
      { id: 'days', label: 'Days to keep', type: 'number', default: '30', step: '1' },
      { id: 'driveTb', label: 'Drive size (TB)', type: 'number', default: '8', step: '1' },
      { id: 'raid', label: 'Drive protection', type: 'select', default: 'raid5', options: RAID_CHOICES.map((r) => ({ value: r.id, label: r.label })) },
    ],
    compute: (v) => recordingServer(v),
    results: (r) => [
      { label: 'Recording traffic into the server', value: `${fmt(r.totalMbps, 0)} Mbps` },
      { label: 'Network connection', value: r.network },
      { label: 'Disk writes', value: `${fmt(r.writeMBps, 1)} MB/s` },
      { label: 'Storage needed', value: `${fmt(r.storageTb, 1)} TB` },
      { label: 'Drives', value: r.drives ? `${fmt(r.drives, 0)} x drive, ${r.raidLabel}` : 'Enter a drive size' },
      { label: 'Memory to start from', value: `${fmt(r.ramGb, 0)} GB` },
    ],
    note: "Storage adds 10% for the file system and indexes. Memory is a starting point (8 GB plus 1 GB for every 16 cameras); check the recording software maker's own sizing tool for the processor, and allow extra network capacity for people viewing live and playback.",
  },

  'virtual-server-calculator': {
    fields: [
      { id: 'vms', label: 'Number of virtual machines', type: 'number', default: '8', step: '1' },
      { id: 'vcpusPerVm', label: 'Virtual CPUs per machine', type: 'number', default: '2', step: '1' },
      { id: 'ramPerVmGb', label: 'Memory per machine (GB)', type: 'number', default: '8', step: '1' },
      { id: 'storagePerVmGb', label: 'Storage per machine (GB)', type: 'number', default: '100', step: '10' },
      { id: 'vcpuRatio', label: 'Virtual CPUs per physical core', type: 'number', default: '4', step: '1', hint: '4 is typical for office servers; use 1 or 2 for busy databases or recording servers.' },
      { id: 'hostRamGb', label: 'Memory for the host itself (GB)', type: 'number', default: '8', step: '1' },
      { id: 'headroomPercent', label: 'Room to grow (%)', type: 'number', default: '20', step: '5' },
    ],
    compute: (v) => virtualServer(v),
    results: (r) => [
      { label: 'Virtual CPUs in total', value: fmt(r.vcpus, 0) },
      { label: 'Physical processor cores', value: fmt(r.cores, 0) },
      { label: 'Memory needed', value: `${fmt(r.ramGb, 0)} GB` },
      { label: 'Memory to fit', value: r.ramFitted ? `${fmt(r.ramFitted, 0)} GB` : 'More than 2 TB: split across hosts' },
      { label: 'Storage', value: `${fmt(r.storageTb, 2)} TB` },
    ],
    note: 'Cores and memory include the room to grow. Leave out hyper-threads when counting physical cores. For high availability, size each host to carry the load of the others if one fails.',
  },

  'rack-size-heat-calculator': {
    fields: [
      { id: 'equipmentU', label: 'Equipment height (rack units)', type: 'number', default: '14', step: '1', hint: 'Add up the U of every server, switch, patch panel, recorder and UPS. 1U is 44.45 mm.' },
      { id: 'equipmentWatts', label: 'Total power of the equipment (W)', type: 'number', default: '1500', step: '50' },
      { id: 'sparePercent', label: 'Spare space (%)', type: 'number', default: '25', step: '5' },
      { id: 'volts', label: 'Supply voltage (V)', type: 'number', default: '230', step: '10' },
    ],
    compute: (v) => rackSizeHeat(v),
    results: (r) => [
      { label: 'Rack space with spare', value: `${fmt(r.neededU, 0)}U` },
      { label: 'Rack to buy', value: r.rackU ? `${fmt(r.rackU, 0)}U` : 'More than 48U: use two racks' },
      { label: 'Power', value: `${fmt(r.kw, 2)} kW (${fmt(r.amps, 1)} A)` },
      { label: 'Heat to remove', value: `${fmt(r.btuPerHour, 0)} BTU/h` },
      { label: 'UPS for the rack', value: `at least ${fmt(r.upsVa, 0)} VA` },
    ],
    note: 'Every watt the equipment uses becomes heat: 1 W is 3.412 BTU/h. The UPS figure assumes a 0.9 power factor with 25% headroom. A single 10 A outlet supplies about 2,300 W.',
  },
};
