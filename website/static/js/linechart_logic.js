document.addEventListener('DOMContentLoaded', function() {
    // Function to fetch data and update charts
    function fetchDataAndCharts() {
        // Fetch data from API
        fetch('/print_sample_data_uk')
            .then(response => response.json())
            .then(data => {
                // Extract salary and work year data
                const cleanedData = JSON.parse(data.cleaned_data_uk);
                
                // Filter data for the years 2020 to 2023
                const filteredData = cleanedData.filter(entry => entry.work_year >= 2020 && entry.work_year <= 2023);

                // Calculate average salary for each year
                const averageSalaries = [];
                for (let year = 2020; year <= 2023; year++) {
                    const salariesOfYear = filteredData.filter(entry => entry.work_year === year).map(entry => entry.salary_in_gbp);
                    const averageSalary = salariesOfYear.reduce((total, salary) => total + salary, 0) / salariesOfYear.length;
                    averageSalaries.push(averageSalary);
                }

                // Create labels for the years
                const years = Array.from({ length: 4 }, (_, i) => 2020 + i);

                // Create line chart for salary trend
                const salaryTrendCtx = document.getElementById('salaryTrendChart').getContext('2d');
                const salaryTrendChart = new Chart(salaryTrendCtx, {
                    type: 'line',
                    data: {
                        labels: years,
                        datasets: [{
                            label: 'Average Salary Trend (GBP)',
                            data: averageSalaries,
                            borderColor: 'rgba(75, 192, 192, 1)',
                            borderWidth: 2,
                            fill: false
                        }]
                    },
                    options: {
                        scales: {
                            x: {
                                title: {
                                    display: true,
                                    text: 'Year'
                                }
                            },
                            y: {
                                title: {
                                    display: true,
                                    text: 'Average Salary (GBP)'
                                }
                            }
                        }
                    }
                });

                // Extract job count and work year data
                // Filter data for the years 2020 to 2023
                const filteredDataForJobCount = cleanedData.filter(entry => entry.work_year >= 2020 && entry.work_year <= 2023);
                // Count job occurrences for each year
                const jobCounts = {};
                for (let year = 2020; year <= 2023; year++) {
                    const count = filteredDataForJobCount.filter(entry => entry.work_year === year).length;
                    jobCounts[year] = count;
                }

                // Create dataset for job count trend
                const jobCountData = years.map(year => jobCounts[year] || 0);

                // Create line chart for job count trend
                const jobCountCtx = document.getElementById('jobCountTrendChart').getContext('2d');
                const jobCountTrendChart = new Chart(jobCountCtx, {
                    type: 'line',
                    data: {
                        labels: years,
                        datasets: [{
                            label: 'Job Count Trend',
                            data: jobCountData,
                            borderColor: 'rgba(255, 99, 132, 1)',
                            borderWidth: 2,
                            fill: false
                        }]
                    },
                    options: {
                        scales: {
                            x: {
                                title: {
                                    display: true,
                                    text: 'Year',
                                }
                            },
                            y: {
                                title: {
                                    display: true,
                                    text: 'Job Count'
                                }
                            }
                        }
                    }
                });
                
                // Extract working setting and work year data
                // Filter data for the years 2020 to 2023
                const filteredDataForWorkSetting = cleanedData.filter(entry => entry.work_year >= 2020 && entry.work_year <= 2023);
                // Count occurrences of each working setting for each year
                const workSettingCounts = {};
                for (let year = 2020; year <= 2023; year++) {
                    workSettingCounts[year] = {};
                    const settingsOfYear = filteredDataForWorkSetting.filter(entry => entry.work_year === year).map(entry => entry.work_setting);
                    settingsOfYear.forEach(setting => {
                        if (workSettingCounts[year][setting]) {
                            workSettingCounts[year][setting]++;
                        } else {
                            workSettingCounts[year][setting] = 1;
                        }
                    });
                }

                // Create datasets for each working setting
                const datasets = [];
                const uniqueSettings = [...new Set(cleanedData.map(entry => entry.work_setting))];
                uniqueSettings.forEach(setting => {
                    const data = years.map(year => workSettingCounts[year][setting] || 0);
                    datasets.push({
                        label: `Work Setting Trend (${setting})`,
                        data: data,
                        borderColor: getRandomColor(),
                        borderWidth: 2,
                        fill: false
                    });
                });

                // Create line chart for work setting trend
                const workSettingTrendCtx = document.getElementById('workSettingTrendChart').getContext('2d');
                const workSettingTrendChart = new Chart(workSettingTrendCtx, {
                    type: 'line',
                    data: {
                        labels: years,
                        datasets: datasets
                    },
                    options: {
                        scales: {
                            x: {
                                title: {
                                    display: true,
                                    text: 'Year'
                                }
                            },
                            y: {
                                title: {
                                    display: true,
                                    text: 'Job Count'
                                }
                            }
                        }
                    }
                });
            })
            .catch(error => console.error('Error fetching data:', error));
    }

    // Call the function to fetch data and update charts
    fetchDataAndCharts();

    // Function to update chart based on selected radio button
    function updateChart() {
        const selectedChartType = document.querySelector('input[name="chartType"]:checked').value;
        const charts = ['salaryTrendChart', 'workSettingTrendChart', 'jobCountTrendChart'];

        // Hide all charts
        charts.forEach(chartId => {
            const chart = document.getElementById(chartId);
            chart.style.display = 'none';
        });

        // Show selected chart
        const selectedChart = document.getElementById(selectedChartType);
        selectedChart.style.display = 'block';
    }

    // Event listener for radio button change
    const radioButtons = document.querySelectorAll('input[name="chartType"]');
    radioButtons.forEach(button => {
        button.addEventListener('change', updateChart);
    });

    // Function to generate random color
    function getRandomColor() {
        const letters = '0123456789ABCDEF';
        let color = '#';
        for (let i = 0; i < 6; i++) {
            color += letters[Math.floor(Math.random() * 16)];
        }
        return color;
    }
});