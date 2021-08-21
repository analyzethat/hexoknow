function expandNode(Id) {
    newNode = baseNode.getNodeById(Id, []);
    if (newNode.Id !== centerNode.Id) {
        grid.innerHTML = "";
        centerNode = newNode;
        centerNode.render(grid, true);
        breadCrumbs.push(centerNode);
    } else {
        if (breadCrumbs.length > 1) {
            grid.innerHTML="";
            breadCrumbs.pop();
            
            centerNode = breadCrumbs[breadCrumbs.length - 1];
            centerNode.render(grid, true);
        }
    }
    showBreadCrumbs();
    showVoting();
}

function createChildNodes(parent, children) {
    children.forEach(child => {
        newNode = new Node(child, [], makeid(32));
        parent.addChildNode(newNode);
    });
}

function makeid(length) {
    var result = "";
    var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var charactersLength = characters.length;
    for (var i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
}

function goToBreadCrumb(Id) {
    nodeToGo=baseNode.getNodeById(Id, []);
    grid.innerHTML = "";

    for (let i = breadCrumbs.length-1; i >=0; i--) {
        const crumb = breadCrumbs[i];
        if (crumb.Id === Id) {
            break;
        }
        
    }
    
    centerNode= nodeToGo;
    centerNode.render(grid, true);

    newCrumbs=[];
    for (let i = 0; i < breadCrumbs.length; i++) {
        const crumb = breadCrumbs[i];
        newCrumbs.push(crumb);
        if (crumb.Id === Id) {
            break;
        } 
    }
    breadCrumbs=newCrumbs;
    showBreadCrumbs();
    showVoting();

}

function showBreadCrumbs() {
    var breadCrumbsNode=document.getElementsByClassName("breadcrumbs")[0];
    breadCrumbsNode.innerHTML = "";
    for (let i = 0; i < breadCrumbs.length; i++) {
        const crumb = breadCrumbs[i];
        var newPart = document.createElement("span");
        newPart.setAttribute("id", crumb.Id);
        newPart.setAttribute("onclick", "goToBreadCrumb('" + crumb.Id + "')");
        var newTextNode = document.createTextNode(crumb.Text);
        if (i === 0) {
            newTextNode.nodeValue="Home";
        }
        newPart.appendChild(newTextNode);
        breadCrumbsNode.appendChild(newPart);
        if (i<breadCrumbs.length-1) {
            breadCrumbsNode.innerHTML += " > ";
        }
    }
}

function increaseScore() {
    var idToIncrease = centerNode.Id;
    var parent = breadCrumbs[breadCrumbs.length-2];
    var score = parent.ScoreList[idToIncrease]+1;
    parent.ScoreList[idToIncrease] = score;
    showVoting();
}

function lowerScore() {
    var idToIncrease = centerNode.Id;
    var parent = breadCrumbs[breadCrumbs.length - 2];
    var score = parent.ScoreList[idToIncrease]-1;
    parent.ScoreList[idToIncrease] = score;
    showVoting();
}

function showVoting() {
    var scoreNode = document.getElementsByClassName("score")[0];
    scoreNode.innerHTML = "";

    if (breadCrumbs.length>1) {
        var parentNode = breadCrumbs[breadCrumbs.length-2];
        if (parentNode.ScoreList.hasOwnProperty(centerNode.Id)) {
            var scoreText = document.createTextNode("Score: " + parentNode.ScoreList[centerNode.Id]);
            scoreNode.appendChild(scoreText);

            var incrementScoreNode = document.createElement("button");
            var incrementText = document.createTextNode("++");
            incrementScoreNode.appendChild(incrementText);
            incrementScoreNode.addEventListener("click", increaseScore);

            var decrementScoreNode = document.createElement("button");
            var decrementText = document.createTextNode("--");
            decrementScoreNode.appendChild(decrementText);
            decrementScoreNode.addEventListener("click", lowerScore);
            
            scoreNode.appendChild(incrementScoreNode);
            scoreNode.appendChild(decrementScoreNode);
        }
    }
}

baseChildNodes=[
    "Vervoersmiddelen",
    "Nederland"
]

var transportChildNodes=[
    "Auto's",
    "Vliegtuigen",
    "Motoren",
    "Boten",
    "Fietsen",
    "Treinen",
    "Motorfietsen",
    "Scooters",
    "Jetski's"
];

var carChildNodes=[
    "Merken",
    "Geschiedenis"
];

var brandChildNodes=[
    "Toyota",
    "Renault",
    "Volkswagen",
    "Open",
    "Kia",
    "Mercedes",
    "Mitsubishi",
    "Chrevrolet",
    "Porsche",
    "Rolls-Royce",
    "Ferrari",
    "Mclaren",
    "Dacia",
    "Daihatsu",
    "Volvo",
    "Audi",
    "BWM",
    "Lamborghini",
    "Skoda",
    "Alfa Romeo"
];


var netherlandsChildNodes=[
    "Provincies",
    "Geschiedenis",
    "Bestuur",
    "Infrastructuur"
];

var provincesChildNodes=[
    "Utrecht",
    "Gelderland",
    "Noord-Holland",
    "Zuid-Holland",
    "Zeeland",
    "Noord-Brabant",
    "Limburg",
    "Flevoland",
    "Overijssel",
    "Friesland",
    "Groningen",
    "Niet Drenthe"
];

var centerX=50;
var centerY=50;

var baseNode=new Node("", [], makeid(32));
var centerNode=baseNode;
var breadCrumbs=[centerNode];

createChildNodes(baseNode, baseChildNodes);

var transportNode=centerNode.getNodeByText("Vervoersmiddelen");
createChildNodes(transportNode, transportChildNodes);

var carNode = centerNode.getNodeByText("Auto's");
createChildNodes(carNode,carChildNodes);

var brandNode = centerNode.getNodeByText("Merken");
createChildNodes(brandNode,brandChildNodes);

var netherlandsNode=centerNode.getNodeByText("Nederland");
createChildNodes(netherlandsNode,netherlandsChildNodes);

var provincesNode=centerNode.getNodeByText("Provincies");
createChildNodes(provincesNode,provincesChildNodes);

var infraStructureNode = centerNode.getNodeByText("Infrastructuur");
infraStructureNode.addChildNode(carNode);

carNode.addChildNode(infraStructureNode);

carNode.Image = "https://images.abcdn.nl/image/67cb6bb827_Hennessay_Venom_F5_1.jpg?rect=16%2C0%2C1214%2C683&w=880&s=359a20f22546ad514b08fde497eaca29";
carNode.BackGround = "#641623";

var historyNode=centerNode.getNodeByText("Geschiedenis");
historyNode.Link = "https://nl.wikipedia.org/wiki/Auto";

var grid = document.getElementsByClassName("pod-wrap")[0];
grid.innerHTML = "";

centerNode.render(grid, true);
showBreadCrumbs();