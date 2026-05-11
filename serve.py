#!/usr/bin/env python3
"""Local dev server with Cache-Control headers so the browser doesn't
revalidate every asset on every page navigation.

- HTML  : no-cache (always pick up edits)
- CSS/JS: max-age=300 (5 min)
- images: max-age=3600 (1 hour)
- fonts : max-age=86400 (1 day)
"""
from http.server import ThreadingHTTPServer, SimpleHTTPRequestHandler


class CachingHandler(SimpleHTTPRequestHandler):
    def end_headers(self):
        path = self.path.split("?", 1)[0].split("#", 1)[0].lower()
        if path.endswith((".html", "/")) or "." not in path.rsplit("/", 1)[-1]:
            self.send_header("Cache-Control", "no-cache, must-revalidate")
        elif path.endswith((".css", ".js")):
            self.send_header("Cache-Control", "public, max-age=300")
        elif path.endswith((".woff", ".woff2", ".ttf", ".otf")):
            self.send_header("Cache-Control", "public, max-age=86400, immutable")
        elif path.endswith((".webp", ".png", ".jpg", ".jpeg", ".gif", ".svg", ".ico", ".avif")):
            self.send_header("Cache-Control", "public, max-age=3600")
        else:
            self.send_header("Cache-Control", "public, max-age=60")
        super().end_headers()


if __name__ == "__main__":
    port = 8000
    with ThreadingHTTPServer(("0.0.0.0", port), CachingHandler) as httpd:
        print(f"Serving with cache headers on http://localhost:{port}")
        httpd.serve_forever()
