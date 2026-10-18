// Configuration for your app
// https://v2.quasar.dev/quasar-cli-vite/quasar-config-file

import { defineConfig } from '#q-app';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig((/* ctx */) => {
        return {
                // https://v2.quasar.dev/quasar-cli-vite/boot-files
                boot: ['axios'],

                // https://v2.quasar.dev/quasar-cli-vite/quasar-config-file#css
                // A ordem importa: o Tailwind vem por último para sobrescrever o Quasar.
                css: ['fonts.css', 'app.scss', 'tailwind.css'],

                // https://github.com/quasarframework/quasar/tree/dev/extras
                extras: ['material-icons', 'mdi-v7'],

                // Full list of options: https://v2.quasar.dev/quasar-cli-vite/quasar-config-file#build
                build: {
                        target: {
                                browser: ['es2022', 'firefox115', 'chrome115', 'safari14'],
                                node: 'node20',
                        },

                        typescript: {
                                strict: true,
                                vueShim: true,
                        },

                        vueRouterMode: 'history',

                        vitePlugins: [
                                // @tailwindcss/vite retorna um array de plugins
                                ...tailwindcss(),
                                [
                                        'vite-plugin-checker',
                                        {
                                                vueTsc: true,
                                                eslint: {
                                                        lintCommand:
                                                                'eslint -c ./eslint.config.js "./src*/**/*.{ts,js,mjs,cjs,vue}"',
                                                        useFlatConfig: true,
                                                },
                                        },
                                        { server: false },
                                ],
                        ],
                },

                // Full list of options: https://v2.quasar.dev/quasar-cli-vite/quasar-config-file#devserver
                devServer: {
                        open: true,
                },

                // https://v2.quasar.dev/quasar-cli-vite/quasar-config-file#framework
                framework: {
                        config: {
                                notify: { position: 'top-right', timeout: 3000 },
                        },
                        lang: 'pt-BR',
                        iconSet: 'material-icons',
                        plugins: ['Notify', 'Dialog', 'Loading', 'LocalStorage', 'SessionStorage'],
                },

                animations: [],
        };
});
