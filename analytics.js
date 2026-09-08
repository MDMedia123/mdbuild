/* Funnel tracking for buildbymd.com.
 *
 * Deliberately small and deliberately forgettable: the visit id lives in
 * sessionStorage, so it is gone when the tab closes. No cookie is set, nothing
 * is shared with another site, and nothing here identifies a person — which is
 * why the site needs no cookie banner.
 *
 * Exposes window.mdTrack(name) so a page can record a step of its own.
 */
(function () {
  'use strict';

  var ENDPOINT = '/api/track';
  var SESSION_KEY = 'md_visit';
  var CAMPAIGN_KEY = 'md_campaign';

  function store(key, value) {
    try { sessionStorage.setItem(key, value); } catch (err) { /* private mode */ }
  }

  function recall(key) {
    try { return sessionStorage.getItem(key); } catch (err) { return null; }
  }

  // One id per tab, for the length of the visit.
  function visitId() {
    var id = recall(SESSION_KEY);
    if (id) return id;

    id = (window.crypto && window.crypto.randomUUID)
      ? window.crypto.randomUUID()
      : String(Date.now()) + '-' + Math.random().toString(36).slice(2, 11);

    store(SESSION_KEY, id);
    return id;
  }

  // Campaign tags arrive on the landing page but matter at the checkout, so
  // hold them for the rest of the visit. Without this, every sale looks like it
  // came from nowhere.
  function campaign() {
    var held = recall(CAMPAIGN_KEY);
    var params = new URLSearchParams(window.location.search);
    var fresh = {
      utm_source:   params.get('utm_source'),
      utm_medium:   params.get('utm_medium'),
      utm_campaign: params.get('utm_campaign')
    };

    if (fresh.utm_source || fresh.utm_medium || fresh.utm_campaign) {
      store(CAMPAIGN_KEY, JSON.stringify(fresh));
      return fresh;
    }

    if (held) {
      try { return JSON.parse(held); } catch (err) { /* fall through */ }
    }
    return {};
  }

  function track(name) {
    var tags = campaign();
    var payload = JSON.stringify({
      event:        name,
      session:      visitId(),
      path:         window.location.pathname,
      referrer:     document.referrer || null,
      utm_source:   tags.utm_source || null,
      utm_medium:   tags.utm_medium || null,
      utm_campaign: tags.utm_campaign || null
    });

    // sendBeacon survives the page being navigated away from, which is exactly
    // when the interesting events happen.
    try {
      if (navigator.sendBeacon) {
        navigator.sendBeacon(ENDPOINT, new Blob([payload], { type: 'application/json' }));
        return;
      }
    } catch (err) { /* fall through to fetch */ }

    try {
      fetch(ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: payload,
        keepalive: true
      }).catch(function () { /* analytics must never disturb the page */ });
    } catch (err) { /* ignore */ }
  }

  window.mdTrack = track;

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function () { track('page_view'); });
  } else {
    track('page_view');
  }
})();
