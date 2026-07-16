import http.server

FOLDER = r"C:\Users\mikedownes\Claude Building"

class NoCacheHandler(http.server.SimpleHTTPRequestHandler):
    def end_headers(self):
        self.send_header('Cache-Control', 'no-store, no-cache, must-revalidate, max-age=0')
        self.send_header('Pragma', 'no-cache')
        self.send_header('Expires', '0')
        super().end_headers()

if __name__ == "__main__":
    import os
    os.chdir(FOLDER)
    PORT = 8000
    print("Serving with no-cache headers on http://localhost:%d" % PORT)
    http.server.HTTPServer(("0.0.0.0", PORT), NoCacheHandler).serve_forever()
