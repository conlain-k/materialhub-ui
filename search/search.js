// Forward a search query to cordra and populate search page
async function runSearch(query, pagesize) {
    let qstr = '?query=' + query;

    qstr += '&filter=["/id","/content/name","/content/thumbnailUrl"]'; //&filter=["/id","/content/name","/content/thumbnailUrl"]

    qstr += '&pageSize=' + pagesize; //change this.

    qstr = encodeURI(qstr);

    let response = await getData('/objects' + qstr);

    if (!response.ok) {
        alert('Search failed!');
    }

    let results = await response.json();
    populateTable(results['results']);
}

async function createSearchResult(result) {
    const result_id = result.id;
    const result_name = result.content.name;
    const result_thumbnail = result.content.thumbnailUrl;

    let row_td = document.createElement('td');

    let name_div = document.createElement('div');
    let name_header = document.createElement('h5');
    let name_link = document.createElement('a');
    let thumbnail_link = document.createElement('img');
    name_link.href = encodeURI('/object?id=' + result_id);
    name_link.innerHTML = result_name;
    thumbnail_link.src = result_thumbnail;
    thumbnail_link.height = '50';
    //$('img').addClass = 'img-fluid img-thumbnail'; //need to figure out how to pass through a class attribute

    // Add tree of elements
    row_td.appendChild(name_div);
    name_div.appendChild(name_header);
    name_header.appendChild(name_link);

    if (nonEmpty(result_thumbnail)) {
        name_div.appendChild(thumbnail_link);
    }

    let id_link = document.createElement('a');
    id_link.href = name_link.href;
    id_link.innerHTML = 'ID: ' + result_id;

    row_td.appendChild(id_link);

    console.log(row_td);

    return row_td;
}

async function populateTable(results) {
    console.log(results);
    // Guided by here: https://developer.mozilla.org/en-US/docs/Web/HTML/Element/template

    // Get references to the table body
    var table = document.getElementById('results_table');

    // TODO there has to be a better way in JS
    for (let i = 0; i < results.length; i++) {
        let new_row = table.insertRow();
        let row_td = await createSearchResult(results[i]);

        new_row.appendChild(row_td);
    }
}

// If we have a query string, search it now
document.addEventListener(
    'DOMContentLoaded',
    function () {
        let params = new URLSearchParams(location.search);
        let qstr = params.get('query');
        let pageSize = params.get('pageSize');
        let pageNum = params.get('pageNum');

        console.log(qstr);
        console.log(pageSize);
        console.log(pageNum);

        if (nonEmpty(qstr)) {
            const results = runSearch(qstr, pageSize);
        }
    }
    // if (nonEmpty(pageSize)) {
    //     const pageSize = pageSize;
    //     if (nonEmpty(qstr)) {
    //         const results = runSearch(qstr, pageSize);
    //     }
    // } else {
    //     //const pageSize = 25;
    //     if (nonEmpty(qstr)) {
    //         const results = runSearch(qstr, 25);
    //     }
    // }
    // if we have params, search for them
    //else {
    //     const result = runSearch(qstr, 25); //this seems to work for now, but might not account for all possible outcomes/be the best solution
    //
);
