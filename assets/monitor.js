var interval;
var chartCanvas = document.getElementById('recording-chart');
var thermoCanvas = document.getElementById('thermo-chart');
var sensorCanvas = document.getElementById('sensor-graph');
var sensor_chartCanvas = document.getElementById('sensormode-recording-chart')
const checkbox = document.getElementById("sensor-display-switch");
var recordChart;
var viewIsSensor;
var chartLabels = ['H2', 'CO', 'CO2', 'CH4', 'C6H6', 'C3H8', 'OH', 'LPG'];
const sensorNames = ['MQ2_H2', 'MQ2_H2_1', 'MQ2_H2_2', 'MQ4_H2', 'MQ4_H2_1', 'MQ4_H2_2', 'MQ6_H2', 'MQ6_H2_1', 'MQ6_H2_2', 'MQ7_H2', 'MQ7_H2_1', 'MQ7_H2_2', 'MQ8_H2', 'MQ8_H2_1', 'MQ8_H2_2', 
                     'MQ2_CO', 'MQ2_CO_1', 'MQ2_CO_2', 'MQ7_CO', 'MQ7_CO_1', 'MQ7_CO_2',
                     'MG811_CO2', 'MG811_CO2_1', 'MG811_CO2_2', 
                     'MQ2_CH4', 'MQ2_CH4_1', 'MQ2_CH4_2', 'MQ4_CH4', 'MQ4_CH4_1', 'MQ4_CH4_2', 'MQ9_CH4', 'MQ9_CH4_1', 'MQ9_CH4_2', 
                     'MQ3_C6H6', 'MQ3_C6H6_1', 'MQ3_C6H6_2',
                     'MQ2_C3H8', 'MQ2_C3H8_1', 'MQ2_C3H8_2', 
                     'MQ2_OH', 'MQ2_OH_1', 'MQ2_OH_2',
                     'MQ2_LPG', 'MQ2_LPG_1', 'MQ2_LPG_2', 'MQ9_LPG', 'MQ9_LPG_1', 'MQ9_LPG_2'];
// var chartLabels = ['MQ6_H2_1','MG811_CO2_2','MQ7_CO_1','MQ4_CH4_1','MQ3_C6H6_1','MQ2_C3H8_1','MQ3_OH_1','MQ2_LPG_1']
var chartDataSets = [];
var sensor_chartDataSets = [];
var recording;
var sensorProcessedChartData = [];
var gasProcessChartData = [];
var pause = true;
var recordingButton = document.getElementById('r-record');
var pauseButton = document.getElementById('r-pause');
var timeElapsed = document.getElementById('r-time-elapsed');
const test_tab = document.getElementById("test-btn");
const dataset_tab = document.getElementById("dataset-btn");
const custom_tab = document.getElementById("custom-btn");
var timeElapsedInterval;
var elapsed = 0;
var saveState = {
    type:"",
    file_name:""
};

function resetDataSets(){chartDataSets = [];for(i of chartLabels){chartDataSets.push({label: i, tension: 0, data: []});};for(i of sensorNames){sensor_chartDataSets.push({label: i, tension: 0, data: []});}}
resetDataSets();

chartCanvas.style.width = '400px';
chartCanvas.style.height = '341px';
sensor_chartCanvas.style.width = '400px';
sensor_chartCanvas.style.height = '341px';

recordChart = new Chart(chartCanvas, {
    type: 'line',
    data: {
        labels: [],
        datasets: chartDataSets
    },
    options: {
        responsive: true
    }
});  
sensormode_recordChart = new Chart(sensor_chartCanvas, {
    type: 'line',
    data: {
        labels: [],
        datasets: sensor_chartDataSets
    },
    options: {
        responsive: true,
        plugins: {
            legend: {
                display:true,
            }
        }
    }
}); 

var data = {
    labels: [],
    datasets: [
        {label: "Thermocouple 1",data: [],fill: false,borderColor: 'rgb(100, 192, 100)',tension: 0.1},
        {label: "Thermocouple 2",data: [],fill: false,borderColor: 'rgb(235, 202, 200)',tension: 0.1},
        {label: "Thermocouple 3",data: [],fill: false,borderColor: 'rgb(75, 192, 192)',tension: 0.1},
        {label: "Thermocouple 4",data: [],fill: false,borderColor: 'rgb(6, 71, 137)',tension: 0.1},
        {label: "Thermocouple 5",data: [],fill: false,borderColor: 'rgb(200, 0, 0)',tension: 0.1},
        {label: "Thermocouple 6",data: [],fill: false,borderColor: 'rgb(86, 98, 1)',tension: 0.1},
        {label: "Thermocouple 7",data: [],fill: false,borderColor: 'rgb(200, 200, 87)',tension: 0.1},
]
  };

