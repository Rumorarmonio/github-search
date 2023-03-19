const pageContainer = document.querySelector('.page__container');

const form = document.querySelector('.form');

form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const inputsValue = Object.fromEntries(new FormData(e.target));
    if (!inputsValue.title) {
        alert("Please type something!");
        return;
    }
    const response = await fetch(`https://api.github.com/search/repositories?q=${inputsValue.title}`);

    if (pageContainer.contains(pageContainer.querySelector('.page__table'))) {
        pageContainer.querySelector('.page__table').remove();
    }

    if (pageContainer.contains(pageContainer.querySelector('.page__error'))) {
        pageContainer.querySelector('.page__error').remove();
    }

    if (response.ok) {
        const repositories = (await response.json())['items'];

        if (repositories.length) {
            createTable(repositories);
            pageContainer.querySelector('.form__input').value = '';
        } else {
            createErrorMessage();
        }
    }
});

function createTable(repositories) {
    const table = document.createElement('table');
    pageContainer.appendChild(table);
    table.classList.add('page__table', 'table');

    table.innerHTML = `
        <thead class="table__head">
        <tr class="table__info">
            <th>title</th>
            <th>author</th>
            <th>created at</th>
            <th>updated at</th>
            <th>description</th>
        </tr>
        </thead>
        <tbody class="table__body">
        </tbody>`;

    const tableBody = table.querySelector('.table__body');

    for (let i = 0; i < 10; i++) {
        tableBody.appendChild(createTableRow(repositories[i]));
    }
}

function createTableRow(repositoryData) {
    const row = document.createElement('tr');
    row.innerHTML = `
        <td>
            <a target="_blank" rel="noopener noreferrer" href="${repositoryData.html_url}">${repositoryData.name}</a>
        </td>
        <td>
            <a target="_blank" rel="noopener noreferrer" href="${repositoryData.owner.html_url}">${repositoryData.owner.login}</a>
        </td>
        <td>${repositoryData.created_at.substring(0, 10)}</td>
        <td>${repositoryData.updated_at.substring(0, 10)}</td>
        <td>${repositoryData.description}</td>`
    return row;
}

function createErrorMessage() {
    const error = document.createElement('h2');
    pageContainer.appendChild(error);
    error.classList.add('page__error');
    error.innerText = 'Nothing found!'
}
