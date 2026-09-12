/* ============================================================
   CONTADOR DE QUILOMETRAGEM — NATIVUS ON ROAD
   Pop-up institucional (arquivo isolado: injeta o próprio HTML)
   ------------------------------------------------------------
   >>> DIRETORIA — ATUALIZE APENAS O NÚMERO ABAIXO <<<

   KM_TOTAL_NO_ANO = total de quilômetros rodados pelo grupo
   no ano. O ano exibido é detectado automaticamente.
   Nenhum outro ajuste é necessário.
   ============================================================ */

const KM_TOTAL_NO_ANO = 10435; // <<< KM RODADOS NO ANO (EDITAR AQUI)

(function () {
    'use strict';

    if (document.getElementById('kmOverlay')) return; // evita duplicação

    var CIRCUNFERENCIA_TERRA = 40075; // km (equador)

    var reduced = window.matchMedia &&
                  window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    var ano = new Date().getFullYear();
    var total = Math.max(0, Math.round(
        typeof KM_TOTAL_NO_ANO === 'number' ? KM_TOTAL_NO_ANO : 0
    ));

    /* ================= SVG — PLANETA + MOTO CUSTOM ================= */
    var svg = `
<svg id="kmSvg" class="km-svg" viewBox="0 0 400 400" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" focusable="false">
  <defs>
    <radialGradient id="kmPlanetGrad" cx="36%" cy="30%" r="78%">
      <stop offset="0%" stop-color="#C7A988"/>
      <stop offset="35%" stop-color="#907159"/>
      <stop offset="70%" stop-color="#47352D"/>
      <stop offset="100%" stop-color="#1a0f0c"/>
    </radialGradient>
    <radialGradient id="kmShade" cx="34%" cy="28%" r="80%">
      <stop offset="0%" stop-color="rgba(15,7,5,0)"/>
      <stop offset="62%" stop-color="rgba(15,7,5,0)"/>
      <stop offset="100%" stop-color="rgba(15,7,5,0.6)"/>
    </radialGradient>
    <radialGradient id="kmMotoGlow" cx="50%" cy="50%" r="50%">
      <stop offset="0%" stop-color="rgba(193,117,124,0.4)"/>
      <stop offset="100%" stop-color="rgba(193,117,124,0)"/>
    </radialGradient>
    <linearGradient id="kmTrailGrad" gradientUnits="userSpaceOnUse" x1="-150" y1="0" x2="-38" y2="0">
      <stop offset="0%" stop-color="rgba(193,117,124,0)"/>
      <stop offset="100%" stop-color="rgba(193,117,124,0.8)"/>
    </linearGradient>
    <clipPath id="kmPlanetClip"><circle cx="200" cy="200" r="122"/></clipPath>
  </defs>

  <!-- estrelas -->
  <g fill="#C7A988">
    <circle class="km-star" cx="30" cy="40" r="1.6" style="animation-delay:-0.4s"/>
    <circle class="km-star" cx="378" cy="60" r="1.3" style="animation-delay:-1.1s"/>
    <circle class="km-star" cx="60" cy="330" r="1.2" style="animation-delay:-2s"/>
    <circle class="km-star" cx="352" cy="318" r="1.7" style="animation-delay:-0.8s"/>
    <circle class="km-star" cx="205" cy="18" r="1.1" style="animation-delay:-1.6s"/>
    <circle class="km-star" cx="18" cy="200" r="1.2" style="animation-delay:-2.6s"/>
    <circle class="km-star" cx="390" cy="205" r="1" style="animation-delay:-0.2s"/>
    <circle class="km-star" cx="120" cy="70" r="1" style="animation-delay:-3s"/>
  </g>

  <!-- anel-estrada traseiro (passa por trás do planeta) -->
  <g transform="rotate(-14 200 200)">
    <path d="M70,200 A130,40 0 0,1 330,200" stroke="rgba(169,170,173,0.28)" stroke-width="1.5" stroke-dasharray="3 9" fill="none"/>
  </g>

  <!-- planeta -->
  <circle cx="200" cy="200" r="122" fill="url(#kmPlanetGrad)"/>
  <g clip-path="url(#kmPlanetClip)" stroke="rgba(199,169,136,0.16)" stroke-width="1" fill="none">
    <ellipse cx="200" cy="200" rx="122" ry="38"/>
    <ellipse cx="200" cy="200" rx="122" ry="82"/>
    <ellipse cx="200" cy="200" rx="38" ry="122"/>
    <ellipse cx="200" cy="200" rx="82" ry="122"/>
  </g>

  <!-- pins: as 5 regionais -->
  <g>
    <g transform="translate(148,152)"><circle r="3" fill="#c1757c"/><circle class="km-ring" r="7" fill="none" stroke="#c1757c" stroke-width="1.4" style="animation-delay:0s"/></g>
    <g transform="translate(256,138)"><circle r="3" fill="#c1757c"/><circle class="km-ring" r="7" fill="none" stroke="#c1757c" stroke-width="1.4" style="animation-delay:-0.6s"/></g>
    <g transform="translate(283,196)"><circle r="3" fill="#c1757c"/><circle class="km-ring" r="7" fill="none" stroke="#c1757c" stroke-width="1.4" style="animation-delay:-1.2s"/></g>
    <g transform="translate(118,212)"><circle r="3" fill="#c1757c"/><circle class="km-ring" r="7" fill="none" stroke="#c1757c" stroke-width="1.4" style="animation-delay:-1.8s"/></g>
    <g transform="translate(196,170)"><circle r="3" fill="#c1757c"/><circle class="km-ring" r="7" fill="none" stroke="#c1757c" stroke-width="1.4" style="animation-delay:-2.4s"/></g>
  </g>

  <circle cx="200" cy="200" r="122" fill="url(#kmShade)"/>
  <circle cx="200" cy="200" r="122" stroke="rgba(199,169,136,0.35)" stroke-width="1.2" fill="none"/>
  <circle cx="200" cy="200" r="128" stroke="rgba(199,169,136,0.07)" stroke-width="14" fill="none"/>

  <!-- estrada frontal + moto (na frente do planeta) -->
  <g transform="rotate(-14 200 200)">
    <path class="km-road" d="M330,200 A130,40 0 0,1 70,200" stroke="#c1757c" stroke-width="2.5" stroke-dasharray="10 14" fill="none" opacity="0.85"/>

    <g id="kmMoto">
      <ellipse cx="0" cy="8" rx="60" ry="34" fill="url(#kmMotoGlow)"/>
      <g id="kmTrail" opacity="0.2" stroke-linecap="round" fill="none">
        <path d="M-40,14 L-150,18" stroke="url(#kmTrailGrad)" stroke-width="3"/>
        <path d="M-38,4 L-118,8" stroke="url(#kmTrailGrad)" stroke-width="2"/>
        <path d="M-40,24 L-132,28" stroke="url(#kmTrailGrad)" stroke-width="1.5"/>
      </g>
      <g transform="scale(0.62) translate(-67,-11)">
        <!-- escape -->
        <path d="M80,40 C70,46 60,48 47,45" stroke="#A9AAAD" stroke-width="3.4" fill="none" stroke-linecap="round"/>
        <!-- rodas -->
        <circle cx="30" cy="40" r="14" fill="#050203" stroke="#A9AAAD" stroke-width="2"/>
        <g class="km-spokes" stroke="#A9AAAD" stroke-width="1" opacity="0.85">
          <line x1="19" y1="40" x2="41" y2="40"/>
          <line x1="22" y1="32" x2="38" y2="48"/>
          <line x1="38" y1="32" x2="22" y2="48"/>
        </g>
        <circle cx="30" cy="40" r="3" fill="#A9AAAD"/>
        <circle cx="112" cy="40" r="11.5" fill="#050203" stroke="#A9AAAD" stroke-width="2"/>
        <g class="km-spokes" stroke="#A9AAAD" stroke-width="1" opacity="0.85">
          <line x1="103" y1="40" x2="121" y2="40"/>
          <line x1="106" y1="34" x2="118" y2="46"/>
          <line x1="118" y1="34" x2="106" y2="46"/>
        </g>
        <circle cx="112" cy="40" r="2.6" fill="#A9AAAD"/>
        <!-- paralama traseiro -->
        <path d="M13,36 A17.5,17.5 0 0,1 46,36" stroke="#907159" stroke-width="4.5" fill="none" stroke-linecap="round"/>
        <!-- quadro -->
        <path d="M30,40 L57,22 L74,27" stroke="#47352D" stroke-width="4" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
        <path d="M92,21 L76,30" stroke="#47352D" stroke-width="4" stroke-linecap="round"/>
        <!-- motor v-twin -->
        <circle cx="73" cy="35" r="5.5" fill="#0F0705" stroke="#A9AAAD" stroke-width="1.4"/>
        <circle cx="83" cy="33" r="4.6" fill="#0F0705" stroke="#A9AAAD" stroke-width="1.4"/>
        <!-- tanque -->
        <path d="M62,25 C66,17 82,16 88,23 L86,29 L65,29 Z" fill="#47352D" stroke="#C7A988" stroke-width="1"/>
        <path d="M69,22 L83,21" stroke="#c1757c" stroke-width="2.2" stroke-linecap="round"/>
        <!-- banco solo -->
        <rect x="48" y="12" width="17" height="6" rx="3" fill="#1a0f0c" stroke="#907159" stroke-width="1"/>
        <!-- piloto: perna avançada (pedaleira forward) -->
        <path d="M56,17 C64,23 70,27 77,32" stroke="#47352D" stroke-width="6" fill="none" stroke-linecap="round"/>
        <path d="M77,32 L84,34" stroke="#0F0705" stroke-width="4.5" stroke-linecap="round"/>
        <!-- piloto: tronco recuado + colete -->
        <path d="M56,17 C51,6 46,-1 40,-6" stroke="#907159" stroke-width="7.5" fill="none" stroke-linecap="round"/>
        <path d="M49,4 L55,10 L50,13.5 L44.5,7.5 Z" fill="#975D63"/>
        <!-- braço -->
        <path d="M42,-4 C56,-4 66,0 73,7" stroke="#907159" stroke-width="4.6" fill="none" stroke-linecap="round"/>
        <!-- cabeça -->
        <circle cx="38" cy="-11" r="5.6" fill="#47352D" stroke="#C7A988" stroke-width="1"/>
        <!-- cocar (símbolo nativo do grupo) -->
        <path d="M36,-15 C30,-24 24,-28 17,-27" stroke="#C7A988" stroke-width="2" fill="none" stroke-linecap="round"/>
        <path d="M34,-16 C27,-23 20,-24 13,-22" stroke="#c1757c" stroke-width="2" fill="none" stroke-linecap="round"/>
        <path d="M39,-17 C35,-26 30,-31 23,-32" stroke="#C7A988" stroke-width="1.6" fill="none" stroke-linecap="round"/>
        <circle cx="17" cy="-27" r="1.4" fill="#c1757c"/>
        <circle cx="13" cy="-22" r="1.4" fill="#C7A988"/>
        <circle cx="23" cy="-32" r="1.2" fill="#c1757c"/>
        <!-- garfo longo -->
        <path d="M95,19 L112,40" stroke="#A9AAAD" stroke-width="3" stroke-linecap="round"/>
        <!-- guidão ape-hanger -->
        <path d="M96,17 C91,7 82,3 75,7" stroke="#A9AAAD" stroke-width="2.4" fill="none" stroke-linecap="round"/>
        <path d="M75,7 L71,9" stroke="#907159" stroke-width="4" stroke-linecap="round"/>
        <!-- farol -->
        <circle cx="98" cy="14" r="4" fill="#C7A988"/>
        <circle cx="98" cy="14" r="7.5" fill="#C7A988" opacity="0.18"/>
        <polygon points="102,12 150,2 150,24" fill="#C7A988" opacity="0.1"/>
      </g>
    </g>
  </g>
</svg>`;

    /* ================= HTML DO POP-UP (injetado no body) ================= */
    var modalHtml = `
<div class="km-overlay" id="kmOverlay" role="dialog" aria-modal="true" aria-labelledby="kmTitulo" hidden>
  <div class="km-modal">
    <button class="km-close" id="kmClose" type="button" aria-label="Fechar painel de quilometragem"><i class="fa-solid fa-xmark"></i></button>
    <div class="km-head">
      <div class="km-titles">
        <h2 id="kmTitulo">Quilometragem rodada em <b>${ano}</b></h2>
        <p>Nativus On Road • todas as regionais</p>
      </div>
    </div>
    <div class="km-body">
      <div class="km-globe">${svg}</div>
      <div class="km-panel">
        <div class="km-label"><i class="fa-solid fa-gauge-high"></i> Odômetro do grupo</div>
        <div class="km-odometer" id="kmOdometer"><span class="km-unit">km</span></div>
        <div class="km-sub">quilômetros rodados no ano pela irmandade</div>
        <div class="km-stats">
          <span class="km-chip"><i class="fa-solid fa-road"></i><span><b id="kmMedia">0</b> km/mês em média</span></span>
          <span class="km-chip"><i class="fa-solid fa-earth-americas"></i><span><b id="kmMundo">0</b>% de uma volta ao mundo</span></span>
        </div>
        <div class="km-hint"><i class="fa-solid fa-hand-pointer"></i> Toque ou passe o cursor sobre o planeta para acelerar</div>
        <span class="km-sr" id="kmSr"></span>
      </div>
    </div>
    <div class="km-foot">Irmandade • Respeito • Estrada • Disciplina</div>
  </div>
</div>`;

    document.body.insertAdjacentHTML('beforeend', modalHtml);

    /* ================= REFERÊNCIAS ================= */
    var overlay = document.getElementById('kmOverlay');
    var closeBtn = document.getElementById('kmClose');
    var svgEl = document.getElementById('kmSvg');
    var motoG = document.getElementById('kmMoto');
    var trailG = document.getElementById('kmTrail');
    var odoEl = document.getElementById('kmOdometer');
    var mediaEl = document.getElementById('kmMedia');
    var mundoEl = document.getElementById('kmMundo');
    var srEl = document.getElementById('kmSr');

    var fmtFinal = total.toLocaleString('pt-BR');
    if (srEl) srEl.textContent = fmtFinal + ' quilômetros rodados em ' + ano + '.';

    /* ================= ODÔMETRO DIGITAL ================= */
    /* Cada dígito mostra sempre um número completo; só "vira"
       (flip rápido) quando o valor de fato muda de unidade. */
    var fmt = fmtFinal;
    var html = '';
    var pw = -1;
    for (var j = fmt.length - 1; j >= 0; j--) {
        var ch = fmt[j];
        if (ch >= '0' && ch <= '9') {
            pw++;
            html = '<span class="km-slot" data-pw="' + pw + '"><span class="km-digit">0</span></span>' + html;
        } else {
            html = '<span class="km-sep">' + ch + '</span>' + html;
        }
    }
    odoEl.insertAdjacentHTML('afterbegin', html);

    var slots = Array.prototype.map.call(
        odoEl.querySelectorAll('.km-slot'),
        function (el) {
            return {
                digit: el.querySelector('.km-digit'),
                pw: parseInt(el.dataset.pw, 10),
                cur: 0,
                dim: false
            };
        }
    );

    /* médias automáticas (fração do ano já decorrida) */
    var yStart = new Date(ano, 0, 1).getTime();
    var yEnd = new Date(ano + 1, 0, 1).getTime();
    var meses = Math.max(1, (Date.now() - yStart) / (yEnd - yStart) * 12);

    function fmtInt(n) { return Math.round(n).toLocaleString('pt-BR'); }
    function fmtDec(n) {
        return n.toLocaleString('pt-BR', { minimumFractionDigits: 1, maximumFractionDigits: 1 });
    }

    function renderOdo(v) {
        var vInt = Math.floor(v + 1e-9);
        for (var i = 0; i < slots.length; i++) {
            var s = slots[i];
            var d = Math.floor((v / Math.pow(10, s.pw)) % 10 + 1e-9);
            if (d !== s.cur) {
                s.cur = d;
                s.digit.textContent = d;
                s.digit.classList.remove('km-flip');
                void s.digit.offsetWidth;
                s.digit.classList.add('km-flip');
            }
            /* zeros à esquerda ficam apagadinhos até "ganhar vida" */
            var lead = s.pw > 0 && vInt < Math.pow(10, s.pw);
            if (lead !== s.dim) {
                s.dim = lead;
                s.digit.classList.toggle('km-dim', lead);
            }
        }
        if (mediaEl) mediaEl.textContent = fmtInt(v / meses);
        if (mundoEl) mundoEl.textContent = fmtDec((v / CIRCUNFERENCIA_TERRA) * 100);
    }
    renderOdo(0);

    /* ---- animação de contagem ---- */
    var DUR = reduced ? 1 : 5000;
    var DELAY = reduced ? 0 : 500;
    var t0 = null;
    var countStarted = false;
    var countDone = false;
    var countRAF = null;

    function stepCount(ts) {
        countRAF = requestAnimationFrame(stepCount);
        if (t0 === null) t0 = ts;
        var e = ts - t0 - DELAY;
        if (e < 0) { renderOdo(0); return; }
        var k = Math.min(1, e / DUR);
        var ease = 1 - Math.pow(1 - k, 4);
        renderOdo(total * ease);
        if (k >= 1) {
            renderOdo(total);
            countDone = true;
            if (countRAF) { cancelAnimationFrame(countRAF); countRAF = null; }
        }
    }
    function startCount() {
        if (countStarted || countDone) return;
        countStarted = true;
        countRAF = requestAnimationFrame(stepCount);
    }

    /* ================= MOTO AO REDOR DO PLANETA ================= */
    var CX = 200, CY = 200, RX = 130, RY = 40;
    var BASE = reduced ? 0.12 : 0.5;   // rad/s (volta ~12,6s)
    var BOOST = reduced ? BASE : 2.1;  // turbo no hover/toque
    var ang = 2.2;                     // início: frente do planeta
    var speed = BASE;
    var target = BASE;
    var last = null;
    var motoRAF = null;

    function loop(ts) {
        motoRAF = requestAnimationFrame(loop);
        if (last === null) { last = ts; return; }
        var dt = Math.min(0.05, (ts - last) / 1000);
        last = ts;

        speed += (target - speed) * Math.min(1, dt * 3.5);
        ang = (ang + speed * dt) % (Math.PI * 2);

        var c = Math.cos(ang), s = Math.sin(ang);
        var x = CX + RX * c;
        var y = CY + RY * s;
        var deg = Math.atan2(RY * c, -RX * s) * 180 / Math.PI;
        var dist = Math.hypot(x - CX, y - CY);
        var front = s > 0;

        /* oclusão 3D: atrás do planeta a moto desaparece gradualmente */
        var alpha = front ? 1 : Math.max(0, Math.min(0.5, (dist - 118) / 24));
        var sc = (0.44 + 0.13 * (s + 1) / 2) * (front ? 1 : 0.85);

        motoG.setAttribute('transform',
            'translate(' + x.toFixed(1) + ' ' + y.toFixed(1) + ') ' +
            'rotate(' + deg.toFixed(1) + ') ' +
            'scale(' + sc.toFixed(3) + ' ' + (-sc).toFixed(3) + ')');
        motoG.setAttribute('opacity', alpha.toFixed(2));

        if (trailG) {
            var n = Math.max(0, Math.min(1, (speed - BASE) / ((BOOST - BASE) || 1)));
            trailG.setAttribute('opacity', (0.15 + 0.6 * n).toFixed(2));
        }
    }
    function startMoto() {
        if (motoRAF) return;
        last = null;
        motoRAF = requestAnimationFrame(loop);
    }
    function stopMoto() {
        if (motoRAF) { cancelAnimationFrame(motoRAF); motoRAF = null; }
    }

    /* ---- interatividade: turbo ---- */
    var hovering = false;
    var pressing = false;

    function applyTarget() {
        var t = BASE;
        if (!reduced) {
            if (pressing) t = BOOST * 1.6;
            else if (hovering) t = BOOST;
        }
        target = t;
        svgEl.classList.toggle('km-boost', t > BASE);
    }
    svgEl.addEventListener('pointerenter', function () { hovering = true; applyTarget(); });
    svgEl.addEventListener('pointerleave', function () { hovering = false; pressing = false; applyTarget(); });
    svgEl.addEventListener('pointerdown', function () { pressing = true; applyTarget(); });
    window.addEventListener('pointerup', function () {
        if (pressing) { pressing = false; applyTarget(); }
    });

    /* ================= ABRIR / FECHAR ================= */
    var openState = false;

    function openKm() {
        if (openState) return;
        openState = true;
        overlay.hidden = false;
        void overlay.offsetWidth; /* reflow para disparar a transição */
        overlay.classList.add('km-open');
        document.documentElement.style.overflow = 'hidden';
        document.body.style.overflow = 'hidden';
        try { closeBtn.focus({ preventScroll: true }); } catch (err) { closeBtn.focus(); }
        startMoto();
        if (!countDone) setTimeout(startCount, 700);
    }

    function closeKm() {
        if (!openState) return;
        openState = false;
        overlay.classList.remove('km-open');
        stopMoto();
        document.documentElement.style.overflow = '';
        document.body.style.overflow = '';
        setTimeout(function () { if (!openState) overlay.hidden = true; }, 380);
    }

    closeBtn.addEventListener('click', closeKm);
    overlay.addEventListener('click', function (e) {
        if (e.target === overlay) closeKm();
    });
    document.addEventListener('keydown', function (e) {
        if (e.key === 'Escape' && openState) closeKm();
    });

    /* ---- abre sempre que o site é aberto ---- */
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', function () { setTimeout(openKm, 500); });
    } else {
        setTimeout(openKm, 500);
    }
})();
