// 矩阵计算https://zs.symbolab.com/solver/matrix-calculator
// https://web.dev/gpu-compute/#read-result-matrix
import vxCode from '../shaders/wgsl/matrix.vertex.wgsl';
(async () => {
    if (!navigator.gpu) {
        console.log("浏览器不支持WebGPU");
        return;
    }
    const adapter = await navigator.gpu.requestAdapter();
    if (!adapter) {
        console.log("获取 GPU 适配器失败。");
        return;
    }
    const device = await adapter.requestDevice();
    const maxThreadNum = device.limits.maxComputeWorkgroupSizeX;
    console.log('最大工作组',maxThreadNum);
    const size = 4;
    // First Matrix
    const firstMatrix = new Float32Array(size * size + 2);
    // Second Matrix
    const secondMatrix = new Float32Array(size * size + 2);
    secondMatrix[0] = secondMatrix[1] = firstMatrix[0] = firstMatrix[1] = size;
    for (let i = 0; i < size * size; i++) {
        secondMatrix[i + 2] = i + 1;
        firstMatrix[i + 2] = i + 1;
    }
    const gpuBufferFirstMatrix = device.createBuffer({
        mappedAtCreation: true,
        size: firstMatrix.byteLength,
        usage: GPUBufferUsage.STORAGE
    });
    const arrayBufferFirstMatrix = gpuBufferFirstMatrix.getMappedRange();
    new Float32Array(arrayBufferFirstMatrix).set(firstMatrix);
    gpuBufferFirstMatrix.unmap();
    const gpuBufferSecondMatrix = device.createBuffer({
        mappedAtCreation: true,
        size: secondMatrix.byteLength,
        usage: GPUBufferUsage.STORAGE
    });
    const arrayBufferSecondMatrix = gpuBufferSecondMatrix.getMappedRange();
    new Float32Array(arrayBufferSecondMatrix).set(secondMatrix);
    gpuBufferSecondMatrix.unmap();
    // Result Matrix
    const resultMatrixBufferSize = Float32Array.BYTES_PER_ELEMENT * (2 + firstMatrix[0] * secondMatrix[1]);
    const resultMatrixBuffer = device.createBuffer({
        size: resultMatrixBufferSize,
        usage: GPUBufferUsage.STORAGE | GPUBufferUsage.COPY_SRC
    });
    // Compute shader code
    const shaderModule = device.createShaderModule({ code: vxCode });
    // Pipeline setup 慢2~3倍
    // const computePipeline = device.createComputePipeline({
    //     compute: {
    //         module: shaderModule,
    //         entryPoint: "main"
    //     }
    // });
    // 建议使用异步的方式，这种方式可以避免阻塞管道编译中的相关操作
    const computePipeline = await device.createComputePipelineAsync(
        {
            compute: {
                module: shaderModule,
                entryPoint: "main"
            }
        }
    );
    // Bind group /* index */
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
    const commandEncoder = device.createCommandEncoder();
    const passEncoder = commandEncoder.beginComputePass();
    passEncoder.setPipeline(computePipeline);
    passEncoder.setBindGroup(0, bindGroup);
    const x = Math.ceil(firstMatrix[0] / 8); // X dimension of the grid of workgroups to dispatch.
    const y = Math.ceil(secondMatrix[1] / 8); // Y dimension of the grid of workgroups to dispatch.
    passEncoder.dispatch(x, y);
    // 结束通道编码 这行代码表示当前的渲染通道已经结束了，不再向 GPU 发送指令。
    let keyName = 'endPass';
    if (Reflect.has(passEncoder, 'end')) {
        keyName = 'end';
    }
    passEncoder[keyName]();
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
    // Submit GPU commands.
    const gpuCommands = commandEncoder.finish();
    console.time('GPU矩阵计算');
    device.queue.submit([gpuCommands]);
    // Read buffer.
    await gpuReadBuffer.mapAsync(GPUMapMode.READ);
    const arrayBuffer = gpuReadBuffer.getMappedRange();
    console.timeEnd('GPU矩阵计算');
    console.log(new Float32Array(arrayBuffer));
    // const matrixMultiplication = (A, B) => {
    //     const n = A.length;
    //     const C = [];
    //     for (let i = 0; i < n; i++) {
    //         C[i] = [];
    //         for (let j = 0; j < n; j++) {
    //             C[i][j] = 0;
    //             for (let k = 0; k < n; k++) {
    //                 C[i][j] += A[i][k] * B[k][j];
    //             }
    //         }
    //     }
    //     return C;
    // };
    // const matrix = [[], []];
    // for (let i = 2; i < size * size + 2; i += size) {
    //     const s0 = [];
    //     const s1 = [];
    //     for (let k = 0; k < size; k++) {
    //         s0.push(firstMatrix[i + k]);
    //         s1.push(secondMatrix[i + k]);
    //     }
    //     matrix[0].push(s0);
    //     matrix[1].push(s1);
    // }
    // console.time('CPU矩阵计算');
    // console.log(matrixMultiplication(matrix[0], matrix[1]));
    // console.timeEnd('CPU矩阵计算');
})();
