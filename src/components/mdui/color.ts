import { Directive } from "vue";

export default ((el, binding) => {
    el.classList.forEach((className) => {
        if (className.startsWith("mdui-color-") || className.startsWith("mdui-text-color-")) {
            el.classList.remove(className);
        }
    });
    let className = "mdui-color-";
    if (binding.modifiers.text) {
        className = "mdui-text-color-";
    }
    if (binding.value) {
        className += binding.value;
    } else {
        className += "theme"
    }
    if (binding.modifiers.accent) {
        className += "-accent";
    }
    el.classList.add(className);

    
}) as Directive<Element, string | undefined>