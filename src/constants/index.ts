export const menus = [
    {
        icon: 'mtdicon mtdicon-home-o',
        title: 'CSS',
        id: '1',
        children: [
            {
                id: '1-1',
                title: '2D寻路',
                route: 'astar',
            }, {
                id: '1-2',
                title: '3D寻路',
                route: 'astar3d',
            }, {
                id: '1-3',
                title: '翻转时钟',
                route: 'clock',
            }, {
                id: '1-4',
                title: '3D加载',
                route: '3dloading',
            }
        ]
    }, {
        id: '2',
        icon: 'mtdicon mtdicon-cart-o',
        title: '架构设计',
        children: [
            {
                id: '2-1',
                title: '头像并行',
                route: 'avatar',
            }
        ]
    }, {
        id: '3',
        icon: 'mtdicon mtdicon-time-o',
        title: '综合案例',
        children: [
            {
                id: '3-1',
                title: '3D地球',
                route: 'earth',
            },
            {
                id: '3-2',
                title: '飞跃丛林',
                route: 'jungle',
            }
        ]
    }, {
        id: '4',
        icon: 'mtdicon mtdicon-calendar-o',
        title: 'GLSL案例',
        children: [
            {
                id: '4-1',
                title: '纹理动效',
                route: 'effect',
            }
        ]
    }
];
