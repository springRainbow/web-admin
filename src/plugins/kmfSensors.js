import kmfSensors from '@glo/kmf-sensors';
import Vue from 'vue'

const data = {
    install(Vue) {
        Vue.prototype.$kmfSensors = kmfSensors;
    }
};

Vue.use(data);