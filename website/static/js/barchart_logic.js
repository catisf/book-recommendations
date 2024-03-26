// Define a global variable to store cleaned data
let cleanedData;

document.addEventListener('DOMContentLoaded', () => {
    // Fetch data from the /print_sample_data_uk route for the United Kingdom
    fetch('/print_sample_data_uk')
        .then(response => response.json())
        .then(data => {
            cleanedData = JSON.parse(data.cleaned_data_uk);

            // Get unique years from the data
            const uniqueYears = [...new Set(cleanedData.map(entry => entry.work_year))];
            uniqueYears.sort((a, b) => b - a);

            // Add "All Years" option to the year dropdown
            uniqueYears.unshift('All Years');

            // Populate the year dropdown
            const yearSelection = document.getElementById('yearSelection');
            if (yearSelection) {
                populateDropdown(yearSelection, uniqueYears);

                // Set up initial chart with the first year and default data type (job category)
                updateChart(cleanedData, uniqueYears[0], 'jobCategory', null);

                // Update chart when the year or category selection changes
                yearSelection.addEventListener('change', () => {
                    const selectedYear = yearSelection.value === 'All Years' ? null : parseInt(yearSelection.value);
                    const selectedCategory = getCategorySelection();
                    const dataType = getDataType();
                    updateChart(cleanedData, selectedYear, dataType, selectedCategory);
                });
            }

            // Populate the job category dropdown
            const categorySelection = document.getElementById('categorySelection');
            if (categorySelection) {
                const uniqueCategories = [...new Set(cleanedData.map(entry => entry.job_category))];
                populateDropdown(categorySelection, uniqueCategories);

                // Set up initial chart with the default year and job category
                const defaultYear = uniqueYears[0];
                const defaultCategory = getCategorySelection();
                const defaultDataType = getDataType();
                updateChart(cleanedData, defaultYear, defaultDataType, defaultCategory);

                // Update chart when the category selection changes
                categorySelection.addEventListener('change', () => {
                    const selectedYear = yearSelection.value === 'All Years' ? null : parseInt(yearSelection.value);
                    const selectedCategory = getCategorySelection();
                    const dataType = getDataType();
                    updateChart(cleanedData, selectedYear, dataType, selectedCategory);
                });
            }

            // Set up event listeners for the data type buttons
            document.getElementById('jobCategoryBtn').addEventListener('click', () => switchData('jobCategory'));
            document.getElementById('experienceLevelBtn').addEventListener('click', () => switchData('experienceLevel'));
            document.getElementById('jobTitleBtn').addEventListener('click', () => switchData('jobTitle'));
        });

    // After initializing the chart and dropdowns, add the 'show' class to elements
    document.querySelector('header').classList.add('show');
    document.querySelector('canvas').classList.add('show');
    document.querySelector('.year-dropdown-container').classList.add('show');
    document.querySelector('.switch-buttons').classList.add('show');
    document.querySelector('footer').classList.add('show');
});
// Function to get the selected category
function getCategorySelection() {
    const categorySelection = document.getElementById('categorySelection');
    return categorySelection ? categorySelection.value : null;
}

// Function to get the selected data type
function getDataType() {
    if (document.getElementById('jobCategoryBtn').classList.contains('active')) {
        return 'jobCategory';
    } else if (document.getElementById('experienceLevelBtn').classList.contains('active')) {
        return 'experienceLevel';
    } else if (document.getElementById('jobTitleBtn').classList.contains('active')) {
        return 'jobTitle';
    }
}

// Function to populate a dropdown with options
function populateDropdown(selectElement, options) {
    options.forEach(option => {
        const optionElement = document.createElement('option');
        optionElement.value = option;
        optionElement.textContent = option;
        selectElement.appendChild(optionElement);
    });
}

// Function to switch between job category, experience level, and job title
function switchData(dataType) {
    // Remove 'active' class from all buttons
    document.getElementById('jobCategoryBtn').classList.remove('active');
    document.getElementById('experienceLevelBtn').classList.remove('active');
    document.getElementById('jobTitleBtn').classList.remove('active');

    // Add 'active' class to the clicked button
    document.getElementById(`${dataType}Btn`).classList.add('active');

    // Get the selected year
    const selectedYear = yearSelection.value === 'All Years' ? null : parseInt(yearSelection.value);

    // Update the chart with the selected year and data type
    updateChart(cleanedData, selectedYear, dataType);
}

