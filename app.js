// ==========================================
// Bloom Academy - Interactive Application Scripts
// ==========================================

// Global state for synthesizers and speech
let audioContext = null;
let noiseNode = null;
let filterNode = null;
let speechSynth = window.speechSynthesis;
let currentUtterance = null;
let voiceGuidanceActive = false;

document.addEventListener('DOMContentLoaded', () => {
  initModeSwitcher();
  initAccessibilityPanel();
  initReadingMask();
  initSensorySimulator();
  initIEPBuilder();
});

// ==========================================
// 1. Viewing Mode Switcher
// ==========================================
function initModeSwitcher() {
  const btnLiveSite = document.getElementById('btn-live-site');
  const btnBehance = document.getElementById('btn-behance');
  const liveContainer = document.getElementById('live-site-container');
  const behanceContainer = document.getElementById('behance-container');

  btnLiveSite.addEventListener('click', () => {
    btnLiveSite.classList.add('active');
    btnLiveSite.setAttribute('aria-pressed', 'true');
    btnBehance.classList.remove('active');
    btnBehance.setAttribute('aria-pressed', 'false');

    liveContainer.style.display = 'block';
    behanceContainer.style.display = 'none';
  });

  btnBehance.addEventListener('click', () => {
    btnBehance.classList.add('active');
    btnBehance.setAttribute('aria-pressed', 'true');
    btnLiveSite.classList.remove('active');
    btnLiveSite.setAttribute('aria-pressed', 'false');

    liveContainer.style.display = 'none';
    behanceContainer.style.display = 'block';
    
    // Shut down speech synthesis when leaving live view
    if (speechSynth) speechSynth.cancel();
  });
}

// ==========================================
// 2. Accessibility Options Panel
// ==========================================
const accDialog = document.getElementById('accessibility-dialog');
const accToggleBtn = document.getElementById('accessibility-toggle-btn');

