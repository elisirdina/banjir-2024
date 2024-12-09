// API URL
const apiUrl = 'https://infobencanajkmv2.jkm.gov.my/api/data-dashboard-table-pps.php?a=0&b=0&seasonmain_id=208&seasonnegeri_id=';

// Fetch data from API
async function fetchData() {
    try {
        const response = await fetch(apiUrl);
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error fetching data:', error);
        return null;
    }
}

// Update statistics
function updateStats(data) {
    const totalPPS = d3.sum(data, d => 1);
    const totalMangsa = d3.sum(data, d => parseInt(d.JUMLAH_MANGSA) || 0);
    const totalKeluarga = d3.sum(data, d => parseInt(d.JUMLAH_KELUARGA) || 0);

    d3.select('#totalPPS')
        .html(`<h3>Total PPS</h3><h2>${totalPPS}</h2>`);
    
    d3.select('#totalMangsa')
        .html(`<h3>Total Mangsa</h3><h2>${totalMangsa}</h2>`);
    
    d3.select('#totalKeluarga')
        .html(`<h3>Total Keluarga</h3><h2>${totalKeluarga}</h2>`);
}

// Create bar chart
function createBarChart(data) {
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
        d => d.NEGERI
    );

    const processedData = Array.from(negeriData, ([key, value]) => ({negeri: key, mangsa: value}));

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
}

// Create pie chart
function createPieChart(data) {
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
        .text(d => d.data.status);
}

// Initialize dashboard
async function initDashboard() {
    const data = await fetchData();
    if (data) {
        updateStats(data);
        createBarChart(data);
        createPieChart(data);
    }
}

// Call initialization
initDashboard();

// Add window resize listener
window.addEventListener('resize', () => {
    initDashboard();
});
