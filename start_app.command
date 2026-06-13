#!/bin/bash

# Ens situem a la carpeta pare on és el server.py
cd "$(dirname "$0")/.."

echo "=========================================="
echo "   Iniciant BiblioScan - Cerca Portades   "
echo "=========================================="
echo ""

# Tancar qualsevol servidor anterior que estigui ocupant el port 8000
echo "Netejant sessions anteriors..."
lsof -ti:8000 | xargs kill -9 2>/dev/null

echo "S'està iniciant el servidor..."

# Obrim el navegador directament a l'app de cerca per portada
(sleep 2 && open "https://localhost:8000/open_library/") &

# Iniciem el servidor python des de la carpeta arrel del projecte
python3 server.py