function initAccessibilityPanel() {
  // Toggle panel opening
  accToggleBtn.addEventListener('click', () => {
    const isExpanded = accToggleBtn.getAttribute('aria-expanded') === 'true';
    if (isExpanded) {
      closeAccessibilityPanel();
    } else {
      openAccessibilityPanel();
    }
  });

  // Esc key closes panel
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && accDialog.style.display === 'flex') {
      closeAccessibilityPanel();
    }
  });

  // Text Scaling listeners
  const textButtons = [
    { btn: document.getElementById('btn-text-normal'), scale: '1' },
    { btn: document.getElementById('btn-text-large'), scale: '1.25' },
    { btn: document.getElementById('btn-text-huge'), scale: '1.5' }
  ];

  textButtons.forEach(item => {
    item.btn.addEventListener('click', () => {
      textButtons.forEach(b => {
        b.btn.classList.remove('active');
        b.btn.setAttribute('aria-pressed', 'false');
      });
      item.btn.classList.add('active');
      item.btn.setAttribute('aria-pressed', 'true');
      document.documentElement.style.setProperty('--font-scale', item.scale);
      announceToScreenReader(`Text size adjusted to ${parseInt(item.scale * 100)} percent.`);
    });
  });

  // Dyslexic Font Toggle
  const fontStandard = document.getElementById('btn-font-standard');
  const fontDyslexic = document.getElementById('btn-font-dyslexic');

  fontStandard.addEventListener('click', () => {
    fontStandard.classList.add('active');
    fontStandard.setAttribute('aria-pressed', 'true');
    fontDyslexic.classList.remove('active');
    fontDyslexic.setAttribute('aria-pressed', 'false');
    document.body.classList.remove('font-dyslexic-active');
    announceToScreenReader('Font set to standard sans serif.');
  });

  fontDyslexic.addEventListener('click', () => {
    fontDyslexic.classList.add('active');
    fontDyslexic.setAttribute('aria-pressed', 'true');
    fontStandard.classList.remove('active');
    fontStandard.setAttribute('aria-pressed', 'false');
    document.body.classList.add('font-dyslexic-active');
    announceToScreenReader('Font set to Lexend dyslexic friendly reader mode.');
  });

  // Visual Customization Theme Buttons
  const themes = [
    { btn: document.getElementById('theme-btn-calming'), className: '' },
    { btn: document.getElementById('theme-btn-contrast'), className: 'theme-high-contrast' },
    { btn: document.getElementById('theme-btn-dark'), className: 'theme-dark' },
    { btn: document.getElementById('theme-btn-monochrome'), className: 'theme-monochrome' }
  ];

  themes.forEach(theme => {
    theme.btn.addEventListener('click', () => {
      themes.forEach(t => {
        t.btn.classList.remove('active');
        t.btn.setAttribute('aria-pressed', 'false');
        if (t.className) document.body.classList.remove(t.className);
      });
      theme.btn.classList.add('active');
      theme.btn.setAttribute('aria-pressed', 'true');
      if (theme.className) {
        document.body.classList.add(theme.className);
      }
      const themeName = theme.btn.querySelector('.theme-choice-name').innerText;
      announceToScreenReader(`Visual theme changed to ${themeName}.`);
    });
  });

  // Cognitive supports checkboxes
  const chkReadingMask = document.getElementById('chk-reading-mask');
  const chkHighlightLinks = document.getElementById('chk-highlight-links');
  const chkStopAnimations = document.getElementById('chk-stop-animations');
  const chkVoiceSynthesizer = document.getElementById('chk-voice-synthesizer');

  chkReadingMask.addEventListener('change', (e) => {
    const mask = document.getElementById('reading-mask-overlay');
    mask.style.display = e.target.checked ? 'block' : 'none';
    announceToScreenReader(`Line reading guide ${e.target.checked ? 'activated' : 'deactivated'}.`);
  });

  chkHighlightLinks.addEventListener('change', (e) => {
    if (e.target.checked) {
      document.body.classList.add('highlight-links');
      announceToScreenReader('Highlighting links and action buttons.');
    } else {
      document.body.classList.remove('highlight-links');
      announceToScreenReader('Removed link highlights.');
    }
  });

  chkStopAnimations.addEventListener('change', (e) => {
    if (e.target.checked) {
      document.body.classList.add('reduce-motion');
      announceToScreenReader('Motion elements and animations paused.');
    } else {
      document.body.classList.remove('reduce-motion');
      announceToScreenReader('Motion and animations enabled.');
    }
  });

  chkVoiceSynthesizer.addEventListener('change', (e) => {
    voiceGuidanceActive = e.target.checked;
    if (voiceGuidanceActive) {
      announceToScreenReader('Interactive voice guidance activated. Hover or tap text to read aloud.');
      speakText('Voice guidance ready');
    } else {
      if (speechSynth) speechSynth.cancel();
      announceToScreenReader('Interactive voice guidance deactivated.');
    }
  });

  // Setup Hover Voice Synthesizer listener
  setupHoverReader();
}

function openAccessibilityPanel() {
  accDialog.style.display = 'flex';
  accToggleBtn.setAttribute('aria-expanded', 'true');
  // Set focus on close button for keyboard trapping accessibility
  setTimeout(() => {
    accDialog.querySelector('.close-panel-btn').focus();
  }, 100);
}

function closeAccessibilityPanel() {
  accDialog.style.display = 'none';
  accToggleBtn.setAttribute('aria-expanded', 'false');
  accToggleBtn.focus();
}

function resetAccessibilitySettings() {
  // Revert layout styles
  document.documentElement.style.setProperty('--font-scale', '1');
  document.body.className = ''; // remove themes & dyslexic classes
  
  // Revert buttons
  document.getElementById('btn-text-normal').click();
  document.getElementById('btn-font-standard').click();
  document.getElementById('theme-btn-calming').click();

  // Reset checkboxes
  const checkboxes = ['chk-reading-mask', 'chk-highlight-links', 'chk-stop-animations', 'chk-voice-synthesizer'];
  checkboxes.forEach(id => {
    const chk = document.getElementById(id);
    if (chk.checked) {
      chk.checked = false;
      chk.dispatchEvent(new Event('change'));
    }
  });

  announceToScreenReader('Accessibility configurations reset to defaults.');
}

