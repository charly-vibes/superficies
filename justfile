set shell := ["bash", "-cu"]

install:
    npm install

check:
    npm run check

build:
    npm run build

serve:
    npm run dev -- --host 0.0.0.0

preview:
    npm run preview -- --host 0.0.0.0
