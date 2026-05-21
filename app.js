// ==========================================
// İZ Özel Eğitim - Etkileşimli Uygulama Kodları
// ==========================================

// Sentezleyici ve ses için global durumlar
let audioContext = null;
let noiseNode = null;
let filterNode = null;
let speechSynth = window.speechSynthesis;
let currentUtterance = null;
let voiceGuidanceActive = false;

document.addEventListener('DOMContentLoaded', () => {
  initModeSwitcher();
  initScrollHeader();
  initAccessibilityPanel();
  initReadingMask();
  initSensorySimulator();
  initIEPBuilder();
});

// ==========================================
// 0. Scroll-Hide / Show Navbar
// ==========================================
function initScrollHeader() {
  const header = document.querySelector('.site-header');
  if (!header) return;

  let lastScrollY = window.scrollY;
  let ticking = false;

  window.addEventListener('scroll', () => {
    if (!ticking) {
      window.requestAnimationFrame(() => {
        const currentScrollY = window.scrollY;

        // Add scrolled shadow after 10px
        if (currentScrollY > 10) {
          header.classList.add('header-scrolled');
        } else {
          header.classList.remove('header-scrolled');
        }

        // Hide on scroll down, reveal on scroll up
        if (currentScrollY > lastScrollY && currentScrollY > 80) {
          header.classList.add('header-hidden');
        } else {
          header.classList.remove('header-hidden');
        }

        lastScrollY = currentScrollY;
        ticking = false;
      });
      ticking = true;
    }
  }, { passive: true });
}

// ==========================================
// 1. Görünüm Modu Geçişi (Erişilebilirlik Paneli İçinde)
// ==========================================
function initModeSwitcher() {
  const btnLiveSite = document.getElementById('btn-toggle-live');
  const btnBehance = document.getElementById('btn-toggle-behance');
  const liveContainer = document.getElementById('live-site-container');
  const behanceContainer = document.getElementById('behance-container');

  if (btnLiveSite && btnBehance) {
    btnLiveSite.addEventListener('click', () => {
      btnLiveSite.classList.add('active');
      btnLiveSite.setAttribute('aria-pressed', 'true');
      btnBehance.classList.remove('active');
      btnBehance.setAttribute('aria-pressed', 'false');

      liveContainer.style.display = 'block';
      behanceContainer.style.display = 'none';
      announceToScreenReader('Canlı etkileşimli site görünümüne geçildi.');
    });

    btnBehance.addEventListener('click', () => {
      btnBehance.classList.add('active');
      btnBehance.setAttribute('aria-pressed', 'true');
      btnLiveSite.classList.remove('active');
      btnLiveSite.setAttribute('aria-pressed', 'false');

      liveContainer.style.display = 'none';
      behanceContainer.style.display = 'block';
      announceToScreenReader('Behance portfolyo sunumu görünümüne geçildi.');
      
      // Canlı görünümden çıkarken ses sentezini kapat
      if (speechSynth) speechSynth.cancel();
    });
  }
}

// ==========================================
// 2. Erişilebilirlik Ayarları Paneli
// ==========================================
// NOTE: These are resolved lazily inside functions, not at parse time,
// because the DOM may not be ready when the script first runs.
let accDialog;
let accToggleBtn;

