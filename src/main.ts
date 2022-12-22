import { createApp } from 'vue'
import App from './App.vue'
import "normalize.css";
import "uno.css";
import "mdui/dist/css/mdui.min.css";
import MDUIRippleDirective from "./components/mdui/ripple";
import MDUIColorDirective from "./components/mdui/color";

createApp(App)
    .directive("ripple", MDUIRippleDirective)
    .directive("color", MDUIColorDirective)
    .mount('#app')