// Function to update the chart based on the selected year, data type, and category
function updateChart(cleanedData, selectedYear, dataType, selectedCategory) {
    let filteredData;

    if (selectedYear !== null) {
        filteredData = cleanedData.filter(entry => entry.work_year === selectedYear);
    } else {
        filteredData = cleanedData;
    }

    if (selectedCategory) {
        filteredData = filteredData.filter(entry => entry.job_category === selectedCategory);
    }

    let groupedData;

    if (dataType === 'jobCategory') {
        groupedData = groupDataByJobCategory(filteredData);
    } else if (dataType === 'experienceLevel') {
        groupedData = groupDataByExperienceLevel(filteredData);
    } else if (dataType === 'jobTitle') {
        groupedData = groupDataByJobTitle(filteredData);
    }

    const averageSalaries = calculateAverageSalaries(groupedData);
    const sortedSalaries = sortSalariesByAverage(averageSalaries);

    const labels = sortedSalaries.map(entry => entry.label);
    const averageSalariesData = sortedSalaries.map(entry => entry.averageSalary);

    const ctx = document.getElementById('DataJobChart').getContext('2d');
    destroyExistingChart();
    createNewChart(ctx, labels, averageSalariesData, dataType);
}

// Function to group data by job category
function groupDataByJobCategory(filteredData) {
    return filteredData.reduce((acc, entry) => {
        const label = entry.job_category;
        if (!acc[label]) {
            acc[label] = {
                totalSalary: entry.salary_in_gbp,
                count: 1
            };
        } else {
            acc[label].totalSalary += entry.salary_in_gbp;
            acc[label].count += 1;
        }
        return acc;
    }, {});
}

// Function to group data by experience level
function groupDataByExperienceLevel(filteredData) {
    return filteredData.reduce((acc, entry) => {
        const label = entry.experience_level;
        if (!acc[label]) {
            acc[label] = {
                totalSalary: entry.salary_in_gbp,
                count: 1
            };
        } else {
            acc[label].totalSalary += entry.salary_in_gbp;
            acc[label].count += 1;
        }
        return acc;
    }, {});
}

// Function to group data by job title
function groupDataByJobTitle(filteredData) {
    return filteredData.reduce((acc, entry) => {
        const label = entry.job_title;
        if (!acc[label]) {
            acc[label] = {
                totalSalary: entry.salary_in_gbp,
                count: 1
            };
        } else {
            acc[label].totalSalary += entry.salary_in_gbp;
            acc[label].count += 1;
        }
        return acc;
    }, {});
}

// Function to calculate average salary for each job category, experience level, or job title
function calculateAverageSalaries(groupedData) {
    return Object.keys(groupedData).map(label => ({
        label,
        averageSalary: groupedData[label].totalSalary / groupedData[label].count
    }));
}

// Function to sort salaries by average salary
function sortSalariesByAverage(averageSalaries) {
    return averageSalaries.sort((a, b) => b.averageSalary - a.averageSalary);
}

// Function to destroy an existing chart
function destroyExistingChart() {
    if (window.myChart) {
        window.myChart.destroy();
    }
}

// Function to create a new chart
function createNewChart(ctx, labels, averageSalariesData, dataType) {
    const xAxisTitle = getChartXAxisTitle(dataType);

    window.myChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: labels,
            datasets: [{
                label: 'Average Salary (GBP)',
                data: averageSalariesData,
                backgroundColor: 'rgba(75, 192, 192, 0.2)',
                borderColor: 'rgba(75, 192, 192, 1)',
                borderWidth: 1
            }]
        },
        options: {
            scales: {
                x: {
                    grid: {
                        display: true,
                        borderWidth: 0,
                        color: 'rgba(0,0,0,0)'
                    },
                    type: 'category',
                    title: {
                        display: true,
                        text: xAxisTitle,
                        font: {
                            weight: 'bold'
                        }
                    },
                    labels: labels,
                    ticks: {
                        font: {
                            weight: 'bold'
                        }
                    }
                },
                y: {
                    beginAtZero: true,
                    title: {
                        display: true,
                        text: 'Average Salary (GBP)',
                        font: {
                            weight: 'bold'
                        }
                    },
                    ticks: {
                        font: {
                            weight: 'bold'
                        }
                    },
                    grid: {
                        display: false
                    }
                }
            }
        }
    });
}

// Function to get the chart X-axis title based on the data type
function getChartXAxisTitle(dataType) {
    switch (dataType) {
        case 'jobCategory':
            return 'Job Category';
        case 'experienceLevel':
            return 'Experience Level';
        case 'jobTitle':
            return 'Job Title';
        default:
            return '';
    }
}
