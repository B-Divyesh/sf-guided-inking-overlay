import './style.css';
import { ARTBOARD, clamp, distance, fanSegments, offsetPolyline, pointsToSvgPath, railOffsets, simplifyPoints, type Point } from './geometry';

type Tool = 'select' | 'fan' | 'spline';
type Spline = { id: string; points: Point[] };
type GuideState = {
  fan: { visible: boolean; origin: Point; density: number; rotation: number; spread: number };
  splines: Spline[];
  rails: { count: number; gap: number };
  style: { opacity: number; width: number };
};
type Scene = { id: string; name: string; updatedAt: string; state: GuideState };

const SLUG = 'guided-inking-overlay';
const STORAGE_KEY = 'ink-guides:scenes:v1';
const LICENSE_KEY = `sb_license:${SLUG}`;
const VERDICT_KEY = `sb_license_verdict:${SLUG}`;
const BILLING_BASE = import.meta.env.VITE_BILLING_API_BASE || 'https://api.sociobot.in';
const COLORS = { fan: '#f0645a', rail: '#38c6c4', point: '#f2b84b' } as const;

const defaultState = (): GuideState => ({
  fan: { visible: true, origin: { x: 940, y: 215 }, density: 9, rotation: 115, spread: 142 },
  splines: [],
  rails: { count: 5, gap: 24 },
  style: { opacity: 78, width: 2 },
});

let state = defaultState();
let tool: Tool = 'select';
let scenes: Scene[] = readScenes();
let selectedSpline: string | null = null;
let selectedPoint = -1;
let drawingPoints: Point[] = [];
let dragMode: 'fan' | 'point' | 'draw' | null = null;
let undoStack: GuideState[] = [];
let redoStack: GuideState[] = [];
let reference: { image: HTMLImageElement; url: string; name: string } | null = null;
let unlocked = false;

const icon = (name: 'mark' | 'cursor' | 'fan' | 'curve' | 'upload' | 'save' | 'export' | 'undo' | 'lock') => {
  const icons = {
    mark: '<path d="M4 20 12 4l8 16M7.3 14h9.4"/><path d="M5 7c5 4 9 4 14 0"/>',
    cursor: '<path d="m6 3 12 9-7 1-3 6z"/>',
    fan: '<path d="M20 5 4 4M20 5 5 11M20 5 8 19"/><circle cx="20" cy="5" r="2"/>',
    curve: '<path d="M3 17c5-12 12-12 18-4M3 21c6-12 12-12 18-4"/>',
    upload: '<path d="M12 16V4m0 0L7 9m5-5 5 5M4 15v5h16v-5"/>',
    save: '<path d="M5 3h12l3 3v15H4V3zM8 3v6h8V3M8 21v-7h8v7"/>',
    export: '<path d="M12 3v12m0 0 5-5m-5 5-5-5M4 15v6h16v-6"/>',
    undo: '<path d="m9 7-5 5 5 5M5 12h8a6 6 0 0 1 6 6"/>',
    lock: '<rect x="5" y="10" width="14" height="11" rx="2"/><path d="M8 10V7a4 4 0 0 1 8 0v3"/>',
  };
  return `<svg viewBox="0 0 24 24" aria-hidden="true">${icons[name]}</svg>`;
};

function legalPage(kind: 'privacy' | 'terms'): string {
  const privacy = kind === 'privacy';
  return `<header class="topbar"><a class="brand" href="/" data-route>${icon('mark')}<span>Ink Guides</span></a><a class="paper-link" href="/">Back to studio</a></header>
  <main id="main" class="legal paper-sheet">
    <p class="eyebrow">The small print, in plain ink</p>
    <h1>${privacy ? 'Privacy' : 'Terms'}</h1>
    <p class="lede">${privacy ? 'Your sketches stay at your desk.' : 'A compact, honest license for a compact artist tool.'}</p>
    ${privacy ? `<h2>What stays local</h2><p>Reference images are decoded only in your browser. They are never uploaded by Ink Guides and are not included in saved scenes or guide exports. Guide scenes, preferences, and an optional purchase license are stored in your browser’s local storage.</p>
      <h2>Network requests</h2><p>The app makes no analytics or advertising requests. When you enter or receive a license, it contacts the Sociobot billing API to verify that license, at most once per day. The billing service receives the token and standard connection data such as IP address. Checkout is hosted by Sociobot/Dodo, the merchant of record, under their own privacy terms.</p>
      <h2>Your control</h2><p>Delete scenes from the scene shelf. Use “Remove license from this device” in the unlock panel to clear purchase data. Clearing site data removes all Ink Guides local data.</p>` : `<h2>Using the app</h2><p>You may use Ink Guides and its exported geometry for personal or commercial artwork. Do not misuse the service, interfere with its operation, or claim the app itself as your own.</p>
      <h2>Free and Studio unlock</h2><p>The free workspace includes guide creation and SVG/PNG export. The optional Studio unlock is a one-time purchase that adds up to 20 saved scenes and 2× PNG export. Sociobot/Dodo is the merchant of record and handles checkout and refunds. A refund revokes the associated license.</p>
      <h2>Warranty</h2><p>The software is provided “as is,” without warranty. You remain responsible for saving your work and checking exports before relying on them. Nothing here limits rights that cannot legally be limited.</p>`}
    <p class="legal-date">Effective 27 August 2026 · <a href="mailto:hello@sociobot.in">hello@sociobot.in</a></p>
  </main>${footer()}`;
}

