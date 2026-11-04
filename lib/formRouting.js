// Where signed forms go (the backend's services/form_routing.py), in words for the console.
// A route is { '*': [destination...], '<form key>': [destination...] }: the list for all
// forms, and optionally a form's own list instead.

export const ALL_FORMS = '*';
export const DEFAULT_FOLDER = '{form}/{year}';

export const KIND_LABELS = {
  customer_email: 'Customer',
  email: 'Email',
  network_folder: 'Network folder',
  global_monitoring: 'Teracom AI Global Platform',
};

/** One place in a sentence, such as "Email robert@… " or "Network folder: Monitoring/{year}". */
export function describeDestination(dest, folderLocation = '') {
  if (!dest) return '';
  if (dest.kind === 'email') return `Email ${dest.to}`;
  if (dest.kind === 'network_folder') {
    const path = dest.path || DEFAULT_FOLDER;
    return `Network folder: ${folderLocation ? `${folderLocation}\\` : ''}${path.replace(/\//g, '\\')}`;
  }
  if (dest.kind === 'global_monitoring') return 'Create the monitoring site on the Teracom AI Global Platform';
  return dest.kind;
}

/** The places a form goes: its own list if it has one, otherwise the list for all forms. */
export function destinationsFor(routes, formKey) {
  if (!routes) return [];
  return Object.prototype.hasOwnProperty.call(routes, formKey) ? routes[formKey] : routes[ALL_FORMS] || [];
}

/** The kinds a form may use: the Global Platform only takes the 24/7 Monitoring sign-up. */
export function kindsFor(formKey, globalForm) {
  return ['email', 'network_folder', ...(formKey === globalForm ? ['global_monitoring'] : [])];
}

export function blankDestination(kind) {
  if (kind === 'email') return { kind, to: '' };
  if (kind === 'network_folder') return { kind, path: DEFAULT_FOLDER };
  return { kind };
}

/** What a folder path becomes for one form, as an example under the box. */
export function folderExample(path, formTitle, when = new Date()) {
  const year = String(when.getFullYear());
  const month = `${year}-${String(when.getMonth() + 1).padStart(2, '0')}`;
  return (path || DEFAULT_FOLDER).replaceAll('{form}', formTitle).replaceAll('{year}', year).replaceAll('{month}', month)
    .split(/[\\/]+/).filter(Boolean).join('\\');
}
