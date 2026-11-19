# SUMMARY — gta6-cover-art-01: Vice Nights Cover Studio

Entry: aplikasi web offline yang mengubah foto + caption menjadi cover art
gaya box art multi-panel dan mengekspor PNG 1080x1080, 1080x1350, dan
1920x1080. Repo: Nawadays-ai/gta6-cover-art (belum di-push; submit menunggu
persetujuan).

## Perbaikan v3 (2026-11-19) — framing focal mengutamakan wajah

Cacat v2: panel foto di-crop di tengah foto, sehingga panel orang jatuh ke
dada/torso, bukan wajah (box art resmi GTA VI itu face-led: head-and-
shoulders, wajah besar di atas-tengah panel). Perbaikan:

- **Renderer (cover.js):** crop per panel kini berjangkar pada titik focal
  (fx, fy) dalam [0,1]² — jendela crop diposisikan agar titik focal jatuh
  di tengah panel sebisa mungkin, di-clamp ke batas foto. Default bila
  panel tak punya focal eksplisit: fx 0,5; fy 0,26 untuk panel portrait
  dan foto portrait (sepertiga atas, posisi wajah), fy 0,35 untuk panel
  landscape, fy 0,29 untuk panel nyaris persegi.
- **Editor (main.js + index.html + style.css):** slider pan lama kini
  mengatur titik focal langsung (rentang 0–1, nilai default di-reset ke
  default focal di atas); ada penanda focal pink yang BISA DISERET di
  pratinjau (klik-seret penanda untuk menunjuk wajah; seret di tempat lain
  menggeser foto dan focal ikut bergerak). Kursor pratinjau crosshair.
- **Adegan screenshot (shots.js + presets.js):** posisi wajah terukur di
  foto sampel — pier (0,44; 0,26), boulevard (0,56; 0,19) — dipasang
  sebagai focal eksplisit tiap panel foto, sehingga di semua ukuran ekspor
  (1080x1080, 1080x1350, 1920x1080) panel orang membingkai wajah.
- **Verifikasi visual:** keempat screenshot di-regenerate dari aplikasi
  yang berjalan dan diperiksa satu per satu — tidak ada lagi panel yang
  memotong orang di dada/leher; semua wajah terlihat head-and-shoulders
  (di layout Hero dan pita tengah, judul/emblem tetap menimpa sebagian
  wajah sesuai desain judul-menimpa-mosaik, tetapi crop-nya kini jatuh ke
  wajah, bukan leher/bahu seperti v2). Ukuran: 167.280 / 179.957 /
  233.740 / 171.498 byte, semua <= 256 KiB.