function footer(): string {
  return `<footer><p>Artwork stays local. <span aria-hidden="true">✦</span> Original generated paper-diorama imagery.</p><nav aria-label="Legal"><a href="/privacy" data-route>Privacy</a><a href="/terms" data-route>Terms</a><a href="https://github.com/B-Divyesh/sf-guided-inking-overlay" rel="noreferrer">Source</a></nav></footer>`;
}

function studioPage(): string {
  return `<header class="topbar">
    <a class="brand" href="/" aria-label="Ink Guides home">${icon('mark')}<span>Ink Guides</span></a>
    <div class="top-actions"><span class="connection" id="connection"><span></span> Works offline</span><button class="quiet-button" id="open-help">How it works</button><button class="unlock-button" id="open-license">${icon('lock')}<span id="unlock-label">Unlock Studio</span></button></div>
  </header>
  <main id="main" class="studio">
    <section class="intro" aria-labelledby="page-title">
      <div><p class="eyebrow">A portable drafting instrument</p><h1 id="page-title">Lay down the line.<br><em>Keep the flow.</em></h1></div>
      <p>Build rotated perspective fans and repeatable curved rails over any reference—then take clean guide layers back to your art app.</p>
    </section>
    <section class="workbench" aria-label="Guide editor">
      <aside class="controls paper-panel" aria-label="Guide controls">
        <div class="panel-heading"><div><p class="step">01 / shape</p><h2>Guide bench</h2></div><button id="reset" class="icon-button" title="Reset guides" aria-label="Reset guides">↺</button></div>
        <fieldset><legend>Tool</legend><div class="tool-row" role="group" aria-label="Canvas tool">
          <button class="tool active" data-tool="select" aria-pressed="true">${icon('cursor')} Select <kbd>V</kbd></button>
          <button class="tool" data-tool="fan" aria-pressed="false">${icon('fan')} Aim fan <kbd>F</kbd></button>
          <button class="tool" data-tool="spline" aria-pressed="false">${icon('curve')} Draw spline <kbd>S</kbd></button>
        </div></fieldset>
        <fieldset><legend><span>Perspective fan</span><label class="switch"><input id="fan-visible" type="checkbox" checked><span>Show</span></label></legend>
          ${rangeControl('density', 'Lines', 3, 25, 1, 9)}
          ${rangeControl('rotation', 'Rotation', -180, 180, 1, 115, '°')}
          ${rangeControl('spread', 'Fan spread', 30, 180, 1, 142, '°')}
        </fieldset>
        <fieldset><legend>Parallel spline rails</legend>
          ${rangeControl('rail-count', 'Rails', 1, 11, 2, 5)}
          ${rangeControl('rail-gap', 'Spacing', 6, 64, 1, 24, ' px')}
          <button id="delete-spline" class="secondary full" disabled>Delete selected spline</button>
        </fieldset>
        <fieldset><legend>Ink</legend>
          ${rangeControl('guide-opacity', 'Opacity', 20, 100, 1, 78, '%')}
          ${rangeControl('guide-width', 'Weight', 1, 6, 0.5, 2, ' px')}
        </fieldset>
        <div class="history-row"><button id="undo" class="secondary" disabled>${icon('undo')} Undo</button><button id="redo" class="secondary" disabled>Redo</button></div>
      </aside>
      <div class="drawing-area">
        <div class="canvas-bar">
          <div class="canvas-title"><span class="paper-dot"></span><span><strong>Untitled guide</strong><small id="canvas-summary">9 fan lines · no spline yet</small></span></div>
          <div class="canvas-actions"><label class="file-button">${icon('upload')}<span>Reference</span><input id="reference-file" type="file" aria-label="Choose reference image" accept="image/png,image/jpeg,image/webp,image/gif" /></label><button class="secondary" id="clear-reference" hidden>Remove image</button></div>
        </div>
        <div class="canvas-shell" id="canvas-shell">
          <canvas id="guide-canvas" width="1200" height="800" tabindex="0" aria-label="Guide canvas. Drag the coral vanishing point or draw a spline. Arrow keys move a selected point."></canvas>
          <div class="canvas-welcome" id="canvas-welcome">
            <img src="/assets/hero-paper-diorama.webp" width="960" height="640" alt="Paper-cut drafting desk with coral perspective threads and cyan curved rails" fetchpriority="high" decoding="async" />
            <div><p class="eyebrow">Start on tracing paper</p><h2>Bring a sketch, or start clear.</h2><p>Your reference never leaves this browser.</p><div><button id="welcome-reference" class="primary">Choose reference</button><button id="welcome-clear" class="secondary">Start transparent</button></div></div>
          </div>
          <p class="canvas-hint" id="canvas-hint">Drag the coral pin to aim · press S to draw a curve</p>
        </div>
        <div class="reference-control" id="reference-control" hidden>${rangeControl('reference-opacity', 'Reference opacity', 10, 100, 1, 55, '%')}</div>
      </div>
    </section>
    <section class="lower-bench">
      <div class="scene-section paper-panel"><div class="section-title"><div><p class="step">02 / reuse</p><h2>Scene shelf</h2><p>Save geometry locally. References are never stored.</p></div><span class="scene-count" id="scene-count">${scenes.length} / 3</span></div>
        <div class="save-row"><label for="scene-name">Scene name</label><div><input id="scene-name" type="text" maxlength="42" autocomplete="off" placeholder="Alley, low angle…"><button id="save-scene" class="primary">${icon('save')} Save scene</button></div></div>
        <div class="scene-list" id="scene-list"></div>
      </div>
      <div class="export-section paper-panel"><div class="section-title"><div><p class="step">03 / carry</p><h2>Clean guide layer</h2><p>Exports contain guide geometry only—never your reference.</p></div>${icon('export')}</div>
        <div class="export-options"><button id="export-svg" class="primary big">Export SVG <small>Vector · free</small></button><button id="export-png" class="secondary big">Export PNG <small id="png-label">1200 × 800 · free</small></button></div>
        <p class="export-note"><span aria-hidden="true">✓</span> Transparent background · artwork-safe</p>
      </div>
    </section>
    <section class="studio-offer" aria-labelledby="studio-title"><div><p class="eyebrow">One tool, not another subscription</p><h2 id="studio-title">Keep the bigger scene shelf.</h2><p>Ink Guides Studio adds 20 local scenes and crisp 2× PNGs. Core drawing and vector export stay free.</p></div><div class="price"><strong>$9</strong><span>one time</span><button class="primary" id="offer-unlock">Unlock Studio</button></div></section>
  </main>
  ${footer()}
  <div class="toast" id="toast" role="status" aria-live="polite"></div>
  <dialog id="help-dialog"><form method="dialog"><button class="dialog-close" aria-label="Close help">×</button><p class="eyebrow">Three gestures</p><h2>Ink without fighting the ruler.</h2><ol><li><strong>Aim.</strong> Choose Aim fan and drag the coral pin. Tune density, rotation, and spread.</li><li><strong>Flow.</strong> Choose Draw spline, then draw one curve with mouse, pen, or touch. Ink Guides repeats it in parallel.</li><li><strong>Carry.</strong> Save the scene locally, or export transparent SVG/PNG geometry to your art app.</li></ol><p class="key-help">Keyboard: V select · F fan · S spline · arrow keys nudge · Shift + arrows move 10px · Delete removes a selected spline.</p></form></dialog>
  <dialog id="license-dialog"><form method="dialog"><button class="dialog-close" aria-label="Close unlock panel">×</button><p class="eyebrow">Ink Guides Studio</p><h2>More room, once.</h2><p class="license-copy">$9 one-time purchase. Unlock 20 saved scenes and 2× PNG export on this device. SVG export and accessibility remain free.</p><a class="primary buy-link" href="${BILLING_BASE}/api/v1/products/${SLUG}/checkout">Buy securely — $9</a><p class="merchant">Checkout and refunds are handled by Sociobot/Dodo, merchant of record.</p><hr><label for="license-token">Have a license? Paste it here</label><input id="license-token" type="text" autocomplete="off" spellcheck="false"><button value="cancel" type="button" class="secondary full" id="restore-license">Verify & restore purchase</button><button value="cancel" type="button" class="text-button" id="remove-license" hidden>Remove license from this device</button><p id="license-status" class="form-status" role="status"></p><p class="legal-links"><a href="/privacy" data-route>Privacy</a> · <a href="/terms" data-route>Terms</a></p></form></dialog>`;
}