function initAccessibilityPanel() {
  // Resolve elements now that DOM is ready
  accDialog = document.getElementById('accessibility-dialog');
  accToggleBtn = document.getElementById('accessibility-toggle-btn');

  if (!accDialog || !accToggleBtn) {
    console.warn('Erişilebilirlik paneli öğeleri bulunamadı.');
    return;
  }

  // Panel açma/kapama
  accToggleBtn.addEventListener('click', () => {
    const isExpanded = accToggleBtn.getAttribute('aria-expanded') === 'true';
    if (isExpanded) {
      closeAccessibilityPanel();
    } else {
      openAccessibilityPanel();
    }
  });

  // Esc tuşu ile paneli kapatma
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && accDialog.style.display === 'flex') {
      closeAccessibilityPanel();
    }
  });

  // Hızlı Açık/Koyu Tema Geçiş Tuşları (Erişilebilirlik Paneli En Üst Kısmı)
  const quickThemeLight = document.getElementById('quick-theme-light');
  const quickThemeDark = document.getElementById('quick-theme-dark');

  if (quickThemeLight && quickThemeDark) {
    quickThemeLight.addEventListener('click', () => {
      quickThemeLight.classList.add('active');
      quickThemeLight.setAttribute('aria-pressed', 'true');
      quickThemeDark.classList.remove('active');
      quickThemeDark.setAttribute('aria-pressed', 'false');
      
      // Varsayılan pastel açık temaya tıkla
      document.getElementById('theme-btn-calming').click();
    });

    quickThemeDark.addEventListener('click', () => {
      quickThemeDark.classList.add('active');
      quickThemeDark.setAttribute('aria-pressed', 'true');
      quickThemeLight.classList.remove('active');
      quickThemeLight.setAttribute('aria-pressed', 'false');
      
      // Rahatlatıcı koyu temaya tıkla
      document.getElementById('theme-btn-dark').click();
    });
  }

  // Disleksi Dostu Yazı Karakteri Geçişi
  const fontStandard = document.getElementById('btn-font-standard');
  const fontDyslexic = document.getElementById('btn-font-dyslexic');

  if (fontStandard && fontDyslexic) {
    fontStandard.addEventListener('click', () => {
      fontStandard.classList.add('active');
      fontStandard.setAttribute('aria-pressed', 'true');
      fontDyslexic.classList.remove('active');
      fontDyslexic.setAttribute('aria-pressed', 'false');
      document.body.classList.remove('font-dyslexic-active');
      announceToScreenReader('Yazı karakteri standart sans-serif olarak ayarlandı.');
    });

    fontDyslexic.addEventListener('click', () => {
      fontDyslexic.classList.add('active');
      fontDyslexic.setAttribute('aria-pressed', 'true');
      fontStandard.classList.remove('active');
      fontStandard.setAttribute('aria-pressed', 'false');
      document.body.classList.add('font-dyslexic-active');
      announceToScreenReader('Yazı karakteri disleksi dostu Lexend okuma modu olarak ayarlandı.');
    });
  }

  // Görsel Özelleştirme Temaları Butonları
  const themes = [
    { btn: document.getElementById('theme-btn-calming'), className: '' },
    { btn: document.getElementById('theme-btn-contrast'), className: 'theme-high-contrast' },
    { btn: document.getElementById('theme-btn-dark'), className: 'theme-dark' },
    { btn: document.getElementById('theme-btn-monochrome'), className: 'theme-monochrome' }
  ];

  themes.forEach(theme => {
    if (theme.btn) {
      theme.btn.addEventListener('click', () => {
        themes.forEach(t => {
          if (t.btn) {
            t.btn.classList.remove('active');
            t.btn.setAttribute('aria-pressed', 'false');
          }
          if (t.className) document.body.classList.remove(t.className);
        });
        theme.btn.classList.add('active');
        theme.btn.setAttribute('aria-pressed', 'true');
        if (theme.className) {
          document.body.classList.add(theme.className);
        }
        
        // Hızlı Açık/Koyu tema butonlarını da senkronize et
        updateQuickThemeButtons(theme.className);

        const themeName = theme.btn.querySelector('.theme-choice-name').innerText;
        announceToScreenReader(`Görsel tema ${themeName} olarak değiştirildi.`);
      });
    }
  });

  // Bilişsel Destek Seçenekleri (Checkox'lar)
  const chkReadingMask = document.getElementById('chk-reading-mask');
  const chkHighlightLinks = document.getElementById('chk-highlight-links');
  const chkStopAnimations = document.getElementById('chk-stop-animations');
  const chkVoiceSynthesizer = document.getElementById('chk-voice-synthesizer');

  if (chkReadingMask) {
    chkReadingMask.addEventListener('change', (e) => {
      const mask = document.getElementById('reading-mask-overlay');
      if (mask) mask.style.display = e.target.checked ? 'block' : 'none';
      announceToScreenReader(`Satır okuma maskesi kılavuzu ${e.target.checked ? 'etkinleştirildi' : 'kapatıldı'}.`);
    });
  }

  if (chkHighlightLinks) {
    chkHighlightLinks.addEventListener('change', (e) => {
      if (e.target.checked) {
        document.body.classList.add('highlight-links');
        announceToScreenReader('Bağlantılar ve butonlar görsel olarak vurgulandı.');
      } else {
        document.body.classList.remove('highlight-links');
        announceToScreenReader('Bağlantı vurguları kaldırıldı.');
      }
    });
  }

  if (chkStopAnimations) {
    chkStopAnimations.addEventListener('change', (e) => {
      if (e.target.checked) {
        document.body.classList.add('reduce-motion');
        announceToScreenReader('Sayfadaki tüm animasyonlar ve hareketli öğeler durduruldu.');
      } else {
        document.body.classList.remove('reduce-motion');
        announceToScreenReader('Animasyonlar ve hareketler tekrar etkin.');
      }
    });
  }

  if (chkVoiceSynthesizer) {
    chkVoiceSynthesizer.addEventListener('change', (e) => {
      voiceGuidanceActive = e.target.checked;
      if (voiceGuidanceActive) {
        announceToScreenReader('Etkileşimli sesli yönlendirme açıldı. Metinleri sesli dinlemek için farenizi üzerlerine getirebilirsiniz.');
        speakText('Sesli rehber hazır');
      } else {
        if (speechSynth) speechSynth.cancel();
        announceToScreenReader('Sesli yönlendirme kapatıldı.');
      }
    });
  }

  // Hover ile Sesli Okuyucuyu Yapılandır
  setupHoverReader();
}