// ==========================================
// 3. Screen Reader Utilities & Voice Synthesis
// ==========================================
function announceToScreenReader(message) {
  // Check if live region exists, else create one
  let liveRegion = document.getElementById('accessibility-live-announcer');
  if (!liveRegion) {
    liveRegion = document.createElement('div');
    liveRegion.id = 'accessibility-live-announcer';
    liveRegion.setAttribute('aria-live', 'polite');
    liveRegion.setAttribute('aria-atomic', 'true');
    liveRegion.style.position = 'absolute';
    liveRegion.style.width = '1px';
    liveRegion.style.height = '1px';
    liveRegion.style.overflow = 'hidden';
    document.body.appendChild(liveRegion);
  }
  
  // Update content to trigger screen reader announcement
  liveRegion.textContent = '';
  setTimeout(() => {
    liveRegion.textContent = message;
  }, 50);
}

function speakText(text) {
  if (!speechSynth) return;
  speechSynth.cancel(); // Stop any currently reading item
  
  currentUtterance = new SpeechSynthesisUtterance(text);
  currentUtterance.rate = 0.9; // Slightly slower, calm speaking rate
  currentUtterance.pitch = 1.0;
  
  // Find a pleasant, clear voice if available
  const voices = speechSynth.getVoices();
  const calmingVoice = voices.find(v => v.lang.includes('en') && (v.name.includes('Natural') || v.name.includes('Google') || v.name.includes('Zira')));
  if (calmingVoice) {
    currentUtterance.voice = calmingVoice;
  }
  
  speechSynth.speak(currentUtterance);
}

function setupHoverReader() {
  const speakableSelector = 'h1, h2, h3, h4, p, label, .cta-button, .card-btn-action, .timeline-content h3, .timeline-content p';
  
  document.addEventListener('mouseover', (e) => {
    if (!voiceGuidanceActive) return;
    
    // Find closest speakable element
    const element = e.target.closest(speakableSelector);
    if (element && !element.dataset.speechRead) {
      const textToRead = element.innerText || element.ariaLabel || '';
      if (textToRead.trim().length > 0) {
        speakText(textToRead);
      }
    }
  });

  // Trigger for keyboard tab navigation focus
  document.addEventListener('focusin', (e) => {
    if (!voiceGuidanceActive) return;
    
    const element = e.target.closest(speakableSelector + ', button, a');
    if (element) {
      const textToRead = element.innerText || element.ariaLabel || element.alt || '';
      if (textToRead.trim().length > 0) {
        speakText(textToRead);
      }
    }
  });
}

// ==========================================
// 4. Line Reading Mask Logic
// ==========================================
function initReadingMask() {
  const mask = document.getElementById('reading-mask-overlay');
  
  document.addEventListener('mousemove', (e) => {
    if (mask.style.display !== 'none') {
      mask.style.top = e.clientY + 'px';
    }
  });
}