function rangeControl(id: string, label: string, min: number, max: number, step: number, value: number, suffix = ''): string {
  return `<div class="range-control"><div><label for="${id}">${label}</label><output id="${id}-out" for="${id}">${value}${suffix}</output></div><input id="${id}" type="range" min="${min}" max="${max}" step="${step}" value="${value}"></div>`;
}

const app = document.querySelector<HTMLDivElement>('#app')!;

function mount(): void {
  const route = location.pathname.replace(/\/$/, '') || '/';
  if (route === '/privacy' || route === '/terms') {
    document.title = `${route === '/privacy' ? 'Privacy' : 'Terms'} — Ink Guides`;
    app.innerHTML = legalPage(route.slice(1) as 'privacy' | 'terms');
    bindRoutes();
    return;
  }
  document.title = 'Ink Guides — perspective fans & spline rails';
  app.innerHTML = studioPage();
  bindRoutes();
  bindStudio();
  void initializeLicense();
}

function bindRoutes(): void {
  document.querySelectorAll<HTMLAnchorElement>('[data-route]').forEach((link) => link.addEventListener('click', (event) => {
    if (link.origin !== location.origin) return;
    event.preventDefault();
    history.pushState({}, '', link.pathname);
    mount();
    scrollTo(0, 0);
  }));
}

window.addEventListener('popstate', mount);

function cloneState(value: GuideState): GuideState {
  return structuredClone(value);
}

function readScenes(): Scene[] {
  try {
    const stored = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]') as Scene[];
    return Array.isArray(stored) ? stored.filter((scene) => scene?.state?.fan && Array.isArray(scene.state.splines)) : [];
  } catch {
    return [];
  }
}

