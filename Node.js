class Node {
    constructor(Text, children, Id) {
        this.Text = Text;
        this.children = children;
        this.Id = Id;
        this.ScoreList={};
    }

    getDistance(point1, point2) {
        return Math.sqrt(Math.pow(point2[0]-point1[0],2)+Math.pow(point2[1]-point1[1],2));
    }

    getShortestToCenter(points) {
        var shortest=points[0];
        var shortestLength=this.getDistance(points[0],[50,50]);

        for (let i = 0; i < points.length; i++) {
            const point = points[i];
            
            if (this.getDistance(point,[50,50])<shortestLength) {
                shortest=point;
                shortestLength=this.getDistance(point,[50,50]);
            }
        }

        return shortest;
    }

    getNodeByLocation(nodes, location) {
        for (let i = 0; i < nodes.length; i++) {
            const node = nodes[i];
            var position = node.getAttribute("transform");
            if (position!==null) {
                var tempX = parseInt(position.split("(")[1].split(",")[0]);
                var tempY = parseInt(position.split(",")[1].split(")")[0]);

                if (location[0] === tempX && location[1] === tempY) {
                    return node;
                }
            }
        }

        return null;
    }

    render(grid, renderChildren) {
        var newHex = document.createElementNS("http://www.w3.org/2000/svg", "use");
        newHex.setAttributeNS("http://www.w3.org/1999/xlink", "xlink:href", "#pod");
        var xToRender = 50;
        var yToRender = 50;
        var allNodes = grid.getElementsByTagName("use");
        if (allNodes.length > 0) {
            var latestNode = allNodes[allNodes.length - 1];
            var position = latestNode.getAttribute("transform");
            var tempX = parseInt(position.split("(")[1].split(",")[0]);
            var tempY = parseInt(position.split(",")[1].split(")")[0])-36;

            var freePlaces = [];

            if (this.getNodeByLocation(allNodes, [tempX, tempY]) === null) {
                freePlaces.push([tempX, tempY]);
            }
            tempX += 30;
            tempY += 18;
            if (this.getNodeByLocation(allNodes, [tempX, tempY]) === null) {
                freePlaces.push([tempX, tempY]);
            }
            tempY += 36;
            if (this.getNodeByLocation(allNodes, [tempX, tempY]) === null) {
                freePlaces.push([tempX, tempY]);
            }
            tempX -= 30;
            tempY += 18;
            if (this.getNodeByLocation(allNodes, [tempX, tempY]) === null) {
                freePlaces.push([tempX, tempY]);
            }
            tempX -= 30;
            tempY -= 18;
            if (this.getNodeByLocation(allNodes, [tempX, tempY]) === null) {
                freePlaces.push([tempX, tempY]);
            }
            tempY -= 36;
            if (this.getNodeByLocation(allNodes, [tempX, tempY]) === null) {
                freePlaces.push([tempX, tempY]);
            }

            var location = this.getShortestToCenter(freePlaces);
            xToRender=location[0];
            yToRender=location[1];
        }

        newHex.setAttributeNS(null, "transform", "translate(" + xToRender + ", " + yToRender + ")");
        if (typeof(this.Link) === "undefined" ) {
            newHex.setAttributeNS(null, "onclick", "expandNode('" + this.Id + "')");
        }
        
        newHex.setAttributeNS(null, "id", this.Id);

        if (this.Link) {
            var linkNode = document.createElementNS("http://www.w3.org/2000/svg", "a");
            linkNode.setAttributeNS("http://www.w3.org/1999/xlink", "xlink:href", this.Link);
            linkNode.setAttributeNS(null, "target", "_blank")
        }

        var textNode = document.createElementNS("http://www.w3.org/2000/svg", "text");
        textNode.setAttributeNS(null, "x", xToRender);
        textNode.setAttributeNS(null, "y", yToRender);
        textNode.setAttributeNS(null, "text-anchor", "middle");
        textNode.setAttributeNS(null, "fill", "black");
        textNode.setAttributeNS(null, "font-size", "3");
        textNode.setAttributeNS(null, "pointer-events", "none");

        var text = document.createTextNode(this.Text);
        textNode.appendChild(text);

        if (this.BackGround) {
            var backGroundNode = document.createElementNS("http://www.w3.org/2000/svg", "set");
            backGroundNode.setAttributeNS(null, "attributeName", "fill");
            backGroundNode.setAttributeNS(null, "to", this.BackGround);
            backGroundNode.setAttributeNS(null, "begin", this.Id + ".mouseover");
            backGroundNode.setAttributeNS(null, "end", this.Id + ".mouseout");
            newHex.appendChild(backGroundNode);
        }

        if (this.Link) {
            linkNode.appendChild(newHex);
            linkNode.appendChild(textNode);
            grid.appendChild(linkNode);
        } else {
            grid.appendChild(newHex);
            grid.appendChild(textNode);
        }

        if (this.Image) {
            var imageNode = document.createElementNS("http://www.w3.org/2000/svg", "image");
            imageNode.setAttributeNS('http://www.w3.org/1999/xlink', 'href', this.Image);
            imageNode.setAttributeNS(null, "pointer-events", "none");
            imageNode.setAttributeNS(null, "width", "20");
            imageNode.setAttributeNS(null, "height", "20");
            imageNode.setAttributeNS(null, "x", xToRender - 10);
            imageNode.setAttributeNS(null, "y", yToRender - 20);
            grid.appendChild(imageNode);
        }

        if (renderChildren) {
            var sortedChildren = this.sortChildrenByScore();
            sortedChildren.forEach(child => {
                child.render(grid, false);
            });
        }
    }

    getAllChildren() {
        var result= this.children;
        this.children.forEach(child => {
            var childVals = child.getAllChildren();
            childVals.forEach(val => {
                result.push(val);
            });
        });
        return result;
    }

    addChildNode(node) {
        this.children.push(node);
        this.ScoreList[node.Id] = 0;
    }

    getHighestPair(scoreList) {
        var highest = 0;
        var result = [];
        var hasSet = false;
        for (var Id in scoreList) {
            var score = scoreList[Id];
            if (score > highest || !hasSet) {
                highest = score;
                result = [Id, score];
                hasSet = true;
            }
        }

        return result;
    }

    sortChildrenByScore() {
        var copyList = {};
        for (var Id in this.ScoreList) {
            copyList[Id] = this.ScoreList[Id];
        }

        var result = [];
        for (let i = 0; i < this.children.length; i++) {
            var highest = this.getHighestPair(copyList);
            delete copyList[highest[0]];
            result.push(this.getNodeById(highest[0], []));
        }

        return result;
    }

    getNodeByText(text) {
        if (this.Text == text) {
            return this;
        }
        else {
            var node = null;
            for (let i = 0; i < this.children.length; i++) {
                const child = this.children[i];
                var temp = child.getNodeByText(text);
                if (temp !== null) {
                    node = temp;
                    break;
                }
            }
            return node;
        }
    }

    getNodeById(Id, nodesHad) {
        if (this.Id === Id) {
            return this;
        } else {
            var node = null;
            for (let i = 0; i < this.children.length; i++) {
                const child = this.children[i];
                if (nodesHad.indexOf(child.Id)===-1) {
                    nodesHad.push(child.Id)
                    var temp = child.getNodeById(Id, nodesHad);
                    if (temp !== null) {
                        node = temp;
                        break;
                    }
                }
            }
            return node;
        }
    }
}