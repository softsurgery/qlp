(function persistSwaggerAuth() {
  const TOKEN_KEY = 'access_token';
  const AUTH_SCHEME = 'access_token';

  function applyToken(ui, token) {
    if (!ui || !token) {
      return;
    }
    ui.preauthorizeApiKey(AUTH_SCHEME, token);
  }

  function extractToken(body) {
    try {
      const data = typeof body === 'string' ? JSON.parse(body) : body;
      return data?.access_token || data?.data?.access_token || null;
    } catch {
      return null;
    }
  }

  function attachFetchInterceptor(ui) {
    if (window.__swaggerAuthFetchPatched) {
      return;
    }
    window.__swaggerAuthFetchPatched = true;

    const originalFetch = window.fetch;
    window.fetch = async function patchedFetch(...args) {
      const response = await originalFetch.apply(this, args);
      const requestUrl = typeof args[0] === 'string' ? args[0] : args[0]?.url;

      if (requestUrl && requestUrl.includes('auth/sign-in') && response.ok) {
        const clone = response.clone();
        clone.text().then((text) => {
          const token = extractToken(text);
          if (token) {
            localStorage.setItem(TOKEN_KEY, token);
            applyToken(window.ui || ui, token);
          }
        });
      }

      return response;
    };
  }

  function onUiReady() {
    const ui = window.ui;
    if (!ui) {
      setTimeout(onUiReady, 100);
      return;
    }

    applyToken(ui, localStorage.getItem(TOKEN_KEY));
    attachFetchInterceptor(ui);
  }

  if (document.readyState === 'complete') {
    onUiReady();
  } else {
    window.addEventListener('load', onUiReady);
  }
})();