function persistScenes(): boolean {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(scenes));
    return true;
  } catch {
    notify('Scenes could not be saved. Your browser storage may be full.');
    return false;
  }
}

function pushUndo(): void {
  undoStack.push(cloneState(state));
  if (undoStack.length > 40) undoStack.shift();
  redoStack = [];
  updateHistoryButtons();
}

function bindStudio(): void {
  document.querySelectorAll<HTMLButtonElement>('.tool[data-tool]').forEach((button) => button.addEventListener('click', () => setTool(button.dataset.tool as Tool)));
  bindRange('density', () => state.fan.density, (value) => state.fan.density = value);
  bindRange('rotation', () => state.fan.rotation, (value) => state.fan.rotation = value, '°');
  bindRange('spread', () => state.fan.spread, (value) => state.fan.spread = value, '°');
  bindRange('rail-count', () => state.rails.count, (value) => state.rails.count = value);
  bindRange('rail-gap', () => state.rails.gap, (value) => state.rails.gap = value, ' px');
  bindRange('guide-opacity', () => state.style.opacity, (value) => state.style.opacity = value, '%');
  bindRange('guide-width', () => state.style.width, (value) => state.style.width = value, ' px');
  bindRange('reference-opacity', () => Number(byId<HTMLInputElement>('reference-opacity').value), () => renderCanvas(), '%');
  const fanVisible = byId<HTMLInputElement>('fan-visible');
  fanVisible.addEventListener('change', () => { pushUndo(); state.fan.visible = fanVisible.checked; refresh(); });
  const canvas = byId<HTMLCanvasElement>('guide-canvas');
  canvas.addEventListener('pointerdown', pointerDown);
  canvas.addEventListener('pointermove', pointerMove);
  canvas.addEventListener('pointerup', pointerUp);
  canvas.addEventListener('pointercancel', pointerUp);
  canvas.addEventListener('keydown', canvasKeydown);
  byId('delete-spline').addEventListener('click', deleteSelectedSpline);
  byId('undo').addEventListener('click', undo);
  byId('redo').addEventListener('click', redo);
  byId('reset').addEventListener('click', resetGuides);
  byId('save-scene').addEventListener('click', saveScene);
  byId('export-svg').addEventListener('click', exportSvg);
  byId('export-png').addEventListener('click', exportPng);
  byId<HTMLInputElement>('reference-file').addEventListener('change', importReference);
  byId('welcome-reference').addEventListener('click', () => byId<HTMLInputElement>('reference-file').click());
  byId('welcome-clear').addEventListener('click', dismissWelcome);
  byId('clear-reference').addEventListener('click', clearReference);
  byId('open-help').addEventListener('click', () => byId<HTMLDialogElement>('help-dialog').showModal());
  byId('open-license').addEventListener('click', openLicense);
  byId('offer-unlock').addEventListener('click', openLicense);
  byId('restore-license').addEventListener('click', restoreLicense);
  byId('remove-license').addEventListener('click', removeLicense);
  document.removeEventListener('keydown', globalKeydown);
  document.addEventListener('keydown', globalKeydown);
  window.removeEventListener('online', updateConnection);
  window.removeEventListener('offline', updateConnection);
  window.addEventListener('online', updateConnection);
  window.addEventListener('offline', updateConnection);
  updateConnection();
  renderScenes();
  refreshControls();
  refresh();
}

function byId<T extends HTMLElement = HTMLElement>(id: string): T {
  return document.getElementById(id) as T;
}

function bindRange(id: string, read: () => number, write: (value: number) => void, suffix = ''): void {
  const input = byId<HTMLInputElement>(id);
  let began = false;
  input.addEventListener('pointerdown', () => { pushUndo(); began = true; });
  input.addEventListener('keydown', (event) => {
    if (!began && ['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown', 'Home', 'End', 'PageUp', 'PageDown'].includes(event.key)) { pushUndo(); began = true; }
  });
  input.addEventListener('blur', () => began = false);
  input.addEventListener('input', () => {
    write(Number(input.value));
    byId<HTMLOutputElement>(`${id}-out`).value = `${read()}${suffix}`;
    refresh();
  });
}

function refresh(): void {
  renderCanvas();
  byId('canvas-summary').textContent = `${state.fan.visible ? `${state.fan.density} fan lines` : 'fan hidden'} · ${state.splines.length ? `${state.splines.length} spline${state.splines.length === 1 ? '' : 's'}` : 'no spline yet'}`;
  const del = byId<HTMLButtonElement>('delete-spline');
  del.disabled = !selectedSpline;
}

function refreshControls(): void {
  const values: Record<string, number> = { density: state.fan.density, rotation: state.fan.rotation, spread: state.fan.spread, 'rail-count': state.rails.count, 'rail-gap': state.rails.gap, 'guide-opacity': state.style.opacity, 'guide-width': state.style.width };
  const suffixes: Record<string, string> = { rotation: '°', spread: '°', 'rail-gap': ' px', 'guide-opacity': '%', 'guide-width': ' px' };
  Object.entries(values).forEach(([id, value]) => {
    byId<HTMLInputElement>(id).value = String(value);
    byId<HTMLOutputElement>(`${id}-out`).value = `${value}${suffixes[id] || ''}`;
  });
  byId<HTMLInputElement>('fan-visible').checked = state.fan.visible;
}

