const shader1 = (MAX_THREAD_NUM: number) =>
    `struct structFixedData {
    data: array<f32, ${MAX_THREAD_NUM}>
};
struct ssbo {
    data: array<f32>
};
@group(0) @binding(0) var<storage, write> input: ssbo;
var<workgroup> sharedData: structFixedData;
@stage(compute) @workgroup_size(${MAX_THREAD_NUM},1,1) // workgroup_size 指定三个维度上要申请多少个 GPU 核心进行运算，这代表了核函数的运算能力大小。
fn main(
    @builtin(local_invocation_id) local_id: vec3<u32>,
    @builtin(global_invocation_id) global_id: vec3<u32>,
    @builtin(workgroup_id) group_id: vec3<u32>,
) {
    let localIdX: u32 = local_id.x;
    let globalIdX: u32 = global_id.x;
    sharedData.data[ localIdX ] = input.data[ globalIdX ];
    workgroupBarrier(); // 影响存储地址空间中的内存和原子操作
    storageBarrier(); // 影响工作组地址空间中的内存和原子操作。
    let offset: u32 = group_id.x * ${MAX_THREAD_NUM}u;
    var tmp: f32;
    for ( var k: u32 = 2u; k <= ${MAX_THREAD_NUM}u; k = k << 1u ) {
        for ( var j: u32 = k >> 1u; j > 0u; j = j >> 1u ) {
            let ixj: u32 = ( globalIdX ^ j ) - offset;
            if ( ixj > localIdX ) {
                if ( ( globalIdX & k ) == 0u ) {
                    if ( sharedData.data[ localIdX ] > sharedData.data[ ixj ] ) {
                        tmp = sharedData.data[ localIdX ];
                        sharedData.data[ localIdX ] = sharedData.data[ ixj ];
                        sharedData.data[ ixj ] = tmp;
                    }
                } else {
                    if ( sharedData.data[ localIdX ] < sharedData.data[ ixj ] ) {
                        tmp = sharedData.data[ localIdX ];
                        sharedData.data[ localIdX ] = sharedData.data[ ixj ];
                        sharedData.data[ ixj ] = tmp;
                    }
                }
            }
            workgroupBarrier();
            storageBarrier();
        }
    }
    input.data[ globalIdX ] = sharedData.data[ localIdX ];
}`;
const shader2 = (MAX_THREAD_NUM: number) =>
    `struct ssbo {
    data: array<f32>
};
struct struct_Uniform {
    data: vec4<u32>
};
@group(0) @binding(0) var<uniform> tonic: struct_Uniform;
@group(0) @binding(1) var<storage, write> input: ssbo;
@stage(compute) @workgroup_size(${MAX_THREAD_NUM},1,1)
fn main(@builtin(global_invocation_id) global_id: vec3<u32>) {
    let globalIdX: u32 = global_id.x;
    var tmp: f32;
    let ixj: u32 = globalIdX ^ tonic.data.y;
    if ( ixj > globalIdX ) {
        if ( ( globalIdX & tonic.data.x ) == 0u ) {
            if ( input.data[ globalIdX ] > input.data[ ixj ] ) {
                tmp = input.data[ globalIdX ];
                input.data[ globalIdX ] = input.data[ ixj ];
                input.data[ ixj ] = tmp;
            }
        } else {
            if ( input.data[ globalIdX ] < input.data[ ixj ] ) {
                tmp = input.data[ globalIdX ];
                input.data[ globalIdX ] = input.data[ ixj ];
                input.data[ ixj ] = tmp;
            }
        }
    }
}`;
class WebGPUSort {
    private adapter: GPUAdapter;
    private device: GPUDevice;
    private maxThreadNum = 256;
    constructor() {
        if (!navigator.gpu) {
            throw new Error('WebGPU not supported!');
        }
    }
    public async Init() {
        this.adapter = await navigator.gpu.requestAdapter({
            powerPreference: 'high-performance'
        });
        if (!this.adapter) {
            throw new Error('Adapter init failed!');
        }
        this.device = await this.adapter.requestDevice();
        this.maxThreadNum = this.device.limits.maxComputeWorkgroupSizeX;
    }
    public Validate(array: Float32Array) {
        const length = array.length;
        for (let i = 0; i < length; i++) {
            if (i !== length - 1 && array[i] > array[i + 1]) {
                console.error('validation error:', i, array[i], array[i + 1]);
                return false;
            }
        }
        return true;
    }
    public async Run(array: Float32Array): Promise<Float32Array> {
        if (!this.device) {
            throw new Error('Device not found!');
        }
        const length = array.length;
        const byteLength = array.byteLength;
        const threadgroupsPerGrid = Math.max(1, length / this.maxThreadNum);
        const offset = Math.log2(length) - (Math.log2(this.maxThreadNum * 2 + 1));
        const inputBuffer = this.device!.createBuffer({
            label: 'input',
            mappedAtCreation: true,
            size: byteLength,
            usage: GPUBufferUsage.STORAGE | GPUBufferUsage.COPY_SRC | GPUBufferUsage.COPY_DST

        });
        const inputRange = inputBuffer.getMappedRange();
        new Float32Array(inputRange).set(array);
        inputBuffer.unmap();// 取消映射
        const shaderModule1 = this.device.createShaderModule({
            label: 'shader1',
            code: shader1(this.maxThreadNum)

        });
        const bindGroupLayout1 = this.device.createBindGroupLayout({
            entries: [
                {
                    binding: 0,
                    visibility: GPUShaderStage.COMPUTE,
                    buffer: {
                        type: 'storage'
                    }
                }
            ]
        });
        const pipelineLayout1 = this.device.createPipelineLayout(
            {
                bindGroupLayouts: [bindGroupLayout1]
            }
        );
        const pipeline1 = await this.device.createComputePipelineAsync(
            {
                label: 'pipeline1',
                compute: {
                    module: shaderModule1,
                    entryPoint: 'main'
                },
                layout: pipelineLayout1
            }
        );
        const bindGroup1 = this.device.createBindGroup(
            {
                layout: bindGroupLayout1,
                entries: [
                    {
                        binding: 0,
                        resource: {
                            buffer: inputBuffer
                        }
                    }

                ]
            }
        );
        const commandEncoder = this.device.createCommandEncoder();
        const passEncoder = commandEncoder.beginComputePass();
        passEncoder.setPipeline(pipeline1);
        passEncoder.setBindGroup(0, bindGroup1);
        passEncoder.dispatch(threadgroupsPerGrid, 1, 1);
        passEncoder['end']();
        this.device.queue.submit([commandEncoder.finish()]);
        const uniform = new Uint32Array([0, 0, 0, 0]);
        const uniformBuffer = this.device.createBuffer({
            size: 16,
            usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST

        });
        const shaderModule2 = this.device.createShaderModule({
            label: 'shader2',
            code: shader2(this.maxThreadNum)
        });
        const bindGroupLayout2 = this.device.createBindGroupLayout({
            entries: [
                {
                    binding: 0,
                    visibility: GPUShaderStage.COMPUTE,
                    buffer: {
                        type: 'uniform'
                    }
                },
                {
                    binding: 1,
                    visibility: GPUShaderStage.COMPUTE,
                    buffer: {
                        type: 'storage'
                    }
                }
            ]
        });
        const pipelineLayout2 = this.device.createPipelineLayout({
            bindGroupLayouts: [bindGroupLayout2]
        });
        const pipeline2 = await this.device.createComputePipelineAsync({
            label: 'pipeline2',
            compute: {
                module: shaderModule2,
                entryPoint: 'main'
            },
            layout: pipelineLayout2
        });
        const bindGroup2 = this.device.createBindGroup({
            layout: bindGroupLayout2,
            entries: [
                {
                    binding: 0,
                    resource: {
                        buffer: uniformBuffer
                    }
                },

                {
                    binding: 1,
                    resource: {
                        buffer: inputBuffer
                    }
                }
            ]
        });
        if (threadgroupsPerGrid > 1) {
            for (let k = threadgroupsPerGrid >> offset; k <= length; k = k << 1) {
                for (let j = k >> 1; j > 0; j = j >> 1) {
                    // 创建指令编码
                    const commandEncoder2 = this.device.createCommandEncoder();
                    // 使用指令编码器的 beginComputePass 即可创建一个计算通道编码器
                    /**
                        通过指令编码器的 beginRenderPass 和 beginComputePass 可以分别启动/创建一个渲染通道 或 计算通道，
                        这两个方法的返回值自然就是渲染通道编码器（GPURenderPassEncoder）和计算通道编码器（GPUComputePassEncoder）。
                    **/
                    const passEncoder2 = commandEncoder2.beginComputePass();
                    // 调用计算通道编码器的 setPipeline 方法来指定计算管线
                    passEncoder2.setPipeline(pipeline2);
                    passEncoder2.setBindGroup(0, bindGroup2);
                    uniform[0] = k;
                    uniform[1] = j;
                    this.device.queue.writeBuffer(uniformBuffer, 0, uniform);
                    passEncoder2.dispatch(threadgroupsPerGrid, 1, 1);
                    passEncoder2['end']();
                    // 调用 指令编码器 的 finish 方法，即可获取指令缓存对象
                    this.device.queue.submit([commandEncoder2.finish()]);
                }
            }
        }
        const lastCommandEncoder = this.device.createCommandEncoder();
        const resultBufferToRead = this.device.createBuffer({
            size: byteLength,
            usage: GPUBufferUsage.COPY_DST | GPUBufferUsage.MAP_READ
        });
        // 即 copyBufferToBuffer 方法，用于 GPUBuffer 之间的拷贝
        lastCommandEncoder.copyBufferToBuffer(inputBuffer, 0, resultBufferToRead, 0, byteLength);
        this.device.queue.submit([lastCommandEncoder.finish()]);
        console.time('GPU sort - 获取GPU缓冲区数据');
        await resultBufferToRead.mapAsync(GPUMapMode.READ); // 即异步映射方法
        console.timeEnd('GPU sort - 获取GPU缓冲区数据');
        return new Float32Array(resultBufferToRead.getMappedRange()); // 获取映射后的范围，以 ArrayBuffer 表示
    }
    public Dispose() {
        this.device.destroy();
    }
}
const cssText =
    `width: 200px;
    height: 30px;
    font-size: 16px;
    background: #9e9898;
    line-height: 30px;
    margin-bottom: 20px;
    text-align: left;
    padding-left: 10px;
    cursor: pointer;
`;
const main = async () => {
    const exponent = 23;
    const array = new Float32Array(Math.pow(2, exponent));
    for (let i = 0; i < array.length; ++i) {
        array[i] = Math.random();
    }
    const span = document.createElement('span');
    span.innerText = `排序数组长度：${array.length}`;
    const gpubut = document.createElement('div');
    gpubut.innerText = 'GPU排序';
    gpubut.style.cssText = cssText;
    gpubut.onclick = async () => {
        const sort = new WebGPUSort();
        await sort.Init();
        console.time('GPU 排序');
        const now = Date.now();
        const gpuSortResult = await sort.Run(array);
        // console.log(gpuSortResult);
        console.timeEnd('GPU 排序');
        gpubut.innerText += `：耗时${Date.now() - now}ms`;
        if (sort.Validate(gpuSortResult)) {
            console.log('GPU 排序验证通过!');
        }
    };
    const cpubut = document.createElement('div');
    cpubut.innerText = 'CPU排序';
    cpubut.style.cssText = cssText;
    cpubut.onclick = () => {
        console.time('CPU 排序');
        const now = Date.now();
        array.slice().sort((a, b) => a - b);
        // const cpuSortResult = array.slice().sort((a, b) => a - b);
        console.timeEnd('CPU 排序');
        cpubut.innerText += `：耗时${Date.now() - now}ms`;
        // console.log(cpuSortResult);
    };
    document.body.appendChild(span);
    document.body.appendChild(gpubut);
    document.body.appendChild(cpubut);
};

window.addEventListener('DOMContentLoaded', main);
