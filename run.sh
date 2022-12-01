cd web;
sh -c "../grab.sh";
sh -c "../server.py&";
xdg-open "http://localhost:8000/";