function setTool(next: Tool): void {
  tool = next;
  document.querySelectorAll<HTMLButtonElement>('.tool[data-tool]').forEach((button) => {
    const active = button.dataset.tool === next;
    button.classList.toggle('active', active);
    button.setAttribute('aria-pressed', String(active));
  });
  byId('canvas-shell').dataset.tool = next;
  byId('canvas-hint').textContent = next === 'spline' ? 'Draw one flowing curve · lift to create parallel rails' : next === 'fan' ? 'Drag anywhere to place the coral vanishing point' : 'Select the coral pin or a yellow spline knot';
}

function canvasPoint(event: PointerEvent): Point {
  const rect = byId<HTMLCanvasElement>('guide-canvas').getBoundingClientRect();
  return { x: clamp((event.clientX - rect.left) / rect.width * ARTBOARD.width, 0, ARTBOARD.width), y: clamp((event.clientY - rect.top) / rect.height * ARTBOARD.height, 0, ARTBOARD.height) };
}

function pointerDown(event: PointerEvent): void {
  if (event.pointerType === 'mouse' && event.button !== 0) return;
  const canvas = byId<HTMLCanvasElement>('guide-canvas');
  canvas.setPointerCapture(event.pointerId);
  canvas.focus({ preventScroll: true });
  const point = canvasPoint(event);
  if (tool === 'spline') {
    pushUndo(); drawingPoints = [point]; dragMode = 'draw'; selectedSpline = null; selectedPoint = -1;
  } else if (tool === 'fan' || distance(point, state.fan.origin) < 38) {
    pushUndo(); state.fan.origin = point; dragMode = 'fan';
  } else {
    const hit = findSplinePoint(point);
    if (hit) { pushUndo(); selectedSpline = hit.id; selectedPoint = hit.index; dragMode = 'point'; }
    else { selectedSpline = null; selectedPoint = -1; }
  }
  refresh();
}

function pointerMove(event: PointerEvent): void {
  if (!dragMode) return;
  const point = canvasPoint(event);
  if (dragMode === 'fan') state.fan.origin = point;
  if (dragMode === 'draw' && distance(drawingPoints.at(-1)!, point) > 3) drawingPoints.push(point);
  if (dragMode === 'point' && selectedSpline) {
    const spline = state.splines.find((item) => item.id === selectedSpline);
    if (spline?.points[selectedPoint]) spline.points[selectedPoint] = point;
  }
  renderCanvas();
}

function pointerUp(): void {
  if (dragMode === 'draw') {
    const points = simplifyPoints(drawingPoints, 12);
    if (points.length > 2 && distance(points[0]!, points.at(-1)!) > 10) {
      const spline: Spline = { id: crypto.randomUUID(), points };
      state.splines.push(spline); selectedSpline = spline.id; selectedPoint = -1;
      notify('Spline rails added.');
    } else undoStack.pop();
    drawingPoints = [];
  }
  dragMode = null;
  updateHistoryButtons();
  refresh();
}

function findSplinePoint(point: Point): { id: string; index: number } | null {
  for (const spline of state.splines) {
    for (let index = 0; index < spline.points.length; index += 1) {
      if (distance(point, spline.points[index]!) < 24) return { id: spline.id, index };
    }
  }
  return null;
}

function canvasKeydown(event: KeyboardEvent): void {
  if (!['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown'].includes(event.key)) return;
  event.preventDefault();
  const amount = event.shiftKey ? 10 : 1;
  const delta = { x: event.key === 'ArrowLeft' ? -amount : event.key === 'ArrowRight' ? amount : 0, y: event.key === 'ArrowUp' ? -amount : event.key === 'ArrowDown' ? amount : 0 };
  pushUndo();
  if (selectedSpline && selectedPoint >= 0) {
    const point = state.splines.find((item) => item.id === selectedSpline)?.points[selectedPoint];
    if (point) { point.x = clamp(point.x + delta.x, 0, ARTBOARD.width); point.y = clamp(point.y + delta.y, 0, ARTBOARD.height); }
  } else {
    state.fan.origin.x = clamp(state.fan.origin.x + delta.x, 0, ARTBOARD.width);
    state.fan.origin.y = clamp(state.fan.origin.y + delta.y, 0, ARTBOARD.height);
  }
  refresh();
}

function globalKeydown(event: KeyboardEvent): void {
  if (location.pathname !== '/' || (event.target as HTMLElement).matches('input, textarea, select')) return;
  if (event.key.toLowerCase() === 'v') setTool('select');
  if (event.key.toLowerCase() === 'f') setTool('fan');
  if (event.key.toLowerCase() === 's' && !(event.metaKey || event.ctrlKey)) setTool('spline');
  if (event.key === 'Delete' || event.key === 'Backspace') deleteSelectedSpline();
  if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'z') event.shiftKey ? redo() : undo();
}

function deleteSelectedSpline(): void {
  if (!selectedSpline) return;
  pushUndo();
  state.splines = state.splines.filter((item) => item.id !== selectedSpline);
  selectedSpline = null; selectedPoint = -1;
  notify('Spline removed. Undo is available.');
  refresh();
}

