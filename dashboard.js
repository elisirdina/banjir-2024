// Fetch flood relief center data and populate dashboard
fetch('https://infobencanajkmv2.jkm.gov.my/api/pusat-buka.php?a=0&b=0')
    .then(response => response.json())
    .then(data => {
        // Render statistics
        const totalCenters = data.length;
        const totalEvacuees = data.reduce((sum, item) => sum + parseInt(item.jumlah_mangsa || 0), 0);
        const totalFamilies = data.reduce((sum, item) => sum + parseInt(item.jumlah_keluarga || 0), 0);

        document.getElementById('stats').innerHTML = `
            <p><strong>Total Centers Open:</strong> ${totalCenters}</p>
            <p><strong>Total Evacuees:</strong> ${totalEvacuees}</p>
            <p><strong>Total Families:</strong> ${totalFamilies}</p>
        `;

        // Render table
        const tableBody = document.querySelector('#data-table tbody');
        tableBody.innerHTML = data.map(item => `
            <tr>
                <td>${item.nama_pusat}</td>
                <td>${item.negeri}</td>
                <td>${item.jumlah_mangsa}</td>
                <td>${item.jumlah_keluarga}</td>
            </tr>
        `).join('');
    })
    .catch(error => console.error("Error loading dashboard data:", error));
