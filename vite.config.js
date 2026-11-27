import {defineConfig} from 'vite';
import {createApi} from './server/api.js';
export default defineConfig({plugins:[{name:'escape-local-multiplayer',configureServer(server){server.middlewares.use(createApi());}}]});
