console.log(graph)
document.getElementById("graph").value = JSON.stringify(graph); // Clear node name field

// Initialize Cytoscape
const cy = cytoscape({
    container: document.getElementById('cy'), // The div to render the graph in
    elements: graph, // The graph data
    style: [
        {
            selector: 'node',
            style: {
                'background-color': '#0074D9',
                'label': 'data(label)', // Display the label on each node
                'color': '#fff',
                'text-outline-width': 2,
                'text-outline-color': '#0074D9',
            }
        },
        {
            selector: 'edge',
            style: {
                'width': 3,
                'line-color': 'black',
                'curve-style': 'bezier',
                'label': 'data(weight)', // Display weight on edges
                'font-size': 12,
                'text-background-opacity': 1,
                'text-background-color': '#fff',
                'text-background-padding': 2,
            }
        }
    ],
    layout: {
        name: 'circle', // Circular layout to place nodes in a circular fashion
        padding: 10,
    }
});

document.getElementById("add-connection-btn").addEventListener("click", function () {
    const connectionsDiv = document.getElementById("connections");

    // Create a new div for the connection fields
    const newConnectionDiv = document.createElement("div");
    newConnectionDiv.className = "connection";

    // Add input fields for "Connected to" and "Weight"
    newConnectionDiv.innerHTML = `
        Connected to:
        <input type="text" class="target" name="connected_to[]" required>
        Weight:
        <input type="number" class="weight" name="weight[]" min="0" placeholder="Enter a positive number" required>
        `;

    // Append the new connection fields to the connections div
    connectionsDiv.appendChild(newConnectionDiv);
});

function addNode() {
    const nodeName = document.getElementById("name").value;
    const connectionsDiv = document.getElementById("connections");

    // Add the new node to the graph
    graph.nodes.push({
        "data": {
            "id": nodeName,
            "label": `Node ${nodeName}`
        }
    });

    // Get all the connections (target and weight) from the form
    const connectedTo = document.querySelectorAll("input[name='connected_to[]']");
    const weights = document.querySelectorAll("input[name='weight[]']");

    // Add the corresponding edges to the graph
    connectedTo.forEach((target, index) => {
        // Log the edge data object without using JSON.parse
        console.log({
            "data": {
                "source": nodeName,
                "target": target.value,
                "weight": parseInt(weights[index].value)
            }
        });

        // Push the edge data to the graph
        graph.edges.push({
            "data": {
                "source": nodeName,
                "target": target.value,
                "weight": parseInt(weights[index].value),
                "id": `${nodeName}-${target.value}-${weights[index].value}`
            }
        });

    });

    // Update Cytoscape graph with new data
    cy.json({ elements: graph });

    // Optionally, clear the form after adding the node
    document.getElementById("name").value = ''; // Clear node name field
    document.getElementById("connections").innerHTML = ''; // Clear connection fields
    document.getElementById("graph").value = JSON.stringify(graph); // Clear node name field
}