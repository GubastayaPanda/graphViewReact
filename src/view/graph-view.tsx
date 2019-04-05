import React from "react";
import {GraphModel, Link, Node} from "../models/graph-model";

interface Props {
    model: GraphModel;
}
export class GraphView extends React.Component<Props, {}> {
    public nodes: Array<Node>;
    public links: Array<Link>;

    protected readonly rectSize = 20;
    protected model: GraphModel;
    protected limits: {minX: number, minY: number, maxX: number, maxY: number};
    protected scale: {x: number, y: number};
    protected pressedItem: Node;
    protected pressed: boolean;
    protected focusedItem: Node;
    protected focused: boolean;
    protected canvas: HTMLCanvasElement;

    private mouseBuffer: {x: number, y: number};

    constructor(props: Props) {
        super(props);
        this.model = props.model;
        this.nodes = this.model.getNodes();
        this.links = this.model.getLinks();
        this.limits = {minX: Number.MAX_VALUE, minY: Number.MAX_VALUE, maxX: Number.MIN_VALUE, maxY: Number.MIN_VALUE};
        this.scale = {x: 0, y: 0};
        this.pressedItem = {} as Node;
        this.pressed = false;
        this.focusedItem = {} as Node;
        this.focused = false;
        this.canvas = {} as HTMLCanvasElement;
        this.mouseBuffer = {x: 0, y: 0};
    };

    protected setFocus = (e: any) => {
        const x = e.nativeEvent.offsetX;
        const y = e.nativeEvent.offsetY;
        this.nodes.forEach(node => {
            if ((node.pos[0] - this.limits.minX) * this.scale.x < x &&
                (node.pos[0] - this.limits.minX) * this.scale.x + this.rectSize > x &&
                (node.pos[1] - this.limits.minY) * this.scale.y < y &&
                (node.pos[1] - this.limits.minY) * this.scale.y + this.rectSize > y) {
                this.pressedItem = node;
                this.pressed = true;
            }
        });
        if (this.pressed) {
            this.mouseBuffer = {
                x: x - (this.pressedItem.pos[0] - this.limits.minX) * this.scale.x,
                y: y - (this.pressedItem.pos[1] - this.limits.minY) * this.scale.y
            }
        }
    };

    protected removeFocus = () => {
        this.pressed = false;
    };

    protected move = (e: any) => {
        const x = e.nativeEvent.offsetX;
        const y = e.nativeEvent.offsetY;
        if (this.pressed &&
            x > this.mouseBuffer.x &&
            y > this.mouseBuffer.y &&
            x < this.canvas.width - this.rectSize + this.mouseBuffer.x &&
            y < this.canvas.height - this.rectSize + this.mouseBuffer.y) {
            this.pressedItem.pos[0] = (x - this.mouseBuffer.x) / this.scale.x + this.limits.minX;
            this.pressedItem.pos[1] = (y - this.mouseBuffer.y) / this.scale.y + this.limits.minY;
            this.updateCanvas();
        }
        if (!this.focused) {
            this.nodes.forEach(node => {
                if ((node.pos[0] - this.limits.minX) * this.scale.x < x &&
                    (node.pos[0] - this.limits.minX) * this.scale.x + this.rectSize > x &&
                    (node.pos[1] - this.limits.minY) * this.scale.y < y &&
                    (node.pos[1] - this.limits.minY) * this.scale.y + this.rectSize > y) {
                    this.focusedItem = node;
                    this.focused = true;
                    this.canvas.setAttribute('title', 'label: ' + this.focusedItem.label);
                }
            })
        } else {
            if ((this.focusedItem.pos[0] - this.limits.minX) * this.scale.x > x ||
                (this.focusedItem.pos[0] - this.limits.minX) * this.scale.x + this.rectSize < x ||
                (this.focusedItem.pos[1] - this.limits.minY) * this.scale.y > y ||
                (this.focusedItem.pos[1] - this.limits.minY) * this.scale.y + this.rectSize < y) {
                this.canvas.removeAttribute('title');
                this.focused = false;
            }
        }
    };

    componentDidMount() {
        this.canvas = this.refs.graph as HTMLCanvasElement;
        this.updateCanvasSizes();
        window.addEventListener("resize", this.updateCanvasSizes);
    };

    protected updateCanvasSizes = () => {
        this.canvas.height = this.canvas.offsetHeight;
        this.canvas.width = this.canvas.offsetWidth;
        this.getScale();
        this.updateCanvas();
    };

    protected getScale() {
        this.nodes.forEach(node => {
            if (node.pos[0] > this.limits.maxX) this.limits.maxX = node.pos[0];
            if (node.pos[0] < this.limits.minX) this.limits.minX = node.pos[0];
            if (node.pos[1] > this.limits.maxY) this.limits.maxY = node.pos[1];
            if (node.pos[1] < this.limits.minY) this.limits.minY = node.pos[1];
        });
        this.scale = {
            x: (this.canvas.width - this.rectSize) / (this.limits.maxX - this.limits.minX),
            y: (this.canvas.height - this.rectSize) / (this.limits.maxY - this.limits.minY)
        };
    }

    protected updateCanvas() {
        const ctx = this.canvas.getContext('2d');
        if (ctx) {
            ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
            this.links.forEach(link => {
                const from = this.nodes[link.from];
                const to = this.nodes[link.to];
                ctx.strokeStyle = 'rgba(255, 204, 0, 0.8)';
                ctx.beginPath();
                ctx.moveTo((from.pos[0] - this.limits.minX) * this.scale.x + this.rectSize / 2,
                    (from.pos[1] - this.limits.minY) * this.scale.y + this.rectSize / 2);
                ctx.lineTo((to.pos[0] - this.limits.minX) * this.scale.x + this.rectSize / 2,
                    (to.pos[1] - this.limits.minY) * this.scale.y + this.rectSize / 2);
                ctx.stroke();
            });
            this.nodes.forEach(node => {
                ctx.fillStyle = node.color;
                ctx.fillRect((node.pos[0] - this.limits.minX) * this.scale.x,
                    (node.pos[1] - this.limits.minY) * this.scale.y,
                    this.rectSize, this.rectSize);
            })
        }
    };

    render() {
        return (
            <canvas ref="graph" style={{margin:'0', padding: "0", width: '100%', height: '100%'}}
                    onMouseDown={this.setFocus}
                    onMouseUp={this.removeFocus}
                    onMouseMove={this.move}
                    onMouseLeave={this.removeFocus}
            />
        );
    }

    componentWillUnmount(){
        window.removeEventListener("resize", this.updateCanvasSizes);
    }
}