// ==========================================
// 5. Sensory Room Simulator Widget
// ==========================================
function initSensorySimulator() {
  const sensoryPreview = document.getElementById('sensory-preview');
  const sensoryStatusText = document.getElementById('sensory-status-text');
  const bubbleTube = document.getElementById('sensory-bubble-tube');
  const bubbleSlider = document.getElementById('bubble-speed-slider');

  // A. Color toggles
  const colorBtns = document.querySelectorAll('.color-btn');
  colorBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      colorBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const color = btn.dataset.color;
      
      // Update preview wrapper classes
      sensoryPreview.className = 'sensory-visual-preview';
      sensoryPreview.classList.add(`color-${color}`);

      // Translate color names for status display
      let formattedColor = color.charAt(0).toUpperCase() + color.slice(1);
      sensoryStatusText.textContent = `Ambient Mode: Soft ${formattedColor}`;
      announceToScreenReader(`Sensory room lighting adjusted to Soft ${formattedColor}.`);
    });
  });

  // B. Bubble Speed Slider
  bubbleSlider.addEventListener('input', (e) => {
    const val = e.target.value;
    
    // Clear old bubble classes
    bubbleTube.className = 'bubble-tube';
    bubbleTube.classList.add(`bubble-speed-${val}`);

    let speedLabel = 'Off';
    if (val == 1) speedLabel = 'Gentle';
    if (val == 2) speedLabel = 'Medium';
    if (val == 3) speedLabel = 'Active';

    announceToScreenReader(`Bubble tube speed set to ${speedLabel}.`);
  });

  // C. Calming Audio Synthesis (Web Audio API)
  const rainBtn = document.getElementById('btn-ambient-rain');
  const forestBtn = document.getElementById('btn-ambient-forest');

  rainBtn.addEventListener('click', () => {
    if (rainBtn.classList.contains('active')) {
      stopAmbientAudio();
      rainBtn.classList.remove('active');
    } else {
      stopAmbientAudio();
      forestBtn.classList.remove('active');
      rainBtn.classList.add('active');
      playAmbientNoise('pink'); // Pink noise resembles soft rain
      announceToScreenReader('Calming white noise enabled.');
    }
  });

  forestBtn.addEventListener('click', () => {
    if (forestBtn.classList.contains('active')) {
      stopAmbientAudio();
      forestBtn.classList.remove('active');
    } else {
      stopAmbientAudio();
      rainBtn.classList.remove('active');
      forestBtn.classList.add('active');
      playAmbientNoise('brown'); // Brown/Red noise resembles deep ocean waves
      announceToScreenReader('Calming ocean waves sound simulated.');
    }
  });
}

// Synth engine for calming auditory stimulation (pink/brown noise generator)
function playAmbientNoise(type) {
  try {
    // Setup AudioContext
    if (!audioContext) {
      audioContext = new (window.AudioContext || window.webkitAudioContext)();
    }
    
    if (audioContext.state === 'suspended') {
      audioContext.resume();
    }

    // Stop current nodes
    stopAmbientAudio();

    // 1. Generate Noise Buffer (Pink/Brown noise algorithm)
    const bufferSize = 2 * audioContext.sampleRate;
    const noiseBuffer = audioContext.createBuffer(1, bufferSize, audioContext.sampleRate);
    const output = noiseBuffer.getChannelData(0);
    
    if (type === 'pink') {
      // Pink noise approximation algorithm (Paul Kellet's refined method)
      let b0 = 0, b1 = 0, b2 = 0, b3 = 0, b4 = 0, b5 = 0, b6 = 0;
      for (let i = 0; i < bufferSize; i++) {
        let white = Math.random() * 2 - 1;
        b0 = 0.99886 * b0 + white * 0.0555179;
        b1 = 0.99332 * b1 + white * 0.0750759;
        b2 = 0.96900 * b2 + white * 0.1538520;
        b3 = 0.86650 * b3 + white * 0.3104856;
        b4 = 0.55000 * b4 + white * 0.5329522;
        b5 = -0.7616 * b5 - white * 0.0168980;
        output[i] = b0 + b1 + b2 + b3 + b4 + b5 + b6 + white * 0.5362;
        output[i] *= 0.11; // Gain normalization
        b6 = white * 0.115926;
      }
    } else {
      // Brown noise algorithm (integration of white noise)
      let lastOut = 0.0;
      for (let i = 0; i < bufferSize; i++) {
        let white = Math.random() * 2 - 1;
        output[i] = (lastOut + (0.02 * white)) / 1.02;
        lastOut = output[i];
        output[i] *= 3.5; // Gain normalization
      }
    }

    // 2. Setup Nodes
    noiseNode = audioContext.createBufferSource();
    noiseNode.buffer = noiseBuffer;
    noiseNode.loop = true;

    // Filter to make sounds even softer (lowpass filter)
    filterNode = audioContext.createBiquadFilter();
    filterNode.type = 'lowpass';
    filterNode.frequency.value = type === 'pink' ? 1200 : 400; // Brown noise gets deeper cut

    // Gain node for gentle volume
    const gainNode = audioContext.createGain();
    gainNode.gain.value = 0.15; // Low volume level

    // Connect
    noiseNode.connect(filterNode);
    filterNode.connect(gainNode);
    gainNode.connect(audioContext.destination);

    noiseNode.start();
  } catch (err) {
    console.warn("Audio Context init blocked or not supported on this browser:", err);
  }
}