function undo(): void {
  const previous = undoStack.pop();
  if (!previous) return;
  redoStack.push(cloneState(state)); state = previous; selectedSpline = null; refreshControls(); refresh(); updateHistoryButtons();
}

function redo(): void {
  const next = redoStack.pop();
  if (!next) return;
  undoStack.push(cloneState(state)); state = next; selectedSpline = null; refreshControls(); refresh(); updateHistoryButtons();
}

function updateHistoryButtons(): void {
  const undoButton = document.getElementById('undo') as HTMLButtonElement | null;
  const redoButton = document.getElementById('redo') as HTMLButtonElement | null;
  if (undoButton) undoButton.disabled = undoStack.length === 0;
  if (redoButton) redoButton.disabled = redoStack.length === 0;
}

function resetGuides(): void {
  if (!confirm('Reset all fan and spline geometry? Your saved scenes will stay on the shelf.')) return;
  pushUndo(); state = defaultState(); selectedSpline = null; selectedPoint = -1; refreshControls(); refresh(); notify('Guide geometry reset.');
}

function renderCanvas(target?: HTMLCanvasElement, scale = 1, includeReference = true): void {
  const canvas = target || document.getElementById('guide-canvas') as HTMLCanvasElement | null;
  if (!canvas) return;
  const context = canvas.getContext('2d');
  if (!context) return;
  context.clearRect(0, 0, canvas.width, canvas.height);
  context.save();
  context.scale(scale, scale);
  if (includeReference && reference) drawReference(context, reference.image, Number(byId<HTMLInputElement>('reference-opacity')?.value || 55) / 100);
  context.globalAlpha = state.style.opacity / 100;
  context.lineWidth = state.style.width;
  context.lineCap = 'round'; context.lineJoin = 'round';
  if (state.fan.visible) {
    context.strokeStyle = COLORS.fan;
    fanSegments(state.fan.origin, state.fan.density, state.fan.rotation, state.fan.spread).forEach((segment) => { context.beginPath(); context.moveTo(segment.a.x, segment.a.y); context.lineTo(segment.b.x, segment.b.y); context.stroke(); });
  }
  context.strokeStyle = COLORS.rail;
  [...state.splines, ...(drawingPoints.length > 1 ? [{ id: 'drawing', points: drawingPoints }] : [])].forEach((spline) => {
    railOffsets(state.rails.count, state.rails.gap).forEach((offset) => drawSmoothPath(context, offsetPolyline(spline.points, offset)));
  });
  context.globalAlpha = 1;
  if (!target) {
    if (state.fan.visible) drawPin(context, state.fan.origin, COLORS.fan, tool === 'fan' || dragMode === 'fan');
    const spline = state.splines.find((item) => item.id === selectedSpline);
    if (spline) spline.points.forEach((point, index) => drawPin(context, point, COLORS.point, index === selectedPoint, 7));
  }
  context.restore();
}

function drawReference(context: CanvasRenderingContext2D, image: HTMLImageElement, opacity: number): void {
  const ratio = Math.min(ARTBOARD.width / image.naturalWidth, ARTBOARD.height / image.naturalHeight);
  const width = image.naturalWidth * ratio; const height = image.naturalHeight * ratio;
  context.save(); context.globalAlpha = opacity; context.drawImage(image, (ARTBOARD.width - width) / 2, (ARTBOARD.height - height) / 2, width, height); context.restore();
}

function drawSmoothPath(context: CanvasRenderingContext2D, points: Point[]): void {
  if (points.length < 2) return;
  context.beginPath(); context.moveTo(points[0]!.x, points[0]!.y);
  for (let index = 1; index < points.length - 1; index += 1) {
    const point = points[index]!; const next = points[index + 1]!;
    context.quadraticCurveTo(point.x, point.y, (point.x + next.x) / 2, (point.y + next.y) / 2);
  }
  const last = points.at(-1)!; context.lineTo(last.x, last.y); context.stroke();
}

function drawPin(context: CanvasRenderingContext2D, point: Point, color: string, active: boolean, radius = 12): void {
  context.save(); context.fillStyle = color; context.strokeStyle = '#172033'; context.lineWidth = active ? 4 : 2; context.beginPath(); context.arc(point.x, point.y, active ? radius + 3 : radius, 0, Math.PI * 2); context.fill(); context.stroke(); context.restore();
}

function dismissWelcome(): void {
  byId('canvas-welcome').classList.add('dismissed');
  setTimeout(() => byId('canvas-welcome').setAttribute('hidden', ''), 220);
  byId<HTMLCanvasElement>('guide-canvas').focus();
}

function importReference(event: Event): void {
  const input = event.target as HTMLInputElement; const file = input.files?.[0]; if (!file) return;
  if (!file.type.startsWith('image/')) { notify('Choose a PNG, JPEG, WebP, or GIF image.'); return; }
  if (file.size > 25 * 1024 * 1024) { notify('That image is over 25 MB. Please choose a smaller reference.'); input.value = ''; return; }
  const url = URL.createObjectURL(file); const image = new Image();
  image.onload = () => {
    if (reference) URL.revokeObjectURL(reference.url);
    reference = { image, url, name: file.name }; dismissWelcome(); byId('reference-control').hidden = false; byId('clear-reference').hidden = false; renderCanvas(); notify(`${file.name} loaded locally.`);
  };
  image.onerror = () => { URL.revokeObjectURL(url); notify('That image could not be decoded. Try exporting it as PNG or JPEG.'); };
  image.src = url; input.value = '';
}

