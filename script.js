// Global variables
let tenantData = {};
let currentCategory = 'complete';
let currentSortColumn = null;
let sortDirection = 1; // 1 for ascending, -1 for descending

// Load tenant data from JSON
fetch('tenants_data.json')
    .then(response => response.json())
    .then(data => {
        tenantData = data;
        showCategory('complete'); // Show 'complete' category by default
    })
    .catch(error => {
        console.error('Error loading tenant data:', error);
        document.getElementById('tenant-table').innerHTML = '<p>حدث خطأ أثناء تحميل البيانات</p>';
    });

// Function to show a specific category
function showCategory(category) {
    currentCategory = category;
    // Update active tab
    document.querySelectorAll('.tab').forEach(tab => tab.classList.remove('active'));
    document.querySelector(`.tab[onclick="showCategory('${category}')"]`).classList.add('active');

    // Reset search
    document.getElementById('search').value = '';
    currentSortColumn = null;
    sortDirection = 1;

    // Render table
    renderTable();
}

// Function to render table
function renderTable() {
    const tenants = tenantData[currentCategory] || [];
    const table = document.createElement('table');
    const thead = document.createElement('thead');
    const tbody = document.createElement('tbody');

    // Define headers based on category
    let headers = [];
    let fieldKeys = [];
    if (currentCategory === 'complete') {
        headers = ['المستأجر', 'المرحلة', 'الدور', 'رقم المحل', 'الإيجار', 'تاريخ آخر سداد', 'الباقي', 'ملاحظات'];
        fieldKeys = ['المستاجر ', 'المرحلة', 'الدور', 'رقم المحل', 'الايجار', 'تاريخ اخر سداد', 'الباقي', 'ملاحظات'];
    } else {
        headers = ['المستأجر', 'المرحلة', 'الدور', 'رقم المحل', 'الإيجار', 'تاريخ آخر سداد', 'الباقي', 'ملاحظات'];
        fieldKeys = ['Unnamed: 1', 'Unnamed: 2', 'Unnamed: 3', 'Unnamed: 4', 'Unnamed: 5', 'Unnamed: 8', 'Unnamed: 9', 'Unnamed: 12'];
    }

    // Create header row
    const headerRow = document.createElement('tr');
    headers.forEach((header, index) => {
        const th = document.createElement('th');
        th.textContent = header;
        th.dataset.column = index;
        th.addEventListener('click', () => sortTable(index));
        headerRow.appendChild(th);
    });
    thead.appendChild(headerRow);
    table.appendChild(thead);

    // Create table body
    let filteredTenants = [...tenants];
    const query = document.getElementById('search').value.toLowerCase();
    if (query) {
        filteredTenants = tenants.filter(tenant => tenant[fieldKeys[0]].toLowerCase().includes(query));
    }

    // Sort tenants if a column is selected
    if (currentSortColumn !== null) {
        filteredTenants.sort((a, b) => {
            let valueA = a[fieldKeys[currentSortColumn]] || '';
            let valueB = b[fieldKeys[currentSortColumn]] || '';
            if (!isNaN(valueA) && !isNaN(valueB)) {
                return (Number(valueA) - Number(valueB)) * sortDirection;
            }
            return valueA.localeCompare(valueB) * sortDirection;
        });
    }

    filteredTenants.forEach(tenant => {
        const row = document.createElement('tr');
        fieldKeys.forEach(key => {
            const td = document.createElement('td');
            td.textContent = tenant[key] || '-';
            row.appendChild(td);
        });
        tbody.appendChild(row);
    });
    table.appendChild(tbody);

    // Update table container
    document.getElementById('tenant-table').innerHTML = '';
    document.getElementById('tenant-table').appendChild(table);
}

// Function to search tenants
function searchTenants() {
    renderTable();
}

// Function to sort table
function sortTable(column) {
    if (currentSortColumn === column) {
        sortDirection *= -1; // Toggle sort direction
    } else {
        currentSortColumn = column;
        sortDirection = 1;
    }
    renderTable();
}

// Function to export table to CSV
function exportToCSV() {
    const tenants = tenantData[currentCategory] || [];
    const headers = ['المستأجر', 'المرحلة', 'الدور', 'رقم المحل', 'الإيجار', 'تاريخ آخر سداد', 'الباقي', 'ملاحظات'];
    const fieldKeys = currentCategory === 'complete' 
        ? ['المستاجر ', 'المرحلة', 'الدور', 'رقم المحل', 'الايجار', 'تاريخ اخر سداد', 'الباقي', 'ملاحظات']
        : ['Unnamed: 1', 'Unnamed: 2', 'Unnamed: 3', 'Unnamed: 4', 'Unnamed: 5', 'Unnamed: 8', 'Unnamed: 9', 'Unnamed: 12'];
    
    let csv = headers.map(header => `"${header}"`).join(',') + '\n';
    tenants.forEach(tenant => {
        const row = fieldKeys.map(key => `"${tenant[key] || '-'}"`).join(',');
        csv += row + '\n';
    });

    const csvFile = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const downloadLink = document.createElement('a');
    downloadLink.download = `tenants_${currentCategory}.csv`;
    downloadLink.href = window.URL.createObjectURL(csvFile);
    downloadLink.click();
}