thermoChart = new Chart(thermoCanvas, {
    type: 'line',
    data: data,
    options: {
        responsive: true
    }
});  
sensorChart = new Chart(sensorCanvas, {
    type: 'line',
    data: data,
    options: {
        responsive: true
    }
}); 

function updateSensorChart(){
    const chartSelector = document.getElementById('sensor-chartSelector');
    const selectedValue = chartSelector.value;
    
    sensor_name = valueData[selectedValue]

}

function updateChartData(newData, pos) {
    var thermoChartData = thermoChart.data.datasets[pos -1].data;

    thermoChartData.push(newData);
    if (thermoChartData.length > 50) {
        thermoChartData.shift();
    }
    thermoChart.data.labels = Array.from({ length: thermoChartData.length }, (_, i) => i);
    thermoChart.update();
}

function showDatasetsByLabels(chart, labelsToShow) {
    chart.data.datasets.forEach(dataset => {
      if (labelsToShow.includes(dataset.label)) {
        dataset.hidden = false;
      } else {
        dataset.hidden = true;
      }
    });
    chart.update();
  }  

recordingButton.addEventListener('click', ()=>{
    if(recording){stopRecord();}
    else{startRecord();}
});
pauseButton.addEventListener('click', ()=>{
    if (recording){
        pauseRecord()
        if (pause){
            pauseButton.textContent = "Resume"
        } else {
            pauseButton.textContent = "Pause"
        }
    }
})

function showDatasetsByLabels(chart, labelsToShow) {
    chart.data.datasets.forEach(dataset => {
      if (labelsToShow.includes(dataset.label)) {
        dataset.hidden = false;
      } else {
        dataset.hidden = true;
      }
    });
    chart.update();
}

function updateChart(){
    const chartSelector = document.getElementById('sensor-chartSelector');
    const selectedValue = chartSelector.value;

    sensor_name = valueData[selectedValue]
    sensor_name_obj = {
        "MQ2" : ['MQ2_H2_1', 'MQ2_H2_2', 'MQ2_CO_1', 'MQ2_CO_2', 'MQ2_CH4_1', 'MQ2_CH4_2', 'MQ2_C6H6', 'MQ2_C6H6_1', 'MQ2_C6H6_2','MQ2_C3H8', 'MQ2_C3H8_1', 'MQ2_C3H8_2', 'MQ2_LPG', 'MQ2_LPG_1', 'MQ2_LPG_2']
    }
    showDatasetsByLabels(sensormode_recordChart, [sensor_name + "_1"])
}

checkbox.addEventListener("change", function() {
  if (this.checked) {
    document.getElementById('recording-chart-container').style.display = "none"
    document.getElementById('sensormode-recording-chart-container').style.display = "flex"
  } else {
    document.getElementById('recording-chart-container').style.display = "flex"
    document.getElementById('sensormode-recording-chart-container').style.display = "none"
  }
});


function formatStopwatchTime(seconds) {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
  
    const formattedMinutes = String(minutes).padStart(2, '0');
    const formattedSeconds = String(remainingSeconds).padStart(2, '0');
  
    return `${formattedMinutes}:${formattedSeconds}`;
  }

function timerecord(timestamps){
    tr = [];
    dt = 0;
    for (v in timestamps) {
        vr = Math.round(v)
        tr.push(vr)
        dt += vr
    }
    const timeLabels = tr.map(timestamp => {
    const duration = moment.duration((timestamp - tr[0])*2, 'seconds');
    return duration.minutes() +':'+ duration.seconds();
  });
  return timeLabels
}

function startRecord(){
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            recording = true;
            pause = false;
            console.log("recording = " + recording + " " + "pause = " + pause)
            animating = true;
            interval = listenInterval((data)=>{recordChartUpdate(data, data.t);if(elapsed>=180000){stopRecord();}});
            allow_animate = false;
            recordingButton.textContent = 'Stop Record';
            resetDataSets();
            recordChart.data.labels = [];
            recordChart.data.datasets = chartDataSets;
            recordChart.update();
            sensormode_recordChart.data.labels = [];
            sensormode_recordChart.data.datasets = sensor_chartDataSets;
            sensormode_recordChart.update();
            timeElapsedInterval = writeElapsedTime(timeElapsed);
        }
    }
    xhttp.open("GET", "http://127.0.0.1/record/start", true);
    xhttp.send();
}

function nutshell(method){var xhttp = new XMLHttpRequest();xhttp.open("GET", "http://127.0.0.1/record/" + method, true);xhttp.send();}
function pauseRecord(){pause=!pause;nutshell(pause?"pause":"resume");}