function stopAmbientAudio() {
  if (noiseNode) {
    try {
      noiseNode.stop();
    } catch(e) {}
    noiseNode = null;
  }
}

// ==========================================
// 6. IEP Profile Builder Strategy Generator
// ==========================================
const iepStrategies = {
  visual: {
    focus: [
      "Visual schedules with pictorial symbols detailing classroom daily workflow.",
      "Clear workstation boundaries marked with green tape to anchor focusing points.",
      "Color-coded subjects folder systems to reduce mental search overhead."
    ],
    speech: [
      "Dynamic Communication Boards featuring PECS (Picture Exchange Communication System).",
      "Interactive tablets with visual sentence builders to prompt vocal expression.",
      "Visual timers for turn-taking activities to manage socialization flow."
    ],
    motor: [
      "High-contrast visual cut outlines matching thick-line cutting worksheets.",
      "Visual instruction diagrams detailing physical finger arrangements for pencil grips.",
      "Color-matched pegs and sensory trays mapping coordination targets."
    ],
    sensory: [
      "Individual desk visual calm-down zones showing bubble speed or counting stars.",
      "Low contrast worksheets printed on warm cream colored paper instead of white.",
      "Visual 'Quiet Zone' access ticket indicators to use on-demand."
    ]
  },
  kinesthetic: {
    focus: [
      "Active wobble cushions or wiggle seats to channel sensory focusing energy.",
      "Short tactile task intervals broken up with 'brain break' motor loops.",
      "Weighted lap pads (3-5 lbs) during listening circles to encourage anchoring."
    ],
    speech: [
      "Pairing target vocabulary gestures (sign language/Makaton) with verbal phonics.",
      "Active floor word-hop games to build syntax structures physically.",
      "Sensory word boxes (find letters hidden in sensory sand/rice to build verbal words)."
    ],
    motor: [
      "Using weighted pencils and thick clay molding to bolster finger muscle tone.",
      "Textured scissors and squishy grips to increase sensory motor awareness.",
      "Tactile trace boards (velvet paper, sand paths) for letter formation tracing."
    ],
    sensory: [
      "On-demand access to squeeze items (putty, stress balls) during lectures.",
      "Dedicated sensory corridor paths (hopscotch, wall-touches) to regulate system.",
      "Deep pressure therapy breaks (gentle resistance movements) between periods."
    ]
  },
  musical: {
    focus: [
      "Soft rhythmic metronome click tracks played via noise-canceling headphones during tasks.",
      "Singing focus cues (simple catchy transitions melodies) to reset attention.",
      "White/pink noise soundscapes loaded onto headphones during quiet studies."
    ],
    speech: [
      "Chanting vocabulary words in rhythmic structures to prompt articulation.",
      "Song-based sentence patterns to facilitate stutter-free fluent verbal scripting.",
      "Auditory echo imitation games using xylophones or rhythm sticks."
    ],
    motor: [
      "Clapping rhythms to synchronize hand-eye motor coordination sequences.",
      "Rhythm-matched drawing activities (drawing circles in time with background beat).",
      "Keyboarding/Piano finger exercise patterns to strengthen fine muscle controls."
    ],
    sensory: [
      "Listening to soft binaural beats or forest ambient sounds during sensory rests.",
      "Providing quiet acoustic instruments (rainstick, chimes) for self-regulation.",
      "Use of soft sound-canceling headphones during high-decibel assemblies."
    ]
  },
  analytical: {
    focus: [
      "Checklists displaying numeric percentages of progress (e.g. 1 of 5 steps completed).",
      "Structured rubrics outlining step-by-step logic expected in tasks.",
      "Grid sheets and puzzle organizers to map structural objectives."
    ],
    speech: [
      "Structured scripting cards outlining exact phrases needed in social requests.",
      "Flowcharts representing conversation trees (e.g., 'If greeting, say Hello').",
      "Dynamic vocabulary classification tasks sorting words by clear rules."
    ],
    motor: [
      "Building complex Lego structures or logic puzzles to practice fine spatial coordination.",
      "Grid-aligned handwriting exercises with box indicators for each letter.",
      "Structured maze designs to coordinate pencil pressure and target tracking."
    ],
    sensory: [
      "Structured quiet times with logic puzzles to re-align overstimulated circuits.",
      "Low-light workspaces with structured visual guides to minimize clutter.",
      "Earplugs with explicit decibel reductions during group work phases."
    ]
  }
};

