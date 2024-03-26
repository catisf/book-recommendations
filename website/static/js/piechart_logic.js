document.addEventListener('DOMContentLoaded', () => {
    const companySizeBtn = document.getElementById('companySizeBtn');
    const workSettingBtn = document.getElementById('workSettingBtn');
    const yearSelect = document.getElementById('yearSelect'); 
    const ctx = document.getElementById('pieChart').getContext('2d');
    let myPieChart;

    
    function fetchDataAndRenderChart(criteria, selectedYear = 'all') {
       
        if (myPieChart) {
            myPieChart.destroy();
        }

        fetch('/print_sample_data_uk')
            .then(response => response.json())
            .then(data => {
                let cleanedData = JSON.parse(data.cleaned_data_uk);

                
                if (selectedYear !== 'all') {
                    cleanedData = cleanedData.filter(item => item.work_year === parseInt(selectedYear));
                }
                
                let chartData;
                if (criteria === 'companySize') {
                    const filteredData = cleanedData.filter(item => item.experience_level === 'Entry-level');
                    chartData = processDataForChart(filteredData, 'company_size');
                } else if (criteria === 'workSetting') {
                    const filteredData = cleanedData.filter(item => item.experience_level === 'Entry-level');
                    chartData = processDataForChart(filteredData, 'work_setting');
                }

                
                renderChart(chartData);
            })
            .catch(error => {
                console.error("Error fetching data: ", error);
            });
    }

    function processDataForChart(data, field) {
        const aggregation = {};
        data.forEach(item => {
            const key = item[field];
            if (!aggregation[key]) {
                aggregation[key] = 1;
            } else {
                aggregation[key]++;
            }
        });

        return {
            labels: Object.keys(aggregation),
            datasets: [{
                data: Object.values(aggregation),
                backgroundColor: ["rgb(208,209,230)","rgb(4,90,141)","rgb(166,189,219)","rgb(54,144,192)", "rgb(5,112,176)" ,"rgb(116,169,207)","rgb(2,56,88)"],
                hoverOffset: 10
            }]
        };
    }
    function renderChart(chartData) {
        myPieChart = new Chart(ctx, {
            type: 'pie',
            data: chartData,
            options: {
                responsive: true,
                plugins: {
                    legend: {
                        position: 'top',
                    },
                    title: {
                        display: true,
                        text: 'UK Data Analyst Jobs-Entry Level Distrubition',
                        font: {
                            size: 18
                        },
                        tooltip: { 
                            bodyFont: {
                                size: 18, 
                            },
                            titleFont: {
                                size: 20, 
                            }
                        }
                    }
                }

            }
        });
    }    

let lastSelectedCriteria = 'companySize'; 

companySizeBtn.addEventListener('click', () => {
    lastSelectedCriteria = 'companySize';
    fetchDataAndRenderChart(lastSelectedCriteria, yearSelect.value);
});

workSettingBtn.addEventListener('click', () => {
    lastSelectedCriteria = 'workSetting';
    fetchDataAndRenderChart(lastSelectedCriteria, yearSelect.value);
});

yearSelect.addEventListener('change', () => {
  
    fetchDataAndRenderChart(lastSelectedCriteria, yearSelect.value);
});

});