function recordChartUpdate(data, time){
    if (!pause) {
        recordData = {
            "H2" : parseFloat((data.MQ2_H2_1+data.MQ2_H2_2+data.MQ4_H2_1+data.MQ4_H2_2+data.MQ6_H2_1+data.MQ6_H2_2+data.MQ7_H2_1+data.MQ7_H2_2+data.MQ8_H2_1+data.MQ8_H2_2)/10).toFixed(0),
            "CO" : parseFloat((data.MQ2_CO_1+data.MQ2_CO_2+data.MQ7_CO_1+data.MQ7_CO_2)/4).toFixed(0),
            "CO2" : parseFloat((data.MG811_CO2_1+data.MG811_CO2_2)/2).toFixed(0),
            "CH4" : parseFloat((data.MQ2_CH4_1+data.MQ2_CH4_2+data.MQ4_CH4_1+data.MQ4_CH4_2+data.MQ9_CH4_1+data.MQ9_CH4_2)/6).toFixed(0),
            "C6H6" : parseFloat((data.MQ3_C6H6_1+data.MQ3_C6H6_2)/2).toFixed(0),
            "C3H8" : parseFloat((data.MQ2_C3H8_1+data.MQ2_C3H8_2)/2).toFixed(0),
            "OH" : parseFloat((data.MQ2_OH_1+data.MQ2_OH_2)/2).toFixed(0),
            "LPG" : parseFloat((data.MQ2_LPG_1+data.MQ2_LPG_2+data.MQ9_LPG_1+data.MQ9_LPG_2)/4).toFixed(0),
        }
        recordChart.data.labels.push(timerecord(parseInt(time)));
        recordChart.data.datasets.forEach((dataset)=>{
            dataset.data.push(recordData[dataset.label]);
        });
        recordChart.update();

        sensormode_recordChart.data.labels.push(timerecord(parseInt(time)));
        sensormode_recordChart.data.datasets.forEach((dataset)=>{
            if (["MQ2_H2", "MQ4_H2", "MQ6_H2", "MQ7_H2", "MQ8_H2", "MQ2_CO", "MQ7_CO", "MG811_CO2", "MQ2_CH4", "MQ4_CH4", "MQ9_CH4","MQ3_C6H6", "MQ2_C3H8","MQ2_OH","MQ2_LPG","MQ9_LPG"].includes(dataset)){
                dataset.data.push(parseFloat((data[dataset+"_1"]+data[dataset+"_2"])/2));
            }
            dataset.data.push(data[dataset.label]);
        });
        sensormode_recordChart.update();
    }
}

function switchTab(tabName) {
    const tabs = ["test-tab", "dataset-tab", "custom-tab"];
    tabs.forEach(id => {
      const element = document.getElementById(id);
      element.style.display = id === tabName ? "block" : "none";
      element.style.borderBottom = id === tabName ? "1px solid black" : "0px solid black";
      element.style.color = id === tabName ? "black" : "gray";
    });
  
    saveState.type = tabName.replace("-tab", "");
  }

function saveModal(method){
    saveState.file_name = ""
    switch (method) {
        case "show-modal":
            document.getElementById("r-save-modal").style.display = "block";
            saveModal("test-tab");
            break;
      
        case "hide-modal":
            document.getElementById("r-save-modal").style.display = "none";
            animating = false;
            allow_animate = true;
            recordingButton.textContent = 'Record';
            break;
        
        case "confirm":
            if (saveState.type === "custom") {
                const fnValue = document.getElementById("fn-val").value || "test";
                saveState.file_name = fnValue;
            } else if (saveState.type === 'dataset') {
                const selectedValue = document.getElementById('chartSelector').value;
                const ds_id = document.getElementById("id-val").value || "";
                saveState.file_name = selectedValue + (ds_id ? "_" + ds_id : "");
            } else if (saveState.type === 'test') {
                saveState.file_name = "test";
            }
        
            const xhttp = new XMLHttpRequest();
            xhttp.onreadystatechange = function() {
                if (this.readyState === 4 && this.status === 200) {
                animating = false;
                allow_animate = true;
                recordingButton.textContent = 'Record';
                saveModal("hide-modal");
                alert('Saved as ' + xhttp.responseText);
                }
            };
            xhttp.open("GET", "http://127.0.0.1/record/stop?name=" + saveState.file_name, true);
            xhttp.send();
            break;
        
        case "test-tab":
        case "dataset-tab":
        case "custom-tab":
            switchTab(method);
            break;
      }
}

function stopRecord(){
    recording = false;
    pause = true;
    Timer("reset");
    nutshell("pause")
    clearInterval(interval);
    clearInterval(timeElapsedInterval);
    saveModal("show-modal")
}

function updateClassText(className, text){
    for(i of document.getElementsByClassName(className)){
        i.textContent = text;
    }
}

setInterval(()=>Timer("add"), 1000)

function Timer(method){
    if (method == "add") {
        if (!pause) {
            elapsed += 1000
            console.log(elapsed)
        }
    } else if (method == "reset"){
        elapsed = 0
    }
}