function initIEPBuilder() {
  const btnBuild = document.getElementById('btn-build-iep');
  const resultView = document.getElementById('iep-result-view');
  const strategyList = document.getElementById('iep-strategy-list');
  const strategyBadge = document.getElementById('iep-strategy-badge');

  btnBuild.addEventListener('click', () => {
    const strength = document.getElementById('student-strength').value;
    const support = document.getElementById('student-support').value;

    // Get specific strategies
    const strategies = iepStrategies[strength]?.[support] || [];
    
    // Clear list
    strategyList.innerHTML = '';
    
    // Populate
    strategies.forEach(item => {
      const li = document.createElement('li');
      li.textContent = item;
      strategyList.appendChild(li);
    });

    // Label formatting
    const strengthLabel = strength.charAt(0).toUpperCase() + strength.slice(1);
    const supportLabel = support.charAt(0).toUpperCase() + support.slice(1);
    strategyBadge.textContent = `${strengthLabel} Learner + ${supportLabel} Support Plan`;

    // View result
    resultView.style.display = 'block';

    announceToScreenReader(`IEP strategies generated for ${strengthLabel} learners with ${supportLabel} needs.`);
  });
}

// ==========================================
// 7. Contact Form Handling
// ==========================================
function handleFormSubmit() {
  const formFeedback = document.getElementById('form-feedback-message');
  const nameVal = document.getElementById('contact-name').value;

  formFeedback.style.display = 'block';
  formFeedback.className = 'form-feedback success';
  formFeedback.textContent = `Thank you, ${nameVal}! Your inquiry has been logged successfully. Our admissions team and occupational therapists will review your notes and contact you within 24 hours to schedule a sensory-adapted tour.`;
  
  announceToScreenReader(`Form submitted successfully. ${formFeedback.textContent}`);

  // Clear Form
  document.getElementById('contact-form').reset();
}

// Open interactive modals from the feature cards
function openInteractiveDemo(type) {
  const switcher = document.getElementById('btn-live-site');
  switcher.click(); // ensure we are in live view

  if (type === 'iep') {
    const target = document.getElementById('interactive-playground');
    target.scrollIntoView({ behavior: 'smooth' });
    document.getElementById('student-strength').focus();
    announceToScreenReader('Scrolled to Individualized Education Profile Builder widget.');
  } else if (type === 'sensory') {
    const target = document.getElementById('interactive-playground');
    target.scrollIntoView({ behavior: 'smooth' });
    document.querySelector('.color-btn').focus();
    announceToScreenReader('Scrolled to Sensory Calming Simulator widget.');
  } else if (type === 'therapists') {
    const target = document.getElementById('about');
    target.scrollIntoView({ behavior: 'smooth' });
    announceToScreenReader('Scrolled to About Support Team and Mission details.');
  }
}
