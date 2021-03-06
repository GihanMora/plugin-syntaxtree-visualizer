import { treeMapper } from "./treeMapper";
import { TreeNode, layoutOptions } from "./resources";
import { graphMapper } from "./graphMapper";

export let nodeMembers: any[], nodeEdges: any[], nodeArray: TreeNode[];

export function retrieveGraph (responseTree: JSON){
    nodeArray = [];
    treeMapper(responseTree, {}, 0);
    return updateSyntaxTree("");
}

export function updateSyntaxTree (nodeID: string){
    nodeEdges = []; nodeMembers = [];
    graphMapper(nodeArray, nodeID);
    return setGraph();
}

function setGraph(){
    const graph = {
        id: "root",
        layoutOptions: layoutOptions,
        children: nodeMembers,
        edges: nodeEdges
    };

    return {graph, nodeArray};
}
