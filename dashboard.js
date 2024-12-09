// API URL
const originalApiUrl = 'https://infobencanajkmv2.jkm.gov.my/api/data-dashboard-table-pps.php?a=0&b=0&seasonmain_id=208&seasonnegeri_id=';
const apiUrl = `https://api.allorigins.win/get?url=${encodeURIComponent(originalApiUrl)}`;

// Fetch data from API
async function fetchData() {
    try {
        console.log('Attempting to fetch data from:', apiUrl);

        const response = await fetch(apiUrl);
        console.log('Response received:', response);
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const proxyResponse = await response.json();
        console.log('Proxy response:', proxyResponse);

        if (!proxyResponse.contents) {
            throw new Error('No data in proxy response');
        }

        // Parse the contents from the proxy
        let data;
        try {
            data = JSON.parse(proxyResponse.contents);
            console.log('Parsed data:', data);
        } catch (parseError) {
            console.error('JSON Parse Error:', parseError);
            throw new Error('Failed to parse JSON response');
        }

        if (!data) {
            throw new Error('No data received from API');
        }

        return data;
    } catch (error) {
        console.error('Error details:', {
            message: error.message,
            name: error.name,
            stack: error.stack
        });
        
        document.querySelector('.stats-container').innerHTML = `
            <div class="error-message">
                <h3>Error Loading Data</h3>
                <p>${error.message}</p>
                <p>Please check the browser console for more details.</p>
            </div>
        `;
        return null;
    }
}

// Update statistics
function updateStats(data) {
    try {
        console.log('Updating stats with data:', data);
        
        if (!data) {
            throw new Error('No data available');
        }

        // Ensure data is an array
        const dataArray = Array.isArray(data) ? data : [data];
        
        const totalPPS = dataArray.length;
        const totalMangsa = dataArray.reduce((sum, item) => {
            const mangsa = parseInt(item.JUMLAH_MANGSA) || 0;
            console.log('Processing mangsa:', item.JUMLAH_MANGSA, 'parsed as:', mangsa);
            return sum + mangsa;
        }, 0);
        
        const totalKeluarga = dataArray.reduce((sum, item) => {
            const keluarga = parseInt(item.JUMLAH_KELUARGA) || 0;
            console.log('Processing keluarga:', item.JUMLAH_KELUARGA, 'parsed as:', keluarga);
            return sum + keluarga;
        }, 0);

        console.log('Calculated totals:', { totalPPS, totalMangsa, totalKeluarga });

        // Update DOM
        d3.select('#totalPPS')
            .html(`<h3>Total PPS</h3><h2>${totalPPS}</h2>`);
        
        d3.select('#totalMangsa')
            .html(`<h3>Total Mangsa</h3><h2>${totalMangsa}</h2>`);
        
        d3.select('#totalKeluarga')
            .html(`<h3>Total Keluarga</h3><h2>${totalKeluarga}</h2>`);

    } catch (error) {
        console.error('Error in updateStats:', error);
        document.querySelector('.stats-container').innerHTML = `
            <div class="error-message">
                <h3>Error Processing Data</h3>
                <p>${error.message}</p>
            </div>
        `;
    }
}

