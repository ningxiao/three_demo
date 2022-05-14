const getRandom = (n, m) => {
    return Math.floor(Math.random() * (m - n + 1) + n);
};
class Perceptron {
    // 感知器常量
    private c = 0.01;
    // 感知器权重列表
    private weights: number[] = [];
    /**
     * 通过随机数初始化感知器权重列表
     * @param size
     */
    constructor(size: number) {
        for (let i = 0; i < size; i++) {
            this.weights.push(getRandom(-1, 1));
        }
    }
    activate(sum: number) {
        return sum > 0 ? 1 : -1;
    }
    feedforward(inputs: number[]) {
        let sum = 0;
        this.weights.forEach((weight, index) => {
            sum += inputs[index] * weight;
        });
        return this.activate(sum);
    }
    /**
     * 使用已知数据进行神经网络训练
     * @param inputs
     * @param desired
     */
    train(inputs: number[], desired: number) {
        const guess = this.feedforward(inputs);
        const error = desired - guess;
        for (let i = 0; i < this.weights.length; i++) {
            this.weights[i] += this.c * error * inputs[i];
        }
    }
}
class Trainer {
    answer;
    inputs: number[] = [];
    constructor(x: number, y: number, a: number) {
        this.answer = a;
        this.inputs.push(x, y, 1);
    }
}
let count = 0;
const ptron = new Perceptron(3);
const training: Trainer[] = new Array(2000);
const f = (x) => {
    return 2 * x + 1;
};
for (let i = 0; i < training.length; i++) {
    let answer = 1;
    const x = getRandom(-400 / 2, 400 / 2);
    const y = getRandom(-400 / 2, 400 / 2);
    if (y > f(x)) {
        answer = -1;
    }
    training[i] = new Trainer(x, y, answer);
}
const draw = () => {
    ptron.train(training[count].inputs, training[count].answer);
    count = (count + 1) % training.length;
    for (let i = 0; i < count; i++) {
        ptron.feedforward(training[i].inputs);
        // const guess = ptron.feedforward(training[i].inputs);
        // if (guess > 0) {
        //     console.log('-1');
        // } else {
        //     console.log('1', training[i].inputs[0], training[i].inputs[1]);
        // }
    }
    if (count < 200) {
        window.requestAnimationFrame(draw);
    }else{
        console.log('预测结果',ptron.feedforward([-12,-12]));
    }
};
draw();
