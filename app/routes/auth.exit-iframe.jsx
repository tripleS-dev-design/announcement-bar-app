// app/routes/auth.exit-iframe.jsx
export async function loader({ request }) {
  const url = new URL(request.url);
  const to = url.searchParams.get("exitIframe") || "/";
  const html = `<!doctype html>
<html>
  <head><meta charset="utf-8"><meta http-equiv="refresh" content="0; url=${to}"></head>
  <body>
    <script>
      (function(){
        var target = ${JSON.stringify(to)};
        if (window.top) window.top.location.href = target;
        else window.location.href = target;
      })();
    </script>
  </body>
</html>`;
  return new Response(html, { headers: { "Content-Type": "text/html; charset=utf-8" } });
}