- **Uji v3:** node --check semua app/src/*.js lolos; main.ts dua kali
  jalan menghasilkan dossier.json byte-identik (1.070.568 byte,
  sha256 610a9b7aa1ed500334742c68562bbd962be876518e3f9d97e889fe5da0d4c591),
  di bawah cap kit 1,5 MiB; tidak ada referensi http/https di app/.

## Restyle v2 (2026-11-19) — mengikuti pola art resmi GTA VI

Visual dibangun ulang mengikuti POLA komposisi key art / box art resmi
GTA VI (dipelajari dari referensi di luar repo; tidak ada aset, logo, font,
atau karakter Rockstar yang disalin — semua gambar dan huruf digambar kode
sendiri):

- **Layout "Box Art" (default baru):** mosaik ireguler 5–8 panel (7 panel)
  full-bleed sampai ke tepi, ukuran dan rasio panel campur (dua tepi sedikit
  miring/angled), satu panel hero lebih besar, dipisahkan gutter HITAM tebal
  (±1% lebar canvas), tanpa margin luar / bingkai putih. Mosaik punya dua
  susunan: portrait/square dan landscape. Layout lama Hero/Triptych/Quad
  tetap ada, semuanya di-restyle full-bleed + gutter hitam; Hero diarahkan
  ke komposisi key art satu gambar: foto full-bleed, treatment langit
  gradien, siluet palem kode membingkai kiri/kanan, judul di atas.
- **Judul bertumpuk menimpa mosaik:** judul dipecah 2–3 baris, putih,
  extra-bold rounded, outline hitam tebal, di tengah, MENIMPA pita tengah
  mosaik — bukan lagi pita judul terpisah. Di belakang/bawahnya ada emblem
  gradien ORIGINAL: badge belah ketupat (diamond) berisi gradien sunset
  vertikal (ungu tua → magenta/pink → oranye) dengan siluet palem gelap di
  dalam gradien dan inisial pertama judul di tengahnya (fallback badge
  bintang bila judul kosong). Subjudul kecil dan subordinat, tanpa pita.
- **Grade foto baru "Illustrated" (default):** posterise (kuantisasi 5
  level per kanal) + boost saturasi/kontras + bayangan condong ungu dan
  highlight condong hangat, plus wash hue dominan per panel (teal, hot
  pink, ungu, oranye, aqua, magenta, biru langit) sehingga foto terbaca
  sebagai vignette komik. Grade lama Sunset, Neon, Noir, Gold tetap bisa
  dipilih.
- **Panel kosong = adegan motif vektor datar original** (rotasi per panel):
  helikopter di atas skyline, speedboat dengan flamingo pink, mobil sport
  kuning, buaya/aligator di air, siluet palem dengan matahari bergaris,
  hotel art-deco, dan burung-burung di atas teluk — menggantikan filler
  sunset polos sebelumnya.

## Isi aplikasi (app/, file statis, tanpa jaringan)

- app/index.html + app/style.css — editor: panel kontrol gelap dengan
  aksen gradien sunset dan tombol terpilih bergradien; pratinjau langsung.
- app/src/cover.js — renderer cover v2: mosaik Box Art, emblem gradien,
  judul bertumpuk, grade Illustrated + 4 grade lama, 7 adegan motif, palem
  dan skyline yang digambar kode.
- app/src/main.js — wiring editor: pilih layout (default Box Art), muat
  foto per panel, crop dan posisi (drag pratinjau atau slider zoom/pan),
  edit judul + subjudul, pilih grade (default Illustrated), ekspor PNG.
- app/src/presets.js — preset caption (5) dan data layout (Box Art 7 panel).
- app/src/shots.js — adegan tetap untuk screenshot (?shot=editor/cover/
  portrait/square/export, kini dengan parameter empty= untuk membiarkan
  panel tertentu menampilkan motifnya).
- app/samples/pier.jpg, boulevard.jpg — foto contoh bawaan kit (dibuat
  dengan image model untuk make.fun, bebas dipakai).

## Fitur

- 4 layout: Box Art (7 panel), Hero (key art, 3 panel), Triptych (3),
  Quad (4) — semua full-bleed dengan gutter hitam.
- Foto apa pun: tiap panel foto sendiri, zoom 1–3x, geser posisi (drag atau
  slider), satu foto bisa mengisi semua panel, panel bisa dikosongkan
  kembali ke adegan motif.
- 5 grade warna: Illustrated (default), Sunset, Neon, Noir, Gold.
- Judul + subjudul bisa diedit, plus 5 preset caption.
- Ekspor PNG satu klik: Square 1080x1080, Portrait 1080x1350,
  Wide 1920x1080. Foto dibaca di mesin sendiri, tidak pernah diunggah.

## Screenshot (asli dari aplikasi yang berjalan)

Diambil dengan Chromium headless 157 (via Playwright) dari aplikasi yang
berjalan, 4 file JPEG di screenshots/ (semua <= 256 KiB, sisi panjang
<= 1280, sisi pendek >= 480):

- 1-cover.jpg (1280x720) — PNG hasil ekspor Wide yang sebenarnya lewat
  jalur ekspor aplikasi: layout Box Art landscape, grade Illustrated,
  panel 3 dan 6 menampilkan motif mobil sport dan hotel art-deco.
- 2-editor.jpg (1280x800) — editor dengan layout Box Art + grade
  Illustrated; panel 5 dan 7 menampilkan motif palem dan burung.
- 3-cover.jpg (1024x1280) — cover Portrait layout Box Art, grade
  Illustrated, caption "NEON HEIST"; motif speedboat+flamingo dan buaya.
- 4-cover.jpg (1080x1080) — cover Square layout Hero (komposisi key art),
  grade Sunset, caption "OCEAN DRIVE": palem membingkai, judul di atas,
  emblem inisial "O".

Catatan: Chromium headless di VM ini membutuhkan dua flag kebijakan WebGL
milik Hatch (--hatch-webgl-allowed-domains-file dan
--hatch-webgl-allowed-domains-sha256) dan tidak bisa memuat
http://localhost (Local Network Access check); screenshot diambil lewat
file:// dengan flag --allow-file-access-from-files. Aplikasi sendiri tetap
jalan normal lewat node serve.ts di http://localhost:8080.

## Uji yang dijalankan

- MAKEFUN_OUTPUT_DIR=/tmp/out-cover node main.ts — sukses; dossier.json
  valid (1.070.568 byte di v3; 1.011.197 byte di v2, 712.261 byte di v1 —
  tetap lolos semua cap kit yang ditegakkan buildDossier), app/ +
  screenshots/ tersalin lengkap.
- main.ts dijalankan dua kali — byte hasil identik (deterministik,
  sha256 v3 610a9b7aa1ed500334742c68562bbd962be876518e3f9d97e889fe5da0d4c591;
  v2 d34a9c3cb11d68d205df32e13b51b873b985ea256af7aa4dcda98750f5801ae7).
- Semua berkas .js di app/src lolos node --check.
- Tidak ada referensi http/https di app/ (semua aset lokal).
- main.ts memanggil buildDossier dari vendor/makefun-app.ts (salinan kit
  utuh, sha256 14e650adbd6aff7fb760e9bcd7be00dfbe86fb4819afe88dfe23dd0e087e770e).

## Berkas repo

- main.ts, serve.ts, shots.json, README.md (badge make.fun), LICENSE (MIT),
  .makefun/owner.json (dompet 528VzcgreXtS599EmxZczVbNrPSC3vtnSFHvezPjBccW)
- app/, screenshots/ (4 JPEG), vendor/makefun-app.ts
- Perbaikan selama build v1: posisi underline judul yang semula menabrak
  subjudul di layout Hero/Quad diperbaiki, ditambah scrim gelap di bawah
  pita judul agar terbaca di atas skyline. (Di v2 underline dan pita judul
  sudah tidak ada — judul kini bertumpuk menimpa mosaik dengan emblem.)
- Perbaikan selama restyle v2: emblem awalnya tertutup penuh oleh judul —
  digeser lebih besar dan lebih ke bawah agar gradien, palem, dan inisial
  terlihat di bawah tumpukan judul; backdrop langit Hero dihapus agar
  gutter Hero benar-benar hitam; tab panel editor dibuat wrap agar 7 tab
  Box Art tidak meluber.
