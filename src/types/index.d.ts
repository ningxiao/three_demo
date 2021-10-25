import * as THREE from "three";
declare module '*.less' {
    const classes: { [key: string]: string };
    export default classes;
}
export interface MeshObject {
    geometry?: THREE.Geometry | THREE.BufferGeometry;
    material?: THREE.Material;
    position?: THREE.Vector3;
}

export interface NavItem {
    to: Path;
    text: string;
}

export interface Path {
    name?: string;
    path?: string;
    query?: Record;
}



export interface Point3D {
    x: number;
    y: number;
    z: number;
}

export interface SunshineInfo {
    time: string;
    pos: SunshinePos;
}

export interface SunshinePos {
    sunshinePos: unknown;
    sunshinePosCalc: Point3D;
}

export interface Scroll {
    current: number;
    target: number;
    ease: number;
    last: number;
    delta: number;
    direction: "up" | "down" | "";
}

export type MeshType = "mesh" | "points";

export type MeshSizeType = "size" | "scale";

export type HTMLIVCElement =
    | HTMLImageElement
    | HTMLVideoElement
    | HTMLCanvasElement;