function writeElapsedTime(text){
    return setInterval(()=>{
        var swt = elapsed/1000
        var s = swt%60;
        if(s.toString().length == 1){
            s = '0' + s.toString();
        }
        m = Math.floor(swt/60)
        if(m.toString().length == 1){
            m = '0' + m.toString();
        }
        text.textContent = m + ':' + s;
    }, 100);
}

function startMonitor(){
    if(monitor){return;}
    monitor = true;
    interval = listenInterval()
}

function stopMonitor(){
    if(monitor){
        monitor = false;
        clearInterval(interval);
    }
}

function temperatureToColor(value, minValue, maxValue) {
    value = Math.min(Math.max(value, minValue), maxValue);
    
    // Calculate the normalized value within the range
    const normalizedValue = (value - minValue) / (maxValue - minValue);
    
    // Interpolate between white (255, 255, 255) and black (0, 0, 0) using the normalized value
    const r = Math.round(255 * (1 - normalizedValue));
    const g = Math.round(255 * (1 - normalizedValue));
    const b = Math.round(255 * (1 - normalizedValue));
    
    return `rgb(${r}, ${g}, ${b})`;
}
  
  function getContrastColor(rgbColor) {
    const match = rgbColor.match(/\d+/g);
    const r = parseInt(match[0], 10);
    const g = parseInt(match[1], 10);
    const b = parseInt(match[2], 10);
    const brightness = (r * 299 + g * 587 + b * 114) / 1000;
    return brightness >= 128 ? 'rgb(0, 0, 0)' : 'rgb(255, 255, 255)';
}

  function humidToColor(value) {
    value = Math.min(Math.max(value, 0), 100);
    const normalizedValue = (value - 0) / (100 - 0);
    const r = Math.round(255 * (1 - normalizedValue));
    const g = Math.round(255 * (1 - normalizedValue));
    const b = Math.round(255 * (1 - normalizedValue));
    
    return `rgb(${r}, ${g}, ${b})`;
}

function listenInterval(onUpdate){
    return setInterval(()=>{
        var xhttp = new XMLHttpRequest();
        xhttp.onreadystatechange = function() {
            if (this.readyState == 4 && this.status == 200) {
                data = JSON.parse(xhttp.responseText);
                for(i=1;i<8;i++){
                if (data['Thermocouple_1']){
                    updateChartData(data['Thermocouple_' + i], i)}
                }
                updateClassText('m-h2', parseFloat((data.MQ2_H2_1+data.MQ2_H2_2+data.MQ4_H2_1+data.MQ4_H2_2+data.MQ6_H2_1+data.MQ6_H2_2+data.MQ7_H2_1+data.MQ7_H2_2+data.MQ8_H2_1+data.MQ8_H2_2)/10).toFixed(0));
                updateClassText('m-co', parseFloat((data.MQ2_CO_1+data.MQ2_CO_2+data.MQ7_CO_1+data.MQ7_CO_2)/4).toFixed(0));
                updateClassText('m-co2', parseFloat((data.MG811_CO2_1+data.MG811_CO2_2)/2).toFixed(0));
                updateClassText('m-ch4', parseFloat((data.MQ2_CH4_1+data.MQ2_CH4_2+data.MQ4_CH4_1+data.MQ4_CH4_2+data.MQ9_CH4_1+data.MQ9_CH4_2)/6).toFixed(0));
                updateClassText('m-c6h6', parseFloat((data.MQ3_C6H6_1+data.MQ3_C6H6_2)/2).toFixed(0));
                updateClassText('m-c3h8', parseFloat((data.MQ2_C3H8_1+data.MQ2_C3H8_2)/2).toFixed(0));
                updateClassText('m-oh', parseFloat((data.MQ2_OH_1+data.MQ2_OH_2)/2).toFixed(0));
                updateClassText('m-lpg', parseFloat((data.MQ2_LPG_1+data.MQ2_LPG_2+data.MQ9_LPG_1+data.MQ9_LPG_2)/4).toFixed(0));
                updateClassText('m-humid', parseFloat(data.DHT22_H).toFixed(0));
                updateClassText('m-temp', parseFloat(data.DHT22_T).toFixed(0));
                humidcolor = humidToColor(parseFloat(data.DHT22_H).toFixed(0));
                tempcolor = temperatureToColor(parseFloat(data.DHT22_T).toFixed(0), 1, 100);
                document.getElementById("temp").style.backgroundColor = tempcolor;
                document.getElementById("humid").style.backgroundColor = humidcolor;
                document.getElementById("temp").style.color = getContrastColor(tempcolor);
                document.getElementById("humid").style.color = getContrastColor(humidcolor);
                if(onUpdate!=null){onUpdate(data);}
            }
        };
        xhttp.open("GET", "http://127.0.0.1/data", true);
        xhttp.send();
    }, 2500);
}