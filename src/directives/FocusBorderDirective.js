import Vue from 'vue'

const defaultBorderColor = '#4c91ff';

export const FocusBorder = {
    bind(el, binding, vnode) {
        const color = binding.expression || defaultBorderColor;
        if (el) {

            el.addEventListener('focus', function () {
                // binding.value();
            });
            el.addEventListener('blur', function () {
                this.parentElement.style.borderColor = '';
            })
        }
    }
}