function updateQuickThemeButtons(themeClass) {
  const quickLight = document.getElementById('quick-theme-light');
  const quickDark = document.getElementById('quick-theme-dark');
  if (!quickLight || !quickDark) return;
  
  if (themeClass === 'theme-dark') {
    quickDark.classList.add('active');
    quickDark.setAttribute('aria-pressed', 'true');
    quickLight.classList.remove('active');
    quickLight.setAttribute('aria-pressed', 'false');
  } else if (themeClass === '') {
    quickLight.classList.add('active');
    quickLight.setAttribute('aria-pressed', 'true');
    quickDark.classList.remove('active');
    quickDark.setAttribute('aria-pressed', 'false');
  } else {
    quickLight.classList.remove('active');
    quickLight.setAttribute('aria-pressed', 'false');
    quickDark.classList.remove('active');
    quickDark.setAttribute('aria-pressed', 'false');
  }
}

function openAccessibilityPanel() {
  if (accDialog) {
    accDialog.style.display = 'flex';
    accToggleBtn.setAttribute('aria-expanded', 'true');
    // Klavye navigasyon odağını kapatma tuşuna getir
    setTimeout(() => {
      const closeBtn = accDialog.querySelector('.close-panel-btn');
      if (closeBtn) closeBtn.focus();
    }, 100);
  }
}

function closeAccessibilityPanel() {
  if (accDialog) {
    accDialog.style.display = 'none';
    accToggleBtn.setAttribute('aria-expanded', 'false');
    accToggleBtn.focus();
  }
}

function resetAccessibilitySettings() {
  document.documentElement.style.setProperty('--font-scale', '1');
  document.body.className = ''; // temaları ve disleksi sınıflarını sıfırla
  
  // Butonları sıfırla
  const btnStdFont = document.getElementById('btn-font-standard');
  const themeCalming = document.getElementById('theme-btn-calming');

  if (btnStdFont) btnStdFont.click();
  if (themeCalming) themeCalming.click();

  // Checkbox'ları sıfırla
  const checkboxes = ['chk-reading-mask', 'chk-highlight-links', 'chk-stop-animations', 'chk-voice-synthesizer'];
  checkboxes.forEach(id => {
    const chk = document.getElementById(id);
    if (chk && chk.checked) {
      chk.checked = false;
      chk.dispatchEvent(new Event('change'));
    }
  });

  announceToScreenReader('Erişilebilirlik ayarları varsayılana sıfırlandı.');
}

// ==========================================
// 3. Ekran Okuyucu Yardımcıları ve Ses Sentezi
// ==========================================
function announceToScreenReader(message) {
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
  
  liveRegion.textContent = '';
  setTimeout(() => {
    liveRegion.textContent = message;
  }, 50);
}

