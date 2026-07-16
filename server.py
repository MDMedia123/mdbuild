import http.server
import os
import glob
import traceback

FOLDER = r"C:\Users\mikedownes\Claude Building"

class LatestFileHandler(http.server.SimpleHTTPRequestHandler):
    def do_GET(self):
        try:
            if self.path == "/" or self.path == "/latest":
                html_files = glob.glob(os.path.join(FOLDER, "*.html"))
                if html_files:
                    latest = max(html_files, key=os.path.getmtime)
                    filename = os.path.basename(latest)
                    filepath = latest
                    print(f"  Serving latest: {filename}")
                    with open(filepath, 'rb') as f:
                        self.send_response(200)
                        self.send_header('Content-type', 'text/html')
                        self.send_header('Content-length', os.path.getsize(filepath))
                        self.end_headers()
                        self.wfile.write(f.read())
                else:
                    self.send_error(404, "No HTML files found in folder")
            else:
                super().do_GET()
        except Exception as e:
            print(f"  ERROR in do_GET: {e}")
            traceback.print_exc()

    def log_message(self, format, *args):
        print(f"  {args[0]} {args[1]}")

if __name__ == "__main__":
    os.chdir(FOLDER)
    PORT = 7655
    print("==================================================")
    print("  NCR Dashboard Server")
    print(f"  Share this link: http://192.168.68.69:{PORT}/latest")
    print(f"  Local access:    http://localhost:{PORT}/latest")
    print("  Serving from:", FOLDER)
    html_files = glob.glob(os.path.join(FOLDER, "*.html"))
    if html_files:
        latest = max(html_files, key=os.path.getmtime)
        print("  Current latest:", os.path.basename(latest))
    print("  (Auto-updates when new .html file is added)")
    print("==================================================")
    http.server.HTTPServer(("0.0.0.0", PORT), LatestFileHandler).serve_forever()
