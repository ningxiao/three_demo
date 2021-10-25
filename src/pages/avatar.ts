import '@/style/index.less';
import Avatar from '@/components/Avatar';
const createAvatar = () => {
    ['quanyingying', 'shidan03', 'wanghaoran16', 'quanyingying', 'ningxiao', 'xuxin09', 'shidan03', 'wanghaoran16', 'ningxiao', 'xuxin09', 'quanyingying', 'ningxiao', 'xuxin09', 'shidan03', 'wanghaoran16'].forEach(vo => {
        new Avatar(vo, document.querySelector('#app'));
    });
};
createAvatar();
setTimeout(() => {
    createAvatar();
}, 5000);
