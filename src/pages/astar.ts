import '@/style/astar.less';
const Maps = [
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1, 1, 1, 0, 0, 0, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 1, 0, 1, 0, 0, 0, 0, 0, 1, 0, 1, 1, 1, 1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 1, 1, 1, 0, 1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 1, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1, 0, 0, 1, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1, 0, 0, 1, 0, 1, 0, 0, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 1, 1, 1, 0, 1, 0, 0, 0, 0, 0, 1, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 1, 0, 1, 0, 0, 0, 0, 0, 1, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 1, 0, 1, 0, 0, 0, 0, 0, 1, 0, 0, 1, 0, 0, 0, 0, 1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 1, 0, 1, 0, 0, 1, 0, 1, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 1, 0, 1, 0, 0, 1, 0, 1, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 1, 0, 1, 0, 0, 1, 0, 1, 0, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 1, 0, 1, 0, 0, 1, 0, 1, 0, 1, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 1, 0, 1, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 1, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 1, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 1, 0, 1, 0, 0, 0, 1, 1, 0, 0, 1, 1, 1, 1, 1, 1, 1, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 1, 0, 0, 1, 0, 1, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 1, 0, 1, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
];
interface GameMapEvent {
    x: number;
    y: number;
    row: number;
    cell: number;
    type: string;
}
class Point {
    public P: Point;
    public X: number;
    public Y: number;
    public G: number;
    public H: number;
    public F: number;
    public I: number;
    constructor(p: Point, x: number, y: number) {
        this.P = p;  //父节点
        this.X = x;  //x位置
        this.Y = y;  //y位置
        this.G = 0;  //g值
        this.H = 0;  //h值
        this.F = 0;  //f值
        this.I = 0;  //节点唯一值
    }
}
class AStar {
    private map;
    private end;
    private start;
    private game: GameMap;
    private open: Array<Point>;
    private close: Array<Point>;
    private sn = 0;
    private tmin = -1;
    private rmax = -1;
    private bmax = -1;
    private lmin = -1;
    private limit = 0;
    private maps: { [key: number]: Point };
    constructor(start, end) {
        this.end = end;
        this.start = start;
        this.initialize();
    }
    private getAllPath(node: Point) {
        const path = [];
        do {
            path[path.length] = [node.X, node.Y];
        } while ((node = node.P) !== null);
        path.reverse();
        this.initialize();
        return path;
    }
    //创造ID
    private makeID(x: number, y: number, limit: number) {
        return x + y * limit;
    }
    private euclidean(a: Point, b: Point) {
        return Math.round(10 * Math.sqrt(Math.pow(a.X - b.X, 2) + Math.pow(a.Y - b.Y, 2)));
    }
    private getMinNode() {
        let t;
        let min = 0;
        let max = this.open[0].F;
        for (let i = 1; i < this.open.length; i++) {
            t = this.open[i];
            if (t.F < max) {
                min = i;
                max = t.F;
            }
        }
        t = this.open[min], this.open[min] = this.open[this.open.length - 1], this.open.pop();
        return t;
    }
    private getNodes(node) {
        let i = 0;
        const nodes = [];
        const x = node.X;
        const y = node.Y;
        const t = y - 1;
        const r = x + 1;
        const b = y + 1;
        const l = x - 1;
        const map = this.map;
        const tmin = this.tmin;
        const rmax = this.rmax;
        const bmax = this.bmax;
        const lmin = this.lmin;
        const _t = t > tmin && (map[t][x] === 0);
        const _r = r < rmax && (map[y][r] === 0);
        const _b = b < bmax && (map[b][x] === 0);
        const _l = l > lmin && (map[y][l] === 0);
        if (_t) {
            nodes[i++] = [x, t];
            if (_l && (map[t][l] === 0)) nodes[i++] = [l, t];
            if (_r && (map[t][r] === 0)) nodes[i++] = [r, t];
        }
        if (_l) nodes[i++] = [l, y];
        if (_b) {
            nodes[i++] = [x, b];
            if (_l && (map[b][l] === 0)) nodes[i++] = [l, b];
            if (_r && (map[b][r] === 0)) nodes[i++] = [r, b];
        }
        if (_r) nodes[i++] = [r, y];
        return nodes;
    }
    private initialize() {
        this.open = [];   //open表
        this.close = [];  //close表
        this.maps = {};  //已经发现点组
    }
    public loadMap(game: GameMap) {
        this.game = game;
        this.map = this.game.maps;
        this.limit = (this.bmax = this.map.length) * (this.rmax = this.map[0].length);
        this.game.addEventListener('click', (ev) => {
            const { row, cell } = ev;
            if (this.sn) {
                this.end.X = cell;
                this.end.Y = row;
                window.requestAnimationFrame(() => {
                    console.time('寻路计算耗时');
                    const searchs = this.search(this.start, this.end);
                    console.log(searchs);
                    for (let i = 1; i < searchs.length - 1; i++) {
                        this.game.fillRect(searchs[i][0], searchs[i][1], '#ff0000');
                    }
                    console.timeEnd('寻路计算耗时');
                });
            } else {
                this.start.X = cell;
                this.start.Y = row;
                this.game.resizeMap();
            }
            this.sn = Math.abs(this.sn - 1);
            this.game.fillRect(cell, row, '#000000');
        });
    }
    private search(start, end) {
        let node;
        let tempnode;
        let id = 0;
        let tempg = 0;
        let nodes = [];
        const maps = this.maps; //地图
        const open = this.open;
        const close = this.close;
        const limit = this.limit; //地图最大值
        const makeID = this.makeID; //放创造唯一值函数的引用.这样快
        const euclidean = this.euclidean; //计算代价的方法
        const GID = makeID(end.X, end.Y, limit); //终点的唯一值
        open.push(new Point(null, start.X, start.Y)); //追加启始点
        while (open.length !== 0) {
            node = this.getMinNode(); //取最优点
            if (node.I != GID) { //若不是终点
                nodes = this.getNodes(node); //取该点所有所有临点
                for (let i = 0, j = nodes.length; i < j; i++) {
                    id = makeID(nodes[i][0], nodes[i][1], limit); //获取临点ID
                    if (!(tempnode = maps[id])) { //如果没有查过
                        //创建点对象.放到open表.放到关联组
                        tempnode = open[open.length] = maps[id] = new Point(node, nodes[i][0], nodes[i][1]);
                        //计算代价值，估价值，总值
                        tempnode.I = id; //计算唯一标识
                        tempnode.G = node.G + euclidean(tempnode, node);
                        tempnode.H = euclidean(tempnode, end);
                        tempnode.F = tempnode.G + tempnode.H;
                    } else { //如果存在此点
                        tempg = node.G + euclidean(tempnode, node); //计算当前点到此临点的G值
                        if (tempg < tempnode.G) {
                            tempnode.P = node;
                            tempnode.G = tempg;
                            tempnode.F = tempg + tempnode.H;
                        }
                    }
                }
                close[close.length] = node; //放入close表
            } else {
                return this.getAllPath(node); //已经找到最优路径.返回完整路径
            }
        }
        return (this.initialize(), []); //没有找到最优路径.返回空值
    }
}
class GameMap {
    private _maps;
    private size = 0;
    private spacingw = 0;
    private spacingh = 0;
    private width = 650;
    private height = 650;
    private ctx: CanvasRenderingContext2D;
    private ratio = window.devicePixelRatio || 1;
    private canvas = document.createElement('canvas');
    private dispatchs: Map<string, Set<(ev: GameMapEvent) => void>> = new Map();
    constructor(maps: Array<Array<number>>) {
        this.maps = maps;
        this.size = this.maps.length;
        this.spacingw = this.width / this.size;
        this.spacingh = this.height / this.size;
        this.initialize();
        this.drawMap();
        this.canvas.addEventListener('click', this.dispatcherEvent.bind(this));
        this.canvas.addEventListener('mousemove', this.dispatcherEvent.bind(this));
    }
    set maps(maps: Array<Array<number>>) {
        this._maps = maps;
    }
    get maps() {
        return this._maps;
    }
    private transform(x: number, y: number) {
        return {
            row: Math.max(0, Math.ceil(y / this.spacingw) - 1),
            cell: Math.max(0, Math.ceil(x / this.spacingh) - 1)
        };
    }
    private dispatcherEvent(ev: MouseEvent) {
        const x = Math.max(0, Math.min(ev.offsetX, this.width));
        const y = Math.max(0, Math.min(ev.offsetY, this.height));
        const { row, cell } = this.transform(x, y);
        const isUpdata = this.maps[row][cell] === 0;
        this.canvas.style.cursor = isUpdata ? 'pointer' : 'auto';
        if (isUpdata && ev.type === 'click') {
            this.dispatchEvent({
                x,
                y,
                row,
                cell,
                type: 'click'
            });
        }
    }
    private initialize() {
        this.canvas = document.createElement('canvas');
        this.ctx = this.canvas.getContext("2d");
        this.canvas.width = this.width * this.ratio;
        this.canvas.height = this.height * this.ratio;
        this.canvas.style.cssText = `width:${this.width}px;height:${this.height}px;`;
        this.ctx.scale(this.ratio, this.ratio);
        document.querySelector('#app').appendChild(this.canvas);
    }
    private drawMap() {
        const width = this.spacingw - 1;
        const height = this.spacingh - 1;
        this.ctx.save();
        this.ctx.strokeStyle = '#CCC';
        this.ctx.fillStyle = '#fff000';
        for (let i = 1; i < this.size; i++) {
            this.ctx.beginPath();
            this.ctx.moveTo(0, i * this.spacingw);
            this.ctx.lineTo(this.width, i * this.spacingw);
            this.ctx.stroke();
            this.ctx.beginPath();
            this.ctx.moveTo(i * this.spacingh, 0);
            this.ctx.lineTo(i * this.spacingh, this.height);
            this.ctx.stroke();
        }
        this.ctx.strokeRect(0.5, 0.5, this.width - 1, this.height - 1);
        for (let i = 0; i < this.size; i++) {
            for (let k = 0; k < this.size; k++) {
                if (Maps[i][k] !== 0) {
                    this.ctx.fillRect(k * this.spacingw + 0.5, i * this.spacingh + 0.5, width, height);
                }
            }
        }
        this.ctx.restore();
        this.canvas.toBlob((blob) => {
            this.canvas.style.backgroundImage = `url(${URL.createObjectURL(blob)})`;
            this.resizeMap();
        });
    }
    public fillRect(cell: number, row: number, fillStyle: string) {
        const width = this.spacingw - 1;
        const height = this.spacingh - 1;
        this.ctx.save();
        this.ctx.fillStyle = fillStyle;
        this.ctx.fillRect(cell * this.spacingw + 0.5, row * this.spacingh + 0.5, width, height);
        this.ctx.restore();
    }
    public addEventListener(type: string, listener: (ev: GameMapEvent) => void) {
        if (!this.dispatchs.has(type)) {
            this.dispatchs.set(type, new Set());
        }
        this.dispatchs.get(type).add(listener);
    }
    public dispatchEvent(ev: GameMapEvent) {
        const type: string = ev.type;
        if (this.dispatchs.has(type)) {
            this.dispatchs.get(type).forEach((callback) => callback(ev));
        }
    }
    public resizeMap() {
        this.ctx.clearRect(0, 0, this.width, this.height);
    }
}
new AStar({ X: 0, Y: 0 }, { X: 0, Y: 0 }).loadMap(new GameMap(Maps));
