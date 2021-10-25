export default {
    isWebGLAvailable() {
        try {
            const canvas = document.createElement('canvas');
            return !!(window.WebGLRenderingContext && (canvas.getContext('webgl') || canvas.getContext('experimental-webgl')));
        } catch (e) {
            return false;
        }
    },
    isWebGL2Available() {
        try {
            const canvas = document.createElement('canvas');
            return !!(window.WebGL2RenderingContext && canvas.getContext('webgl2'));
        } catch (e) {
            return false;
        }
    },
    getWebGLErrorMessage: function () {
        return this.getErrorMessage(1);

    },
    getWebGL2ErrorMessage: function () {
        return this.getErrorMessage(2);
    },

    getErrorMessage: function (version) {
        let message = 'Your $0 does not seem to support <a href="http://khronos.org/webgl/wiki/Getting_a_WebGL_Implementation" style="color:#000">$1</a>';
        const names = {
            1: 'WebGL',
            2: 'WebGL 2'
        };
        const contexts = {
            1: window.WebGLRenderingContext,
            2: window.WebGL2RenderingContext
        };
        const element = document.createElement('div');
        element.id = 'webglmessage';
        element.style.cssText = 'font-family:monospace;font-size:13px;font-weight:normal;text-align:center;background:#fff;color:#000;padding:1.5em;width:400px;margin:5em auto 0';
        if (contexts[version]) {
            message = message.replace('$0', 'graphics card');
        } else {
            message = message.replace('$0', 'browser');
        }
        message = message.replace('$1', names[version]);
        element.innerHTML = message;
        return element;
    }
};
