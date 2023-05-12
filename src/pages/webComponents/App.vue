<template>
    <section>
        <mtd-button
            type="primary"
            @click="clickOpen"
        >点击通讯</mtd-button>
        <customer-usercard
            orange
            ref="userCard"
            data-name="John Doe"
            data-avatar="https://www.google.com.hk/images/branding/googlelogo/2x/googlelogo_color_92x30dp.png"
        >
            <span slot="element-name">customer-usercard</span>
        </customer-usercard>
        <button-group ref="group">
            <button>1</button>
            <button>2</button>
            <button aria-pressed="true">3</button>
            <button>4</button>
        </button-group>
        <button @click="clickAddGroup">Add option</button>
    </section>
</template>
<script lang="ts">
import '@/pages/webComponents/components/buttongroup';
import ButtonGroup from '@/pages/webComponents/components/buttongroup';
import Button from '@ss/mtd-vue/lib/button';
import UserCard from '@/pages/webComponents/components/UserCard';
import { Component, Vue } from 'vue-property-decorator';
@Component({
    components: {
        [Button.name]: Button
    },
})
export default class App extends Vue {
    counter = 3;
    userCard: UserCard;
    asyncUserCard: UserCard;
    buttonGroup: ButtonGroup;
    $refs!: {
        group: ButtonGroup,
        userCard: UserCard;
    }
    constructor() {
        super();
    }
    clickAddGroup() {
        this.counter++;
        this.buttonGroup.insertAdjacentHTML('beforeend', `<button aria-pressed=true>${this.counter}</button>`);
    }
    clickOpen() {
        this.userCard.open();
        console.log('internals', this.userCard.internals.form);
    }
    mounted() {
        this.userCard = this.$refs.userCard;
        this.buttonGroup = this.$refs.group;
        console.dir(this.buttonGroup);
        this.userCard.addEventListener(UserCard.AVATAR_CLICK, (ev: CustomEvent) => {
            console.log(ev.detail);
        });
        import('@/pages/webComponents/components/UserCard').then(({ default: WebComponent }) => {
            requestIdleCallback(() => {
                this.asyncUserCard = new WebComponent();

                const span = document.createElement('span');
                span.slot = 'element-name';
                span.innerText = 'customer-usercard';
                this.asyncUserCard.appendChild(span);
                this.asyncUserCard.setAttribute('orange', '');
                this.asyncUserCard.setAttribute('data-name', 'John Doe');
                this.asyncUserCard.setAttribute('data-avatar', 'https://www.google.com.hk/images/branding/googlelogo/2x/googlelogo_color_92x30dp.png');
                this.asyncUserCard.addEventListener(UserCard.AVATAR_CLICK, (ev: CustomEvent) => {
                    console.log(ev.detail);
                });
                document.body.appendChild(this.asyncUserCard);
            });
        });
    }
    beforeDestroy() {
        this.asyncUserCard.remove();
    }
}
</script>
<style lang="less" scoped>
customer-usercard {
    display: flex;
    width: 50vw;
    height: 300px;
}
.user-card {
    font-size: 14px;
    color: red;
}
</style>
