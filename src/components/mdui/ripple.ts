import { Directive } from "vue";
import mdui from "mdui";

export default ((el, binding) => {
    const $ = mdui.$(el);
    $.addClass("mdui-ripple");
    if (binding.value) {
        $.addClass(`mdui-ripple-${binding.value}`);
    }
    $.mutation();
}) as Directive<Element, string>