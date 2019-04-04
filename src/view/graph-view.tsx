import React from "react";
import {GraphModel} from "../models/graph-model";

interface Props {
    model: GraphModel;
}
export class GraphView extends React.Component<Props, {}> {
    protected readonly rectSize = 20;
    protected model: GraphModel;
    protected limits: {minX: number, minY: number, maxX: number, maxY: number};
    protected scale: {x: number, y: number};
    protected canvas: HTMLCanvasElement;

    constructor(props: Props) {
        super(props);
        this.model = props.model;
        this.limits = {minX: Number.MAX_VALUE, minY: Number.MAX_VALUE, maxX: Number.MIN_VALUE, maxY: Number.MIN_VALUE};
        this.scale = {x: 0, y: 0};
        this.canvas = {} as HTMLCanvasElement;
        this.updateCanvasSizes = this.updateCanvasSizes.bind(this);
    };

    componentDidMount() {
        this.canvas = this.refs.graph as HTMLCanvasElement;
        this.updateCanvasSizes();
        window.addEventListener("resize", this.updateCanvasSizes);
    };

    protected updateCanvasSizes() {
        this.canvas.height = this.canvas.offsetHeight;
        this.canvas.width = this.canvas.offsetWidth;
        this.getScale();
        this.updateCanvas();
    }


    protected getScale() {
        const nodes = this.model.getNodes();
        nodes.forEach(node => {
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
            const links =this.model.getLinks();
            const nodes = this.model.getNodes();
            links.forEach(link => {
                const from = nodes[link.from];
                const to = nodes[link.to];
                ctx.strokeStyle = 'rgba(255, 204, 0, 0.8)';
                ctx.beginPath();
                ctx.moveTo((from.pos[0] - this.limits.minX) * this.scale.x + this.rectSize / 2,
                    (from.pos[1] - this.limits.minY) * this.scale.y + this.rectSize / 2);
                ctx.lineTo((to.pos[0] - this.limits.minX) * this.scale.x + this.rectSize / 2,
                    (to.pos[1] - this.limits.minY) * this.scale.y + this.rectSize / 2);
                ctx.stroke();
            });
            nodes.forEach(node => {
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
            />
        );
    }

    componentWillUnmount(){
        window.removeEventListener("resize", this.updateCanvasSizes);
    }
}
