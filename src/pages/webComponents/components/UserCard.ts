const template = document.createElement('template');
template.innerHTML = `
<style>
    :host {
        display: block;
    }
    :host([orange]) {
        background: orange;
    }
    ::slotted([slot="element-name"]) {
        color: red;
        font-weight: bold;
    }
    h3{
        color: coral;
    }
    .user-card{
        font-size: 12px;
        width: 200px;
        height: 200px;
    }
    .bili-avatar-img-radius {
        border-radius: 50%;
    }
    .bili-avatar-img {
        border: none;
        display: block;
        object-fit: cover;
        image-rendering: -webkit-optimize-contrast;
        height: 30px;
        aspect-ratio: auto 92 / 30;
        width: 92px;
    }
    .bili-avatar-face {
        position: absolute;
        width: 150px;
        height: 38px;
    }
</style>
<div class="user-card">
    <slot name="element-name"></slot>
    <h3>Hello World</h3>
    <div class="bili-avatar-face">
        <img class="bili-avatar-img bili-avatar-img-radius"  alt="">
    </div>
</div>
`;
export default class UserCard extends HTMLElement {
    static formAssociated = true;
    static AVATAR_CLICK = 'avatar_click';
    internals: ElementInternals;
    private avatar: HTMLImageElement;
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
        this.internals = this.attachInternals?.();
    }
    /**
       * connectedCallback
       * 当元素插入到 DOM 中时，将调用 connectedCallback。
       * 这是运行安装代码的好地方，比如获取数据或设置默认属性。
       * 可以将其与React的componentDidMount方法进行比较
       * vue的mount方法作比较
       */
    connectedCallback() {
        console.log('connected!');
        this.#render();
    }
    #clickAvatar(ev: MouseEvent) {
        console.log(ev.target);
        const { name, avatar } = this.dataset;
        this.dispatchEvent(new CustomEvent(UserCard.AVATAR_CLICK, {
            detail: {
                name,
                avatar
            }
        }));
    }
    #render() {
        const { name, avatar } = this.dataset;
        this.shadowRoot.appendChild(template.content.cloneNode(true));
        this.avatar = this.shadowRoot.querySelector('img');
        this.shadowRoot.querySelector('h3').innerText = name;
        this.avatar.src = avatar;
        this.avatar.addEventListener('click', this.#clickAvatar.bind(this));
        console.dir(this.shadowRoot);
        document.addEventListener('click', ev => {
            if (ev.composedPath().includes(this)) {
                console.log('点击发生在自定义组件内部');
            } else {
                console.log('点击发生在自定义组件外部');
            }
        });
        const animate = this.#slide();
        animate.onfinish = ev => {
            console.log('动画结束', ev);
            console.dir(this);
            animate.onfinish = null;
        };
    }
    #slide() {
        return this.animate([
            { transform: 'translateY(-300px)' },
            { transform: 'translateY(0px)' }
        ], {
            duration: 1000
        });
    }
    open() {
        console.log('被点击');
        this.#slide();
    }
    /**
     * disconnectedCallback
     * 只要从 DOM 中移除元素，就会调用 disconnectedCallback。清理时间到了！
     * 我们可以使用 disconnectedCallback 删除事件监听，或取消记时。
     * 但是请记住，当用户直接关闭浏览器或浏览器标签时，这个方法将不会被调用。
     *
     * 可以用window.unload beforeunload或者widow.close 去触发在浏览器关闭是的回调
     *
     * 可以与 react 中的 componentWillUnmount 的方法进行比较
     * vue 中的 destory中是生命周期函数进行对比
     */
    disconnectedCallback() {
        console.log('disconnected!');
    }
    get template() {
        return template.content;
    }
    static get observedAttributes() {
        return ['data-name', 'data-avatar'];
    }
    /**
     *
     * @param {*} name
     * @param {*} oldVal
     * @param {*} newVal
     *
     * 每当添加到observedAttributes数组的属性发生变化时，就会调用这个函数。使用属性的名称、旧值和新值调用该方法
     * react 中的 static getDerivedStateFromProps(props, state) 有些类似
     * 基本上和vue中的watch使用和observedAttributes + attributeChangedCallback使用雷同；
     */

    attributeChangedCallback(name, oldVal, newVal) {
        console.log(`Attribute: ${name}->${oldVal}->${newVal} changed!`);
    }
    /**
     * 每次将自定义元素移动到新文档时，都会调用 adoptedCallback。只有当您的页面中有 < iframe > 元素时，您才会遇到这个用例。
     * 通过调用document.adoptnode (element)调用它，基本上用不上
     */
    adoptedCallback() {
        console.log('adopted!');
    }
    /**
     * 生命周期的执行顺序  挂载的时候 按照react 或者vue中的执行顺序是相同的
     * constructor -> attributeChangedCallback -> connectedCallback
     */
}
window.customElements.define('customer-usercard', UserCard);