function speakText(text) {
  if (!speechSynth) return;
  speechSynth.cancel(); // Mevcut okumayı kes
  
  currentUtterance = new SpeechSynthesisUtterance(text);
  currentUtterance.rate = 0.95; // Sakin okuma hızı
  currentUtterance.pitch = 1.0;
  
  // Varsa Türkçe ses seç
  const voices = speechSynth.getVoices();
  const turkishVoice = voices.find(v => v.lang.includes('tr') || v.lang.includes('TR'));
  if (turkishVoice) {
    currentUtterance.voice = turkishVoice;
  }
  
  speechSynth.speak(currentUtterance);
}

function setupHoverReader() {
  const speakableSelector = 'h1, h2, h3, h4, p, label, .cta-button, .card-btn-action, .timeline-content h3, .timeline-content p';
  
  document.addEventListener('mouseover', (e) => {
    if (!voiceGuidanceActive) return;
    
    const element = e.target.closest(speakableSelector);
    if (element && !element.dataset.speechRead) {
      const textToRead = element.innerText || element.ariaLabel || '';
      if (textToRead.trim().length > 0) {
        speakText(textToRead);
      }
    }
  });

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
// 4. Satır Okuma Maskesi Kılavuzu
// ==========================================
function initReadingMask() {
  const mask = document.getElementById('reading-mask-overlay');
  
  document.addEventListener('mousemove', (e) => {
    if (mask && mask.style.display !== 'none') {
      mask.style.top = e.clientY + 'px';
    }
  });
}

// ==========================================
// 5. Duyu Odası Sakinleşme Simülatörü
// ==========================================
const colorsTR = {
  sage: "Yumuşak Adaçayı Yeşili",
  blue: "Yumuşak Mavi",
  lavender: "Yumuşak Lavanta",
  amber: "Sakinleştirici Kehribar"
};

function initSensorySimulator() {
  const sensoryPreview = document.getElementById('sensory-preview');
  const sensoryStatusText = document.getElementById('sensory-status-text');
  const bubbleTube = document.getElementById('sensory-bubble-tube');
  const bubbleSlider = document.getElementById('bubble-speed-slider');

  // A. Renk butonları
  const colorBtns = document.querySelectorAll('.color-btn');
  colorBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      colorBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const color = btn.dataset.color;
      
      if (sensoryPreview) {
        sensoryPreview.className = 'sensory-visual-preview';
        sensoryPreview.classList.add(`color-${color}`);
      }

      if (sensoryStatusText) {
        sensoryStatusText.textContent = `Ortam Aydınlatması: ${colorsTR[color]}`;
      }
      announceToScreenReader(`Duyu odası aydınlatması ${colorsTR[color]} olarak ayarlandı.`);
    });
  });

  // B. Kabarcık Tüpü Hızı
  if (bubbleSlider && bubbleTube) {
    bubbleSlider.addEventListener('input', (e) => {
      const val = e.target.value;
      
      bubbleTube.className = 'bubble-tube';
      bubbleTube.classList.add(`bubble-speed-${val}`);

      let speedLabel = 'Kapalı';
      if (val == 1) speedLabel = 'Hafif';
      if (val == 2) speedLabel = 'Orta';
      if (val == 3) speedLabel = 'Aktif';

      announceToScreenReader(`Kabarcık tüpü hızı ${speedLabel} olarak ayarlandı.`);
    });
  }

  // C. Sakinleştirici Ses Sentezleyicisi (Web Audio API)
  const rainBtn = document.getElementById('btn-ambient-rain');
  const forestBtn = document.getElementById('btn-ambient-forest');

  if (rainBtn && forestBtn) {
    rainBtn.addEventListener('click', () => {
      if (rainBtn.classList.contains('active')) {
        stopAmbientAudio();
        rainBtn.classList.remove('active');
      } else {
        stopAmbientAudio();
        forestBtn.classList.remove('active');
        rainBtn.classList.add('active');
        playAmbientNoise('pink'); // Pembe gürültü yağmur sesini andırır
        announceToScreenReader('Sakinleştirici yağmur gürültüsü açıldı.');
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
        playAmbientNoise('brown'); // Kahverengi gürültü derin dalgaları andırır
        announceToScreenReader('Sakinleştirici okyanus dalgaları sesi açıldı.');
      }
    });
  }
}

