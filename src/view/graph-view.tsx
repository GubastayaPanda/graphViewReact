import React from "react";
import {GraphModel} from "../models/graph-model";

interface Props {
    model: GraphModel;
}
export class GraphView extends React.Component<Props, {}> {
    protected readonly rectSize = 20;
    protected model: GraphModel;

    constructor(props: Props) {
        super(props);
        this.model = props.model;
    };

    componentDidMount() {
        console.log(this.refs.graph);
        const canvas = this.refs.graph as HTMLCanvasElement;
        canvas.height = canvas.offsetHeight;
        canvas.width = canvas.offsetWidth;
        this.updateCanvas();
    };

    updateCanvas() {
        const canvas = this.refs.graph as HTMLCanvasElement;
        const ctx = canvas.getContext('2d');
        if (ctx) {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            const links =this.model.getLinks();
            const nodes = this.model.getNodes();
            links.forEach(link => {
                const from = nodes[link.from];
                const to = nodes[link.to];
                ctx.strokeStyle = 'black';
                ctx.beginPath();
                ctx.moveTo(from.pos[0] + this.rectSize / 2, from.pos[1] + this.rectSize / 2);
                ctx.lineTo(to.pos[0] + this.rectSize / 2, to.pos[1] + this.rectSize / 2);
                ctx.stroke();
            });
            nodes.forEach(node => {
                ctx.fillStyle = node.color;
                ctx.fillRect(node.pos[0], node.pos[1], this.rectSize, this.rectSize);
            })
        }
    };

    render() {
        return (
            <canvas ref="graph" style={{margin:'0', padding: "0", width: '100%', height: '100%'}}/>
        );
    }

}
