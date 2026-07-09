import { defineConfig, fontProviders } from "astro/config";

export default defineConfig({
  fonts: [{
    provider: fontProviders.local(),
    name: "RustyAttack",
    cssVariable: "--font-rusty-attack",
    options: {
      variants: [{
        src: ['./src/fonts/rusty_attack_regular.otf'],
        weight: 'normal',
        style: 'normal'
      }]
    }
  }]
});

