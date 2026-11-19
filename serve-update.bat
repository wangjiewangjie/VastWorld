@echo off
cd /d "%~dp0"
echo Serving hikermovie update on http://192.168.3.222:8765/
echo Keep this window open, then on phone open ???? and tap ????
python -c "from http.server import ThreadingHTTPServer, SimpleHTTPRequestHandler as H
class X(H):
  def end_headers(self):
    self.send_header('Access-Control-Allow-Origin','*')
    self.send_header('Cache-Control','no-store')
    super().end_headers()
ThreadingHTTPServer(('0.0.0.0',8765),X).serve_forever()"
pause
