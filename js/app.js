/**
 * State machine da experiência: navegação entre telas, progresso,
 * cálculo do signo e microinterações.
 */
(function () {
  const screenRoot = document.getElementById("screen-root");
  const progressTrack = document.getElementById("progress-track");
  const progressFill = document.getElementById("progress-fill");
  const toast = document.getElementById("toast");

  const state = {
    questionIndex: 0,
    answers: {},
    resultSign: null,
    bankReturnTo: "intro",
  };

  const TOTAL_QUESTIONS = QUIZ_QUESTIONS.length;
  // Evita que o navegador use uma cópia antiga da imagem em cache quando o arquivo é trocado.
  const IMAGE_CACHE_BUST = Date.now();
  const LOGO_HTML = '<img class="brand-logo" src="assets/logo-piave.png" alt="Piave Cosmetics" />';

  function setProgress(visible, ratio) {
    progressTrack.classList.toggle("visible", visible);
    progressFill.style.width = `${Math.max(0, Math.min(1, ratio)) * 100}%`;
  }

  function setTheme(dark) {
    document.body.classList.toggle("theme-dark", dark);
  }

  function showScreen(html, mount) {
    const current = screenRoot.querySelector(".screen");
    const render = () => {
      screenRoot.innerHTML = html;
      window.scrollTo(0, 0);
      if (mount) mount();
    };
    if (current) {
      current.classList.add("leaving");
      setTimeout(render, 240);
    } else {
      render();
    }
  }

  function showToast(message) {
    toast.textContent = message;
    toast.classList.add("visible");
    clearTimeout(showToast._t);
    showToast._t = setTimeout(() => toast.classList.remove("visible"), 2600);
  }

  // ---------- Tela 1: Intro ----------
  function renderIntro() {
    setTheme(false);
    setProgress(false, 0);
    showScreen(
      `
      <div class="screen">
        ${LOGO_HTML}
        <p class="eyebrow">✨ Descubra em menos de 1 minuto</p>
        <h1 class="title">Qual é o signo<br/>do seu cabelo?</h1>
        <p class="subtitle">Todo cabelo tem uma personalidade. Descubra qual signo representa melhor os seus fios. Leva menos de um minuto.</p>
        <button class="btn btn-primary" id="start-btn">Começar</button>
      </div>
      `,
      () => {
        document.getElementById("start-btn").addEventListener("click", () => {
          state.questionIndex = 0;
          state.answers = {};
          renderQuestion(0);
        });
      }
    );
  }

  // ---------- Perguntas ----------
  function renderQuestion(index) {
    const q = QUIZ_QUESTIONS[index];
    setTheme(false);
    setProgress(true, index / TOTAL_QUESTIONS);

    const optionsHtml = q.options
      .map(
        (opt, i) => `<button class="option-btn" data-index="${i}">${opt.label}</button>`
      )
      .join("");

    showScreen(
      `
      <div class="screen">
        ${LOGO_HTML}
        <p class="eyebrow">Pergunta ${index + 1} de ${TOTAL_QUESTIONS}</p>
        <h2 class="question-title">${q.question}</h2>
        <div class="options-grid">${optionsHtml}</div>
      </div>
      `,
      () => {
        const buttons = Array.from(document.querySelectorAll(".option-btn"));
        buttons.forEach((btn) => {
          btn.addEventListener("click", () => {
            if (btn.classList.contains("selected")) return;
            buttons.forEach((b) => (b.disabled = true));
            btn.classList.add("selected");
            const chosenIndex = Number(btn.dataset.index);
            state.answers[q.id] = chosenIndex;
            setProgress(true, (index + 1) / TOTAL_QUESTIONS);
            setTimeout(() => {
              if (index + 1 < TOTAL_QUESTIONS) {
                renderQuestion(index + 1);
              } else {
                renderLoading1();
              }
            }, 380);
          });
        });
      }
    );
  }

  // ---------- Loading 1 ----------
  function renderLoadingSequence(messages, totalDuration, onDone) {
    setTheme(true);
    setProgress(false, 1);
    showScreen(
      `
      <div class="screen">
        <div class="spinner-wrapper" aria-hidden="true">
          <div class="spinner-container">
            <div class="thread t1"></div>
            <div class="thread t2"></div>
            <div class="thread t3"></div>
            <div class="thread t4"></div>
            <div class="node"></div>
          </div>
        </div>
        <p class="loading-message" id="loading-msg">${messages[0]}</p>
      </div>
      `,
      () => {
        const el = document.getElementById("loading-msg");
        const stepDuration = totalDuration / messages.length;
        let i = 0;
        const interval = setInterval(() => {
          i++;
          if (i >= messages.length) {
            clearInterval(interval);
            setTimeout(onDone, stepDuration);
            return;
          }
          el.style.opacity = "0";
          setTimeout(() => {
            el.textContent = messages[i];
            el.style.opacity = "1";
          }, 150);
        }, stepDuration);
      }
    );
  }

  function renderLoading1() {
    state.resultSign = computeZodiacSign(state.answers);
    renderLoadingSequence(
      [
        "✨ Analisando sua personalidade capilar...",
        "⭐ Consultando os astros...",
        "🌙 Cruzando sua rotina...",
        "✨ Encontrando seu signo...",
      ],
      3000,
      renderResult
    );
  }

  // ---------- Resultado ----------
  function renderResult() {
    const sign = ZODIAC_SIGNS[state.resultSign];
    setTheme(false);
    setProgress(false, 1);
    showScreen(
      `
      <div class="screen">
        ${LOGO_HTML}
        <div class="sign-icon-wrapper">${renderConstellationSVG(sign.id, 200)}</div>
        <p class="eyebrow">O signo do seu cabelo é</p>
        <h1 class="result-name">${sign.name}</h1>
        <p class="result-description">${sign.description}</p>
        <div class="btn-row">
          <button class="btn btn-primary" id="continue-btn">🎁 Receba o presente do seu signo</button>
          <button class="btn btn-ghost" id="share-btn">Compartilhar resultado</button>
        </div>
      </div>
      `,
      () => {
        document.getElementById("continue-btn").addEventListener("click", renderFinal);
        document.getElementById("share-btn").addEventListener("click", async () => {
          const shareText = `Descobri que meu cabelo é de ${sign.name} ${sign.symbol}! Descubra o seu:`;
          const shareUrl = window.location.href;
          if (navigator.share) {
            try {
              await navigator.share({ text: shareText, url: shareUrl });
            } catch (e) {
              /* usuária cancelou o share, sem ação necessária */
            }
          } else {
            try {
              await navigator.clipboard.writeText(`${shareText} ${shareUrl}`);
              showToast("Link copiado! Cole onde quiser compartilhar.");
            } catch (e) {
              showToast(shareText);
            }
          }
        });
      }
    );
  }

  // ---------- Tela final ----------
  function renderFinal() {
    const sign = ZODIAC_SIGNS[state.resultSign];
    setTheme(false);
    setProgress(false, 1);
    showScreen(
      `
      <div class="screen">
        ${LOGO_HTML}
        <div class="gift-badge">🎁</div>
        <h1 class="title">Parabéns!</h1>
        <p class="sign-gift-tag">Esse é o presente para o signo de ${sign.name}</p>
        <div class="coupon">
          <div class="coupon-percent">${APP_CONFIG.DISCOUNT_PERCENT}% <span class="coupon-off">OFF</span></div>
          <p class="coupon-desc">no produto recomendado para o seu cabelo</p>
        </div>
        <p class="product-title-tag">All In One Leave-In</p>
        <img class="product-image" src="${APP_CONFIG.PRODUCT_IMAGE}?v=${IMAGE_CACHE_BUST}" alt="${APP_CONFIG.PRODUCT_NAME}" />
        <h2 class="product-name">Para todos os tipos de cabelo</h2>
        <p class="product-description">O Leave-in All in One é o aliado perfeito para a sua rotina. Finalize agora a sua compra e ganhe ${APP_CONFIG.DISCOUNT_PERCENT}% de desconto.</p>
        <p class="price-row"><span class="price-original">De R$ ${APP_CONFIG.PRICE_ORIGINAL}</span> <span class="price-final">por R$ ${APP_CONFIG.PRICE_FINAL}</span></p>
        <div class="countdown-timer">
          <span class="countdown-label">⏳ Seu presente expira em</span>
          <div class="countdown-display" id="countdown-display">${String(APP_CONFIG.COUNTDOWN_MINUTES).padStart(2, "0")}:00</div>
        </div>
        <button class="btn btn-primary" id="activate-btn">Ativar meu desconto</button>
      </div>
      `,
      () => {
        startCountdown(document.getElementById("countdown-display"));
        document.getElementById("activate-btn").addEventListener("click", () => {
          window.open(buildProductCheckoutUrl(), "_blank", "noopener");
        });
      }
    );
  }

  let countdownInterval = null;

  function startCountdown(displayEl) {
    clearInterval(countdownInterval);
    let secondsLeft = APP_CONFIG.COUNTDOWN_MINUTES * 60;

    const render = () => {
      const minutes = Math.floor(secondsLeft / 60);
      const seconds = secondsLeft % 60;
      displayEl.textContent = `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
    };

    render();
    countdownInterval = setInterval(() => {
      secondsLeft--;
      if (secondsLeft < 0) {
        clearInterval(countdownInterval);
        return;
      }
      render();
    }, 1000);
  }

  // ---------- Banco de signos ----------
  function renderSignBankIndex() {
    setTheme(false);
    setProgress(false, 0);
    const items = Object.values(ZODIAC_SIGNS)
      .map(
        (s) => `
        <div class="sign-bank-item" data-id="${s.id}">
          <div class="sign-name">${s.name}</div>
        </div>`
      )
      .join("");

    showScreen(
      `
      <div class="screen">
        ${LOGO_HTML}
        <button class="btn-link back-link" id="back-btn">← Voltar</button>
        <p class="eyebrow">Banco de signos</p>
        <h1 class="title">Os 12 signos capilares</h1>
        <p class="subtitle">Toque em um signo para conhecer suas características.</p>
        <div class="sign-bank-grid">${items}</div>
      </div>
      `,
      () => {
        document.getElementById("back-btn").addEventListener("click", () => {
          if (state.bankReturnTo === "intro") renderIntro();
          else renderIntro();
        });
        document.querySelectorAll(".sign-bank-item").forEach((el) => {
          el.addEventListener("click", () => renderSignBankDetail(el.dataset.id));
        });
      }
    );
  }

  function renderSignBankDetail(signId) {
    const sign = ZODIAC_SIGNS[signId];
    setTheme(false);
    setProgress(false, 0);
    const positivesHtml = sign.positives.map((p) => `<li>${p}</li>`).join("");
    const challengesHtml = sign.challenges.map((c) => `<li>${c}</li>`).join("");

    showScreen(
      `
      <div class="screen">
        <button class="btn-link back-link" id="back-btn">← Voltar aos signos</button>
        <div class="sign-icon-wrapper">${renderConstellationSVG(sign.id, 200)}</div>
        <h1 class="result-name">${sign.name}</h1>
        <p class="result-description">${sign.description}</p>
        <p class="section-label">Pontos fortes</p>
        <ul class="trait-list positive">${positivesHtml}</ul>
        <p class="section-label">Pequenos desafios</p>
        <ul class="trait-list challenge">${challengesHtml}</ul>
      </div>
      `,
      () => {
        document.getElementById("back-btn").addEventListener("click", renderSignBankIndex);
      }
    );
  }

  renderIntro();
})();
