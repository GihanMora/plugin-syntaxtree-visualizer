import { toInteger } from "lodash";
import { TreeNode } from "./resources";
import { nodeMembers, nodeEdges } from "./graphGenerator";

export function graphMapper(targetArray: TreeNode[], nodeID: string) {
    for (let i = 0; i < targetArray.length; i++) {
        let position = toInteger(targetArray[i].nodeID.replace(/\D/g, ''));
        let diagnostics : any[] = [];

        if (targetArray[i].nodeID === nodeID) {
            let status = targetArray[i].didCollapse;
            targetArray[i] = {
                ...targetArray[i],
                didCollapse: !status
            };
        }

        if (!targetArray[i].didCollapse && targetArray[i].nodeID.charAt(0) === "p"){
            diagnostics = checkDiagnostics(targetArray[i]);
        }

        nodeMembers.push({
            id: targetArray[i].nodeID,
            width: Math.max(diagnostics.length ? (targetArray[i].value.length*9)+20 : (targetArray[i].value.length*8), 130),
            height: 50,
            label: nodeMembers.length ? targetArray[i].value : "Syntax Tree",
            kind: targetArray[i].kind,
            leadingMinutiae: targetArray[i].leadingMinutiae,
            trailingMinutiae: targetArray[i].trailingMinutiae,
            diagnostics:  diagnostics,
            hasDiagnostics: diagnostics.length > 0 ? true : false,
            layoutOptions: { 
                'elk.position': '('+position+', 0)'
            },
            ifParent: targetArray[i].children.length ? true : false,
            isCollapsible: targetArray[i].didCollapse ? false : (targetArray[i].children.length ? true : false),
            nodeColor: targetArray[i].errorNode ? "#DB3247" : (targetArray[i].nodeID.charAt(0) === "p" ? "#16B16F" : "#6640D1")
        });

        if(nodeMembers.length > 1){
            nodeEdges.push({
                id: `e${targetArray[i].nodeID}`,
                sources: [targetArray[i].parentID],
                targets: [targetArray[i].nodeID]
            });
        }

        if (targetArray[i].didCollapse === true) {
            graphMapper(targetArray[i].children, nodeID);
        }
    }
}

function checkDiagnostics(node: TreeNode){  
    let diagnostics: any[] = [];

    if(node.diagnostics && node.diagnostics.length){
        diagnostics = node.diagnostics;
    } else if (node.kind === "imports" || "members" && node.children.length){
        for (let i=0; i<node.children.length; i++){
            if (node.children[i].diagnostics && node.children[i].diagnostics.length){
                diagnostics = diagnostics.concat(node.children[i].diagnostics);
            }
        }
    }

    return diagnostics;
}
