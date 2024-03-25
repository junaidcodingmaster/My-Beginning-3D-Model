const folderViewer = document.getElementById("folderViewer");
const fileContents = document.getElementById("mdToHtmlText");



async function fetchItemsList() {
try {
  const response = await fetch("itemsList.json");
  if (!response.ok) {
    throw new Error("Failed to fetch items list");
  }
  const data = await response.json();
  generateItemsList(data.items);
} catch (error) {
  console.error("Error:", error.message);
  alert("Error: " + error.message);
}
}

function generateItemsList(items) {
const itemsListDiv = document.getElementById("itemsList");
const ol = document.createElement("ol");

items.forEach((item) => {
  const li = document.createElement("li");
  li.innerHTML = `<u>${item.title}</u> - ${item.shortDescription}`;

  const ul = document.createElement("ul");
  
  const openFolderButton = `<li><button onclick="folderOpener('${item.folderPath}')"><i class="fa fa-folder-open"></i>OPEN FOLDER</button></li>`;

  ul.innerHTML =  openFolderButton;
  li.appendChild(ul);

  ol.appendChild(li);
});

itemsListDiv.appendChild(ol);
}

function download(path) {
window.open(path, "_blank");
}

function convertMarkdownToHTML(mdText) {
const converter = new showdown.Converter();
return converter.makeHtml(mdText);
}

async function folderOpener(path) {
const mdFilePath = path + "/README.md";
const printPath = document.getElementById("printPath");
let data = "";

printPath.innerText = path;

try {
  const response = await fetch(mdFilePath);
  if (!response.ok) {
    throw new Error("There's no 'README.md' file to open!");
  }
  data = await response.text();
} catch (error) {
  console.error("Error:", error.message);
  alert("Error:\n" + error.message);
  return; // Exit the function if there's an error
}

let htmlText = convertMarkdownToHTML(data);
// Replace all occurrences of paths in the HTML content
let fillingPaths = htmlText.replace(
  /\.\//g,
  path.replace(/\.\//, "") + "/"
);
fileContents.innerHTML = fillingPaths;

folderViewer.style.display = "block";
}

function closeFolder() {
folderViewer.style.display = "none";
}

fetchItemsList();