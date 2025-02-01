// Function to fetch graph files from a specific folder
async function fetchGraphFiles(folder) {
    try {
        const response = await fetch(`${folder}/`);
        const data = await response.text();
        const parser = new DOMParser();
        const doc = parser.parseFromString(data, 'text/html');
        const files = Array.from(doc.querySelectorAll('a'))
            .map(link => link.href.split('/').pop())
            .filter(filename => filename.endsWith('.html'));
        return files;
    } catch (error) {
        console.error(`Error fetching files from ${folder}:`, error);
        return [];
    }
}

// Function to extract node IDs from inline JavaScript in each graph file
function extractNodeIdsFromContent(content) {
    try {
        const nodeIds = [];
        const nodeRegex = /nodes\s*=\s*new\s*vis\.DataSet\(\[([\s\S]+?)\]\)/;
        const match = content.match(nodeRegex);

        if (match) {
            const nodesData = `[${match[1]}]`.replace(/,\s*]/, ']'); // Ensure valid JSON
            const nodeObjects = JSON.parse(nodesData);

            nodeObjects.forEach(node => {
                if (node.id) {
                    nodeIds.push({ id: node.id, label: node.label });
                }
            });
        }

        return nodeIds;
    } catch (error) {
        console.error("Error parsing node IDs:", error);
        return [];
    }
}

// Function to search graph contents for the input query
async function searchGraphContent(searchTerm, graphFiles, folder) {
    const results = [];

    for (const file of graphFiles) {
        try {
            const response = await fetch(`${folder}/${file}`);
            const data = await response.text();
            const nodeIds = extractNodeIdsFromContent(data);
            const matchedNodes = nodeIds.filter(node => 
                node.id.toLowerCase().includes(searchTerm.toLowerCase())
            );

            if (matchedNodes.length > 0) {
                results.push({ file, folder, nodes: matchedNodes });
            }
        } catch (error) {
            console.error(`Error reading file ${file}:`, error);
        }
    }

    return results;
}

// Function to display search results dynamically
function displaySearchResults(results) {
    const searchResultsContainer = document.getElementById('search-results');
    const searchList = document.getElementById('search-list');
    
    searchList.innerHTML = ''; // Clear previous results

    searchResultsContainer.style.display = 'block';


    if (results.length === 0) {
        searchList.innerHTML = "<li><h3>No Search Results Found</h3></li>"
    }


    results.forEach(result => {
        result.nodes.forEach(node => {
            const listItem = document.createElement('li');
            const link = document.createElement('a');
            link.href = `${result.folder}/${result.file}`;
            var file_str = formatFileName(result.file)
            link.textContent = `${formatNodeName(node.label)} (${file_str})`;
            listItem.appendChild(link);
            searchList.appendChild(listItem);
        });
    });
}

function formatFileName(fileName) {
    // Remove the .html extension
    let nameWithoutExtension = fileName.replace(/\.html$/, "");
    
    // Replace %20, % and _ with spaces
    let formattedName = nameWithoutExtension.replace(/(%20|[%_])/g, " ");
    
    // Capitalize the first letter
    formattedName = formattedName.charAt(0).toUpperCase() + formattedName.slice(1);
    
    return formattedName;
}

function formatNodeName(label) {
    const words = label.split(" ");

    for (let i = 0; i < words.length; i++) {
        words[i] = words[i][0].toUpperCase() + words[i].substr(1);
    }

    return words.join(" ");

}


// Event listener for dynamic search
document.getElementById('search-box').addEventListener('input', async (event) => {
    const searchTerm = event.target.value.trim();

    if (!searchTerm) {
        document.getElementById('search-results').style.display = 'none';
        return;
    }

    const wikileaksFiles = await fetchGraphFiles('wikileaks_graph');
    const newsFiles = await fetchGraphFiles('news_graph');

    const wikileaksResults = await searchGraphContent(searchTerm, wikileaksFiles, 'wikileaks_graph');
    const newsResults = await searchGraphContent(searchTerm, newsFiles, 'news_graph');

    displaySearchResults([...wikileaksResults, ...newsResults]);
});

// Function to load and display all graphs initially
document.addEventListener('DOMContentLoaded', async function() {
    const wikileaksFiles = await fetchGraphFiles('wikileaks_graph');
    const newsFiles = await fetchGraphFiles('news_graph');

    const wikileaksList = document.getElementById('wikileaks-list').querySelector('ul');
    const newsList = document.getElementById('news-list').querySelector('ul');

    wikileaksFiles.forEach(file => {
        const listItem = document.createElement('li');
        const link = document.createElement('a');
        link.href = `wikileaks_graph/${file}`;
        var file_str = formatFileName(file)
        link.textContent = file_str;
        listItem.appendChild(link);
        wikileaksList.appendChild(listItem);
    });

    newsFiles.forEach(file => {
        const listItem = document.createElement('li');
        const link = document.createElement('a');
        link.href = `news_graph/${file}`;
        var file_str = formatFileName(file)
        link.textContent = file_str;
        listItem.appendChild(link);
        newsList.appendChild(listItem);
    });
});