function playAmbientNoise(type) {
  try {
    if (!audioContext) {
      audioContext = new (window.AudioContext || window.webkitAudioContext)();
    }
    
    if (audioContext.state === 'suspended') {
      audioContext.resume();
    }

    stopAmbientAudio();

    const bufferSize = 2 * audioContext.sampleRate;
    const noiseBuffer = audioContext.createBuffer(1, bufferSize, audioContext.sampleRate);
    const output = noiseBuffer.getChannelData(0);
    
    if (type === 'pink') {
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
        output[i] *= 0.11;
        b6 = white * 0.115926;
      }
    } else {
      let lastOut = 0.0;
      for (let i = 0; i < bufferSize; i++) {
        let white = Math.random() * 2 - 1;
        output[i] = (lastOut + (0.02 * white)) / 1.02;
        lastOut = output[i];
        output[i] *= 3.5;
      }
    }

    noiseNode = audioContext.createBufferSource();
    noiseNode.buffer = noiseBuffer;
    noiseNode.loop = true;

    filterNode = audioContext.createBiquadFilter();
    filterNode.type = 'lowpass';
    filterNode.frequency.value = type === 'pink' ? 1200 : 400;

    const gainNode = audioContext.createGain();
    gainNode.gain.value = 0.15;

    noiseNode.connect(filterNode);
    filterNode.connect(gainNode);
    gainNode.connect(audioContext.destination);

    noiseNode.start();
  } catch (err) {
    console.warn("Ses sentezi desteklenmiyor:", err);
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
// 6. BEP Profil Oluşturucu Stratejileri
// ==========================================
const iepStrategies = {
  visual: {
    focus: [
      "Sınıf içi günlük çalışma akışını ve ders sıralamasını gösteren resimli/sembollü görsel programlar.",
      "Odaklanmayı artırmak ve çalışma alanını belirlemek için çalışma masası sınırlarının renkli bantlarla belirlenmesi.",
      "Arama yükünü azaltmak ve düzen sağlamak için renk kodlu ders klasör sistemleri."
    ],
    speech: [
      "PECS (Resim Değiş Tokuşuna Dayalı İletişim Sistemi) içeren dinamik iletişim panolarının yaygın kullanımı.",
      "Kendini ifade etme süreçlerini desteklemek amacıyla görsel cümle kurucular içeren etkileşimli mobil uygulamalar.",
      "Sıra alma ve paylaşma davranışlarını düzenlemek için etkinliklerde kullanılan renkli görsel zamanlayıcılar."
    ],
    motor: [
      "Kalın kesim hatlarına sahip çalışma sayfalarıyla eşleşen yüksek kontrastlı kesim kılavuz çizgileri.",
      "Kalemin doğru parmak duruşuyla kavranmasını gösteren adım adım görsel yönerge şemaları.",
      "Koordinasyon hedeflerini pekiştiren renk eşleştirmeli mandal takımları ve duyusal tepsiler."
    ],
    sensory: [
      "Bireysel çalışma masalarında baloncuk hızı veya yıldız saymayı simüle eden görsel sakinleşme kartları.",
      "Göz kamaşmasını önlemek için beyaz yerine krem rengi kağıda basılmış düşük kontrastlı çalışma kağıtları.",
      "Öğrencinin ihtiyaç duyduğu anda bağımsız şekilde kullanabileceği görsel 'Sessiz Köşe' erişim kartları."
    ]
  },
  kinesthetic: {
    focus: [
      "Duyusal odaklanma ihtiyacını hareketle karşılamak için aktif denge minderleri veya kıpırdanma tabureleri.",
      "Hafif motor hareket döngüleri (kısa fiziksel egzersiz araları) ile bölünmüş odaklanma çalışma süreleri.",
      "Grup etkinliklerinde odaklanmayı artırmak ve gövde kontrolünü sabitlemek için ağırlıklı kucak yastıkları."
    ],
    speech: [
      "Sözel sesleri ve fonetik gelişimi desteklemek amacıyla harflerle el işaretlerini (işaret dili/Makaton) eşleştirme.",
      "Cümle yapısını fiziksel olarak deneyimlemek için yerdeki büyük kelime kartlarıyla seksek oyunları.",
      "Duyusal kelime kutuları (kum veya pirinç içine gizlenmiş dokulu harfleri bularak kelimeler türetme)."
    ],
    motor: [
      "El ve parmak kas tonusunu güçlendirmek için ağırlıklı kalemler ve sert oyun hamurları ile modelleme çalışmaları.",
      "Duyusal motor farkındalığı uyaran dokulu kenarlı makaslar ve yumuşak ergonomik kalem tutamakları.",
      "Harf oluşum hatlarını parmakla hissetmek için tasarlanmış kadife veya zımpara kağıdı dokulu takip kartları."
    ],
    sensory: [
      "Sınıf içi çalışmalar sırasında eldeki duyusal dürtüyü düzenleyici yumuşak stres topları veya bükülebilir aparatlar.",
      "Duyusal sistemi yatıştırmak ve dengelemek amacıyla hazırlanan hareket koridoru (seksek yolları, duvar şablonları).",
      "Ders aralarında kas gerginliğini ve stres seviyesini azaltan derin basınç odaklı esneme egzersizleri."
    ]
  },
  musical: {
    focus: [
      "Bireysel çalışma süreçlerinde gürültü önleyici kulaklıklar eşliğinde dinletilen sabit ritimli metronom ritimleri.",
      "Etkinlik geçişlerindeki dikkat dağınıklığını önlemek için öğretmen tarafından kullanılan ritmik geçiş melodileri.",
      "Dış uyaranları baskılamak ve odaklanmayı artırmak amacıyla arka planda çalınan sakinleştirici pembe gürültü."
    ],
    speech: [
      "Kelimelerin telaffuzunu ve hece yapılarını ritmik kalıplarla seslendirerek konuşma akışını düzenleme.",
      "Akıcı konuşma gelişimini desteklemek amacıyla melodik ve şarkı formunda hazırlanan cümle tekrarları.",
      "Ksilofon, marakas veya ritim çubukları kullanılarak yapılan işitsel ritim taklit oyunları."
    ],
    motor: [
      "El-göz koordinasyonunu ritimle senkronize etmek için tempoya uyumlu el çırpma ve davul çalışmaları.",
      "Ritmik müzik eşliğinde yapılan koordinasyon çizimleri (müziğin temposuna göre çizgiler ve daireler çizme).",
      "Parmak eklemlerini ve ince motor becerilerini güçlendiren basit klavye/piyano parmak egzersizleri."
    ],
    sensory: [
      "Duyusal dinlenme zamanlarında öğrenciye dinletilen sakinleştirici doğa sesleri veya çift kulaklı vuruşlar (binaural beats).",
      "Kendi kendini sakinleştirme (otoregülasyon) sürecini destekleyen yağmur çubuğu veya yumuşak tonlu rüzgar çanları.",
      "Gürültülü okul ortamlarında veya törenlerde kullanılmak üzere öğrenciye özel gürültü azaltıcı kulaklıklar."
    ]
  },
  analytical: {
    focus: [
      "Görevin aşamalarını ve tamamlanma oranını sayısal olarak gösteren adım adım kontrol listeleri (örn. 5/1 tamamlandı).",
      "Çalışmalardaki başarı kriterlerini ve beklenen adımları gösteren net yapılandırılmış değerlendirme şablonları (rubrikler).",
      "Sorun çözme süreçlerini parçalara ayırmak için kareli şema kağıtları ve mantık yapbozu kılavuzları."
    ],
    speech: [
      "Sosyal ortamlarda iletişimi başlatmak veya yardım istemek için kullanılacak yapılandırılmış hazır konuşma kartları.",
      "Sosyal diyalog akışlarını şematize eden konuşma ağacı tabloları (örn. 'Selamlaştığında sırasıyla bunları söyle').",
      "Sözcük dağarcığını geliştirmek ve ilişkileri anlamak için kelimeleri mantıksal gruplara göre ayırma egzersizleri."
    ],
    motor: [
      "İnce motor ve uzamsal koordinasyonu geliştirmek için yönergelere göre yapılan karmaşık yapım blokları ve lego setleri.",
      "El yazısını düzenlemek ve harf boyutlarını kontrol etmek için her harf için sınırları çizilmiş kutucuklu kağıtlar.",
      "Kalem basıncını ayarlamayı ve yön takibini güçlendirmeyi sağlayan çizgisel labirent bulmacaları."
    ],
    sensory: [
      "Duyusal aşırı yüklenmeyi yatıştırmak için sessiz zamanlarda uygulanan mantıksal eşleştirme ve akıl oyunları.",
      "Görsel dikkat dağınıklığını en aza indiren, gereksiz afiş ve eşyalardan arındırılmış yalın çalışma köşeleri.",
      "Grup çalışmalarında akustik uyaranları hafifletmek için tasarlanmış desibel filtreli kulak tıkaçları."
    ]
  }
};

const strengthsTR = {
  visual: "Görsel-Uzamsal",
  kinesthetic: "Kinestetik/Uygulamalı",
  musical: "İşitsel/Ritmik",
  analytical: "Analitik/Mantıksal"
};

const supportsTR = {
  focus: "Dikkat/Odaklanma",
  speech: "İletişim/Konuşma",
  motor: "Motor Koordinasyon",
  sensory: "Duyusal Düzenleme"
};

function initIEPBuilder() {
  const btnBuild = document.getElementById('btn-build-iep');
  const resultView = document.getElementById('iep-result-view');
  const strategyList = document.getElementById('iep-strategy-list');
  const strategyBadge = document.getElementById('iep-strategy-badge');

  if (btnBuild) {
    btnBuild.addEventListener('click', () => {
      const strength = document.getElementById('student-strength').value;
      const support = document.getElementById('student-support').value;

      const strategies = iepStrategies[strength]?.[support] || [];
      
      if (strategyList) {
        strategyList.innerHTML = '';
        strategies.forEach(item => {
          const li = document.createElement('li');
          li.textContent = item;
          strategyList.appendChild(li);
        });
      }

      if (strategyBadge) {
        strategyBadge.textContent = `${strengthsTR[strength]} Öğrenen + ${supportsTR[support]} Destek Planı`;
      }

      if (resultView) {
        resultView.style.display = 'block';
      }

      announceToScreenReader(`${strengthsTR[strength]} öğrenenler ve ${supportsTR[support]} desteği için BEP stratejileri oluşturuldu.`);
    });
  }
}

// ==========================================
// 7. İletişim Formu İşlemleri
// ==========================================
function handleFormSubmit() {
  const formFeedback = document.getElementById('form-feedback-message');
  const nameVal = document.getElementById('contact-name').value;

  if (formFeedback) {
    formFeedback.style.display = 'block';
    formFeedback.className = 'form-feedback success';
    formFeedback.textContent = `Teşekkürler Sayın ${nameVal}! Bilgi talebiniz başarıyla kaydedildi. Kabul ekibimiz ve ergoterapistlerimiz başvurunuzu inceleyerek, çocuğunuza özel kampüs ve duyu odaları turumuzu planlamak üzere en geç 24 saat içinde sizinle iletişime geçecektir.`;
    announceToScreenReader(`Form başarıyla gönderildi. ${formFeedback.textContent}`);
  }

  const contactForm = document.getElementById('contact-form');
  if (contactForm) contactForm.reset();
}

// Kartlardan etkileşimli alanlara yumuşak geçiş sağlayan fonksiyonlar
function openInteractiveDemo(type) {
  const switcher = document.getElementById('btn-toggle-live');
  if (switcher) switcher.click(); // Canlı site görünümünde olduğumuzdan emin ol

  const targetPlayground = document.getElementById('interactive-playground');
  const targetAbout = document.getElementById('about');

  if (type === 'iep') {
    if (targetPlayground) {
      targetPlayground.scrollIntoView({ behavior: 'smooth' });
      setTimeout(() => {
        const studentStrength = document.getElementById('student-strength');
        if (studentStrength) studentStrength.focus();
      }, 500);
      announceToScreenReader('Bireyselleştirilmiş Eğitim Planı (BEP) hazırlama aracına geçildi.');
    }
  } else if (type === 'sensory') {
    if (targetPlayground) {
      targetPlayground.scrollIntoView({ behavior: 'smooth' });
      setTimeout(() => {
        const firstColorBtn = document.querySelector('.color-btn');
        if (firstColorBtn) firstColorBtn.focus();
      }, 500);
      announceToScreenReader('Duyusal Sakinleşme Simülatörüne geçildi.');
    }
  } else if (type === 'therapists') {
    if (targetAbout) {
      targetAbout.scrollIntoView({ behavior: 'smooth' });
      announceToScreenReader('Destek Ekibi ve Misyonumuz alanına geçildi.');
    }
  }
}
