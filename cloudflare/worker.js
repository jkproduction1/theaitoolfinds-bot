// Telegram webhook for @theaitoolfinds bot (Cloudflare Worker, free plan).
// Answers a button tap instantly and starts the GitHub poster right away.
// Secrets (Worker > Settings > Variables and Secrets):
//   TELEGRAM_BOT_TOKEN, GH_TOKEN (fine-grained, Actions: read+write on the repo), WEBHOOK_SECRET
const REPO = 'jkproduction1/theaitoolfinds-bot';

const tg = (env, method, body) => fetch(`https://api.telegram.org/bot${env.TELEGRAM_BOT_TOKEN}/${method}`, {
  method: 'POST', headers: {'content-type': 'application/json'}, body: JSON.stringify(body),
});

const REPLY = {ok: '✅ Přijato! Nahrávám a plánuju post…', no: '🗑️ Zahozeno', mk: '🎬 Jasně, dělám video…'};

export default {
  async fetch(req, env) {
    const url = new URL(req.url);
    if (url.pathname === '/setup') {  // one-time: point Telegram at this worker
      if (url.searchParams.get('key') !== env.WEBHOOK_SECRET) return new Response('wrong key', {status: 403});
      const r = await tg(env, 'setWebhook', {url: `${url.origin}/tg`, secret_token: env.WEBHOOK_SECRET,
        allowed_updates: ['callback_query', 'message']});
      return new Response(await r.text());
    }
    if (url.pathname !== '/tg' || req.method !== 'POST') return new Response('ok');
    if (req.headers.get('x-telegram-bot-api-secret-token') !== env.WEBHOOK_SECRET) return new Response('no', {status: 403});
    const update = await req.json();
    const cq = update.callback_query;
    if (cq) {
      const action = (cq.data || '').split(':')[0];
      await tg(env, 'answerCallbackQuery', {callback_query_id: cq.id, text: REPLY[action] || 'OK'});
    }
    // hand the update to the GitHub poster immediately
    const b64 = btoa(unescape(encodeURIComponent(JSON.stringify(update))));
    await fetch(`https://api.github.com/repos/${REPO}/actions/workflows/post-approved.yml/dispatches`, {
      method: 'POST',
      headers: {authorization: `Bearer ${env.GH_TOKEN}`, accept: 'application/vnd.github+json',
        'user-agent': 'theaitoolfinds-worker'},
      body: JSON.stringify({ref: 'main', inputs: {update: b64}}),
    });
    return new Response('ok');
  },
};
