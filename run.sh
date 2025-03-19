cd web;
sh -c "../scripts/grab.sh";
sh -c "../scripts/server.py&";
export SERVERPID=$(ps ax | grep "python3 ../scripts/[s]erver.py" | awk '{print $1}')

echo "if ps -p $SERVERPID > /dev/null ; then kill $SERVERPID; rm -- \$0; fi" > ../stop.sh
chmod +x ../stop.sh

xdg-open "http://localhost:8000/";

# kill $SERVERPID