function clearReference(): void {
  if (reference) URL.revokeObjectURL(reference.url); reference = null; byId('reference-control').hidden = true; byId('clear-reference').hidden = true; renderCanvas(); notify('Reference removed.');
}

function saveScene(): void {
  const input = byId<HTMLInputElement>('scene-name'); const name = input.value.trim();
  if (!name) { input.setCustomValidity('Name this scene so you can find it later.'); input.reportValidity(); input.addEventListener('input', () => input.setCustomValidity(''), { once: true }); return; }
  const limit = unlocked ? 20 : 3;
  if (scenes.length >= limit) { notify(unlocked ? 'Your 20-scene shelf is full. Delete one before saving.' : 'The free shelf holds 3 scenes. Unlock Studio for 20.'); if (!unlocked) openLicense(); return; }
  scenes.unshift({ id: crypto.randomUUID(), name, updatedAt: new Date().toISOString(), state: cloneState(state) });
  if (!persistScenes()) { scenes.shift(); return; }
  input.value = ''; renderScenes(); notify(`“${name}” saved on this device.`);
}

function renderScenes(): void {
  const list = document.getElementById('scene-list'); if (!list) return;
  byId('scene-count').textContent = `${scenes.length} / ${unlocked ? 20 : 3}`;
  if (!scenes.length) { list.innerHTML = `<div class="empty-scene"><span aria-hidden="true">◇</span><div><strong>Your shelf is empty.</strong><p>Name this setup to reuse it in one tap.</p></div></div>`; return; }
  list.innerHTML = scenes.map((scene) => `<article class="scene-card"><button class="scene-load" data-load="${scene.id}"><span class="scene-mini" aria-hidden="true">${miniature(scene.state)}</span><span><strong>${escapeHtml(scene.name)}</strong><small>${scene.state.fan.density} lines · ${scene.state.splines.length} spline${scene.state.splines.length === 1 ? '' : 's'} · ${formatDate(scene.updatedAt)}</small></span></button><button class="scene-delete" data-delete="${scene.id}" aria-label="Delete ${escapeHtml(scene.name)}">×</button></article>`).join('');
  list.querySelectorAll<HTMLButtonElement>('[data-load]').forEach((button) => button.addEventListener('click', () => loadScene(button.dataset.load!)));
  list.querySelectorAll<HTMLButtonElement>('[data-delete]').forEach((button) => button.addEventListener('click', () => deleteScene(button.dataset.delete!)));
}

function miniature(scene: GuideState): string {
  const lines = fanSegments({ x: scene.fan.origin.x / 15, y: scene.fan.origin.y / 15 }, Math.min(scene.fan.density, 7), scene.fan.rotation, scene.fan.spread)
    .map((segment) => `<line x1="${segment.a.x / 5}" y1="${segment.a.y / 5}" x2="${segment.b.x / 5}" y2="${segment.b.y / 5}"/>`).join('');
  return `<svg viewBox="0 0 80 54" preserveAspectRatio="none">${lines}<path d="M4 43 Q27 18 72 35"/></svg>`;
}

function loadScene(id: string): void {
  const scene = scenes.find((item) => item.id === id); if (!scene) return;
  pushUndo(); state = cloneState(scene.state); selectedSpline = null; refreshControls(); refresh(); dismissWelcome(); notify(`“${scene.name}” loaded.`);
}

function deleteScene(id: string): void {
  const scene = scenes.find((item) => item.id === id); if (!scene || !confirm(`Delete “${scene.name}” from this device?`)) return;
  scenes = scenes.filter((item) => item.id !== id); persistScenes(); renderScenes(); notify(`“${scene.name}” deleted.`);
}

function formatDate(date: string): string {
  return new Intl.DateTimeFormat(undefined, { month: 'short', day: 'numeric' }).format(new Date(date));
}

function escapeHtml(value: string): string {
  return value.replace(/[&<>'"]/g, (character) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' })[character]!);
}

function guideSvg(): string {
  const opacity = state.style.opacity / 100;
  const fan = state.fan.visible ? fanSegments(state.fan.origin, state.fan.density, state.fan.rotation, state.fan.spread).map((segment) => `<line x1="${segment.a.x.toFixed(1)}" y1="${segment.a.y.toFixed(1)}" x2="${segment.b.x.toFixed(1)}" y2="${segment.b.y.toFixed(1)}"/>`).join('') : '';
  const rails = state.splines.flatMap((spline) => railOffsets(state.rails.count, state.rails.gap).map((offset) => `<path d="${pointsToSvgPath(offsetPolyline(spline.points, offset))}"/>`)).join('');
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${ARTBOARD.width}" height="${ARTBOARD.height}" viewBox="0 0 ${ARTBOARD.width} ${ARTBOARD.height}"><title>Ink Guides layer</title><g fill="none" stroke="${COLORS.fan}" stroke-width="${state.style.width}" stroke-linecap="round" opacity="${opacity}">${fan}</g><g fill="none" stroke="${COLORS.rail}" stroke-width="${state.style.width}" stroke-linecap="round" stroke-linejoin="round" opacity="${opacity}">${rails}</g></svg>`;
}

