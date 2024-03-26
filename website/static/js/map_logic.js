// Define a global variable to store cleaned data
let mapData;

anychart.onDocumentReady(function () {
    // Load the data
    anychart.data.loadJsonFile("/print_sample_data_all", function (data) {
        mapData = JSON.parse(data.cleaned_data_all);

        d3.json("./static/js/countries.geojson").then(function(geojson) {
            let geoData = geojson.features;
            //console.log(geoData)

            // Sum the number of jobs in each country and calculate sum salary
            let numJobs = {};
            let salariesUSD = {};
            let salariesGBP = {};

            mapData.forEach(function(job) {
                let country = job.company_location; 
                let USD = job.salary_in_usd; 
                let GBP = job.salary_in_gbp; 

                if (!numJobs[country]) {
                    numJobs[country] = 0;
                    salariesUSD[country] = 0;
                    salariesGBP[country] = 0;
                }
                numJobs[country]++;
                salariesUSD[country] += USD;
                salariesGBP[country] += GBP; 
            });

            // Save data in the right format for anychart
            let countryData = [];
            let avgUSD = {};
            let avgGBP = {};

            Object.keys(numJobs).forEach(function(country) {
            
            // calculate average salary in each country
            avgUSD[country] = salariesUSD[country] / numJobs[country];
            avgGBP[country] = salariesGBP[country] / numJobs[country];
         
            // Find the feature in geoData that matches the country name           
            let countryID = null;
            let feature = geoData.find(feature => feature.properties.ADMIN === country); 
            if (feature) {
                countryID = feature.properties.ISO_A2; 
            }
            countryData.push({ id: countryID, value: numJobs[country], name: country,
            salaryUSD: avgUSD[country], salaryGBP: avgGBP[country] });
            });       

            // Change US name so that it can be matched with anychart.maps.world and display the correct data on the tooltip
            for (let i = 0; i < countryData.length; i++) {
                if (countryData[i].name === "United States of America") { 
                    countryData[i].name = "United States"; 
                    break;
                }
            };

            // Connect the data with the map
            var chart = anychart.map(countryData);

            // Set the map data
            chart.geoData(anychart.maps.world);

            // Create choropleth series
            var series = chart.choropleth(countryData);

            // Define color scale ranges
            var ocs = anychart.scales.ordinalColor([
                { less: 100 },
                { from: 100, to: 199 },
                { from: 200, to: 299 },
                { from: 300, to: 399 },
                { from: 400, to: 499 },
                { from: 500, to: 599 },
                { greater: 600 }
            ]);

            // Set scale colors
            ocs.colors(["rgb(208,209,230)", "rgb(166,189,219)", "rgb(116,169,207)", "rgb(54,144,192)", "rgb(5,112,176)", "rgb(4,90,141)", "rgb(2,56,88)"]);       

            // Apply color scale to the series
            series.colorScale(ocs);

            // Set legend
            chart.colorRange().enabled(true);

            let colorRangeLegend = chart.legend();
            colorRangeLegend.enabled(true);
            colorRangeLegend.title("Number of data-related jobs advertised between 2020-2023");
            colorRangeLegend.position("bottom");
            colorRangeLegend.align("center");
            colorRangeLegend.title().fontSize(14); 
            colorRangeLegend.padding([10, 0, 0, 0]); // Top, Right, Bottom, Left

            // Disable legend items for the main series
            chart.legend().itemsFormatter(function() {
                return null;
            });
            
            // Improve tooltip
            series.tooltip()
            .useHtml(true)
            .format(function (data) {
                let country = data.name;
                let countryInfo = countryData.find(countryInfo => countryInfo.name === country);
                let salaryUSD = countryInfo.salaryUSD;
                let salaryGBP = countryInfo.salaryGBP;

                return ("<h5 style='font-size:14px; font-weight:400; margin: 0.2rem 0;'> Number of jobs: " + data.value + "</h5>Average salary (USD): $" +
                salaryUSD.toLocaleString('en-US', { maximumFractionDigits: 0 }) + "<br>Average salary (GBP): £" + salaryGBP.toLocaleString('en-US', { maximumFractionDigits: 0 }));
            });

            // Set the container id
            chart.container('mapContainer');

            // Draw the chart
            chart.draw();
        });
    });
});