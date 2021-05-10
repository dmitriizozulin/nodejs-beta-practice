const updateLocation = (query) => {
  window.location.hash = query;

  const goBackBtn = document.querySelector('.goback');
  const newVal = query.slice(0, query.length - 1);
  goBackBtn.dataset['val'] = newVal || '/';
};

const goBack = () => {
  const goBackBtn = document.querySelector('.goback');
  const currentQuery = goBackBtn.dataset['val'];
  const query = currentQuery.slice(0, currentQuery.lastIndexOf('/') + 1);
  
  if (query === window.location.hash.slice(1)) return;

  onFileClick(query);
}

const renderFiles = ({isFile, data}) => {
  const filesList = document.querySelector('.files');
  filesList.innerHTML = '';

  if (isFile) {
    return filesList.innerHTML = `<li><pre>${data}</pre></li>`
  }

  
  data.map(getFileItem).forEach(item => {
    filesList.innerHTML += item;
  });
};

const makeFilesRequest = async (query) => await fetch(`http://localhost:8000/files?query=${query}`).then(res => res.json()).catch(err => console.error(err));

const getFileItem = (item) => {
  console.log(item);
  return `
    <li class="files-item">
      <img src="http://localhost:8000/public/icons/${item.isFile ? 'file' : 'folder'}.svg" class="icon" />
      <button onclick="onFileClick('${item.fullpath}${item.isFile ? '' : '/'}')">${item.path}</button>
    </li>
  `;
}

const onFileClick = async (query) => {
  const response = await makeFilesRequest(query);

  renderFiles(response);
  updateLocation(query);
}; 

(async () => {
  onFileClick('/');
})()