function exportSvg(): void {
  download(new Blob([guideSvg()], { type: 'image/svg+xml' }), 'ink-guides-layer.svg'); notify('SVG guide layer exported—reference excluded.');
}

function exportPng(): void {
  const scale = unlocked ? 2 : 1; const canvas = document.createElement('canvas'); canvas.width = ARTBOARD.width * scale; canvas.height = ARTBOARD.height * scale;
  renderCanvas(canvas, scale, false);
  canvas.toBlob((blob) => { if (blob) { download(blob, `ink-guides-layer${scale > 1 ? '@2x' : ''}.png`); notify('Transparent PNG exported—reference excluded.'); } else notify('PNG export failed in this browser. Try SVG instead.'); }, 'image/png');
}

function download(blob: Blob, filename: string): void {
  const url = URL.createObjectURL(blob); const anchor = document.createElement('a'); anchor.href = url; anchor.download = filename; anchor.click(); setTimeout(() => URL.revokeObjectURL(url), 1000);
}

function notify(message: string): void {
  const toast = document.getElementById('toast'); if (!toast) return;
  toast.textContent = message; toast.classList.add('visible'); clearTimeout(Number(toast.dataset.timer)); toast.dataset.timer = String(setTimeout(() => toast.classList.remove('visible'), 3600));
}

function updateConnection(): void {
  const element = document.getElementById('connection'); if (!element) return;
  element.innerHTML = `<span></span>${navigator.onLine ? ' Works offline' : ' Offline · edits still work'}`; element.classList.toggle('offline', !navigator.onLine);
}

function openLicense(): void { byId<HTMLDialogElement>('license-dialog').showModal(); }

async function initializeLicense(): Promise<void> {
  const params = new URLSearchParams(location.search); const returned = params.get('license');
  if (returned) { localStorage.setItem(LICENSE_KEY, returned); params.delete('license'); history.replaceState({}, '', `${location.pathname}${params.size ? `?${params}` : ''}${location.hash}`); }
  const token = returned || localStorage.getItem(LICENSE_KEY); if (!token) { applyUnlock(false); return; }
  let cached: { valid: boolean; checkedAt: number } | null = null;
  try { cached = JSON.parse(localStorage.getItem(VERDICT_KEY) || 'null'); } catch { /* ignore corrupt cache */ }
  applyUnlock(cached?.valid !== false);
  if (!cached || Date.now() - cached.checkedAt > 86_400_000 || returned) await verifyLicense(token, false);
}

async function restoreLicense(): Promise<void> {
  const input = byId<HTMLInputElement>('license-token'); const token = input.value.trim();
  if (!token) { input.setCustomValidity('Paste the license token from your receipt.'); input.reportValidity(); input.addEventListener('input', () => input.setCustomValidity(''), { once: true }); return; }
  localStorage.setItem(LICENSE_KEY, token); byId('license-status').textContent = 'Checking your license…'; await verifyLicense(token, true);
}

async function verifyLicense(token: string, announce: boolean): Promise<void> {
  try {
    const response = await fetch(`${BILLING_BASE}/api/v1/products/${SLUG}/verify?license=${encodeURIComponent(token)}`, { headers: { Accept: 'application/json' } });
    if (!response.ok) throw new Error('service');
    const verdict = await response.json() as { valid: boolean; reason?: string };
    localStorage.setItem(VERDICT_KEY, JSON.stringify({ valid: verdict.valid, checkedAt: Date.now() })); applyUnlock(verdict.valid);
    const status = document.getElementById('license-status');
    if (status) status.textContent = verdict.valid ? 'Studio is unlocked on this device.' : 'This license is no longer active. Check the token or buy a new license.';
    if (announce) notify(verdict.valid ? 'Studio unlocked. Thank you.' : 'That license could not be verified.');
  } catch {
    const status = document.getElementById('license-status'); if (status) status.textContent = 'Could not reach the license service. Your free workspace still works; try again when online.';
    if (announce) notify('License check is offline. Please try again when connected.');
  }
}

function applyUnlock(value: boolean): void {
  unlocked = value;
  const label = document.getElementById('unlock-label'); if (label) label.textContent = value ? 'Studio unlocked' : 'Unlock Studio';
  const png = document.getElementById('png-label'); if (png) png.textContent = value ? '2400 × 1600 · Studio' : '1200 × 800 · free';
  const remove = document.getElementById('remove-license'); if (remove) remove.hidden = !localStorage.getItem(LICENSE_KEY);
  renderScenes();
}

function removeLicense(): void {
  localStorage.removeItem(LICENSE_KEY); localStorage.removeItem(VERDICT_KEY); applyUnlock(false); byId('license-status').textContent = 'License removed from this device.'; notify('Studio license removed from this device.');
}

if ('serviceWorker' in navigator && import.meta.env.PROD) window.addEventListener('load', () => navigator.serviceWorker.register('/sw.js').catch(() => undefined));

mount();
