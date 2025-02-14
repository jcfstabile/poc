cd web;
sh -c "../scripts/grab.sh";
sh -c "../scripts/server.py&";
export SERVERPID=$(ps ax | grep "python3 ../[s]erver.py" | awk '{print $1}')

echo kill $SERVERPID > ../stop.sh

xdg-open "http://localhost:8000/";

# kill $SERVERPID

