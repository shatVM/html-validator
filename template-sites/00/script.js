//https://shatvm.github.io/html-validator/template-sites/HTML%20Tutorial


let templateSites = [
    "https://shatvm.github.io/html-validator/template-sites/00/index.html",
    "https://shatvm.github.io/html-validator/template-sites/01/index.html",
    "https://shatvm.github.io/html-validator/template-sites/02/index.html",
    "https://shatvm.github.io/html-validator/template-sites/HTML%20Tutorial",
];

// Додати випадаючий список в <div class="templateSites"></div> з індексами які програмно зчитуються з templateSites 
// і  посилання на відповідні сайти вставляти в urlInput
const templateSitesDiv = document.querySelector(".templateSites");
const selectElement = document.createElement("select");

templateSites.forEach((site, index) => {
    const option = document.createElement("option");
    option.value = site;
    option.textContent = `Шаблон Site ${index}`;
    selectElement.appendChild(option);
});

selectElement.addEventListener("change", (event) => {
    document.getElementById("urlInput").value = event.target.value;
    extractTemplate()
});

templateSitesDiv.appendChild(selectElement);


let templateData = [];

// Function to extract elements from template site

function extractTemplate() {
    const url = document.getElementById("urlInput").value.trim();
    if (url) {
        fetch(url)
            .then(response => response.text())
            .then(html => {
                const parser = new DOMParser();
                const doc = parser.parseFromString(html, "text/html");

                // Extracting elements from the template site
                templateData = Array.from(doc.body.getElementsByTagName('*')).map(element => {
                    const task = {
                        task: element.tagName.toLowerCase(),
                        count: 1, // Default count
                        values: {}
                    };

                    //Зчитувати контент з елементів якщо вони мають innerText або innerContent
                    task.values["innerText"] = element.innerText;
                    


                    
                        //task.values["innerContent"] = element.Content;

                    

                    // Collecting all attributes as additional parameters
                    Array.from(element.attributes).forEach(attr => {
                        task.values[attr.name] = attr.value;
                    });

                    return task;
                });

                // Display the extracted template data in a table
                displayTemplate();
            })
            .catch(err => alert("Error fetching template site: " + err.message));
    } else {
        alert("Please enter a valid URL for the template.");
    }
}

// Function to display extracted template data
function displayTemplate() {
    const taskList = document.getElementById("taskList");
    taskList.innerHTML = ""; // Clear previous tasks

    if (templateData.length) {
        const taskTable = document.createElement("table");
        taskTable.innerHTML = `
                    <thead>
                        <tr>
                            <th>Task</th>
                            <th>Expected Count</th>
                            <th>Additional Parameters</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${templateData
                .map(
                    task => `
                            <!-- Main Task Row -->
                            <tr>
                                <td rowspan="${Object.keys(task.values).length + 1}">${task.task}</td>
                                <td>${task.count}</td>
                                 <!--<td>${task.values ? Object.entries(task.values).map(([k, v]) => `${k}: ${v}`).join("<br>") : "None"}</td>-->
                            </tr>
                            <!-- Additional Parameters Rows -->
                            ${Object.entries(task.values)
                            .map(([k, v]) => `
                                    <tr>
                                        <td>${k}</td>
                                        <td>${v}</td>
                                        <td>To be checked...</td>
                                    </tr>
                                `)
                            .join("")}
                        `
                )
                .join("")}
                    </tbody>
                `;
        taskList.appendChild(taskTable);
    }
}

// Function to test entered sites based on the template data
function testSites() {
    const testUrls = document.getElementById("testUrlsInput").value.trim().split(/\s+/);
    if (testUrls.length === 0) {
        alert("Please enter valid URLs.");
        return;
    }

    const resultsContainer = document.getElementById("resultsContainer");
    resultsContainer.innerHTML = ""; // Clear previous results

    testUrls.forEach(url => {
        fetch(url)
            .then(response => response.text())
            .then(html => {
                const parser = new DOMParser();
                const doc = parser.parseFromString(html, "text/html");

                const siteTitle = doc.querySelector('title') ? doc.querySelector('title').innerText : "No title found";

                const resultDiv = document.createElement("div");
                resultDiv.innerHTML = `
                    <div class="site-title"><a class="site-link" href="${url}" target="_blank">${url}</a> - ${siteTitle}</div>
                `;

                const table = document.createElement("table");
                table.innerHTML = `
                    <thead>
                        <tr>
                            <th>Task</th>
                            <th>Count in Site</th>
                            <th>Status</th>
                        </tr>
                    </thead>
                    <tbody>
                `;

                // Compare elements from the template with the elements of the current site
                templateData.forEach(task => {
                    const siteElements = Array.from(doc.getElementsByTagName(task.task));
                    const siteCount = siteElements.length;
                    const status = siteCount >= task.count ? "Yes" : "No";

                    const row = document.createElement("tr");
                    row.innerHTML = `
                        <td>${task.task}</td>
                        <td>${siteCount}</td>
                        <td class="${status === 'Yes' ? 'success' : 'failure'}">${status}</td>
                    `;
                    table.querySelector("tbody").appendChild(row);

                    // Checking additional parameters
                    Object.entries(task.values).forEach(([paramKey, paramValue]) => {
                        const valueMatch = Array.from(doc.querySelectorAll(`[${paramKey}="${paramValue}"]`));
                        const matchStatus = valueMatch.length ? "Yes" : "No";

                        const paramRow = document.createElement("tr");
                        paramRow.innerHTML = `
                            <td>${paramKey}</td>
                            <td>${paramValue}</td>
                            <td class="${matchStatus === 'Yes' ? 'success' : 'failure'}">${matchStatus}</td>
                        `;
                        table.querySelector("tbody").appendChild(paramRow);
                    });
                });

                table.innerHTML += `</tbody>`;
                resultDiv.appendChild(table);
                resultsContainer.appendChild(resultDiv);
            })
            .catch(err => alert("Error fetching test site: " + err.message));
    });
}


