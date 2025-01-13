const templateSites = [
    "https://shatvm.github.io/html-validator/template-sites/00/index.html",
    "https://shatvm.github.io/html-validator/template-sites/01/index.html",
    "https://shatvm.github.io/html-validator/template-sites/02/index.html",
    "https://shatvm.github.io/html-validator/template-sites/HTML%20Tutorial"
];

// Контейнер для випадаючого списку
const templateSitesDiv = document.querySelector(".templateSites");
const selectElement = document.createElement("select");
selectElement.innerHTML = `
    <option value="">Select a template site</option>
    ${templateSites.map((site, index) => `<option value="${site}">Template Site ${index + 1}</option>`).join("")}
`;
templateSitesDiv.appendChild(selectElement);

let templateData = [];

// Слухач зміни вибору
selectElement.addEventListener("change", event => {
    const selectedSite = event.target.value;
    if (selectedSite) {
        extractTemplate(selectedSite); // Запускаємо аналіз шаблону
    } else {
        clearTemplateData(); // Очищаємо результати
    }
});

// Очищення розділу відображення
function clearTemplateData() {
    const taskList = document.getElementById("taskList");
    taskList.innerHTML = "<p>No template data to display.</p>";
}


// Функція для нормалізації innerText
function normalizeText(text) {
    return text.trim().replace(/\s+/g, ' '); // Очищає зайві пробіли та замінює кілька пробілів на один
}


// Функція для аналізу шаблону
function extractTemplate(url) {
    fetch(url)
        .then(response => response.text())
        .then(html => {
            const parser = new DOMParser();
            const doc = parser.parseFromString(html, "text/html");

            // Аналіз елементів (наприклад, тільки основні теги)
            const allowedTags = ['title', 'div', 'h1', 'p', 'a', 'span', 'img', 'ul', 'li', 'table', 'tr', 'td', 'th'];
            templateData = Array.from(doc.querySelectorAll(allowedTags.join(','))).map(element => {
                // Створюємо об'єкт для кожного елемента
                const attributes = Array.from(element.attributes).reduce((attrs, attr) => {
                    attrs[attr.name] = attr.value;
                    return attrs;
                }, {});

                return {
                    task: element.tagName.toLowerCase(),
                    count: 1,
                    innerText: normalizeText(element.innerText),  // Нормалізація тексту
                    attributes: attributes
                };
            });

            displayTemplate(); // Відображення шаблонних даних
        })
        .catch(err => alert("Error fetching template site: " + err.message));
}

// Відображення шаблонних даних
function displayTemplate() {
    const taskList = document.getElementById("taskList");
    taskList.innerHTML = templateData.length
        ? `
        <table>
            <thead>
                <tr>
                    <th>Tag</th>
                    <th>Inner Text</th>
                    <th>Attributes</th>
                </tr>
            </thead>
            <tbody>
                ${templateData.map(data => `
                    <!-- Main task row -->
                    <tr>
                        <td rowspan="${Object.keys(data.attributes).length + 1}">${data.task}</td>
                        <td rowspan="${Object.keys(data.attributes).length + 1}">${data.innerText || "N/A"}</td>
                        <td>${Object.keys(data.attributes).length ? `${Object.keys(data.attributes)[0]}="${data.attributes[Object.keys(data.attributes)[0]]}"` : "None"}</td>
                    </tr>
                    <!-- Additional parameters rows (attributes) -->
                    ${Object.entries(data.attributes)
                .slice(1) // Пропускаємо перший атрибут, бо він вже виведений в основному рядку
                .map(([key, value]) => `
                        <tr>
                            <td>${key}</td>
                            <td>${value}</td>
                        </tr>
                    `).join('')}
                `).join('')}
            </tbody>
        </table>`
        : '<p>No data extracted from the template.</p>';
}


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
                        <td>${status}</td>
                    `;
                    if (status === 'No') {
                        row.style.backgroundColor = "#ffcccc";  // Set light red background for 'No' status
                    }
                    table.querySelector("tbody").appendChild(row);

                    // Checking innerText and comparing normalized values
                    const matchingElements = siteElements.filter(element => normalizeText(element.innerText) === task.innerText);

                    const textMatchStatus = matchingElements.length ? "Yes" : "No";
                    const textRow = document.createElement("tr");
                    textRow.innerHTML = `
                        <td>innerText</td>
                        <td>${task.innerText}</td>
                        <td>${textMatchStatus}</td>
                    `;
                    if (textMatchStatus === 'No') {
                        textRow.style.backgroundColor = "#ffcccc";  // Set light red background for 'No' status
                    }
                    table.querySelector("tbody").appendChild(textRow);

                    // Checking additional attributes
                    Object.entries(task.attributes || {}).forEach(([attrName, attrValue]) => {
                        const matchingAttribute = siteElements.filter(element => element.hasAttribute(attrName) && normalizeText(element.getAttribute(attrName)) === normalizeText(attrValue));

                        const attributeMatchStatus = matchingAttribute.length ? "Yes" : "No";

                        const attributeRow = document.createElement("tr");
                        attributeRow.innerHTML = `
                            <td>${attrName}="${attrValue}"</td>
                            <td>${attrValue}</td>
                            <td>${attributeMatchStatus}</td>
                        `;

                        if (attributeMatchStatus === 'No') {
                            attributeRow.style.backgroundColor = "#ffcccc";  // Set light red background for 'No' status
                        }

                        table.querySelector("tbody").appendChild(attributeRow);
                    });
                });

                table.innerHTML += `</tbody>`;
                resultDiv.appendChild(table);
                resultsContainer.appendChild(resultDiv);
            })
            .catch(err => alert("Error fetching test site: " + err.message));
    });
}



