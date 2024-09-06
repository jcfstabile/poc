#!/usr/bin/env python3
# from https://stackoverflow.com/a/21957017
from http.server import HTTPServer, SimpleHTTPRequestHandler, test
import sys
import signal

class CORSRequestHandler (SimpleHTTPRequestHandler):
    def end_headers (self):
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Cache-Control', 'no-cache, no-store, must-revalidate')
        self.send_header('Pragma', 'no-cache')
        self.send_header('Expires', '0')
        SimpleHTTPRequestHandler.end_headers(self)

def interrupt_handler(sig, frame):
    print('Exiting from server')
    sys.exit(0)

if __name__ == '__main__':
    signal.signal(signal.SIGINT, interrupt_handler)
    signal.signal(signal.SIGTERM, interrupt_handler)

    test(CORSRequestHandler, HTTPServer, port=int(sys.argv[1]) if len(sys.argv) > 1 else 8000)
