// --- RESOLUCIÓ D'URL DEL SERVIDOR LOCAL ---
// Detectem la URL base del servidor Python de forma automàtica.
// Si estem en localtunnel o un túnel d'Internet, respectem l'origen del túnel.
// Si estem en xarxa local (localhost / IPs), normalitzem els ports.
function isLocalHostOrIp() {
  const hostname = window.location.hostname;
  return (
    hostname === 'localhost' ||
    hostname === '127.0.0.1' ||
    hostname.startsWith('192.168.') ||
    hostname.startsWith('10.') ||
    hostname.startsWith('172.')
  );
}

function getBaseUrl() {
  const proto = window.location.protocol;
  if (proto === 'http:' || proto === 'https:') {
    if (isLocalHostOrIp()) {
      const url = new URL(window.location.href);
      url.port = '8080';
      url.protocol = 'http:';
      return url.origin;
    }
    return window.location.origin;
  }
  return 'http://localhost:8080';
}

function getRelayBase() {
  const proto = window.location.protocol;
  if (proto === 'http:' || proto === 'https:') {
    if (isLocalHostOrIp()) {
      const url = new URL(window.location.href);
      url.port = '8080';
      url.protocol = 'http:';
      return url.origin;
    }
    return window.location.origin;
  }
  return 'http://localhost:8080';
}

function getBneApiUrl(keywords) {
  return `${getBaseUrl()}/api/bne?isbn=${encodeURIComponent(keywords)}`;
}

window.syncSelectedBook = function(bookData) {
  const sessionID = localStorage.getItem('biblioscan_session_id');
  const payload = {
    title: bookData.title,
    authors: bookData.author_name ? bookData.author_name.join(', ') : (bookData.authors || 'Desconegut'),
    publisher: bookData.publisher ? bookData.publisher[0] : 'Desconegut',
    publishYear: bookData.first_publish_year || '',
    isbn: bookData.isbn ? bookData.isbn[0] : '',
    place: bookData.publish_place ? bookData.publish_place[0] : '',
    subjects: bookData.subject ? bookData.subject.slice(0, 3).join(', ') : '',
    score: bookData.score ? Math.round(bookData.score * 100) : 100
  };

  // 1. Enviem a ntfy.sh per al bookmarklet (CORS-safelisted text/plain)
  const ntfyPromise = sessionID
    ? fetch(`https://ntfy.sh/biblioscan-sync-${sessionID}`, {
        method: 'POST',
        headers: { 'Content-Type': 'text/plain' },
        body: JSON.stringify(payload)
      }).catch(e => console.error("Error enviant a ntfy.sh:", e))
    : Promise.resolve();

  // 2. Enviem al backend Python local si existeix
  const localPromise = fetch(`${getBaseUrl()}/api/sync`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(bookData)
  }).catch(e => console.log("Servidor local no disponible, ignorat."));

  // Mostrem feedback visual d'èxit
  Promise.all([ntfyPromise, localPromise]).then(() => {
    const btn = document.getElementById('sync-desktop-btn');
    if (btn) {
      btn.innerHTML = '✅ Enviat correctament!';
      btn.style.background = '#27ae60';
      setTimeout(() => {
        btn.innerHTML = '📥 Enviar a l\'ordinador de treball';
        btn.style.background = btn.dataset.origColor || '#8cc63f';
      }, 3000);
    }
  });
};

// Variables d'estat global per a la cerca de llibres
window._biblio = {
  allScoredBooks: [],
  lastSearchStrategy: '',
  lastUsedBNE: false,
  currentThreshold: 0.98
};

// ─── Mòdul de Relay de Càmera Mòbil ──────────────────────────────────────────
(function initCameraRelay() {
  const POLL_MS = 300; // interval de polling (ms) → ~3fps
  let lastTimestamp = 0;
  let relayActive = false;
  let pollTimer = null;

  const relayImg        = document.getElementById('relay-img');
  const relayPlaceholder = document.getElementById('relay-placeholder');
  const relayBadge      = document.getElementById('relay-badge');
  const relayStatusText = document.getElementById('relay-status-text');
  const btnRelayOcr     = document.getElementById('btn-relay-ocr');
  const relayOpenMobile = document.getElementById('relay-open-mobile');

  // Configurem l'enllaç al mòbil de forma dinàmica segons la ruta actual
  if (relayOpenMobile) {
    let path = window.location.pathname;
    // Extraiem el directori de la URL eliminant el fitxer del final si hi és (ex: index.html)
    const lastSlash = path.lastIndexOf('/');
    if (lastSlash !== -1) {
      path = path.substring(0, lastSlash + 1);
    } else {
      path = '/';
    }
    relayOpenMobile.href = path + 'camera_mobile/';
    const relayOpenMobilePaddle = document.getElementById('relay-open-mobile-paddle');
    if (relayOpenMobilePaddle) {
      relayOpenMobilePaddle.href = path + 'camera_mobile/index_paddle.html';
    }
  }

  if (!relayImg) return; // pàgina sense el panel de relay (ex: mòbil)

  async function pollFrame() {
    if (!isLocalHostOrIp()) return;
    try {
      const res = await fetch(`${getRelayBase()}/api/camera-frame?t=${Date.now()}`, {
        cache: 'no-store'
      });

      if (res.status === 204) {
        // Cap frame encara
        setInactive();
      } else if (res.ok) {
        const ts = res.headers.get('X-Frame-Timestamp') || Date.now();
        if (ts !== lastTimestamp) {
          lastTimestamp = ts;
          const blob = await res.blob();
          const url  = URL.createObjectURL(blob);
          const old  = relayImg.src;
          relayImg.src = url;
          relayImg.style.display = 'block';
          relayPlaceholder.style.display = 'none';
          if (old && old.startsWith('blob:')) URL.revokeObjectURL(old);
          setActive();
        }
      }
    } catch (e) {
      // Silenci — servidor no disponible o xarxa tallada
    }

    if (pollTimer !== null) {
      pollTimer = setTimeout(pollFrame, POLL_MS);
    }
  }

  function setActive() {
    if (!relayActive) {
      relayActive = true;
      relayBadge.className = 'live';
      btnRelayOcr.disabled = false;
      relayStatusText.textContent = 'Càmera mòbil connectada i transmetent.';
    }
  }

  function setInactive() {
    if (relayActive) {
      relayActive = false;
      relayBadge.className = '';
      btnRelayOcr.disabled = true;
      relayStatusText.textContent = 'Esperant connexió del mòbil…';
    }
  }

  // Comprovem l'estat de la connexió cada 2.5s per detectar desconnexions (només en local)
  if (isLocalHostOrIp()) {
    setInterval(async () => {
      try {
        const res = await fetch(`${getRelayBase()}/api/camera-status`);
        if (res.ok) {
          const data = await res.json();
          if (!data.active) setInactive();
        }
      } catch(e) {}
    }, 2500);
  }

  // Botó OCR: captura el frame actual i el processa
  btnRelayOcr.addEventListener('click', async () => {
    if (!relayImg.src || relayImg.style.display === 'none') return;

    btnRelayOcr.disabled = true;
    btnRelayOcr.textContent = '⏳ Processant…';
    relayStatusText.textContent = 'Executant OCR sobre el fotograma…';

    try {
      // Dibuixem la imatge en un canvas per poder-la passar a Tesseract
      const cvs = document.createElement('canvas');
      const img = new Image();
      img.crossOrigin = 'anonymous';
      img.src = relayImg.src;
      await img.decode();
      cvs.width  = img.naturalWidth;
      cvs.height = img.naturalHeight;
      cvs.getContext('2d').drawImage(img, 0, 0);

      // Mostrem el preview a la secció principal
      const previewEl  = document.getElementById('preview');
      const previewCon = document.getElementById('preview-container');
      if (previewEl && previewCon) {
        previewEl.src = relayImg.src;
        previewCon.style.display = 'block';
      }

      // Disparem el flux d'anàlisi existent: creem un File objecte i simulem el canvi
      cvs.toBlob(async (blob) => {
        const file = new File([blob], 'relay-frame.jpg', { type: 'image/jpeg' });
        const dt = new DataTransfer();
        dt.items.add(file);
        const fi = document.getElementById('file-input');
        if (fi) {
          fi.files = dt.files;
          fi.dispatchEvent(new Event('change', { bubbles: true }));
        }
      }, 'image/jpeg', 0.92);
    } catch (err) {
      relayStatusText.textContent = 'Error en processar: ' + err.message;
    } finally {
      setTimeout(() => {
        btnRelayOcr.disabled = false;
        btnRelayOcr.textContent = '🔍 Analitzar fotograma actual';
        relayStatusText.textContent = relayActive
          ? 'Càmera mòbil connectada i transmetent.'
          : 'Esperant connexió del mòbil…';
      }, 2000);
    }
  });

  // Iniciem el polling només si estem corrent localment (amb servidor Python)
  if (isLocalHostOrIp()) {
    pollTimer = setTimeout(pollFrame, 500);
  } else {
    // Si estem a GitHub Pages, amaguem controls locals inútils
    if (btnRelayOcr) btnRelayOcr.style.display = 'none';
    if (relayBadge) relayBadge.style.display = 'none';
  }
})();

