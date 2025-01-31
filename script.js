// Function to fetch graph files from a specific folder
// Function to fetch graph files from a specific folder
async function fetchGraphFiles(folder) {
    const graphFiles = [];
    
    const response = await fetch(`${folder}/`);
    const data = await response.text();
    const parser = new DOMParser();
    const doc = parser.parseFromString(data, 'text/html');
    const files = doc.querySelectorAll('a'); // Get all the anchor tags representing files

    files.forEach(file => {
        if (file.href.endsWith('.html')) { // Only include .html files
            graphFiles.push(file.href.split('/').pop()); // Extract the filename (graph_1.html)
        }
    });

    return graphFiles;
}

// Function to extract node IDs from the inline JavaScript in each graph file
function extractNodeIdsFromContent(content) {
    const nodeIds = [];
    const nodeRegex = /nodes\s*=\s*new\s*vis\.DataSet\(\[([^\]]+)\]\)/; // Regex to find the node array
    const match = content.match(nodeRegex);

    if (match) {
        const nodesData = match[1]; // This contains the JSON-like array of nodes
        const nodeObjects = JSON.parse(`[${nodesData}]`); // Parse the JSON array

        nodeObjects.forEach(node => {
            if (node.id) {
                nodeIds.push({ id: node.id, label: node.label }); // Push the node ID and label
            }
        });
    }

    return nodeIds;
}

// Function to fetch and check the content of the graph files for a search term in node IDs
async function searchGraphContent(searchTerm, graphFiles, folder) {
    const results = [];

    for (const file of graphFiles) {
        const response = await fetch(`${folder}/${file}`);
        const data = await response.text();

        // Extract node IDs and check if the search term exists in any of them
        const nodeIds = extractNodeIdsFromContent(data);

        const matchedNodes = nodeIds.filter(node => node.id.toLowerCase().includes(searchTerm.toLowerCase()));

        if (matchedNodes.length > 0) {
            results.push({ file, nodes: matchedNodes });
        }
    }

    return results;
}

// Function to display search results dynamically as the user types
function displaySearchResults(results) {
    const searchResultsContainer = document.getElementById('search-results');
    const searchList = document.getElementById('search-list');
    
    searchList.innerHTML = ''; // Clear the current content

    if (results.length === 0) {
        searchResultsContainer.style.display = 'none'; // Hide if no results
        return;
    }

    // Show the results container
    searchResultsContainer.style.display = 'block';
    console.log(results)
    results.forEach(result => {
        result.nodes.forEach(node => {
            const listItem = document.createElement('li');
            const link = document.createElement('a');
            link.href = `wikileaks_graph/${result.file}`;
            link.textContent = `${result.file}: ${node.label}`;
            listItem.appendChild(link);
            searchList.appendChild(listItem);
        });
    });
}

// Function to handle input event and trigger search dynamically
document.getElementById('search-box').addEventListener('input', async (event) => {
    const searchTerm = event.target.value.trim();
    if (!searchTerm) {
        document.getElementById('search-results').style.display = 'none'; // Hide if search box is empty
        return;
    }

    const wikileaksFiles = await fetchGraphFiles('wikileaks_graph');
    const newsFiles = await fetchGraphFiles('news_graph');

    const wikileaksResults = await searchGraphContent(searchTerm, wikileaksFiles, 'wikileaks_graph');
    const newsResults = await searchGraphContent(searchTerm, newsFiles, 'news_graph');

    const allResults = [...wikileaksResults, ...newsResults];
    displaySearchResults(allResults);
});

// Fetch and display graphs for both folders on initial load
document.addEventListener('DOMContentLoaded', async function() {
    const wikileaksFiles = await fetchGraphFiles('wikileaks_graph');
    const newsFiles = await fetchGraphFiles('news_graph');

    const wikileaksList = document.getElementById('wikileaks-list').querySelector('ul');
    const newsList = document.getElementById('news-list').querySelector('ul');

    wikileaksFiles.forEach(file => {
        const listItem = document.createElement('li');
        const link = document.createElement('a');
        link.href = `wikileaks_graph/${file}`;
        link.textContent = file;
        listItem.appendChild(link);
        wikileaksList.appendChild(listItem);
    });

    newsFiles.forEach(file => {
        const listItem = document.createElement('li');
        const link = document.createElement('a');
        link.href = `news_graph/${file}`;
        link.textContent = file;
        listItem.appendChild(link);
        newsList.appendChild(listItem);
    });
});