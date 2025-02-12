import path from "path";
import vue from '@vitejs/plugin-vue';

export default {

    // vite app is loaded from /src
    root: path.join(__dirname, "src"),

    // build to /dist instead of /src/dist
    build: {
        outDir: '../dist',
        emptyOutDir: true,
    },

    // add plugins
    plugins: [
        vue(),
    ],

}