// --- Filtre de Pre-processament d'Imatge (Visió per Computador Avançada) ---
function preprocessImage(file) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      
      const SCALE_FACTOR = 1.0;
      let width = img.width * SCALE_FACTOR;
      let height = img.height * SCALE_FACTOR;
      
      const MAX_WIDTH = 1000;
      if (width > MAX_WIDTH) {
        height = Math.round(height * (MAX_WIDTH / width));
        width = MAX_WIDTH;
      }
      
      canvas.width = width;
      canvas.height = height;
      ctx.imageSmoothingEnabled = false;
      ctx.mozImageSmoothingEnabled = false;
      ctx.webkitImageSmoothingEnabled = false;
      ctx.msImageSmoothingEnabled = false;
      ctx.drawImage(img, 0, 0, width, height);
      
      const imageData = ctx.getImageData(0, 0, width, height);
      const data = imageData.data;
      const numPixels = width * height;

      // 1. Equalització d'histograma a color per a la visualització de l'usuari (mantenint un disseny premium)
      const histR = new Array(256).fill(0);
      const histG = new Array(256).fill(0);
      const histB = new Array(256).fill(0);
      for (let i = 0; i < data.length; i += 4) {
        histR[data[i]]++;
        histG[data[i+1]]++;
        histB[data[i+2]]++;
      }

      const cdfR = new Array(256).fill(0);
      const cdfG = new Array(256).fill(0);
      const cdfB = new Array(256).fill(0);
      cdfR[0] = histR[0]; cdfG[0] = histG[0]; cdfB[0] = histB[0];
      for (let i = 1; i < 256; i++) {
        cdfR[i] = cdfR[i-1] + histR[i];
        cdfG[i] = cdfG[i-1] + histG[i];
        cdfB[i] = cdfB[i-1] + histB[i];
      }
      
      const cdfMinR = cdfR.find(v => v > 0) || 0;
      const cdfMinG = cdfG.find(v => v > 0) || 0;
      const cdfMinB = cdfB.find(v => v > 0) || 0;

      const lutR = cdfR.map(v => (numPixels === cdfMinR) ? 0 : Math.round(((v - cdfMinR) / (numPixels - cdfMinR)) * 255));
      const lutG = cdfG.map(v => (numPixels === cdfMinG) ? 0 : Math.round(((v - cdfMinG) / (numPixels - cdfMinG)) * 255));
      const lutB = cdfB.map(v => (numPixels === cdfMinB) ? 0 : Math.round(((v - cdfMinB) / (numPixels - cdfMinB)) * 255));

      const previewCanvas = document.createElement('canvas');
      previewCanvas.width = width;
      previewCanvas.height = height;
      const previewCtx = previewCanvas.getContext('2d');
      const previewImageData = previewCtx.createImageData(width, height);
      const previewData = previewImageData.data;

      for (let i = 0; i < data.length; i += 4) {
        const r = lutR[data[i]];
        const g = lutG[data[i+1]];
        const b = lutB[data[i+2]];
        previewData[i]   = r;
        previewData[i+1] = g;
        previewData[i+2] = b;
        previewData[i+3] = 255;
      }
      previewCtx.putImageData(previewImageData, 0, 0);
      const previewUrl = previewCanvas.toDataURL('image/jpeg', 1.0);

      // --- Càlcul de la llegibilitat / nitidesa (usant les dades en escala de grisos del preview) ---
      const normalGrays = new Uint8Array(numPixels);
      for (let i = 0; i < numPixels; i++) {
        normalGrays[i] = Math.round((previewData[i*4] + previewData[i*4+1] + previewData[i*4+2]) / 3);
      }

      let minGrayVal = 255, maxGrayVal = 0, edgeSumVal = 0, edgeCountVal = 0;
      const step = Math.max(1, Math.round(numPixels / 40000));
      for (let i = 0; i < numPixels; i += step) {
        const g = normalGrays[i];
        if (g < minGrayVal) minGrayVal = g;
        if (g > maxGrayVal) maxGrayVal = g;
      }
      const contrastVal = maxGrayVal - minGrayVal;
      const skip = step * 2 + 1;
      for (let y = 1; y < height - 1; y += skip) {
        for (let x = 1; x < width - 1; x += skip) {
          const idx = y * width + x;
          const val = normalGrays[idx];
          const diffX = Math.abs(val - normalGrays[idx + 1]);
          const diffY = Math.abs(val - normalGrays[idx + width]);
          if (diffX > 15 || diffY > 15) { edgeSumVal += (diffX + diffY); edgeCountVal++; }
        }
      }
      const edgeDensityVal = edgeCountVal / ((width * height) / (skip * skip));
      const avgEdgeStrengthVal = edgeCountVal > 0 ? (edgeSumVal / edgeCountVal) : 0;
      let readabilityScore = Math.round((Math.min(100, Math.round((avgEdgeStrengthVal/50)*100)) * 0.6) +
                                        (Math.min(100, Math.round((edgeDensityVal/0.16)*100)) * 0.4));
      if (contrastVal < 90) readabilityScore = Math.round(readabilityScore * (contrastVal / 90));
      readabilityScore = Math.max(5, Math.min(99, readabilityScore));

      let readabilityLabel = '', readabilityColor = '';
      if (readabilityScore < 40)      { readabilityLabel = '⚠️ Desenfocada o amb poc text'; readabilityColor = '#e74c3c'; }
      else if (readabilityScore < 75) { readabilityLabel = '⚡ Nitidesa mitjana';            readabilityColor = '#f39c12'; }
      else                            { readabilityLabel = '✨ Nitidesa excel·lent';          readabilityColor = '#2ecc71'; }

      resolve({ previewUrl, readabilityScore, readabilityLabel, readabilityColor });
    };
    img.onerror = reject;
    
    const reader = new FileReader();
    reader.onload = (e) => { img.src = e.target.result; };
    reader.readAsDataURL(file);
  });
}

// Funció per calcular el % de paraules del títol i de l'autor que es troben dins l'OCR
function calculateOverlapScore(book, ocrTextRaw) {
  const ocrWords = new Set(ocrTextRaw.toLowerCase().replace(/[^\w\sàéèíóòúüçñ]/g, '').split(/\s+/));
  
  // Analitzar Títol
  const titleWords = (book.title || '').toLowerCase().replace(/[^\w\sàéèíóòúüçñ]/g, '').split(/\s+/).filter(w => w.length > 1);
  let titleMatches = 0;
  for (let w of titleWords) {
    if (ocrWords.has(w)) titleMatches++;
  }
  const titleScore = titleWords.length > 0 ? (titleMatches / titleWords.length) : 0;

  // Analitzar Autor
  let authorScore = 0;
  if (book.author_name && book.author_name.length > 0) {
    const authorWords = book.author_name[0].toLowerCase().replace(/[^\w\sàéèíóòúüçñ]/g, '').split(/\s+/).filter(w => w.length > 1);
    let authorMatches = 0;
    for (let w of authorWords) {
      if (ocrWords.has(w)) authorMatches++;
    }
    authorScore = authorWords.length > 0 ? (authorMatches / authorWords.length) : 0;
  }

  return (titleScore * 0.6) + (authorScore * 0.4);
}

