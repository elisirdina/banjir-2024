# Banjir Dashboard Concept

## Overview
The **Banjir Dashboard** is a real-time web application that visualizes flood-related data in Malaysia. It is designed to provide critical insights into the current flood situation, including statistics on affected areas, people, and families. The goal is to present the information in an interactive and user-friendly manner using D3.js visualizations.

## Key Objectives
1. **Real-time Data Integration**: Fetch flood-related data from the JKM API and present it dynamically on the dashboard.
2. **User-Friendly Design**: Ensure the interface is visually appealing and accessible on both desktop and mobile devices.
3. **Interactive Visualizations**: Use D3.js to create bar charts and pie charts for an engaging data exploration experience.
4. **Scalability**: Allow for future enhancements, such as adding geographic maps, filtering capabilities, or additional statistics.

## Features
- **Statistics Section**: Displays the total number of evacuation centers (PPS), affected individuals (Mangsa), and affected families (Keluarga).
- **Bar Chart**: Visualizes the number of affected individuals (`Mangsa`) by state (`Negeri`).
- **Pie Chart**: Shows the distribution of PPS status (`STATUS_PPS`).
- **Error Handling**: Provides clear error messages when data retrieval or processing fails.

## Target Audience
1. **Government Agencies**: To monitor flood impacts and manage resources effectively.
2. **General Public**: To stay informed about the flood situation in their area.
3. **Researchers and Analysts**: To analyze trends and patterns in flood data.

## Technical Stack
- **Frontend**: HTML, CSS, JavaScript, D3.js
- **Backend API**: JKM API (accessed via a proxy to handle CORS issues)
- **Hosting**: GitHub Pages
- **Version Control**: Git and GitHub

## Design Principles
1. **Simplicity**: Ensure the dashboard is intuitive and easy to use.
2. **Responsiveness**: Adapt the layout for all screen sizes.
3. **Performance**: Optimize data fetching and visual rendering to minimize delays.
4. **Clarity**: Use clear labels, color schemes, and tooltips for better understanding of the data.

## Challenges
- Handling inconsistent or incomplete data from the API.
- Ensuring cross-browser compatibility and responsive design.
- Managing large datasets efficiently in the browser.

## Future Enhancements
- Add geographic visualizations (e.g., maps).
- Introduce advanced filtering options for data exploration.
- Support multilingual capabilities (e.g., Malay and English).
- Implement real-time push updates using WebSockets or other technologies.