// Create bar chart
function createBarChart(data) {
    try {
        if (!data || !Array.isArray(data)) {
            console.error('Invalid data for bar chart:', data);
            return;
        }

        console.log('Creating bar chart with data:', data);

        const margin = {top: 20, right: 20, bottom: 60, left: 60};
        const width = document.getElementById('barChart').clientWidth - margin.left - margin.right;
        const height = document.getElementById('barChart').clientHeight - margin.top - margin.bottom;

        // Clear previous chart
        d3.select('#barChart').html('');

        const svg = d3.select('#barChart')
            .append('svg')
            .attr('width', width + margin.left + margin.right)
            .attr('height', height + margin.top + margin.bottom)
            .append('g')
            .attr('transform', `translate(${margin.left},${margin.top})`);

        // Process data by negeri
        const negeriData = d3.rollup(data,
            v => d3.sum(v, d => parseInt(d.JUMLAH_MANGSA) || 0),
            d => d.NEGERI || 'Unknown'
        );

        const processedData = Array.from(negeriData, ([key, value]) => ({negeri: key, mangsa: value}));
        console.log('Processed data for bar chart:', processedData);

        if (processedData.length === 0) {
            console.error('No data to display in bar chart');
            return;
        }

        // Create scales
        const x = d3.scaleBand()
            .range([0, width])
            .domain(processedData.map(d => d.negeri))
            .padding(0.2);

        const y = d3.scaleLinear()
            .range([height, 0])
            .domain([0, d3.max(processedData, d => d.mangsa)]);

        // Add axes
        svg.append('g')
            .attr('transform', `translate(0,${height})`)
            .call(d3.axisBottom(x))
            .selectAll('text')
            .attr('transform', 'rotate(-45)')
            .style('text-anchor', 'end');

        svg.append('g')
            .call(d3.axisLeft(y));

        // Create bars
        svg.selectAll('rect')
            .data(processedData)
            .enter()
            .append('rect')
            .attr('x', d => x(d.negeri))
            .attr('y', d => y(d.mangsa))
            .attr('width', x.bandwidth())
            .attr('height', d => height - y(d.mangsa))
            .attr('fill', '#4CAF50');

    } catch (error) {
        console.error('Error in createBarChart:', error);
        document.getElementById('barChart').innerHTML = `
            <div class="error-message">
                <h3>Error Creating Bar Chart</h3>
                <p>${error.message}</p>
            </div>
        `;
    }
}

// Create pie chart
function createPieChart(data) {
    try {
        if (!data || !Array.isArray(data)) {
            console.error('Invalid data for pie chart:', data);
            return;
        }

        console.log('Creating pie chart with data:', data);

        const width = document.getElementById('pieChart').clientWidth;
        const height = document.getElementById('pieChart').clientHeight;
        const radius = Math.min(width, height) / 2 - 40;

        // Clear previous chart
        d3.select('#pieChart').html('');

        const svg = d3.select('#pieChart')
            .append('svg')
            .attr('width', width)
            .attr('height', height)
            .append('g')
            .attr('transform', `translate(${width/2},${height/2})`);

        // Process data by status PPS
        const statusData = d3.rollup(data,
            v => v.length,
            d => d.STATUS_PPS || 'Tidak Dinyatakan'
        );

        const processedData = Array.from(statusData, ([key, value]) => ({status: key, count: value}));
        console.log('Processed data for pie chart:', processedData);

        if (processedData.length === 0) {
            console.error('No data to display in pie chart');
            return;
        }

        // Color scale
        const color = d3.scaleOrdinal()
            .domain(processedData.map(d => d.status))
            .range(d3.schemeSet3);

        // Pie generator
        const pie = d3.pie()
            .value(d => d.count);

        const arc = d3.arc()
            .innerRadius(0)
            .outerRadius(radius);

        // Create pie chart
        const arcs = svg.selectAll('arc')
            .data(pie(processedData))
            .enter()
            .append('g');

        arcs.append('path')
            .attr('d', arc)
            .attr('fill', d => color(d.data.status));

        // Add labels
        arcs.append('text')
            .attr('transform', d => `translate(${arc.centroid(d)})`)
            .attr('text-anchor', 'middle')
            .text(d => `${d.data.status}: ${d.data.count}`);

    } catch (error) {
        console.error('Error in createPieChart:', error);
        document.getElementById('pieChart').innerHTML = `
            <div class="error-message">
                <h3>Error Creating Pie Chart</h3>
                <p>${error.message}</p>
            </div>
        `;
    }
}

// Initialize dashboard
async function initDashboard() {
    console.log('Initializing dashboard...');
    const data = await fetchData();
    if (data) {
        console.log('Data received, updating visualizations...');
        updateStats(data);
        createBarChart(data);
        createPieChart(data);
    } else {
        console.error('No data received from fetchData');
    }
}

// Call initialization
document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM loaded, starting initialization...');
    initDashboard();
});

// Add window resize listener
window.addEventListener('resize', () => {
    console.log('Window resized, reinitializing dashboard...');
    initDashboard();
});
