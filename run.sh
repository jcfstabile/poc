cd web;
sh -c "../grab.sh";
sh -c "../server.py&";
export SERVERPID=$(ps ax | grep "python3 ../[s]erver.py" | awk '{print $1}')

echo kill $SERVERPID > ../stop.sh

xdg-open "http://localhost:8000/";

# kill $SERVERPID

