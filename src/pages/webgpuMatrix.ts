/**
    矩阵计算https://zs.symbolab.com/solver/matrix-calculator
    https://web.dev/gpu-compute/#read-result-matrix
    https://web.dev/gpu-compute/
    https://github.com/toji/webgpu-best-practices
 **/
import vxCode from '../shaders/wgsl/matrix.vertex.wgsl';
import imgUrl from '../assets/L4fXrCemYcZ5FwAcmRHH.jpeg';
const layout = (arrayBuffer) => {
    const img = new Image();
    img.src = imgUrl;
    img.style.width = '100%';
    document.body.appendChild(img);
    const div = document.createElement('div');
    div.style.cssText = `font-size: 24px;text-align: center;margin-top: 20px;`;
    div.innerText = `计算结果->[${new Float32Array(arrayBuffer).toString()}]`;
    document.body.appendChild(div);
};
(async () => {
    console.time('开启GPU耗时');
    const entry = navigator.gpu;
    if (!entry) {
        console.error("浏览器不支持WebGPU");
        return;
    }
    const adapter = await entry.requestAdapter();
    if (!adapter) {
        console.error("获取 GPU 适配器失败。");
        return;
    }
    const device = await adapter.requestDevice();
    const queue = device.queue;
    /**
     * 着色器的4个生命周期
     * 第一阶段：着色器模块创建(Shader module creation)
     * 当在 WebGPU 中执行 GPUDevice 实例的 createShaderModule() 方法后会开始 着色器模块创建节点。
     * 所以正常情况我们需要执行 2 次 createShaderModule() 方法，分别用于创建 顶点着色器模块 和 片元着色器模块。
     */
    const shaderModule = device.createShaderModule({ code: vxCode });
    const maxThreadNum = device.limits.maxComputeWorkgroupSizeX;
    console.log('最大工作组', maxThreadNum);
    // 第一个矩阵的行乘以第二个矩阵的列，第一个矩阵的行必须与第二个矩阵的列相等
    const firstMatrix = new Float32Array([
        4 /* rows */, 4 /* columns */,
        1, 2, 3, 4,
        5, 6, 7, 8,
        9, 10, 11, 12,
        13, 14, 15, 16,
    ]);
    const secondMatrix = new Float32Array([
        4 /* rows */, 4 /* columns */,
        1, 2, 3, 4,
        5, 6, 7, 8,
        9, 10, 11, 12,
        13, 14, 15, 16,
    ]);
    /**
     * 获取一块暂存缓冲区（Staging buffers），是介于显存和 GPU 之间的缓存，它可以映射到 CPU 端进行读写。
     * 为了读取 GPU 中的数据，要先把数据从 GPU 内的高速缓存先复制到暂存缓冲区，然后把暂存缓冲区映射到 CPU，这样才能读取回主内存
     * mappedAtCreation由于设置为 true ，它会在创建时映射一个 GPU 缓冲区对象
     */
    const gpuBufferFirstMatrix = device.createBuffer(
        {
            mappedAtCreation: true,
            size: firstMatrix.byteLength,
            usage: GPUBufferUsage.STORAGE | GPUBufferUsage.COPY_DST
        }
    );
    // 调用 GPU 缓冲区方法来检索相关的原始二进制数据缓冲区
    const arrayBufferFirstMatrix = gpuBufferFirstMatrix.getMappedRange();
    new Float32Array(arrayBufferFirstMatrix).set(firstMatrix);
    // 为了让 GPU 可以访问必须被取消映射，调用unmap()
    gpuBufferFirstMatrix.unmap();

    const gpuBufferSecondMatrix = device.createBuffer(
        {
            mappedAtCreation: true,
            size: secondMatrix.byteLength,
            usage: GPUBufferUsage.STORAGE
        }
    );
    const arrayBufferSecondMatrix = gpuBufferSecondMatrix.getMappedRange();
    new Float32Array(arrayBufferSecondMatrix).set(secondMatrix);
    gpuBufferSecondMatrix.unmap();
    // 计算结果
    const resultMatrixBufferSize = Float32Array.BYTES_PER_ELEMENT * (2 + firstMatrix[0] * secondMatrix[1]);
    const resultMatrixBuffer = device.createBuffer(
        {
            size: resultMatrixBufferSize,
            usage: GPUBufferUsage.STORAGE | GPUBufferUsage.COPY_SRC
        }
    );
    /**
     * 第二阶段：管线创建(Pipeline creation)，建议使用异步的方式，可以避免阻塞管道编译相关操作
     * createComputePipeline()或createRenderPipeline()，方法开始创建计算管线或渲染管线。
     * createComputePipeline() 对应的异步函数为 createComputePipelineAsync()
     * createRenderPipeline() 对应的异步函数为 createRenderPipelineAsync()
     */
    const computePipeline = await device.createComputePipelineAsync(
        {
            layout: "auto",
            compute: {
                module: shaderModule,
                entryPoint: "computeMatrix" //执行计算方法名（在wgsl里的定义）
            }
        }
    );
    /**
     * 绑定组布局定义着色器预期的输入/输出接口，而绑定组表示着色器的实际输入/输出数据
     * 将创建的GPU缓冲绑定到色器模块
     */
    const bindGroup = device.createBindGroup({
        layout: computePipeline.getBindGroupLayout(0),
        entries: [
            {
                binding: 0,
                resource: {
                    buffer: gpuBufferFirstMatrix
                }
            },
            {
                binding: 1,
                resource: {
                    buffer: gpuBufferSecondMatrix
                }
            },
            {
                binding: 2,
                resource: {
                    buffer: resultMatrixBuffer
                }
            }
        ]
    });
    // Commands submission
    /**
     * 第三阶段：着色器开始执行(Shader execution start)指令（Command）
     */
    const commandEncoder = device.createCommandEncoder();
    const passEncoder = commandEncoder.beginComputePass();//通道编码器，它可以配置管线并调度编码指令
    passEncoder.setPipeline(computePipeline);
    //绑定wgsl代码组
    passEncoder.setBindGroup(0, bindGroup);
    const workgroupCountX = Math.ceil(firstMatrix[0] / 8); // X dimension of the grid of workgroups to dispatch.
    const workgroupCountY = Math.ceil(secondMatrix[1] / 8); // Y dimension of the grid of workgroups to dispatch.
    passEncoder.dispatchWorkgroups(workgroupCountX, workgroupCountY);
    // 结束通道编码 这行代码表示当前的渲染通道已经结束了，不再向 GPU 发送指令。
    passEncoder.end();
    // 获取用于在未映射状态下读取的 GPU 缓冲区。
    const gpuReadBuffer = device.createBuffer({
        size: resultMatrixBufferSize,
        usage: GPUBufferUsage.COPY_DST | GPUBufferUsage.MAP_READ
    });
    // 编码用于将缓冲区复制到缓冲区的命令。
    commandEncoder.copyBufferToBuffer(
        resultMatrixBuffer /* source buffer */,
        0 /* source offset */,
        gpuReadBuffer /* destination buffer */,
        0 /* destination offset */,
        resultMatrixBufferSize /* size */
    );
    console.timeEnd('开启GPU耗时');
    console.time('GPU矩阵计算耗时');
    // Submit GPU commands.
    const gpuCommands = commandEncoder.finish();
    // 通过writeBuffer进行修改
    // queue.writeBuffer(gpuBufferFirstMatrix, 0, new Float32Array([
    //     4 /* rows */, 4 /* columns */,
    //     1, 2, 3, 4,
    //     5, 6, 7, 8,
    //     9, 10, 11, 12,
    //     13, 14, 15, 16,
    // ]));
    queue.submit([gpuCommands]);
    // Read buffer.
    await gpuReadBuffer.mapAsync(GPUMapMode.READ, 0, resultMatrixBufferSize);
    const arrayBuffer = gpuReadBuffer.getMappedRange();
    const data = arrayBuffer.slice(0, resultMatrixBufferSize);
    gpuReadBuffer.unmap();
    console.timeEnd('GPU矩阵计算耗时');
    layout(data);
})();
