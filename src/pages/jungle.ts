import '@/style/jungle.less';
import * as THREE from "three";
import WebGL from "@/utils/WebGL";
const Colors = {
    red: 0xf25346,
    yellow: 0xedeb27,
    white: 0xd8d0d1,
    brown: 0x59332e,
    pink: 0xF5986E,
    brownDark: 0x23190f,
    blue: 0x68c3c0,
    green: 0x458248,
    purple: 0x551A8B,
    lightgreen: 0x629265,
};
const petalColors = [Colors.red, Colors.yellow, Colors.blue];
class Jungle {
    private nearPlane = 1;
    private offSet = -600;
    private farPlane = 10000;
    private fieldOfView = 60;
    private scene: THREE.Scene;
    private camera: THREE.PerspectiveCamera;
    private aspectRatio: number;
    private HEIGHT: number;
    private WIDTH: number;
    private renderer: THREE.WebGLRenderer;
    private container: HTMLElement;
    private hemisphereLight: THREE.HemisphereLight;
    private shadowLight: THREE.DirectionalLight;
    private land: THREE.Mesh;
    private sun: THREE.Object3D;
    private orbit: THREE.Object3D;
    private sky: THREE.Object3D;
    private forest: THREE.Object3D;
    private mousePos = { x: 0, y: 0 };
    private airplane: {
        mesh: THREE.Object3D,
        propeller: THREE.Object3D
    };
    constructor(dom) {
        this.container = dom;
    }
    init() {
        this.createScene();
        this.createLights();
        this.createPlane();
        this.createOrbit();
        this.createSun();
        this.createLand();
        this.createForest();
        this.createSky();
        this.loop();
        document.addEventListener('mousemove', this.handleMouseMove.bind(this), false);
    }
    private createScene() {
        this.HEIGHT = window.innerHeight;
        this.WIDTH = window.innerWidth;
        // 创建场景。
        this.scene = new THREE.Scene();
        // 为场景添加FOV雾效果与样式表中的背景色相同。
        this.scene.fog = new THREE.Fog(0xf7d9aa, 100, 950);
        // 创建相机
        this.aspectRatio = this.WIDTH / this.HEIGHT;
        this.camera = new THREE.PerspectiveCamera(this.fieldOfView, this.aspectRatio, this.nearPlane, this.farPlane);
        // 定位相机
        this.camera.position.x = 0;
        this.camera.position.y = 150;
        this.camera.position.z = 100;
        // 创建渲染器
        this.renderer = new THREE.WebGLRenderer({
            // Alpha使背景透明，抗锯齿性能高
            alpha: true,
            antialias: true
        });
        //将渲染器的大小设置为全屏
        this.renderer.setSize(this.WIDTH, this.HEIGHT);
        //启用投影渲染
        this.renderer.shadowMap.enabled = true;
        this.container.appendChild(this.renderer.domElement);
        //监听屏幕大小改版后
        window.addEventListener('resize', this.handleWindowResize.bind(this), false);
    }
    private handleWindowResize() {
        this.WIDTH = window.innerWidth;
        this.HEIGHT = window.innerHeight;
        this.renderer.setSize(this.WIDTH, this.HEIGHT);
        this.camera.aspect = this.WIDTH / this.HEIGHT;
        this.camera.updateProjectionMatrix();
    }
    private createLights() {
        // 渐变光照 - 天空、地面、光强度
        this.hemisphereLight = new THREE.HemisphereLight(0xaaaaaa, 0x000000, 0.9);
        // 光源 平行光
        this.shadowLight = new THREE.DirectionalLight(0xffffff, 0.9);
        this.shadowLight.position.set(0, 350, 350);
        this.shadowLight.castShadow = true;
        // 设置投影阴影的可见区域
        this.shadowLight.shadow.camera.left = -650;
        this.shadowLight.shadow.camera.right = 650;
        this.shadowLight.shadow.camera.top = 650;
        this.shadowLight.shadow.camera.bottom = -650;
        this.shadowLight.shadow.camera.near = 1;
        this.shadowLight.shadow.camera.far = 1000;
        // 阴影贴图大小
        this.shadowLight.shadow.mapSize.width = 2048;
        this.shadowLight.shadow.mapSize.height = 2048;
        // 将光照添加到场景中
        this.scene.add(this.hemisphereLight);
        this.scene.add(this.shadowLight);
    }
    private createCloud() {
        const mesh = new THREE.Object3D();
        // 立方体几何和材质
        const geom = new THREE.DodecahedronGeometry(20, 0);
        const mat = new THREE.MeshPhongMaterial({
            color: Colors.white,
        });
        const nBlocs = 3 + Math.floor(Math.random() * 3);
        for (let i = 0; i < nBlocs; i++) {
            //克隆网格几何体
            const m = new THREE.Mesh(geom, mat);
            //随机放置每个立方体
            m.position.x = i * 15;
            m.position.y = Math.random() * 10;
            m.position.z = Math.random() * 10;
            m.rotation.z = Math.random() * Math.PI * 2;
            m.rotation.y = Math.random() * Math.PI * 2;
            //随机缩放立方体
            const s = .1 + Math.random() * .9;
            m.scale.set(s, s, s);
            mesh.add(m);
        }
        return mesh;
    }
    /**
     * 生成树三维物体
     * @returns
     */
    private createTree() {
        const mesh = new THREE.Object3D();
        const matTreeLeaves = new THREE.MeshPhongMaterial(
            {
                color: Colors.green,
                flatShading: true
            }
        );//网格材质
        const geonTreeBase = new THREE.BoxGeometry(10, 20, 10);//立方缓冲几何体
        const matTreeBase = new THREE.MeshBasicMaterial({ color: Colors.brown });//基础网格材质
        const treeBase = new THREE.Mesh(geonTreeBase, matTreeBase);//网格
        treeBase.castShadow = true;
        treeBase.receiveShadow = true;
        mesh.add(treeBase);

        const geomTreeLeaves1 = new THREE.CylinderGeometry(1, 12 * 3, 12 * 3, 4);
        const treeLeaves1 = new THREE.Mesh(geomTreeLeaves1, matTreeLeaves);
        treeLeaves1.castShadow = true;
        treeLeaves1.receiveShadow = true;
        treeLeaves1.position.y = 20;
        mesh.add(treeLeaves1);

        const geomTreeLeaves2 = new THREE.CylinderGeometry(1, 9 * 3, 9 * 3, 4);
        const treeLeaves2 = new THREE.Mesh(geomTreeLeaves2, matTreeLeaves);
        treeLeaves2.castShadow = true;
        treeLeaves2.position.y = 40;
        treeLeaves2.receiveShadow = true;
        mesh.add(treeLeaves2);

        const geomTreeLeaves3 = new THREE.CylinderGeometry(1, 6 * 3, 6 * 3, 4);
        const treeLeaves3 = new THREE.Mesh(geomTreeLeaves3, matTreeLeaves);
        treeLeaves3.castShadow = true;
        treeLeaves3.position.y = 55;
        treeLeaves3.receiveShadow = true;
        mesh.add(treeLeaves3);
        return mesh;

    }
    /**
     * 创建花朵
     * @returns
     */
    private createFlower() {
        const mesh = new THREE.Object3D();
        const geomStem = new THREE.BoxGeometry(5, 50, 5, 1, 1, 1);
        const matStem = new THREE.MeshPhongMaterial({ color: Colors.green, flatShading: true });
        const stem = new THREE.Mesh(geomStem, matStem);
        stem.castShadow = false;
        stem.receiveShadow = true;
        mesh.add(stem);

        const geomPetalCore = new THREE.BoxGeometry(10, 10, 10, 1, 1, 1);
        const matPetalCore = new THREE.MeshPhongMaterial({ color: Colors.yellow, flatShading: true });
        const petalCore = new THREE.Mesh(geomPetalCore, matPetalCore);
        petalCore.castShadow = false;
        petalCore.receiveShadow = true;
        const petalColor = petalColors[Math.floor(Math.random() * 3)];
        const geomPetal = new THREE.BoxGeometry(15, 20, 5, 1, 1, 1);
        const matPetal = new THREE.MeshBasicMaterial({ color: petalColor });
        geomPetal.translate(12.5, 0, 3);
        const petals = [];
        for (let i = 0; i < 4; i++) {
            petals[i] = new THREE.Mesh(geomPetal, matPetal);
            petals[i].rotation.z = i * Math.PI / 2;
            petals[i].castShadow = true;
            petals[i].receiveShadow = true;
        }
        petalCore.add(petals[0], petals[1], petals[2], petals[3]);
        petalCore.position.y = 25;
        petalCore.position.z = 3;
        mesh.add(petalCore);
        return mesh;
    }
    private createPlane() {
        const mesh = new THREE.Object3D();
        // 创建小屋
        const geomCockpit = new THREE.BoxGeometry(80, 50, 50, 1, 1, 1);
        const matCockpit = new THREE.MeshPhongMaterial({ color: Colors.red, flatShading: true });
        const vertices = geomCockpit.getAttribute('position');
        const array = vertices.array;
        const itemSize = vertices.itemSize;
        for (let i = 0; i < array.length; i += itemSize) {
            const x = array[i];
            const y = array[i + 1];
            const z = array[i + 2];
            if (x === -40) {
                vertices.setXYZ(i / itemSize, x, y > 0 ? y - 10 : y + 30, z > 0 ? z - 20 : z + 20);
            }
        }
        const cockpit = new THREE.Mesh(geomCockpit, matCockpit);
        cockpit.castShadow = true;
        cockpit.receiveShadow = true;
        mesh.add(cockpit);
        // 创建引擎
        const geomEngine = new THREE.BoxGeometry(20, 50, 50, 1, 1, 1);
        const matEngine = new THREE.MeshPhongMaterial({ color: Colors.white, flatShading: true });
        const engine = new THREE.Mesh(geomEngine, matEngine);
        engine.position.x = 40;
        engine.castShadow = true;
        engine.receiveShadow = true;
        mesh.add(engine);
        // 创建尾巴
        const geomTailPlane = new THREE.BoxGeometry(15, 20, 5, 1, 1, 1);
        const matTailPlane = new THREE.MeshPhongMaterial({ color: Colors.red, flatShading: true });
        const tailPlane = new THREE.Mesh(geomTailPlane, matTailPlane);
        tailPlane.position.set(-35, 25, 0);
        tailPlane.castShadow = true;
        tailPlane.receiveShadow = true;
        mesh.add(tailPlane);
        // 创建机翼
        const geomSideWing = new THREE.BoxGeometry(40, 4, 150, 1, 1, 1);
        const matSideWing = new THREE.MeshPhongMaterial({ color: Colors.red, flatShading: true });

        const sideWingTop = new THREE.Mesh(geomSideWing, matSideWing);
        const sideWingBottom = new THREE.Mesh(geomSideWing, matSideWing);
        sideWingTop.castShadow = true;
        sideWingTop.receiveShadow = true;
        sideWingBottom.castShadow = true;
        sideWingBottom.receiveShadow = true;

        sideWingTop.position.set(20, 12, 0);
        sideWingBottom.position.set(20, -3, 0);
        mesh.add(sideWingTop);
        mesh.add(sideWingBottom);

        const geomWindshield = new THREE.BoxGeometry(3, 15, 20, 1, 1, 1);
        const matWindshield = new THREE.MeshPhongMaterial({ color: Colors.white, transparent: true, opacity: .3, flatShading: true });
        const windshield = new THREE.Mesh(geomWindshield, matWindshield);
        windshield.position.set(5, 27, 0);
        windshield.castShadow = true;
        windshield.receiveShadow = true;
        mesh.add(windshield);
        const geomPropeller = new THREE.BoxGeometry(20, 10, 10, 1, 1, 1);
        const matPropeller = new THREE.MeshPhongMaterial({ color: Colors.brown, flatShading: true });
        const propeller = new THREE.Mesh(geomPropeller, matPropeller);
        propeller.castShadow = true;
        propeller.receiveShadow = true;

        const geomBlade1 = new THREE.BoxGeometry(1, 100, 10, 1, 1, 1);
        const geomBlade2 = new THREE.BoxGeometry(1, 10, 100, 1, 1, 1);
        const matBlade = new THREE.MeshPhongMaterial({ color: Colors.brownDark, flatShading: true });

        const blade1 = new THREE.Mesh(geomBlade1, matBlade);
        blade1.position.set(8, 0, 0);
        blade1.castShadow = true;
        blade1.receiveShadow = true;

        const blade2 = new THREE.Mesh(geomBlade2, matBlade);
        blade2.position.set(8, 0, 0);
        blade2.castShadow = true;
        blade2.receiveShadow = true;
        propeller.add(blade1, blade2);
        propeller.position.set(50, 0, 0);
        mesh.add(propeller);

        const wheelProtecGeom = new THREE.BoxGeometry(30, 15, 10, 1, 1, 1);
        const wheelProtecMat = new THREE.MeshPhongMaterial({ color: Colors.white, flatShading: true });
        const wheelProtecR = new THREE.Mesh(wheelProtecGeom, wheelProtecMat);
        wheelProtecR.position.set(25, -20, 25);
        mesh.add(wheelProtecR);

        const wheelTireGeom = new THREE.BoxGeometry(24, 24, 4);
        const wheelTireMat = new THREE.MeshPhongMaterial({ color: Colors.brownDark, flatShading: true });
        const wheelTireR = new THREE.Mesh(wheelTireGeom, wheelTireMat);
        wheelTireR.position.set(25, -28, 25);

        const wheelAxisGeom = new THREE.BoxGeometry(10, 10, 6);
        const wheelAxisMat = new THREE.MeshPhongMaterial({ color: Colors.brown, flatShading: true });
        const wheelAxis = new THREE.Mesh(wheelAxisGeom, wheelAxisMat);
        wheelTireR.add(wheelAxis);

        mesh.add(wheelTireR);

        const wheelProtecL = wheelProtecR.clone();
        wheelProtecL.position.z = -wheelProtecR.position.z;
        mesh.add(wheelProtecL);

        const wheelTireL = wheelTireR.clone();
        wheelTireL.position.z = -wheelTireR.position.z;
        mesh.add(wheelTireL);

        const wheelTireB = wheelTireR.clone();
        wheelTireB.scale.set(.5, .5, .5);
        wheelTireB.position.set(-35, -5, 0);
        mesh.add(wheelTireB);

        const suspensionGeom = new THREE.BoxGeometry(4, 20, 4);
        suspensionGeom.applyMatrix4(new THREE.Matrix4().makeTranslation(0, 10, 0));
        const suspensionMat = new THREE.MeshPhongMaterial({ color: Colors.red, flatShading: true });
        const suspension = new THREE.Mesh(suspensionGeom, suspensionMat);
        suspension.position.set(-35, -5, 0);
        suspension.rotation.z = -.3;
        mesh.add(suspension);
        this.airplane = { mesh, propeller };
        mesh.scale.set(.35, .35, .35);
        mesh.position.set(-40, 110, -250);
        this.airplane.mesh.rotation.z = Math.PI / 15;
        this.scene.add(mesh);
    }
    private createOrbit() {
        this.orbit = new THREE.Object3D();
        this.orbit.position.y = this.offSet;
        this.orbit.rotation.z = -Math.PI / 6;
        this.scene.add(this.orbit);
    }
    private createSun() {
        const sunGeom = new THREE.SphereGeometry(400, 20, 10);
        const sunMat = new THREE.MeshPhongMaterial({
            color: Colors.yellow,
            flatShading: true
        });
        const mesh = new THREE.Mesh(sunGeom, sunMat);
        mesh.castShadow = false;
        mesh.receiveShadow = false;
        this.sun = new THREE.Object3D();
        this.sun.add(mesh);
        this.sun.scale.set(1, 1, .3);
        this.sun.position.set(0, -30, -850);
        this.scene.add(this.sun);
    }
    private createLand() {
        const geom = new THREE.CylinderGeometry(600, 600, 1700, 40, 10);
        geom.applyMatrix4(new THREE.Matrix4().makeRotationX(-Math.PI / 2));
        //创建对象的网格
        const mesh = new THREE.Mesh(geom, new THREE.MeshPhongMaterial({
            color: Colors.lightgreen,
            flatShading: true,
        }));
        //接收阴影
        mesh.receiveShadow = true;
        mesh.position.y = this.offSet;
        this.land = mesh;
        this.scene.add(mesh);
    }
    private createForest() {
        const mesh = new THREE.Object3D();
        const h = 605;
        //树木数量
        const nTrees = 300;
        //花朵数量
        const nFlowers = 350;
        // 间隔一致
        let stepAngle = Math.PI * 2 / nTrees;
        // Create the Trees
        for (let i = 0; i < nTrees; i++) {
            const tree = this.createTree();
            //使用三角函数设置旋转和位置
            const a = stepAngle * i;
            const s = .3 + Math.random() * .75;
            // 这是轴中心和树本身之间的距离
            tree.position.y = Math.sin(a) * h;
            tree.position.x = Math.cos(a) * h;
            // 根据其位置旋转树
            tree.rotation.z = a + (Math.PI / 2) * 3;
            //tree.rotation.z = Math.atan2(tree.position.y,tree.position.x)-Math.PI/2;
            tree.position.z = 0 - Math.random() * 600;
            tree.scale.set(s, s, s);
            mesh.add(tree);
        }
        stepAngle = Math.PI * 2 / nFlowers;
        for (let i = 0; i < nFlowers; i++) {
            const a = stepAngle * i;
            const s = .1 + Math.random() * .3;
            const flower = this.createFlower();
            flower.position.y = Math.sin(a) * h;
            flower.position.x = Math.cos(a) * h;
            flower.rotation.z = a + (Math.PI / 2) * 3;
            flower.position.z = 0 - Math.random() * 600;
            flower.scale.set(s, s, s);
            mesh.add(flower);
        }
        mesh.position.y = this.offSet;
        this.forest = mesh;
        this.scene.add(mesh);
    }
    private createSky() {
        const nClouds = 25;
        this.sky = new THREE.Object3D();
        // 间隔一致
        const stepAngle = Math.PI * 2 / nClouds;
        // 创建云
        for (let i = 0; i < nClouds; i++) {
            const cloud = this.createCloud();
            //使用三角函数设置旋转和位置
            const a = stepAngle * i;
            // 这是轴中心和云本身之间的距离
            const h = 800 + Math.random() * 200;
            cloud.position.y = Math.sin(a) * h;
            cloud.position.x = Math.cos(a) * h;
            // 根据其位置旋转云
            cloud.rotation.z = a + Math.PI / 2;
            // z 轴上云的随机深度
            cloud.position.z = -400 - Math.random() * 400;
            // 每个云的随机比例
            const s = 1 + Math.random() * 2;
            cloud.scale.set(s, s, s);
            this.sky.add(cloud);
        }
        this.sky.position.y = this.offSet;
        this.scene.add(this.sky);
    }
    private normalize(v, vmin, vmax, tmin, tmax) {
        const nv = Math.max(Math.min(v, vmax), vmin);
        const dv = vmax - vmin;
        const pc = (nv - vmin) / dv;
        const dt = tmax - tmin;
        const tv = tmin + (pc * dt);
        return tv;
    }
    private updatePlane() {
        const targetY = this.normalize(this.mousePos.y, -.75, .75, 50, 190);
        const targetX = this.normalize(this.mousePos.x, -.75, .75, -100, -20);
        //通过添加剩余距离的一小部分，在每一帧移动平面
        this.airplane.mesh.position.y += (targetY - this.airplane.mesh.position.y) * 0.1;
        this.airplane.mesh.position.x += (targetX - this.airplane.mesh.position.x) * 0.1;
        // 与剩余距离成比例地旋转平面
        this.airplane.mesh.rotation.z = (targetY - this.airplane.mesh.position.y) * 0.0128;
        this.airplane.mesh.rotation.x = (this.airplane.mesh.position.y - targetY) * 0.0064;
        this.airplane.mesh.rotation.y = (this.airplane.mesh.position.x - targetX) * 0.0064;

        this.airplane.propeller.rotation.x += 0.3;
    }
    private loop() {
        this.land.rotation.z += .005;
        this.orbit.rotation.z += .001;
        this.sky.rotation.z += .003;
        this.forest.rotation.z += .005;
        this.updatePlane();
        this.renderer.render(this.scene, this.camera);
        requestAnimationFrame(this.loop.bind(this));
    }
    private handleMouseMove(event) {
        const tx = -1 + (event.clientX / this.WIDTH) * 2;
        const ty = 1 - (event.clientY / this.HEIGHT) * 2;
        this.mousePos = { x: tx, y: ty };
    }
}
if (WebGL.isWebGLAvailable) {
    new Jungle(document.querySelector('#app')).init();
    console.log('支持WebGL');
}