document.addEventListener('DOMContentLoaded', () => {
  const fileInput = document.getElementById('file-input');
  const preview = document.getElementById('preview');
  const previewContainer = document.getElementById('preview-container');
  const overlayCanvas = document.getElementById('overlay-canvas');
  const status = document.getElementById('status');
  const resultsContainer = document.getElementById('results-container');
  const rawOcr = document.getElementById('raw-ocr');
  const cleanOcr = document.getElementById('clean-ocr');
  const bookResults = document.getElementById('book-results');
  const thresholdSlider = document.getElementById('threshold-slider');
  const thresholdVal = document.getElementById('threshold-val');


  // --- Generació i enllaç de la Sessió de Sincronització Estàtica (GitHub Pages) ---
  let sessionID = localStorage.getItem('biblioscan_session_id');
  if (!sessionID) {
    sessionID = Math.random().toString(36).substring(2, 8).toUpperCase();
    localStorage.setItem('biblioscan_session_id', sessionID);
  }

  const qrImg = document.getElementById('session-qr');
  const relayOpenMobile = document.getElementById('relay-open-mobile');
  const relayStatusText = document.getElementById('relay-status-text');

  if (qrImg) {
    let path = window.location.pathname;
    const lastSlash = path.lastIndexOf('/');
    if (lastSlash !== -1) {
      path = path.substring(0, lastSlash + 1);
    } else {
      path = '/';
    }
    const mobileUrl = `${window.location.origin}${path}camera_mobile/?session=${sessionID}`;
    qrImg.src = `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(mobileUrl)}`;
    
    if (relayOpenMobile) {
      relayOpenMobile.href = mobileUrl;
    }
    const relayOpenMobilePaddle = document.getElementById('relay-open-mobile-paddle');
    if (relayOpenMobilePaddle) {
      relayOpenMobilePaddle.href = `${window.location.origin}${path}camera_mobile/index_paddle.html?session=${sessionID}`;
    }
  }

  if (relayStatusText) {
    relayStatusText.innerHTML = `Sessió: <strong>${sessionID}</strong>. Escoltant canal estàtic...`;
  }

  // Connexió SSE cap a ntfy.sh per a rebre llibres directament des del mòbil
  const eventSource = new EventSource(`https://ntfy.sh/biblioscan-sync-${sessionID}/sse`);
  
  eventSource.onopen = () => {
    console.log(`📡 Connexió SSE oberta correctament amb ntfy.sh per al canal: biblioscan-sync-${sessionID}`);
  };

  eventSource.onerror = (e) => {
    console.error("❌ Error o desconnexió SSE amb ntfy.sh:", e);
  };

  eventSource.onmessage = (event) => {
    console.log("📥 Nou missatge rebut de ntfy.sh (dades brutes):", event.data);
    try {
      const msg = JSON.parse(event.data);
      if (msg && msg.message) {
        console.log("📥 Contingut del missatge (msg.message):", msg.message);
        const payload = JSON.parse(msg.message);
        console.log("📥 Payload descodificat:", payload);
        if (payload) {
          if (payload.title) {
            console.log("📖 Llibre trobat correctament, processant...");
            handleSyncedBook(payload);
          } else if (payload.error) {
            console.log("⚠️ Avís/Error rebut des del mòbil, processant...");
            handleSyncedError(payload);
          }
        }
      }
    } catch (e) {
      console.warn("⚠️ Error en processar/descodificar el missatge SSE de ntfy.sh (pot no ser JSON):", e);
    }
  };

  function handleSyncedError(payload) {
    if (relayStatusText) {
      relayStatusText.innerHTML = `📥 Rebut: <strong style="color: #e74c3c;">${payload.message || 'Error desconegut escanejant amb el mòbil.'}</strong>`;
    }
    
    // Actualitzem l'estat i esborrem resultats anteriors si n'hi ha
    if (status) {
      status.innerHTML = `<span style="color: #e74c3c;">${payload.message || 'Error de cerca mòbil.'}</span>`;
    }
    if (resultsContainer) {
      resultsContainer.style.display = 'block';
    }
    if (rawOcr) {
      rawOcr.innerHTML = `<strong>[Sincronització Mòbil] Error:</strong> ${payload.message || 'No s\'han trobat resultats.'}`;
    }
    if (cleanOcr) {
      cleanOcr.innerText = 'Cerca fallida des del mòbil.';
    }
    if (bookResults) {
      bookResults.innerHTML = `<p style="color: #e74c3c;">${payload.message || 'No s\'ha trobat cap llibre.'}</p>`;
    }
  }

  function handleSyncedBook(payload) {
    if (relayStatusText) {
      relayStatusText.innerHTML = `📥 Rebut: <strong style="color: #2ecc71;">${payload.title}</strong> (${payload.score}% coinc.)`;
    }
    
    // Omplim la interfície principal
    resultsContainer.style.display = 'block';
    rawOcr.innerText = `[Sincronització Mòbil]\n${payload.title}\n${payload.authors}\nISBN: ${payload.isbn}`;
    cleanOcr.innerText = `${payload.title}\n${payload.authors}`;
    
    const doc = {
      title: payload.title,
      author_name: payload.authors ? [payload.authors] : ['Desconegut'],
      publisher: payload.publisher ? [payload.publisher] : ['Desconegut'],
      first_publish_year: payload.publishYear,
      isbn: payload.isbn ? [payload.isbn] : [],
      publish_place: payload.place ? [payload.place] : [],
      subject: payload.subjects ? payload.subjects.split(', ') : []
    };
    
    allScoredBooks = [{
      book: doc,
      score: payload.score / 100,
      matchedWords: []
    }];
    
    window._biblio.allScoredBooks = allScoredBooks;
    renderBookList();
    
    // Per si de cas l'usuari corre en local, enviem una còpia al webhook local
    fetch(`${getRelayBase()}/api/sync-poll`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        title: payload.title,
        authors: payload.authors,
        publisher: payload.publisher,
        publishYear: payload.publishYear,
        isbn: payload.isbn,
        place: payload.place,
        subjects: payload.subjects
      })
    }).catch(e => {});
  }

  // Sincronització Bookmarklet via SSE (sense dependre del servidor local Python)
  const bookmarkletLink = document.getElementById('bookmarklet-link');
  if (bookmarkletLink) {
    const bookmarkletCode = `javascript:(async () => {
      console.log("Iniciant sincronització BiblioScan estàtica...");
      let active = true;
      const statusDiv = document.createElement('div');
      statusDiv.style.position = 'fixed';
      statusDiv.style.top = '10px';
      statusDiv.style.right = '10px';
      statusDiv.style.background = '#2ecc71';
      statusDiv.style.color = 'white';
      statusDiv.style.padding = '10px 15px';
      statusDiv.style.borderRadius = '5px';
      statusDiv.style.zIndex = '999999';
      statusDiv.style.fontFamily = 'sans-serif';
      statusDiv.style.fontSize = '12px';
      statusDiv.style.boxShadow = '0 2px 10px rgba(0,0,0,0.2)';
      statusDiv.innerHTML = '🔄 Escoltant canal BiblioScan (${sessionID})... <button id="stop-sync-btn" style="background:none;border:none;color:white;font-weight:bold;cursor:pointer;margin-left:10px;">[X]</button>';
      document.body.appendChild(statusDiv);
      
      document.getElementById('stop-sync-btn').onclick = () => {
        active = false;
        statusDiv.remove();
        alert("Sincronització aturada.");
      };

      const eventSource = new EventSource('https://ntfy.sh/biblioscan-sync-${sessionID}/sse');
      eventSource.onmessage = (event) => {
        if (!active) { eventSource.close(); return; }
        try {
          const msg = JSON.parse(event.data);
          if (msg && msg.message) {
            const data = JSON.parse(msg.message);
            if (data && data.title) {
              statusDiv.style.background = '#3498db';
              statusDiv.innerHTML = '📥 Rebut: ' + data.title + '...';
              
              const mappings = {
                'titol': data.title,
                'title': data.title,
                'nom': data.title,
                'name': data.title,
                'autor': data.authors,
                'author': data.authors,
                'creator': data.authors,
                'editorial': data.publisher,
                'publisher': data.publisher,
                'editorial_dest': data.publisher,
                'any': data.publishYear,
                'year': data.publishYear,
                'date': data.publishYear,
                'lloc': data.place,
                'place': data.place,
                'isbn': data.isbn,
                'gènere': data.subjects,
                'genere': data.subjects,
                'subject': data.subjects,
                'tema': data.subjects
              };
              
              const inputs = Array.from(document.querySelectorAll('input, textarea, select'));
              inputs.forEach(el => {
                const name = (el.name || el.id || el.className || '').toLowerCase();
                for (const [key, val] of Object.entries(mappings)) {
                  if (name.includes(key) && val) {
                    el.value = val;
                    el.dispatchEvent(new Event('input', { bubbles: true }));
                    el.dispatchEvent(new Event('change', { bubbles: true }));
                  }
                }
              });

              setTimeout(() => {
                statusDiv.style.background = '#2ecc71';
                statusDiv.innerHTML = '🔄 Escoltant canal BiblioScan (${sessionID})... <button id="stop-sync-btn" style="background:none;border:none;color:white;font-weight:bold;cursor:pointer;margin-left:10px;">[X]</button>';
                const stopBtn = document.getElementById('stop-sync-btn');
                if (stopBtn) {
                  stopBtn.onclick = () => {
                    active = false;
                    statusDiv.remove();
                  };
                }
              }, 3000);
            }
          }
        } catch (e) {
          console.error("Error al processar missatge SSE:", e);
        }
      };
    })();`;
    bookmarkletLink.href = bookmarkletCode.replace(/\s+/g, ' ');
  }

  // Variables d'estat per a la renderització dinàmica amb la barra de probabilitat
  let allScoredBooks = window._biblio.allScoredBooks;
  let lastSearchStrategy = window._biblio.lastSearchStrategy;
  let lastUsedBNE = window._biblio.lastUsedBNE;
  let currentThreshold = window._biblio.currentThreshold;

  thresholdSlider.addEventListener('input', (e) => {
    const val = parseInt(e.target.value);
    thresholdVal.innerText = `${val}%`;
    currentThreshold = val / 100;
    if (allScoredBooks.length > 0) {
      renderBookList();
    }
  });



  // Helper per descarregar fitxers grans mostrant el progrés a la interfície
  async function fetchWithProgress(url, label, statusElement) {
    console.log(`[PaddleOCR:fetchWithProgress] Iniciant descàrrega de: ${label} des de ${url}`);
    statusElement.innerHTML = `⚙️ Connectant per descarregar ${label}...`;
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Error ${response.status} descarregant ${label} des de: ${url}`);
    }
    
    const contentLength = response.headers.get('content-length');
    const total = contentLength ? parseInt(contentLength, 10) : 0;
    
    if (total === 0) {
      statusElement.innerHTML = `⚙️ Descarregant ${label} (mida desconeguda)...`;
      const blob = await response.blob();
      console.log(`[PaddleOCR:fetchWithProgress] Finalitzada descàrrega (mida desconeguda) de: ${label}`);
      return URL.createObjectURL(blob);
    }
    
    const reader = response.body.getReader();
    let loaded = 0;
    const chunks = [];
    
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      chunks.push(value);
      loaded += value.length;
      const pct = Math.round((loaded / total) * 100);
      statusElement.innerHTML = `⚙️ Descarregant ${label}: <strong>${pct}%</strong> (${(loaded / 1024 / 1024).toFixed(1)}MB de ${(total / 1024 / 1024).toFixed(1)}MB)...`;
    }
    
    const blob = new Blob(chunks);
    console.log(`[PaddleOCR:fetchWithProgress] Finalitzada descàrrega de: ${label}`);
    return URL.createObjectURL(blob);
  }

  // Lazy-inicialitzador de PaddleOCR per a ordinador
  let ocrInstance = null;
  async function getOcrInstance() {
    if (ocrInstance) return ocrInstance;
    console.log("[PaddleOCR] getOcrInstance iniciat a l'ordinador.");
    status.innerHTML = `⚙️ Inicialitzant: Carregant llibreria PaddleOCR...`;
    
    try {
      console.log("[PaddleOCR] Important la llibreria local ./paddleocr.js...");
      const module = await import('./paddleocr.js?t=' + Date.now());
      const PaddleOCR = module.PaddleOCR;
      console.log("[PaddleOCR] Llibreria importada correctament.");

      // Resoldre les adreces dels models des del servidor propi o repositori CDN
      const isLocalFile = window.location.protocol === 'file:';
      let detUrl = '';
      let recUrl = '';

      if (!isLocalFile) {
        detUrl = new URL('./models/PP-OCRv5_mobile_det_onnx.tar?t=' + Date.now(), window.location.href).href;
        recUrl = new URL('./models/PP-OCRv5_mobile_rec_onnx.tar?t=' + Date.now(), window.location.href).href;
      } else {
        // Si estem en file://, demanem els fitxers al CDN del repositori de GitHub
        detUrl = 'https://rogroc.github.io/open_library/models/PP-OCRv5_mobile_det_onnx.tar?t=' + Date.now();
        recUrl = 'https://rogroc.github.io/open_library/models/PP-OCRv5_mobile_rec_onnx.tar?t=' + Date.now();
      }
      
      console.log("[PaddleOCR] Rutes resoltes a l'ordinador:", { detUrl, recUrl });

      // Descarreguem ambdós fitxers mostrant el progrés a la interfície
      console.log("[PaddleOCR] Descarregant model de detecció...");
      const localDetObjectUrl = await fetchWithProgress(detUrl, 'model de detecció (4.8MB)', status);
      console.log("[PaddleOCR] Descarregant model de reconeixement...");
      const localRecObjectUrl = await fetchWithProgress(recUrl, 'model de reconeixement (16.7MB)', status);

      status.innerHTML = `⚙️ Inicialitzant el motor de xarxa neuronal...`;
      console.log("[PaddleOCR] Cridant PaddleOCR.create()...");

      ocrInstance = await PaddleOCR.create({
        lang: 'en', // L'idioma English reconeix tots els caràcters llatins (català, castellà, etc.)
        ocrVersion: 'PP-OCRv5',
        worker: false,
        ensureServedFromHttp: () => {},
        text_detection_model_name: 'PP-OCRv5_mobile_det',
        text_detection_model_dir: { url: localDetObjectUrl },
        text_recognition_model_name: 'PP-OCRv5_mobile_rec',
        text_recognition_model_dir: { url: localRecObjectUrl },
        ortOptions: {
          backend: 'wasm',
          wasmPaths: 'https://cdn.jsdelivr.net/npm/onnxruntime-web@1.24.3/dist/',
          numThreads: 1, // Usem 1 fil per evitar necessitat de COOP/COEP headers i SharedArrayBuffer
          simd: true,
          proxy: false  // Desactiva el Web Worker de proxy intern d'ONNX per evitar bloquejos de CORS/sandbox
        }
      });
      console.log("[PaddleOCR] ocrInstance inicialitzat correctament a l'ordinador.");

      // Solució Híbrida: PaddleOCR per a detecció, Tesseract per a reconeixement
      if (ocrInstance) {
        // 1. Ampliem les àrees de detecció (polígons) de PaddleOCR amb un marge de 6px mantenint la inclinació original del polígon
        if (ocrInstance.detModel) {
          console.log("[HybridOCR] Configurant ampliació de marges de detecció conservant inclinació (6px)...");
          const originalDetPredict = ocrInstance.detModel.predict;
          ocrInstance.detModel.predict = async function(cv, mats, options) {
            const results = await originalDetPredict.call(ocrInstance.detModel, cv, mats, options);
            const margin = 6;
            results.forEach((res, imgIdx) => {
              if (res && res.boxes) {
                const mat = mats[imgIdx];
                const maxW = mat ? mat.cols : 99999;
                const maxH = mat ? mat.rows : 99999;
                
                res.boxes.forEach(box => {
                  if (box.poly && box.poly.length === 4) {
                    // Modifiquem cadascun dels 4 punts conservant el paral·lelogram original
                    // 0: top-left, 1: top-right, 2: bottom-right, 3: bottom-left
                    box.poly[0][0] = Math.max(0, box.poly[0][0] - margin);
                    box.poly[0][1] = Math.max(0, box.poly[0][1] - margin);
                    
                    box.poly[1][0] = Math.min(maxW, box.poly[1][0] + margin);
                    box.poly[1][1] = Math.max(0, box.poly[1][1] - margin);
                    
                    box.poly[2][0] = Math.min(maxW, box.poly[2][0] + margin);
                    box.poly[2][1] = Math.min(maxH, box.poly[2][1] + margin);
                    
                    box.poly[3][0] = Math.max(0, box.poly[3][0] - margin);
                    box.poly[3][1] = Math.min(maxH, box.poly[3][1] + margin);
                  }
                });
              }
            });
            return results;
          };
        }

        // 2. Estratègia de Màscara: PaddleOCR detecta on és el text, generem una
        //    imatge nova (fons blanc + text preservat), i Tesseract llegeix la pàgina sencera.
        //    Això dona a Tesseract el context de maquetació complet per una precisió molt superior.
        console.log("[HybridOCR] Estratègia de Màscara: PaddleOCR (detecció) + Tesseract (reconeixement pàgina completa) activada.");
        
        // Inicialitzem els 2 workers de Tesseract (cat, spa) una sola vegada
        if (!window.tesseractParallelWorkersInitialized) {
          console.log("[HybridOCR] Inicialitzant els 2 workers de Tesseract (cat, spa)...");
          const [wCat, wSpa] = await Promise.all([
            Tesseract.createWorker('cat'),
            Tesseract.createWorker('spa')
          ]);
          window.tesseractWorkerCat = wCat;
          window.tesseractWorkerSpa = wSpa;
          // PSM 3: anàlisi automàtica de pàgina completa (Tesseract tria les columnes/línies ell mateix)
          await Promise.all([
            window.tesseractWorkerCat.setParameters({ tessedit_pageseg_mode: '3' }),
            window.tesseractWorkerSpa.setParameters({ tessedit_pageseg_mode: '3' })
          ]);
          window.tesseractParallelWorkersInitialized = true;
          console.log("[HybridOCR] Workers Tesseract preparats (PSM 3).");
        }
        
        // Guardem la referència al canvas de la imatge original per construir la màscara
        ocrInstance._sourceCanvas = null;
        
        // Sobreescrivim recModel.predict perquè retorni resultats buits i lleugers:
        // el reconeixement real es fa a performMaskedOcr(), que s'invoca des de handleFile
        // un cop tenim tant els polígons com el canvas de la imatge original.
        if (ocrInstance.recModel) {
          ocrInstance.recModel.predict = async function(cv, mats, options) {
            // Retornem un placeholder per cada mat; el text real el posarà performMaskedOcr
            return mats.map(() => ({ text: '__MASK_PENDING__', score: 1.0 }));
          };
        }
      }

      return ocrInstance;
    } catch (err) {
      console.error("[PaddleOCR] Error en getOcrInstance (ordinador):", err);
      status.innerHTML = `<span style="color: #e74c3c">❌ Error inicialització: ${err.message}</span>`;
      throw err;
    }
  }

  fileInput.addEventListener('change', handleFile);

  async function handleFile(e) {
    const file = e.target.files[0];
    if (!file) return;

    // Reset UI
    resultsContainer.style.display = 'none';
    bookResults.innerHTML = '';
    previewContainer.style.display = 'none';
    
    // Show preview
    const reader = new FileReader();
    reader.onload = (event) => {
      preview.src = event.target.result;
      previewContainer.style.display = 'block';
    };
    reader.readAsDataURL(file);

    try {
      status.innerText = '⚙️ Inicialitzant motor OCR i aplicant filtres de visió...';
      const { 
        previewUrl, readabilityScore, readabilityLabel, readabilityColor
      } = await preprocessImage(file);
      
      // Mostrem la imatge a color equalitzada al preview
      preview.src = previewUrl;
      
      // Mostrem la llegibilitat de la foto abans de fer OCR
      status.innerHTML = `⚙️ Nitidesa de la foto: <strong style="color: ${readabilityColor}">${readabilityScore}% (${readabilityLabel})</strong>.<br>Inicialitzant PaddleOCR...`;
      
      const ocr = await getOcrInstance();
      
      status.innerText = '🔍 Detectant àrees de text amb PaddleOCR...';
      const colorBlob = await fetch(previewUrl).then(r => r.blob());
      const ocrRes = await ocr.predict(colorBlob, {
        text_det_limit_side_len: 960,
        text_det_limit_type: 'min',
        text_det_thresh: 0.2,
        text_det_box_thresh: 0.4
      });

      // Extraiem els polígons detectats per PaddleOCR
      const pageResult = ocrRes[0] || {};
      const detectedPolys = (pageResult.items || []).map(item => item.poly);
      console.log(`[HybridOCR] PaddleOCR ha detectat ${detectedPolys.length} regions de text.`);

      if (detectedPolys.length === 0) {
        status.innerText = '❌ PaddleOCR no ha detectat cap àrea de text a la portada.';
        return;
      }

      // --- ESTRATÈGIA MÀSCARA ---
      // Carreguem la imatge color original en un canvas
      status.innerText = '🎭 Generant imatge màscara (fons blanc + text preservat)...';
      const sourceImg = await new Promise((resolve, reject) => {
        const img = new Image();
        img.onload = () => resolve(img);
        img.onerror = reject;
        img.src = previewUrl;
      });

      // Canvas de la imatge original
      const srcCanvas = document.createElement('canvas');
      srcCanvas.width = sourceImg.naturalWidth;
      srcCanvas.height = sourceImg.naturalHeight;
      const srcCtx = srcCanvas.getContext('2d');
      srcCtx.drawImage(sourceImg, 0, 0);

      // Canvas màscara: fons blanc, es dibuixa cada polígon binaritzat (negre sobre blanc)
      const maskCanvas = document.createElement('canvas');
      maskCanvas.width = srcCanvas.width;
      maskCanvas.height = srcCanvas.height;
      const maskCtx = maskCanvas.getContext('2d');
      maskCtx.fillStyle = '#ffffff';
      maskCtx.fillRect(0, 0, maskCanvas.width, maskCanvas.height);

      const PAD = 8;
      for (const poly of detectedPolys) {
        if (!poly || poly.length < 3) continue;

        // Bounding box del polígon (ampliada)
        const xs = poly.map(p => p[0]);
        const ys = poly.map(p => p[1]);
        const bx0 = Math.max(0, Math.floor(Math.min(...xs)) - PAD);
        const by0 = Math.max(0, Math.floor(Math.min(...ys)) - PAD);
        const bx1 = Math.min(srcCanvas.width,  Math.ceil(Math.max(...xs)) + PAD);
        const by1 = Math.min(srcCanvas.height, Math.ceil(Math.max(...ys)) + PAD);
        const bw = bx1 - bx0;
        const bh = by1 - by0;
        if (bw <= 0 || bh <= 0) continue;

        // Llegim els píxels originals de la zona del polígon
        const regionData = srcCtx.getImageData(bx0, by0, bw, bh);
        const d = regionData.data;

        // Convertim a escala de grisos i trobem els percentils 10 i 90 per resoldre el llindar localment
        const grays = new Uint8Array(bw * bh);
        for (let i = 0; i < bw * bh; i++) {
          const r = d[i * 4];
          const g = d[i * 4 + 1];
          const b = d[i * 4 + 2];
          grays[i] = Math.round(0.299 * r + 0.587 * g + 0.114 * b);
        }

        const sortedGrays = new Uint8Array(grays);
        sortedGrays.sort();
        const p10 = sortedGrays[Math.floor(sortedGrays.length * 0.10)];
        const p90 = sortedGrays[Math.floor(sortedGrays.length * 0.90)];
        const threshold = (p10 + p90) / 2;

        // Calculem la brillantor del fons a partir de les vores del polígon
        const borderWidth = Math.max(1, Math.min(4, Math.floor(Math.min(bw, bh) / 6)));
        let sumBg = 0;
        let countBg = 0;
        for (let y = 0; y < bh; y++) {
          for (let x = 0; x < bw; x++) {
            const isBorder = (x < borderWidth || x >= bw - borderWidth || y < borderWidth || y >= bh - borderWidth);
            if (isBorder) {
              sumBg += grays[y * bw + x];
              countBg++;
            }
          }
        }
        const bgBr = countBg > 0 ? (sumBg / countBg) : 128;
        const darkText = bgBr > threshold;

        // Binaritzem de forma adaptativa segons si el text és fosc o clar respecte al fons
        for (let i = 0; i < bw * bh; i++) {
          const gray = grays[i];
          const val = darkText ? (gray < threshold ? 0 : 255) : (gray > threshold ? 0 : 255);
          const dIdx = i * 4;
          d[dIdx] = val;
          d[dIdx+1] = val;
          d[dIdx+2] = val;
          d[dIdx+3] = 255;
        }

        // Dibuixem la regió binaritzada al canvas màscara amb el clip del polígon
        const tmpC = document.createElement('canvas');
        tmpC.width = bw; tmpC.height = bh;
        tmpC.getContext('2d').putImageData(regionData, 0, 0);

        maskCtx.save();
        maskCtx.beginPath();
        const cxp = poly.reduce((s, p) => s + p[0], 0) / poly.length;
        const cyp = poly.reduce((s, p) => s + p[1], 0) / poly.length;
        poly.forEach((pt, idx) => {
          const dx = pt[0] - cxp; const dy = pt[1] - cyp;
          const len = Math.sqrt(dx*dx + dy*dy) || 1;
          const ex = pt[0] + (dx/len)*PAD; const ey = pt[1] + (dy/len)*PAD;
          if (idx === 0) maskCtx.moveTo(ex, ey); else maskCtx.lineTo(ex, ey);
        });
        maskCtx.closePath();
        maskCtx.clip();
        maskCtx.drawImage(tmpC, bx0, by0);
        maskCtx.restore();
      }

      console.log('[HybridOCR] Imatge màscara generada. Enviant a Tesseract (PSM 3)...');
      status.innerText = '📖 Llegint text amb Tesseract (pàgina completa)...';

      // Executem Tesseract en paral·lel (cat + spa) sobre la imatge màscara completa
      const [resCat, resSpa] = await Promise.all([
        window.tesseractWorkerCat.recognize(maskCanvas),
        window.tesseractWorkerSpa.recognize(maskCanvas)
      ]);

      // Triem l'idioma amb més confiança global
      const catConf = resCat.data.confidence;
      const spaConf = resSpa.data.confidence;
      const bestRes = catConf >= spaConf ? resCat : resSpa;
      const bestLang = catConf >= spaConf ? 'cat' : 'spa';
      console.log(`[HybridOCR] Confiança cat=${catConf}%, spa=${spaConf}% → triat: ${bestLang}`);

      // Convertim les paraules de Tesseract al format que espera la resta del codi
      const tesseractWords = bestRes.data.words || [];
      const wordsNormal = tesseractWords
        .filter(w => w.confidence > 30 && w.text.trim().length > 0)
        .map(w => ({
          text: w.text.trim(),
          confidence: w.confidence,
          bbox: { x0: w.bbox.x0, y0: w.bbox.y0, x1: w.bbox.x1, y1: w.bbox.y1 },
          source: 'mask_tesseract'
        }));

      if (wordsNormal.length === 0) {
        status.innerText = '❌ No s\'ha detectat cap paraula a la portada.';
        return;
      }

      // Filtrem per alçada mínima (20% de la lletra més gran) i confiança > 40
      const allHeights = wordsNormal.map(w => w.bbox.y1 - w.bbox.y0);
      const maxWordHeight = allHeights.length > 0 ? Math.max(...allHeights) : 0;
      const heightThreshold = maxWordHeight * 0.20;
      const mergedWords = wordsNormal.filter(w =>
        (w.bbox.y1 - w.bbox.y0) >= heightThreshold && w.confidence > 40
      );

      // Dibuixem les caixes de visió artificial sobre la imatge de preview
      const ctx = overlayCanvas.getContext('2d');
      overlayCanvas.width = preview.naturalWidth || preview.width || 600;
      overlayCanvas.height = preview.naturalHeight || preview.height || 800;
      ctx.clearRect(0, 0, overlayCanvas.width, overlayCanvas.height);
      ctx.lineWidth = Math.max(2, Math.round(overlayCanvas.width / 400));

      // Descartades en vermell tènue
      wordsNormal.filter(w => !mergedWords.includes(w)).forEach(w => {
        ctx.strokeStyle = 'rgba(231, 76, 60, 0.3)';
        ctx.fillStyle   = 'rgba(231, 76, 60, 0.03)';
        ctx.fillRect(w.bbox.x0, w.bbox.y0, w.bbox.x1 - w.bbox.x0, w.bbox.y1 - w.bbox.y0);
        ctx.strokeRect(w.bbox.x0, w.bbox.y0, w.bbox.x1 - w.bbox.x0, w.bbox.y1 - w.bbox.y0);
      });
      // Vàlides en verd
      mergedWords.forEach(w => {
        ctx.strokeStyle = 'rgba(46, 204, 113, 0.9)';
        ctx.fillStyle   = 'rgba(46, 204, 113, 0.15)';
        ctx.fillRect(w.bbox.x0, w.bbox.y0, w.bbox.x1 - w.bbox.x0, w.bbox.y1 - w.bbox.y0);
        ctx.strokeRect(w.bbox.x0, w.bbox.y0, w.bbox.x1 - w.bbox.x0, w.bbox.y1 - w.bbox.y0);
      });

      if (mergedWords.length === 0) {
        status.innerText = '❌ No s\'ha trobat cap bloc de text principal a la portada.';
        resultsContainer.style.display = 'block';
        rawOcr.innerHTML = `<strong>Avís:</strong> S'han filtrat totes les paraules.\n\n` +
                           `<strong>Paraules brutes detectades:</strong>\n` +
                           wordsNormal.map(w => `- "${w.text}" (confiança: ${w.confidence}%, y: ${w.bbox.y0}px-${w.bbox.y1}px)`).join('\n');
        return;
      }

      // Ordenem les paraules de dalt a baix i d'esquerra a dreta segons la seva posició per mantenir el flux de lectura coherent
      mergedWords.sort((a, b) => {
        if (Math.abs(a.bbox.y0 - b.bbox.y0) < 15) {
          return a.bbox.x0 - b.bbox.x0;
        }
        return a.bbox.y0 - b.bbox.y0;
      });

      let text = mergedWords.map(w => w.text).join(' ');

      // 2. NORMALITZACIÓ D'ARTEFACTES D'OCR
      // Arreglem el clàssic error de la xarxa neuronal LSTM que confon la "ñ" amb la lligadura "fi"
      text = text.replace(/ufia/gi, 'uña')
                 .replace(/fio/gi, 'ño')
                 .replace(/fia/gi, 'ña')
                 .replace(/iriba/gi, 'i riba')
                 .replace(/\brba\b/gi, 'riba')
                 .replace(/ll['’]?imperí?/gi, "i l'imperi")
                 .replace(/il['’]?imperí?/gi, "i l'imperi")
                 .replace(/l['’]?imperí?/gi, "l'imperi");

      resultsContainer.style.display = 'block';
      rawOcr.innerHTML = `<strong>Text final normalitzat:</strong> ${text}\n\n` +
                         `<strong>Llista detallada de paraules detectades:</strong>\n` +
                         mergedWords.map(w => `- [${w.source}] "${w.text}" (confiança: ${w.confidence}%, y: ${w.bbox.y0}px-${w.bbox.y1}px)`).join('\n');
      
       status.innerText = '🧹 Netejant i analitzant el text...';
       const stopwords = new Set(['el', 'la', 'els', 'les', 'un', 'una', 'de', 'del', 'i', 'a', 'en', 'per', 'amb', 'y', 'los', 'las', 'para', 'con', 'the', 'of', 'and', 'in', 'for']);
       
       const cleanText = text.toLowerCase().replace(/[^\w\sàéèíóòúüçñ]/g, '');
       const ocrWordsList = cleanText.split(/\s+/);
       const keywords = ocrWordsList.filter(w => !stopwords.has(w) && w.length > 2);

      cleanOcr.innerText = `Paraules clau extretes:\n[ ${keywords.join(', ')} ]`;
      
      if (keywords.length === 0) {
        status.innerText = '❌ El text llegit era massa curt o invàlid.';
        return;
      }

      // Ara com que hem netejat tota la brossa gràcies al filtre de Confiança, 
      // podem enviar totes les paraules a Open Library sense por a contaminar la cerca.
      const apiKeywords = keywords.slice(0, 8);

      // Cerca ampla a l'API: Demanem fins a 30 resultats per reordenar-los localment
      status.innerText = '🌐 Cercant a Open Library (Cerca estricta AND)...';
      let andQuery = apiKeywords.join('+');
      let url = `https://openlibrary.org/search.json?q=${andQuery}&fields=key,title,author_name,first_publish_year,cover_i,publisher&limit=30`;
      
      let response = await fetch(url);
      let data = await response.json();
      let searchStrategy = 'AND (Totes les paraules principals)';

      if (data.numFound === 0 || data.docs.length === 0) {
        status.innerText = '🌐 Cap resultat exacte. Cercant amb Cerca laxada OR...';
        searchStrategy = 'OR (Major nombre de coincidències)';
        let orQuery = apiKeywords.join('+OR+');
        url = `https://openlibrary.org/search.json?q=${orQuery}&fields=key,title,author_name,first_publish_year,cover_i,publisher&limit=30`;
        response = await fetch(url);
        data = await response.json();
      }

      status.innerText = '✅ Analitzant les probabilitats...';
      
      if (data.numFound === 0 || data.docs.length === 0) {
        bookResults.innerHTML = '<p>No s\'ha trobat cap llibre a nivell mundial que tingui aquestes paraules.</p>';
        return;
      }

      // Filtrar i Reordenar localment basat en el nou algoritme de Token Overlap
      allScoredBooks = data.docs.map(book => {
        book.matchScore = calculateOverlapScore(book, text);
        return book;
      });
      window._biblio.allScoredBooks = allScoredBooks;
      lastSearchStrategy = searchStrategy;
      lastUsedBNE = false;

      // Calculem la millor nota obtinguda a Open Library per decidir si cal recórrer a la BNE (si és < 99%)
      const maxOLScore = allScoredBooks.length > 0 ? Math.max(...allScoredBooks.map(b => b.matchScore)) : 0;

      // Fallback a la BNE si no hi ha coincidència gairebé perfecta (>= 99%) i no som a GitHub Pages (allotjament estàtic)
      const isStaticGitHubPages = window.location.hostname.endsWith('github.io');
      if (maxOLScore < 0.99 && !isStaticGitHubPages) {
        status.innerText = '🌐 Coincidència Open Library parcial o inexistent. Consultant la BNE...';
        try {
          const bneQuery = apiKeywords.join(' ');
          const bneUrl = getBneApiUrl(bneQuery);
          
          // Timeout de 3 segons per evitar que es quedi penjat si hi ha problemes de xarxa o DNS
          const controller = new AbortController();
          const timeoutId = setTimeout(() => controller.abort(), 3000);

          const bneResData = await fetch(bneUrl, { signal: controller.signal })
            .then(r => r.ok ? r.json() : null)
            .catch(err => {
              console.warn("La crida a la BNE ha fallat o ha expirat el temps d'espera:", err);
              return null;
            })
            .finally(() => clearTimeout(timeoutId));
          
          if (bneResData && bneResData.docs && bneResData.docs.length > 0) {
            window.bneCache = window.bneCache || {};
            
            const bneBooks = bneResData.docs.map(doc => {
              const display = doc.pnx.display || {};
              const addata = doc.pnx.addata || {};
              
              let title = 'Llibre desconegut';
              if (display.title && display.title[0]) {
                title = display.title[0].split('/')[0].trim();
              }
              
              let author_name = [];
              if (display.creator && display.creator[0]) {
                author_name = [display.creator[0].split('$$')[0].trim()];
              } else if (addata.creatorfull && addata.creatorfull[0]) {
                author_name = [addata.creatorfull[0].split('$$')[0].trim()];
              }
              if (author_name.length > 0) {
                let cleanAuthor = author_name[0].replace(/[\d-]/g, '').trim();
                if (cleanAuthor.endsWith(',')) cleanAuthor = cleanAuthor.slice(0, -1).trim();
                if (cleanAuthor.includes(',')) {
                  cleanAuthor = cleanAuthor.split(',').reverse().join(' ').trim();
                }
                author_name = [cleanAuthor];
              }

              let publisher = [];
              if (display.publisher && display.publisher[0]) {
                let pub = display.publisher[0].split(':')[1];
                if (pub) pub = pub.split(',')[0].trim();
                else pub = display.publisher[0].trim();
                publisher = [pub];
              } else if (addata.pub && addata.pub[0]) {
                publisher = [addata.pub[0]];
              }

              let first_publish_year = display.creationdate ? display.creationdate[0] : 'Any desc.';
              let isbn = '';
              if (addata.isbn && addata.isbn[0]) {
                isbn = addata.isbn[0].replace(/[^0-9X]/gi, '');
              }

              const key = `/bne/${doc.context || 'L'}/${doc.recordid || (doc.pnx.control && doc.pnx.control.sourcrecordid ? doc.pnx.control.sourcrecordid[0] : Math.random())}`;
              window.bneCache[key] = doc;

              return {
                key: key,
                title: title,
                author_name: author_name,
                first_publish_year: first_publish_year,
                publisher: publisher,
                cover_i: null,
                isBNE: true,
                isbn: isbn
              };
            });

            let scoredBne = bneBooks.map(book => {
              book.matchScore = calculateOverlapScore(book, text);
              return book;
            });

            // Afegim els resultats de la BNE a l'estat global de cerca
            allScoredBooks = [...allScoredBooks, ...scoredBne];
            window._biblio.allScoredBooks = allScoredBooks;
            if (scoredBne.length > 0) {
              lastUsedBNE = true;
            }
          }
        } catch (e) {
          console.warn("Error consultant la BNE:", e);
        }
      }

      // Pintem la llista a la interfície
      renderBookList();
    } catch (err) {
      console.error(err);
      status.innerText = `❌ Error en el procés: ${err.message}`;
    }
  }

  // --- FUNCIÓ DE PINTAT DINÀMIC QUE RESPECTA EL LLINDAR DEL SLIDER ---
  function renderBookList() {
    // Filtrem segons el llindar actual triat per l'usuari amb el slider
    let filtered = allScoredBooks.filter(book => book.matchScore >= currentThreshold);
    
    // Ordenem de major probabilitat a menor
    filtered.sort((a, b) => b.matchScore - a.matchScore);
    
    // Ens quedem amb els 5 millors resultats
    let topBooks = filtered.slice(0, 5);

    if (topBooks.length === 0) {
      status.innerText = '❌ Cerca finalitzada sense resultats.';
      bookResults.innerHTML = `<p style="color: #e74c3c;">❌ No s'ha trobat cap llibre coincident a Open Library ni a la BNE amb probabilitat >= ${(currentThreshold * 100).toFixed(0)}%.</p>`;
      return;
    }

    status.innerText = '✅ Cerca finalitzada.';
    let htmlContent = `<p>Resultats unificats (OL / BNE) via: <span class="badge ${lastSearchStrategy.includes('OR') ? 'or' : ''}">${lastSearchStrategy}</span>${lastUsedBNE ? ' + <span class="badge" style="background:#e74c3c;">BNE Fallback</span>' : ''}</p><p style="font-size: 0.85rem; color: #7f8c8d;">💡 Clica sobre qualsevol llibre per veure'n la fitxa completa.</p>`;
    
    topBooks.forEach((book, index) => {
      const placeholderSvg = "data:image/svg+xml;charset=UTF-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2280%22%20height%3D%22120%22%20viewBox%3D%220%200%2080%20120%22%3E%3Crect%20fill%3D%22%23ecf0f1%22%20width%3D%2280%22%20height%3D%22120%22%2F%3E%3Ctext%20fill%3D%22%2395a5a6%22%20font-family%3D%22sans-serif%22%20font-size%3D%2212%22%20font-weight%3D%22bold%22%20x%3D%2250%25%22%20y%3D%2250%25%22%20text-anchor%3D%22middle%22%3ESense%20Port.%3C%2Ftext%3E%3C%2Fsvg%3E";
      
      let coverUrl = placeholderSvg;
      if (book.isBNE && book.isbn) {
        coverUrl = `https://covers.openlibrary.org/b/isbn/${book.isbn}-M.jpg`;
      } else if (book.cover_i) {
        coverUrl = `https://covers.openlibrary.org/b/id/${book.cover_i}-M.jpg`;
      }

      const authors = book.author_name ? book.author_name.join(', ') : 'Autor desconegut';
      const apiTitle = book.title;
      const publishers = book.publisher ? book.publisher.slice(0,2).join(', ') : 'Varis/Desconegut';
      const scorePercent = (book.matchScore * 100).toFixed(1);
      
      let color = scorePercent > 70 ? 'green' : (scorePercent > 40 ? 'orange' : 'red');

      // Escapem cometes per la funció de clic
      const safeTitle = apiTitle.replace(/'/g, "\\'").replace(/"/g, '&quot;');
      const safeAuthors = authors.replace(/'/g, "\\'").replace(/"/g, '&quot;');
      const publishYear = book.first_publish_year || 'Desconegut';

      const sourceBadge = book.isBNE 
        ? `<span style="background: #e74c3c; color: white; padding: 2px 6px; border-radius: 4px; font-size: 0.75rem; font-weight: bold; margin-left: 5px;">BNE</span>`
        : `<span style="background: #3498db; color: white; padding: 2px 6px; border-radius: 4px; font-size: 0.75rem; font-weight: bold; margin-left: 5px;">OL</span>`;

      htmlContent += `
        <div class="book-result" style="cursor: pointer; transition: background 0.2s; padding: 10px; border-radius: 8px; border: 1px solid transparent;" onclick="window.fetchBookDetails('${book.key}', '${safeTitle}', '${coverUrl}', '${safeAuthors}', '${publishYear}')" onmouseover="this.style.background='#f0f8ff'; this.style.borderColor='#b3d4fc';" onmouseout="this.style.background='transparent'; this.style.borderColor='transparent';">
          <img src="${coverUrl}" alt="Cover" onerror="this.src='${placeholderSvg}'">
          <div class="book-info">
            <h4>${index + 1}. ${apiTitle} (${book.first_publish_year || 'Any desc.'}) ${sourceBadge}</h4>
            <p>👤 Autor: ${authors}</p>
            <p>🏢 Editorial dest.: ${publishers}</p>
            <p style="margin-top: 5px;">📊 Probabilitat: <strong style="color: ${color};">${scorePercent}%</strong></p>
          </div>
        </div>
      `;
    });
    
    bookResults.innerHTML = htmlContent;
  }
});

// --- LÒGICA DE LES DADES MESTRES (Finestra Flotant) ---
window.fetchBookDetails = async function(key, title, coverUrl, authors, publishYear) {
  const modal = document.getElementById('book-details-modal');
  const detailsContent = document.getElementById('details-content');
  
  modal.style.display = 'flex';
  detailsContent.innerHTML = `<div style="text-align: center; color: #3498db; margin: 20px 0;">⏳ Obtenint dades de catàleg per "${title}"...</div>`;

  try {
    // Interceptem els llibres de la Biblioteca Nacional de España (BNE)
    if (key.startsWith('/bne/')) {
      const doc = window.bneCache ? window.bneCache[key] : null;
      if (!doc) throw new Error("No s'han trobat dades locals per aquest llibre de la BNE.");
      
      const display = doc.pnx.display || {};
      const addata = doc.pnx.addata || {};

      let finalPublishers = 'Desconeguda';
      if (display.publisher && display.publisher[0]) {
        let pub = display.publisher[0].split(':')[1];
        if (pub) finalPublishers = pub.split(',')[0].trim();
        else finalPublishers = display.publisher[0].trim();
      } else if (addata.pub && addata.pub[0]) {
        finalPublishers = addata.pub[0];
      }

      let finalPlaces = 'Desconegut';
      if (display.publisher && display.publisher[0]) {
        finalPlaces = display.publisher[0].split(':')[0].trim();
      }

      let subjects = [];
      if (display.genre) display.genre.forEach(g => subjects.push(g.split('$$')[0].trim()));
      if (display.subject) display.subject.forEach(s => subjects.push(s.split('$$')[0].trim()));
      let finalSubjects = subjects.length > 0 ? Array.from(new Set(subjects)).slice(0, 5).join(', ') : 'No categoritzat';

      if (finalSubjects !== 'No categoritzat') {
        try {
          const translateResponse = await fetch(`https://api.mymemory.translated.net/get?q=${encodeURIComponent(finalSubjects)}&langpair=en|ca`);
          const translateData = await translateResponse.json();
          if (translateData && translateData.responseData && translateData.responseData.translatedText) {
            finalSubjects = translateData.responseData.translatedText;
          }
        } catch (e) {}
      }

      const book = window._biblio.allScoredBooks.find(b => b.key === key);
      const isbnVal = book ? (book.isbn || "") : "";

      detailsContent.innerHTML = `
        <div style="display: flex; gap: 30px; margin-bottom: 20px; flex-wrap: wrap;">
          <img src="${coverUrl}" style="width: 220px; object-fit: contain; box-shadow: 0 4px 12px rgba(0,0,0,0.15);" alt="Cover" onerror="this.style.display='none'">
          
          <div style="flex: 1; min-width: 280px; font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;">
            <h2 style="margin: 0 0 10px 0; font-size: 1.7rem; color: #2c3e50; line-height: 1.3;">${title}</h2>
            <span style="background: #e74c3c; color: white; padding: 4px 12px; border-radius: 12px; font-size: 0.85rem; font-weight: bold; display: inline-block; margin-bottom: 25px;">Llibre (BNE)</span>
            
            <div style="margin-top: 10px;">
              <h3 style="background: #f2f2f2; padding: 10px 15px; margin: 0 0 15px 0; font-size: 1.1rem; color: #444; font-weight: normal; border-radius: 4px;">Informació general</h3>
              
              <div style="font-size: 0.95rem; color: #666; line-height: 1.9; padding-left: 5px;">
                <div>Autor: <span style="color: #7ab800;">${authors}</span></div>
                <div>Editorial: <span style="color: #555;">${finalPublishers}</span></div>
                <div>Any d'edició: <span style="color: #555;">${publishYear}</span></div>
                <div>Lloc d'edició: <span style="color: #555;">${finalPlaces}</span></div>
                <div>Categoria: <span style="color: #7ab800;">${finalSubjects}</span></div>
              </div>
              
              <button id="sync-desktop-btn" data-orig-color="#e74c3c" onclick="window.syncSelectedBook({ title: '${title.replace(/'/g, "\\'").replace(/"/g, '&quot;')}', authors: '${authors.replace(/'/g, "\\'").replace(/"/g, '&quot;')}', publisher: '${finalPublishers.replace(/'/g, "\\'").replace(/"/g, '&quot;')}', publishYear: '${publishYear}', place: '${finalPlaces.replace(/'/g, "\\'").replace(/"/g, '&quot;')}', subjects: '${finalSubjects.replace(/'/g, "\\'").replace(/"/g, '&quot;')}', isbn: '${isbnVal}', source: 'BNE' })" style="margin-top: 20px; width: 100%; padding: 12px; background: #e74c3c; color: white; border: none; border-radius: 6px; font-weight: bold; font-size: 1rem; cursor: pointer; transition: background 0.2s;">
                📥 Enviar a l'ordinador de treball
              </button>
            </div>
          </div>
        </div>
      `;
      return;
    }

    const workResponse = await fetch(`https://openlibrary.org${key}.json`);
    const workData = await workResponse.json();
    
    const editionsResponse = await fetch(`https://openlibrary.org${key}/editions.json?limit=50`);
    const editionsData = await editionsResponse.json();

    // 1. Mineria de Temes/Tags
    let subjectsSet = new Set();
    if (workData.subjects) workData.subjects.forEach(s => subjectsSet.add(s));

    // 2. Mineria de Dades Físiques d'Edicions
    let placesSet = new Set();
    let publishersSet = new Set();
    let firstValidIsbn = null;
    let subtitle = '';
    
    if (editionsData.entries && editionsData.entries.length > 0) {
      editionsData.entries.forEach(ed => {
        if (ed.subjects) ed.subjects.forEach(s => subjectsSet.add(s));
        if (ed.publish_places) ed.publish_places.forEach(p => placesSet.add(p));
        if (ed.publishers) ed.publishers.forEach(p => publishersSet.add(p));
        if (ed.subtitle && !subtitle) subtitle = ed.subtitle;

        if (ed.isbn_13 && !firstValidIsbn) firstValidIsbn = ed.isbn_13[0];
        else if (ed.isbn_10 && !firstValidIsbn) firstValidIsbn = ed.isbn_10[0];
      });
    }

    // 3. API Extra
    if (firstValidIsbn) {
      try {
        const isbnResponse = await fetch(`https://openlibrary.org/api/books?bibkeys=ISBN:${firstValidIsbn}&format=json&jscmd=data`);
        const isbnData = await isbnResponse.json();
        const specificBook = isbnData[`ISBN:${firstValidIsbn}`];
        if (specificBook && specificBook.subtitle && !subtitle) subtitle = specificBook.subtitle;
      } catch(e) {}
    }

    let finalSubjects = subjectsSet.size > 0 ? Array.from(subjectsSet).slice(0, 5).join(', ') : 'No categoritzat';
    let finalPlaces = placesSet.size > 0 ? Array.from(placesSet).slice(0, 3).join(', ') : 'Desconegut';
    let finalPublishers = publishersSet.size > 0 ? Array.from(publishersSet).slice(0, 2).join(', ') : 'Desconeguda';
    
    // --- TRADUCTOR AUTOMÀTIC (Anglès -> Català) ---
    if (finalSubjects !== 'No categoritzat') {
      try {
        const translateResponse = await fetch(`https://api.mymemory.translated.net/get?q=${encodeURIComponent(finalSubjects)}&langpair=en|ca`);
        const translateData = await translateResponse.json();
        if (translateData && translateData.responseData && translateData.responseData.translatedText) {
          finalSubjects = translateData.responseData.translatedText;
        }
      } catch (e) {
        console.warn("No s'ha pogut connectar amb el servei de traducció:", e);
      }
    }
    
    let displayTitle = subtitle ? `${title}. ${subtitle}` : title;

    // INTERFÍCIE NETA ESTIL CATÀLEG
    detailsContent.innerHTML = `
      <div style="display: flex; gap: 30px; margin-bottom: 20px; flex-wrap: wrap;">
        <img src="${coverUrl}" style="width: 220px; object-fit: contain; box-shadow: 0 4px 12px rgba(0,0,0,0.15);" alt="Cover">
        
        <div style="flex: 1; min-width: 280px; font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;">
          <h2 style="margin: 0 0 10px 0; font-size: 1.7rem; color: #2c3e50; line-height: 1.3;">${displayTitle}</h2>
          <span style="background: #8cc63f; color: white; padding: 4px 12px; border-radius: 12px; font-size: 0.85rem; font-weight: bold; display: inline-block; margin-bottom: 25px;">Llibre</span>
          
          <div style="margin-top: 10px;">
            <h3 style="background: #f2f2f2; padding: 10px 15px; margin: 0 0 15px 0; font-size: 1.1rem; color: #444; font-weight: normal; border-radius: 4px;">Informació general</h3>
            
            <div style="font-size: 0.95rem; color: #666; line-height: 1.9; padding-left: 5px;">
              <div>Autor: <span style="color: #7ab800;">${authors}</span></div>
              <div>Editorial: <span style="color: #555;">${finalPublishers}</span></div>
              <div>Any d'edició: <span style="color: #555;">${publishYear}</span></div>
              <div>Lloc d'edició: <span style="color: #555;">${finalPlaces}</span></div>
              <div>Categoria: <span style="color: #7ab800;">${finalSubjects}</span></div>
            </div>
            
            <button id="sync-desktop-btn" data-orig-color="#8cc63f" onclick="window.syncSelectedBook({ title: '${displayTitle.replace(/'/g, "\\'").replace(/"/g, '&quot;')}', authors: '${authors.replace(/'/g, "\\'").replace(/"/g, '&quot;')}', publisher: '${finalPublishers.replace(/'/g, "\\'").replace(/"/g, '&quot;')}', publishYear: '${publishYear}', place: '${finalPlaces.replace(/'/g, "\\'").replace(/"/g, '&quot;')}', subjects: '${finalSubjects.replace(/'/g, "\\'").replace(/"/g, '&quot;')}', isbn: '${firstValidIsbn || ""}', source: 'Open Library' })" style="margin-top: 20px; width: 100%; padding: 12px; background: #8cc63f; color: white; border: none; border-radius: 6px; font-weight: bold; font-size: 1rem; cursor: pointer; transition: background 0.2s;">
              📥 Enviar a l'ordinador de treball
            </button>
          </div>
        </div>
      </div>
    `;
  } catch (err) {
    detailsContent.innerHTML = `<div style="text-align: center; color: #e74c3c;">❌ Error de connexió amb Open Library: ${err.message}</div>`;
  }
};

document.getElementById('close-details')?.addEventListener('click', () => {
  document.getElementById('book-details-modal').style.display = 'none';
});
