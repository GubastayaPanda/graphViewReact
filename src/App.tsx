import React, {Component} from 'react';
import './App.css';
import {GraphView} from './view/graph-view';
import {GraphModel} from './models/graph-model';

class App extends Component {
  private readonly defaultModel: GraphModel;
  constructor(props: any) {
    super(props);
    this.defaultModel = new GraphModel();
    const nodes = [];
    const links = [];
    const colors = ['rgba(255, 0, 0, 0.6)', 'rgba(0, 128, 0, 0.6)', 'rgba(0, 0, 255, 0.6)', 'rgba(0, 0, 128, 0.6)',
      'rgba(128, 0, 0, 0.6)', 'rgba(128, 0, 128, 0.6)', 'rgba(0, 128, 128, 0.6)', 'rgba(128, 128, 128, 0.6)',
      'rgba(255, 0, 255, 0.6)', 'rgba(0, 255, 255, 0.6)', 'rgba(255, 165, 0, 0.6)', 'rgba(0, 0, 0, 0.6)',
      'rgba(255, 255, 0, 0.6)', 'rgba(0, 255, 0, 0.6)', 'rgba(128, 128, 0, 0.6)'];
    for(let i = 0; i < 10 + Math.floor(Math.random() * 10); i++) {
      const randX = Math.floor(Math.random() * (window.innerWidth - 20));
      const randY = Math.floor(Math.random() * (window.innerHeight - 20));
      const node = {
        label: i.toString(),
        pos: [randX, randY],
        color: colors[i % colors.length]
      };
      nodes.push(node);
      for (let j= 0; j < i; j++) {
        if (Math.random() > 0.55) {
          links.push({
            from: j,
            to: i
          })
        }
      }
    }

    this.defaultModel.setNodesAndLinks(nodes, links);
  }
  render() {
    return (
        <GraphView model={this.defaultModel}/>
    );
  }
}

export default App;