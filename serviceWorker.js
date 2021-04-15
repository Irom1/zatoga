var version = 2.59;

const staticZatoga = "zatoga-app-v2";
const assets = [
  "/",
  "/app/",
  "/app/info.html",
  "/media/style.css",
  "/media/app.js",
  "/media/icon.png",
  "/favicon.ico",
  "/app/games/doodle-jump/",
  "/app/games/doodle-jump/background.png",
  "/app/games/doodle-jump/border.png",
  "/app/games/doodle-jump/image.png",
  "/app/games/doodle-jump/main.js",
  "/app/games/doodle-jump/prefixfree.min.js",
  "/app/games/doodle-jump/style.css",
  "/app/games/2048.html",
  "/app/games/chrome-dino.html",
  "/app/games/super-mario/",
  "/app/games/super-mario/game.png",
  "/app/games/super-mario/game.html",
  "/app/games/super-mario/power.html",
  "/app/games/super-mario/audio/theme/Sky.ogg",
  "/app/games/super-mario/audio/coin.ogg",
  "/app/games/super-mario/audio/die.ogg",
  "/app/games/super-mario/audio/enemy_die.ogg",
  "/app/games/super-mario/audio/grow.ogg",
  "/app/games/super-mario/audio/hurt.ogg",
  "/app/games/super-mario/audio/invincibility.ogg",
  "/app/games/super-mario/audio/jump.ogg",
  "/app/games/super-mario/audio/lifeupgrade.ogg",
  "/app/games/super-mario/audio/mushroom.ogg",
  "/app/games/super-mario/audio/music.ogg",
  "/app/games/super-mario/audio/Overworld.ogg",
  "/app/games/super-mario/audio/shell.ogg",
  "/app/games/super-mario/audio/shoot.ogg",
  "/app/games/super-mario/audio/success.ogg",
  "/app/games/super-mario/Content/backgrounds/01.png",
  "/app/games/super-mario/Content/backgrounds/02.png",
  "/app/games/super-mario/Content/backgrounds/03.png",
  "/app/games/super-mario/Content/backgrounds/04.png",
  "/app/games/super-mario/Content/backgrounds/05.png",
  "/app/games/super-mario/Content/backgrounds/06.png",
  "/app/games/super-mario/Content/backgrounds/07.png",
  "/app/games/super-mario/Content/backgrounds/08.png",
  "/app/games/super-mario/Content/fonts/Super Mario Bros.ttf",
  "/app/games/super-mario/Content/mario-enemies.png",
  "/app/games/super-mario/Content/mario-objects.png",
  "/app/games/super-mario/Content/mario-peach.png",
  "/app/games/super-mario/Content/mario-sprites.png",
  "/app/games/super-mario/Content/style.css",
  "/app/games/super-mario/Scripts/constants.js",
  "/app/games/super-mario/Scripts/jquery.js",
  "/app/games/super-mario/Scripts/keys.js",
  "/app/games/super-mario/Scripts/main.js",
  "/app/games/super-mario/Scripts/oop.js",
  "/app/games/super-mario/Scripts/sounds_noop.js",
  "/app/games/super-mario/Scripts/sounds.js",
  "/app/games/super-mario/Scripts/testlevels.js",
  "/app/games/online/",
  "/app/games/online/play.html",
  "/app/games/online/archive.html"
];

self.addEventListener("install", installEvent => {
  installEvent.waitUntil(
    caches.open(staticZatoga).then(cache => {
      cache.addAll(assets)
    })
  )
});

self.addEventListener("fetch", fetchEvent => {
  fetchEvent.respondWith(
    caches.match(fetchEvent.request).then(res => {
      return res || fetch(fetchEvent.request)
    })
  )
});