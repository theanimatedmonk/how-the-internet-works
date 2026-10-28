/**
 * Read aloud — Web Speech API with ranked voice picker.
 */
(function () {
  if (!("speechSynthesis" in window)) return;

  var STORAGE_VOICE = "how-internet-works:readAloudVoiceURI";
  var STORAGE_RATE = "how-internet-works:readAloudRate";
  var STORAGE_OPEN = "how-internet-works:readAloudOpen";

  var state = {
    playing: false,
    paused: false,
    utterance: null,
    chunks: [],
    chunkIndex: 0,
    voicesLoaded: false,
  };

  var els = {};

  var ICON_SPEAKER =
    '<svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true">' +
    '<path fill="currentColor" d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z"/>' +
    "</svg>";

  function fabLabel(text) {
    return (
      '<span class="read-aloud__fab-icon">' +
      ICON_SPEAKER +
      '</span><span class="read-aloud__fab-text">' +
      text +
      "</span>"
    );
  }

  function voiceScore(v) {
    var n = (v.name + " " + v.lang + " " + (v.voiceURI || "")).toLowerCase();
    var score = 0;

    if (!v.lang.toLowerCase().startsWith("en")) return -100;

    score += 10;

    if (v.localService) score += 4;

    if (/premium|enhanced|neural|natural|wavenet|studio|pro/i.test(n)) score += 35;
    if (/google us english|google uk english/i.test(n)) score += 28;
    if (/samantha|ava|allison|nicky|daniel|arthur|karen|moira|tessa|lee/i.test(n))
      score += 22;
    if (/microsoft (aria|jenny|guy|sonia|libby)/i.test(n)) score += 20;
    if (/english \(united states\)|en-us/i.test(n)) score += 6;

    if (/compact|low quality|espeak|festival|android/i.test(n)) score -= 15;
    if (/default/i.test(n) && n.length < 12) score -= 5;

    return score;
  }

  function voiceLabel(v) {
    var tag = "";
    if (voiceScore(v) >= 30) tag = " ★";
    var lang = v.lang.replace("_", "-");
    return v.name + " (" + lang + ")" + tag;
  }

  function getEnglishVoices() {
    return speechSynthesis
      .getVoices()
      .filter(function (v) {
        return v.lang.toLowerCase().startsWith("en");
      })
      .sort(function (a, b) {
        return voiceScore(b) - voiceScore(a);
      });
  }

  function bestVoice() {
    var voices = getEnglishVoices();
    return voices[0] || null;
  }

  function getSelectedVoice() {
    if (!els.voiceSelect) return bestVoice();
    var uri = els.voiceSelect.value;
    if (!uri) return bestVoice();
    var voices = speechSynthesis.getVoices();
    return voices.find(function (v) {
      return v.voiceURI === uri;
    }) || bestVoice();
  }

  function populateVoiceSelect() {
    if (!els.voiceSelect) return;

    var saved = localStorage.getItem(STORAGE_VOICE);
    var voices = getEnglishVoices();
    var prev = els.voiceSelect.value;

    els.voiceSelect.innerHTML = "";

    if (!voices.length) {
      var opt = document.createElement("option");
      opt.textContent = "Loading voices…";
      els.voiceSelect.appendChild(opt);
      return;
    }

    voices.forEach(function (v) {
      var opt = document.createElement("option");
      opt.value = v.voiceURI;
      opt.textContent = voiceLabel(v);
      els.voiceSelect.appendChild(opt);
    });

    var pick = saved || (bestVoice() && bestVoice().voiceURI) || voices[0].voiceURI;
    if (prev && voices.some(function (v) { return v.voiceURI === prev; })) {
      pick = prev;
    }
    els.voiceSelect.value = pick;
    localStorage.setItem(STORAGE_VOICE, pick);
    state.voicesLoaded = true;
  }

  function loadVoices() {
    populateVoiceSelect();
    if (getEnglishVoices().length) return;

    speechSynthesis.onvoiceschanged = function () {
      populateVoiceSelect();
      setStatus(
        getEnglishVoices().length ? "Ready" : "Loading voices…"
      );
    };

    setTimeout(populateVoiceSelect, 250);
    setTimeout(populateVoiceSelect, 800);
  }

  function pageText() {
    var section = document.querySelector(".markdown-section");
    if (!section) return "";

    var clone = section.cloneNode(true);
    clone
      .querySelectorAll(
        "pre, code, script, style, .docsify-pagination-container, table"
      )
      .forEach(function (node) {
        node.remove();
      });

    return (clone.innerText || clone.textContent || "")
      .replace(/\s+/g, " ")
      .trim();
  }

  function splitForSpeech(text, maxLen) {
    maxLen = maxLen || 320;
    if (!text) return [];
    var parts = text.match(/[^.!?]+[.!?]+|\S+/g) || [text];
    var chunks = [];
    var buf = "";

    parts.forEach(function (part) {
      var next = (buf + " " + part).trim();
      if (next.length > maxLen && buf) {
        chunks.push(buf.trim());
        buf = part;
      } else {
        buf = next;
      }
    });
    if (buf.trim()) chunks.push(buf.trim());
    return chunks;
  }

  function setExpanded(open) {
    if (!els.root) return;
    els.root.classList.toggle("read-aloud--open", open);
    if (els.fab) {
      els.fab.setAttribute("aria-expanded", open ? "true" : "false");
      els.fab.hidden = open;
    }
    if (els.panel) els.panel.hidden = !open;
    localStorage.setItem(STORAGE_OPEN, open ? "1" : "0");
    if (!open) updateFabHint();
  }

  function toggleExpanded() {
    setExpanded(!els.root.classList.contains("read-aloud--open"));
  }

  function setStatus(msg) {
    if (els.status) els.status.textContent = msg;
  }

  function updateFabHint() {
    if (!els.fab) return;
    var textEl = els.fab.querySelector(".read-aloud__fab-text");
    if (!textEl) return;
    if (state.playing && !state.paused) {
      textEl.textContent =
        (state.chunkIndex + 1) + "/" + state.chunks.length;
    } else if (state.paused) {
      textEl.textContent = "Paused";
    } else {
      textEl.textContent = "Listen";
    }
  }

  function updateButtons() {
    if (!els.play) return;
    els.play.hidden = state.playing && !state.paused;
    els.pause.hidden = !state.playing || state.paused;
    els.resume.hidden = !state.paused;
    els.stop.disabled = !state.playing && !state.paused;
    updateFabHint();
  }

  function applyUtteranceSettings(u) {
    var voice = getSelectedVoice();
    if (voice) {
      u.voice = voice;
      u.lang = voice.lang;
    } else {
      u.lang = "en-US";
    }
    u.rate = parseFloat(els.rate.value, 10) || 0.95;
    u.pitch = 1;
  }

  function stop() {
    speechSynthesis.cancel();
    state.playing = false;
    state.paused = false;
    state.chunks = [];
    state.chunkIndex = 0;
    state.utterance = null;
    setStatus("Stopped");
    updateButtons();
  }

  function speakChunk(index) {
    if (index >= state.chunks.length) {
      stop();
      setStatus("Finished");
      return;
    }

    state.chunkIndex = index;
    var u = new SpeechSynthesisUtterance(state.chunks[index]);
    applyUtteranceSettings(u);

    u.onend = function () {
      if (state.playing && !state.paused) speakChunk(index + 1);
    };

    u.onerror = function () {
      stop();
      setStatus("Speech unavailable");
    };

    state.utterance = u;
    setStatus("Reading… " + (index + 1) + "/" + state.chunks.length);
    updateFabHint();
    speechSynthesis.speak(u);
  }

  function play() {
    stop();
    var text = pageText();
    if (!text) {
      setStatus("No content on this page");
      return;
    }

    state.chunks = splitForSpeech(text);
    if (!state.chunks.length) {
      setStatus("Nothing to read");
      return;
    }

    state.playing = true;
    state.paused = false;
    updateButtons();
    speakChunk(0);
  }

  function previewVoice() {
    stop();
    var sample = "This is how the selected voice sounds.";
    var u = new SpeechSynthesisUtterance(sample);
    applyUtteranceSettings(u);
    state.playing = true;
    updateButtons();
    u.onend = function () {
      stop();
      setStatus("Preview done");
    };
    speechSynthesis.speak(u);
  }

  function pause() {
    if (!state.playing) return;
    speechSynthesis.pause();
    state.paused = true;
    setStatus("Paused");
    updateButtons();
  }

  function resume() {
    if (!state.paused) return;
    speechSynthesis.resume();
    state.paused = false;
    setStatus("Reading…");
    updateButtons();
  }

  function buildUI() {
    var savedRate = localStorage.getItem(STORAGE_RATE);
    var rateVal = savedRate ? parseFloat(savedRate, 10) : 0.95;

    var bar = document.createElement("div");
    bar.className = "read-aloud read-aloud--collapsed";
    bar.setAttribute("role", "region");
    bar.setAttribute("aria-label", "Read aloud");
    bar.innerHTML =
      '<button type="button" class="read-aloud__fab" aria-expanded="false" aria-controls="read-aloud-panel">' +
      fabLabel("Listen") +
      "</button>" +
      '<div id="read-aloud-panel" class="read-aloud__panel" hidden>' +
      '<div class="read-aloud__head">' +
      '<span class="read-aloud__title">Listen</span>' +
      '<span class="read-aloud__status" aria-live="polite"></span>' +
      '<button type="button" class="read-aloud__close" aria-label="Collapse">×</button>' +
      "</div>" +
      '<label class="read-aloud__voice">' +
      "Voice" +
      '<select data-voice aria-label="Voice"></select>' +
      "</label>" +
      '<div class="read-aloud__controls">' +
      '<button type="button" class="read-aloud__btn read-aloud__btn--compact" data-action="preview" title="Test voice">🔊</button>' +
      '<button type="button" class="read-aloud__btn" data-action="play">▶ Read</button>' +
      '<button type="button" class="read-aloud__btn" data-action="pause" hidden>⏸ Pause</button>' +
      '<button type="button" class="read-aloud__btn" data-action="resume" hidden>▶ Resume</button>' +
      '<button type="button" class="read-aloud__btn" data-action="stop" disabled>⏹ Stop</button>' +
      '<label class="read-aloud__rate">' +
      "Speed" +
      '<input type="range" min="0.75" max="1.25" step="0.05" value="' +
      rateVal +
      '" data-rate />' +
      "</label>" +
      "</div>" +
      "</div>";

    document.body.appendChild(bar);

    els.root = bar;
    els.fab = bar.querySelector(".read-aloud__fab");
    els.panel = bar.querySelector(".read-aloud__panel");
    els.status = bar.querySelector(".read-aloud__status");
    els.play = bar.querySelector('[data-action="play"]');
    els.pause = bar.querySelector('[data-action="pause"]');
    els.resume = bar.querySelector('[data-action="resume"]');
    els.stop = bar.querySelector('[data-action="stop"]');
    els.rate = bar.querySelector("[data-rate]");
    els.voiceSelect = bar.querySelector("[data-voice]");

    els.fab.addEventListener("click", function () {
      setExpanded(true);
    });
    bar.querySelector(".read-aloud__close").addEventListener("click", function () {
      setExpanded(false);
    });

    document.addEventListener("click", function (e) {
      if (!els.root.classList.contains("read-aloud--open")) return;
      if (els.root.contains(e.target)) return;
      setExpanded(false);
    });

    els.play.addEventListener("click", play);
    els.pause.addEventListener("click", pause);
    els.resume.addEventListener("click", resume);
    els.stop.addEventListener("click", stop);
    bar.querySelector('[data-action="preview"]').addEventListener("click", previewVoice);

    els.voiceSelect.addEventListener("change", function () {
      localStorage.setItem(STORAGE_VOICE, els.voiceSelect.value);
    });

    els.rate.addEventListener("input", function () {
      localStorage.setItem(STORAGE_RATE, els.rate.value);
    });

    loadVoices();
    setStatus("Ready");
    updateButtons();

    if (localStorage.getItem(STORAGE_OPEN) === "1") {
      setExpanded(true);
    }
  }

  function onRouteChange() {
    stop();
    setStatus("New page");
  }

  window.$docsify = window.$docsify || {};
  window.$docsify.plugins = [].concat(window.$docsify.plugins || [], function (hook) {
    hook.doneEach(onRouteChange);
  });

  window.addEventListener("beforeunload", stop);

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", buildUI);
  } else {
    buildUI();
  }
})();
