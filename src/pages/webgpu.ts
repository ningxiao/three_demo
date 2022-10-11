
import vxCode from '../shaders/wgsl/triangle.vertex.wgsl';
import fxCode from '../shaders/wgsl/red.fragment.wgsl';
import { PerspectiveCamera, Matrix4 } from 'three';
/**
 * 中文版本API翻译
 * https://www.orillusion.com/zh/webgpu.html
 * https://www.orillusion.com/zh/wgsl.html
 * https://alain.xyz/blog/raw-webgpu
 */
type TypedArray =
    | Int8Array
    | Uint8Array
    | Uint8ClampedArray
    | Int16Array
    | Uint16Array
    | Int32Array
    | Uint32Array
    | Float32Array
    | Float64Array;
class App {
    private canvas: HTMLCanvasElement;
    private adapter: GPUAdapter;
    private device: GPUDevice;
    private context: GPUCanvasContext;
    private presentationFormat: GPUTextureFormat = 'bgra8unorm';
    private commandEncoder: GPUCommandEncoder;
    private renderPassEncoder: GPURenderPassEncoder;
    private uniformGroupLayout: GPUBindGroupLayout;
    private renderPipeline: GPURenderPipeline;
    private devicePixelWidth: number;
    private devicePixelHeight: number;
    private presentationSize: GPUExtent3D;
    /**
     *
     * @param typedArray
     * @param usage
     * MAP_READ	0x0001	映射和读取
     * MAP_WRITE	0x0002	映射和写入
     * COPY_SRC	0x0004	可以作为拷贝源
     * COPY_DST	0x0008	可以作为拷贝目标
     * INDEX	0x0010	索引
     * VERTEX	0x0020	顶点
     * UNIFORM	0x0040	Uniform(通用变量)
     * STORAGE	0x0080	仅存储
     * INDIRECT	0x0100	间接使用
     * QUERY_RESOLVE	0x0200	用于查询
     * @returns
     */
    private CreateGPUBuffer(typedArray: TypedArray, usage: GPUBufferUsageFlags) {
        /* 装配几何，传递内存中的数据，最终成为 vertexAttribute 和 uniform 等资源 */
        const gpuBuffer = this.device.createBuffer(
            {
                size: typedArray.byteLength,
                usage: usage | GPUBufferUsage.COPY_DST,
                mappedAtCreation: true
            }
        );
        const constructor = typedArray.constructor as new (buffer: ArrayBuffer) => TypedArray;
        // 获取映射后的范围，以 ArrayBuffer 表示
        new constructor(gpuBuffer.getMappedRange()).set(typedArray, 0);
        gpuBuffer.unmap(); // 解除映射  请注意一旦被映射，CPU 是可以操作它了，但也意味着 GPU 无法再操作它了，直至该 GPUBuffer 实例调用 unmap() 解除映射。
        return gpuBuffer;
    }
    public CreateCanvas(rootElement: HTMLElement) {
        const width = rootElement.clientWidth;
        const height = rootElement.clientHeight;
        this.devicePixelWidth = width * window.devicePixelRatio;
        this.devicePixelHeight = height * window.devicePixelRatio;
        this.canvas = document.createElement('canvas');
        this.canvas.width = this.devicePixelWidth;
        this.canvas.height = this.devicePixelHeight;
        this.presentationSize = {
            depthOrArrayLayers: 1,
            width: this.devicePixelWidth,
            height: this.devicePixelHeight,
        };
        this.canvas.style.width = '100%';
        this.canvas.style.height = '100%';
        rootElement.appendChild(this.canvas);
    }
    public async InitWebGPU() {
        const requiredFeatures = [];
        const entry: GPU = navigator.gpu;
        if (!entry) {
            throw new Error('WebGPU is not supported on this browser.');
        }
        // low-power一般是自带的集成显卡，它性能较差但是更加省电，而high-performance表示采用更高性能的独立显卡。
        // GPUAdapter 显卡适配器：用于抹平和获取不同类型的 GPUDevice。 'low-power'集成显卡  'high-performance'独立显卡
        this.adapter = await entry.requestAdapter({
            powerPreference: 'high-performance'
        });
        if (this.adapter) {
            // 判断是否支持某些特征 例如  "texture-compression-astc"
            if (this.adapter.features.has('texture-compression-astc')) {
                requiredFeatures.push('texture-compression-astc');
            }
            // GPUDevice 显卡设备：用于抹平不同底层图形框架下的显卡设备，提供发送执行 GPU 渲染或计算命令的能力。
            this.device = await this.adapter.requestDevice({ requiredFeatures });
            this.context = this.canvas.getContext('webgpu') || this.canvas.getContext('gpupresent');
            // 然后需要声明图像色彩格式，比如brga8unorm，即用8位无符号整数和rgba来表示颜色，从adapter中也能直接获取
            this.presentationFormat = this.context.getPreferredFormat(this.adapter);
            // configure的作用主要是关联context和device实例，内部会做缓冲区实现（因为要跟显示器做交互嘛），size是绘制图像的大小，usage是图像用途，一般是固定搭配，表示需要向外输出图像。
            this.context.configure({
                device: this.device,
                size: this.presentationSize,
                format: this.presentationFormat,
                usage: GPUTextureUsage.RENDER_ATTACHMENT
            });
        }
    }
    /**
     * 创建一个渲染通道 RenderPass
     * colorAttachments
     * 表示在哪里储存当前通道渲染的图像数据，我们指定使用context创建一个二进制数组来表示。
     * loadValue可以理解为背景颜色，storeOp表示储存时的操作，可选为'store'储存 或者 'clear' 清除数据，默认就用store。
     * 可选字段depthStencilAttachment表示附加在当前渲染通道用于储存渲染通道的深度信息和模板信息的附件，因为我们只绘制二维图形，所以不需要处理深度、遮挡、混合这些事情。
     * @param clearColor
     */
    public InitRenderPass(clearColor: | GPULoadOp | GPUColor) {
        const renderPassDescriptor: GPURenderPassDescriptor = {
            colorAttachments: [
                {
                    view: this.context.getCurrentTexture().createView(),
                    loadValue: clearColor,
                    storeOp: 'store'
                }
            ]
        };
        this.commandEncoder = this.device.createCommandEncoder(); // 创建指令缓冲编码器对象，它的作用是把你需要让 GPU 执行的指令写入到 GPU 的指令缓冲区
        this.renderPassEncoder = this.commandEncoder.beginRenderPass(renderPassDescriptor); // 让指令编码器开启渲染管道
        //也可以启动一个计算通道
        // const computePassEncoder = commandEncoder.beginComputePass({ /* ... */ })
        this.renderPassEncoder.setViewport(0, 0, this.devicePixelWidth, this.devicePixelHeight, 0, 1);
    }
    public async InitPipeline(vxCode: string, fxCode: string) {
        /* 创建绑定组的布局对象 */
        const uniformGroupLayout = this.device.createBindGroupLayout({
            entries: [
                {
                    binding: 0,
                    visibility: GPUShaderStage.VERTEX,
                    buffer: {
                        type: 'uniform',
                    }
                }
            ]
        });
        /* 创建管线布局，传递绑定组布局对象 */
        const layout: GPUPipelineLayout = this.device.createPipelineLayout({
            bindGroupLayouts: [uniformGroupLayout]
        });
        this.uniformGroupLayout = uniformGroupLayout;
        /*
            创建管线
            指定管线各个阶段所需的素材
            其中有三个阶段可以传递着色器以实现可编程，即顶点、片段、计算
            每个阶段还可以指定其所需要的数据、信息，例如 buffer 等

            除此之外，管线还需要一个管线的布局对象，其内置的绑定组布局对象可以
            让着色器知晓之后在通道中使用的绑定组资源是啥样子的
        */
        /* 创建顶点着色器代码 shaderModule.compilationInfo() 并 await 其 resolve 值查看编译信息对象。 */
        const vertex_shader_module = this.device.createShaderModule({ code: vxCode });
        vertex_shader_module.compilationInfo().then(info => {
            info.messages.forEach(message => {
                console.log(message);
            });
        });
        /* 创建片元着色器代码 shaderModule.compilationInfo() 并 await 其 resolve 值查看编译信息对象。 */
        const fragment_shader_module = this.device.createShaderModule({ code: fxCode });
        fragment_shader_module.compilationInfo().then(info => {
            info.messages.forEach(message => {
                console.log(message);
            });
        });
        this.renderPipeline = await this.device.createRenderPipelineAsync({
            layout: layout,
            vertex: {
                entryPoint: 'main', //入口函数
                buffers: [
                    {
                        arrayStride: 4 * 3,// 一个顶点数据占 20 bytes
                        attributes: [ // position
                            {
                                shaderLocation: 0,
                                offset: 0,
                                format: 'float32x3' // 其中顶点的坐标属性占 12 字节，三个 float32 数字
                            }
                        ]
                    }
                ],
                module: vertex_shader_module,
            },
            fragment: {
                entryPoint: 'main',
                module: fragment_shader_module,
                targets: [
                    {
                        format: this.presentationFormat,  // 即上文的最终渲染色彩格式
                    }
                ]
            },
            primitive: {  // 绘制模式
                topology: 'triangle-list', // 按照三角形绘制
            }
        });
        // 将pipeline和passencoder产生关联
        this.renderPassEncoder.setPipeline(this.renderPipeline);
    }
    public InitGPUBuffer(vxArray: Float32Array, idxArray: Uint32Array, mxArray: Float32Array) {
        this.renderPassEncoder.setVertexBuffer(0, this.CreateGPUBuffer(vxArray, GPUBufferUsage.VERTEX));
        this.renderPassEncoder.setIndexBuffer(this.CreateGPUBuffer(idxArray, GPUBufferUsage.INDEX), "uint32");
        const uniformBuffer: GPUBuffer = this.CreateGPUBuffer(mxArray, GPUBufferUsage.UNIFORM);
        /*
        资源打组，将 buffer 和 texture 归到逻辑上的分组中，
        方便各个过程调用，过程即管线，
        此处必须传递绑定组布局对象，可以从管线中推断获取，也可以直接传递绑定组布局对象本身
        */
        const uniformBindGroup: GPUBindGroup = this.device.createBindGroup({
            layout: this.uniformGroupLayout,
            entries: [
                {
                    binding: 0,
                    resource: { buffer: uniformBuffer }
                }
            ]
        });
        this.renderPassEncoder.setBindGroup(0, uniformBindGroup);
    }
    public Present() {
        // 结束通道编码 这行代码表示当前的渲染通道已经结束了，不再向 GPU 发送指令。
        let keyName = 'endPass';
        if (Reflect.has(this.renderPassEncoder, 'end')) {
            keyName = 'end';
        }
        this.renderPassEncoder[keyName]();
        // 最后提交至 queue，也即 commandEncoder 调用 finish 完成编码，返回一个指令缓冲
        this.device.queue.submit([this.commandEncoder.finish()]);
    }
    public Draw(indexCount: number) {
        this.renderPassEncoder.drawIndexed(indexCount, 1, 0, 0, 0);
    }
}
const triangleVertex = new Float32Array([
    0.0, 1.0, 0.0,
    -1.0, -1.0, 0.0,
    1.0, -1.0, 0.0
]);
const triangleIndex = new Uint32Array([0, 1, 2]);
const triangleMVMatrix = new Matrix4().makeTranslation(-1.5, 0.0, -7.0);
const squareVertex = new Float32Array([
    1.0, 1.0, 0.0,
    -1.0, 1.0, 0.0,
    1.0, -1.0, 0.0,
    -1.0, -1.0, 0.0

]);
const squareIndex = new Uint32Array([0, 1, 2, 1, 2, 3]);
const squareMVMatrix = new Matrix4().makeTranslation(1.5, 0.0, -7.0);
const camera = new PerspectiveCamera(45, document.body.clientWidth / document.body.clientHeight, 0.1, 100);
const pMatrix = camera.projectionMatrix;
const triangleUniformBufferView = new Float32Array(pMatrix.toArray().concat(triangleMVMatrix.toArray()));
const squareUniformBufferView = new Float32Array(pMatrix.toArray().concat(squareMVMatrix.toArray()));
const backgroundColor = { r: 0, g: 0, b: 0, a: 1.0 };
window.addEventListener('DOMContentLoaded', async () => {
    const app = new App();
    app.CreateCanvas(document.body);
    await app.InitWebGPU();
    app.InitRenderPass(backgroundColor);
    await app.InitPipeline(vxCode, fxCode);
    app.InitGPUBuffer(triangleVertex, triangleIndex, triangleUniformBufferView);
    app.Draw(triangleIndex.length);
    app.InitGPUBuffer(squareVertex, squareIndex, squareUniformBufferView);
    app.Draw(squareIndex.length);
    app.Present();
});



