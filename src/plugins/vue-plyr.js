import Vue from 'vue'
import VuePlyr from 'vue-plyr'
Vue.use(VuePlyr, {
    plyr: {
        // fullscreen: { enabled: false },
        controls: ['play', 'progress', 'current-time', 'mute', 'volume', 'captions', 'fullscreen']
    },
    emit: ['ended']
})