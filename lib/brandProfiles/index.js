// The deeper brand pages, by brand slug. A brand with a profile gets the
// longer page (platforms, analytics, range, how it fits together, what
// Teracom does). Avigilon, the pilot, uses SVG files for its drawings;
// every other profile describes its drawings for lib/brandArt to draw in
// the brand's own colour.
import aritech from './aritech.js';
import assaAbloy from './assa-abloy.js';
import avigilon from './avigilon.js';
import axis from './axis.js';
import beward from './beward.js';
import bosch from './bosch.js';
import ccure from './ccure.js';
import cisco from './cisco.js';
import dsc from './dsc.js';
import eagleEye from './eagle-eye.js';
import everki from './everki.js';
import fsh from './fsh.js';
import gallagher from './gallagher.js';
import genetec from './genetec.js';
import hanwhaVision from './hanwha-vision.js';
import hid from './hid.js';
import hikvision from './hikvision.js';
import honeywell from './honeywell.js';
import iPro from './i-pro.js';
import idis from './idis.js';
import innerRange from './inner-range.js';
import ion from './ion.js';
import kantech from './kantech.js';
import lockwood from './lockwood.js';
import milestone from './milestone.js';
import mobotix from './mobotix.js';
import nxWitness from './nx-witness.js';
import paradox from './paradox.js';
import pelco from './pelco.js';
import powershield from './powershield.js';
import reliance from './reliance.js';
import tecomChallenger from './tecom-challenger.js';
import teraudio from './teraudio.js';
import teravision from './teravision.js';
import trimec from './trimec.js';
import ubiquiti from './ubiquiti.js';
import uniview from './uniview.js';
import vivotek from './vivotek.js';
import wasabi from './wasabi.js';

const PROFILES = {
  aritech,
  'assa-abloy': assaAbloy,
  avigilon,
  axis,
  beward,
  bosch,
  ccure,
  cisco,
  dsc,
  'eagle-eye': eagleEye,
  everki,
  fsh,
  gallagher,
  genetec,
  'hanwha-vision': hanwhaVision,
  hid,
  hikvision,
  honeywell,
  'i-pro': iPro,
  idis,
  'inner-range': innerRange,
  ion,
  kantech,
  lockwood,
  milestone,
  mobotix,
  'nx-witness': nxWitness,
  paradox,
  pelco,
  powershield,
  reliance,
  'tecom-challenger': tecomChallenger,
  teraudio,
  teravision,
  trimec,
  ubiquiti,
  uniview,
  vivotek,
  wasabi,
};

export function findBrandProfile(slug) {
  return PROFILES[slug] || null;
}