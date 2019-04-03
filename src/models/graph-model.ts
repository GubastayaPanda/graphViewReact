export interface Node {
    label: string;
    pos: Array<number>;
    color: string;
}
export interface Link {
    from: number;
    to: number;
}
export class GraphModel {
    protected links: Array<Link> = [];
    protected nodes: Array<Node> = [];

    getLinks(): Array<Link> {
        return this.links;
    }

    getNodes(): Array<Node> {
        return this.nodes;
    }

    setNodesAndLinks(nodes: Array<Node>, links: Array<Link>) {
        this.links = links;
        this.nodes = nodes;
    }
}
