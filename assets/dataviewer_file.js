// WE HATE CONST

var modal = document.getElementById("details");
var xbutton = document.getElementsByClassName("close")[0];
var modal_header = document.getElementById("modal_header");

var sensor_exist = false;
var sensor_exist_a = false;
var sensor_exist_b = false;
var open_modal = "none";
var chart = null
// var chart = null;

try{
    console.log(data.data[0]['MQ2_H2_1'])
    sensor_exist_a = true;
    console.log(sensor_exist_a)
    // sensor_exist = true;
} catch (err) {
    try {
        console.log(data.data['0']['hasSensorValue'] + "and" + data.data['0']['H2'])
        sensor_exist_b = true
    } catch (err) {
        sensor_exist = false;
    }
}

// if (data.data[0]['MQ2_H2_1']){
//     sensor_exist = true;
// } else {
//     sensor_exist = false;
// }

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
    const duration = moment.duration((timestamp - tr[0])*8, 'seconds');
    return duration.minutes() +':'+ duration.seconds();
  });
  return timeLabels
}

function sensorTable(amt, sensorNames) {
    for(i=1; i<(amt+1); i++) {
        if (amt === 5) {
            document.getElementById("sensor_"+(i)+"1").style.display = "table-row";
            document.getElementById("sensor_"+(i)+"2").style.display = "table-row";
            document.getElementById("sensor_"+(i)+"3").style.display = "none";
        } else if (amt < 5){
            document.getElementById("sensor_"+(i)+"1").style.display = "table-row";
            document.getElementById("sensor_"+(i)+"2").style.display = "table-row";
            document.getElementById("sensor_"+(i)+"3").style.display = "none";
            for(j=amt+1;j<6;j++){
                document.getElementById("sensor_"+(j)+"1").style.display = "none";
                document.getElementById("sensor_"+(j)+"2").style.display = "none";
                document.getElementById("sensor_"+(j)+"3").style.display = "none";
            }
        }
        document.getElementById("sensor_"+(i)+"3").style.display = "none";
        document.getElementById("sensor_"+i+"_name").textContent = sensorNames[-1+i] 
    }  
    for(i=1;i<6;i++) {
        document.getElementById("sensor_"+ i +"_name").rowSpan = "2"
    }
}

var valueData = {
    data1: "MQ2",
    data2: "MQ4",
    data3: "MQ6",
    data4: "MQ7",
    data5: "MQ8"
};

function updateChart(){
    const chartSelector = document.getElementById('chartSelector');
    const selectedValue = chartSelector.value;

    sensor_name = valueData[selectedValue]
    gas_name = document.getElementById("modal_header").textContent

    document.getElementById('legend_1-btn').textContent = sensor_name + "_1"
    document.getElementById('legend_2-btn').textContent = sensor_name + "_2"

    var gdarray = []
    var glarray = []
    for(i=1;i<3;i++){
        gd = [];
        gl = [];
        dt = 0;
    for(v of data.data){
        vr = Math.round(v[sensor_name+"_"+open_modal+"_"+i]);
        gd.push(vr);
        gl.push(v.t);
        dt += vr;
    }
    gdarray[i-1] = gd
    glarray[i-1] = gl
}
    if (chart){
        chart.destroy()
    }
    gdaverage = [];
    dt = 0;
    for(v of data.data){
        vr = Math.round((v[sensor_name+"_"+open_modal+"_"+"1"]+v[sensor_name+"_"+open_modal+"_"+"2"])/2);
        gdaverage.push(vr);
        dt += vr;
    }
    // gdaverage = (gdarray[0]+gdarray[1])/2
    console.log(gdaverage)
    chart = new Chart(
        document.getElementById('sensor-graph'), 
        {
            type: 'line', 
            data: {
                labels:timerecord(glarray[0]),
                datasets: [ 
                    {label:sensor_name + "_1", tension:0, data: gdarray[0]},
                    {label:sensor_name + "_2", tension:0, data: gdarray[1]},
                    {label:"Average", tension:0, data: gdaverage}
                ]
            },
            options: {
                plugins: {
                    legend: {
                        display: false,
                        labels: {
                            boxWidth: 40,
                            boxHeight:30,
                            padding: 20   // Adjust the padding around the legend labels
                        }
                    }
                }
            }
        }
    );
    // chart.data.datasets.data = gdarray[0]
}

// for myself that is wondering why dont i use for loop for efficiency
// its because this is a fucking onclick event listener and for loops cant continously listen events.

document.getElementById("graph-btn").onclick = function() {
    document.getElementById("graph-btn").classList.add("active")
    document.getElementById("overview-btn").classList.remove("active")
    document.getElementById("sensor_details").style.display = "block";
    document.getElementById("overview").style.display = "none";
    sensor_name = document.getElementById("sensor_1_name").textContent
    gas_name = document.getElementById("modal_header").textContent
    var gdarray = []
    var glarray = []
    for(i=1;i<3;i++){
        gd = [];
        gl = [];
        dt = 0;
    for(v of data.data){
        vr = Math.round(v[sensor_name+"_"+open_modal+"_"+i]);
        gd.push(vr);
        gl.push(v.t);
        dt += vr;
    }
    gdarray[i-1] = gd
    glarray[i-1] = gl
}
    if (chart){
        chart.destroy()
    }
    gdaverage = [];
    dt = 0;
    for(v of data.data){
        vr = Math.round((v[sensor_name+"_"+open_modal+"_"+"1"]+v[sensor_name+"_"+open_modal+"_"+"2"])/2);
        gdaverage.push(vr);
        dt += vr;
    }
    // gdaverage = (gdarray[0]+gdarray[1])/2
    console.log(gdaverage)
    chart = new Chart(
        document.getElementById('sensor-graph'), 
        {
            type: 'line', 
            data: {
                labels:timerecord(glarray[0]),
                datasets: [ 
                    {label:sensor_name + "_1", tension:0, data: gdarray[0]},
                    {label:sensor_name + "_2", tension:0, data: gdarray[1]},
                    {label:"Average", tension:0, data: gdaverage}
                ]
            },
            options: {
                plugins: {
                    legend: {
                        display: false,
                        labels: {
                            boxWidth: 40,
                            boxHeight:30,
                            padding: 20   // Adjust the padding around the legend labels
                        }
                    }
                }
            }
        }
    );
    // chart.data.datasets.data = gdarray[0]
}

legend_1 = true
legend_2 = true
legend_avg = true

function findAvg() {
    sensor_name = document.getElementById("sensor_1_name").textContent
    gdaverage = []
    if (legend_1 === true && legend_2 === true) {
        for(v of data.data){
            vr = Math.round((v[sensor_name+"_"+open_modal+"_"+"1"]+v[sensor_name+"_"+open_modal+"_"+"2"])/2);
            gdaverage.push(vr);
            dt += vr;
        }
    } else if (legend_1 === true && legend_2 === false) {
        for(v of data.data){
            vr = Math.round(v[sensor_name+"_"+open_modal+"_"+"1"]);
            gdaverage.push(vr);
            dt += vr;
        }
    } else if (legend_1 === false && legend_2 === true) {
        for(v of data.data){
            vr = Math.round(v[sensor_name+"_"+open_modal+"_"+"2"]);
            gdaverage.push(vr);
            dt += vr;
        }
    } else {
        gdaverage = null;
    }
    return gdaverage
}

document.getElementById("legend_1-btn").onclick = function() {
    chart.setDatasetVisibility(0, !chart.isDatasetVisible(0));
    if (legend_1) {
        document.getElementById("legend_1-btn").style.color = "#36a2eb"
        document.getElementById("legend_1-btn").style.backgroundColor = "#fff"
        legend_1 = false
    } else if (!legend_1) {
        document.getElementById("legend_1-btn").style.color = "#fff"
        document.getElementById("legend_1-btn").style.backgroundColor = "#36a2eb"
        legend_1 = true
    }
    chart.data.datasets[2].data = findAvg()
    chart.update()
}

document.getElementById("legend_2-btn").onclick = function() {
    chart.setDatasetVisibility(1, !chart.isDatasetVisible(1));
    chart.update()
    if (legend_2) {
        document.getElementById("legend_2-btn").style.color = "#ff6384"
        document.getElementById("legend_2-btn").style.backgroundColor = "#fff"
        legend_2 = false
    } else if (!legend_2) {
        document.getElementById("legend_2-btn").style.color = "#fff"
        document.getElementById("legend_2-btn").style.backgroundColor = "#ff6384"
        legend_2 = true
    }
    chart.data.datasets[2].data = findAvg()
    chart.update()
}

document.getElementById("legend_avg-btn").onclick = function() {
    chart.setDatasetVisibility(2, !chart.isDatasetVisible(2));
    chart.update()
    if (legend_avg) {
        document.getElementById("legend_avg-btn").style.color = "#ffcd56"
        document.getElementById("legend_avg-btn").style.backgroundColor = "#fff"
        legend_avg = false
    } else if (!legend_avg) {
        document.getElementById("legend_avg-btn").style.color = "#fff"
        document.getElementById("legend_avg-btn").style.backgroundColor = "#ffcd56"
        legend_avg = true
    }
}

document.getElementById("overview-btn").onclick = function() {
    document.getElementById("sensor_details").style.display = "none";
    document.getElementById("overview").style.display = "block";
    document.getElementById("graph-btn").classList.remove("active")
    document.getElementById("overview-btn").classList.add("active")
}

// document.getElementById("close-sensor").onclick = function() {
//     document.getElementById("sensor_details").style.display = "none";
// }

document.getElementById("h2_div").onclick = function() {
    const optionsToDisable = [];
    const dropdown = document.getElementById('chartSelector');
    valueData = {
        data1: "MQ2",
        data2: "MQ4",
        data3: "MQ6",
        data4: "MQ7",
        data5: "MQ8"
    };
    document.getElementById("data1").textContent = "MQ2"
    document.getElementById("data2").textContent = "MQ4"
    document.getElementById("data3").textContent = "MQ6"
    document.getElementById("data4").textContent = "MQ7"
    document.getElementById("data5").textContent = "MQ8"
    for (const option of dropdown.options) {
        if (optionsToDisable.includes(option.value)) {
            option.disabled = true;
        } else {
            option.disabled = false;  
        }
    }
    open_modal = "H2"
    modal.style.display = "block";
    modal_header.innerText="H2 (Hydrogen)"
    const placeholders = ['11', '12', '13', '21', '22', '23', '31', '32', '33', '41', '42', '43', '51', '52', '53']
    const mq_sensor = {
        "MQ2_H2_1":"1",
        "MQ2_H2_2":"2",
        "MQ4_H2_1":"1",
        "MQ4_H2_2":"2",
        "MQ6_H2_1":"1",
        "MQ6_H2_2":"2",
        "MQ7_H2_1":"1",
        "MQ7_H2_2":"2",
        "MQ8_H2_1":"1",
        "MQ8_H2_2":"2",
    }
    const mq_sensor_q = {
        "MQ2_H2_1":"1",
        "MQ2_H2_2":"1",
        "MQ4_H2_1":"2",
        "MQ4_H2_2":"2",
        "MQ6_H2_1":"3",
        "MQ6_H2_2":"3",
        "MQ7_H2_1":"4",
        "MQ7_H2_2":"4",
        "MQ8_H2_1":"5",
        "MQ8_H2_2":"5",
    }
    if (sensor_exist_a){
        start = (data.data[0]["MQ2_H2_1"] + data.data[0]["MQ2_H2_2"] + data.data[0]["MQ4_H2_1"] + data.data[0]["MQ4_H2_2"] + data.data[0]["MQ6_H2_1"] + data.data[0]["MQ6_H2_2"] + data.data[0]["MQ7_H2_1"] + data.data[0]["MQ7_H2_2"] + data.data[0]["MQ8_H2_1"] + data.data[0]["MQ8_H2_2"]) / 10
        end =(data.data[data.data.length-1]["MQ2_H2_1"] + data.data[data.data.length-1]["MQ2_H2_2"] + data.data[data.data.length-1]["MQ4_H2_1"] + data.data[data.data.length-1]["MQ4_H2_2"] + data.data[data.data.length-1]["MQ6_H2_1"] + data.data[data.data.length-1]["MQ6_H2_2"] + data.data[data.data.length-1]["MQ7_H2_1"] + data.data[data.data.length-1]["MQ7_H2_2"] + data.data[data.data.length-1]["MQ8_H2_1"] + data.data[data.data.length-1]["MQ8_H2_2"]) / 10
        document.getElementById("modal_start").textContent = start.toFixed(0);
        document.getElementById("modal_end").textContent = end.toFixed(0);
        gd = [];
        dt = 0;
        for(v of data.data){
            vr = Math.round((v["MQ2_H2_1"] + v["MQ2_H2_2"] + v["MQ4_H2_1"] + v["MQ4_H2_2"] + v["MQ6_H2_1"] + v["MQ6_H2_2"] + v["MQ7_H2_1"] + v["MQ7_H2_2"] + v["MQ8_H2_1"] + v["MQ8_H2_2"]) / 10);
            gd.push(vr);
            dt += vr;
        }
    for(i of ['MQ2_H2_1', 'MQ2_H2_2','MQ4_H2_1', 'MQ4_H2_2','MQ6_H2_1', 'MQ6_H2_2','MQ7_H2_1', 'MQ7_H2_2','MQ8_H2_1', 'MQ8_H2_2']){
            gs = []
            ds = 0;
            for(v of data.data){
                vr = Math.round(v[i]);
                gs.push(vr);
                ds += vr;
            }
            document.getElementById(mq_sensor_q[i]+mq_sensor[i]+'_average').textContent = Math.round(ds/gs.length);
            document.getElementById(mq_sensor_q[i]+mq_sensor[i]+'_low').textContent = Math.min(...gs)
            document.getElementById(mq_sensor_q[i]+mq_sensor[i]+'_high').textContent = Math.max(...gs)
                // document.getElementById(i+mq_sensor[i]+'_average').textContent = Math.round(ds/gs.length);
    }
    } else if (sensor_exist_b) {
        document.getElementById("modal_start").textContent = data.data[0]['H2'].toFixed(0);
        document.getElementById("modal_end").textContent = data.data[data.data.length-1]['H2'].toFixed(0);
        gd = [];
        dt = 0;
        for(v of data.data){
            vr = Math.round(v['H2']);
            gd.push(vr);
            dt += vr;
        }
    for(i of ['MQ2_H2_1', 'MQ2_H2_2', 'MQ2_H2_3', 'MQ4_H2_1', 'MQ4_H2_2', 'MQ4_H2_3', 'MQ6_H2_1', 'MQ6_H2_2', 'MQ6_H2_3', 'MQ7_H2_1', 'MQ7_H2_2', 'MQ7_H2_3', 'MQ8_H2_1', 'MQ8_H2_2', 'MQ8_H2_3']){
            gs = []
            ds = 0;
            for(v of data.data){
                vr = Math.round(v[i]);
                gs.push(vr);
                ds += vr;
            }
            for(i=0;i<15;i++){
                document.getElementById(placeholders[0+i]+'_average').textContent = Math.round(ds/gs.length);
                // console.log(gd)
                // console.log(Math.min(...gs))
                // console.log(Math.max(...gs))
                document.getElementById(placeholders[0+i]+'_low').textContent = Math.min(...gs)
                document.getElementById(placeholders[0+i]+'_high').textContent = Math.max(...gs)
                document.getElementById(placeholders[0+i]+'_average').textContent = Math.round(ds/gs.length);
            }
            
    }}
    console.log(sensor_exist)
    console.log(sensor_exist_a)
    console.log(sensor_exist_b)
    document.getElementById('modal_avg').textContent = Math.round(dt/gd.length);
    document.getElementById("modal_low").textContent = Math.min(...gd)
    document.getElementById("modal_high").textContent = Math.max(...gd)
    
    if (sensor_exist){
        document.getElementById("table").style.display = "table";
        const h2_sensors = ['MQ2', 'MQ4', 'MQ6', 'MQ7', 'MQ8']
        for(i=1; i<6; i++) {
            for(j=1; j<4; j++){
                document.getElementById("sensor_"+i+j).style.display = "table-row";
                }
            document.getElementById("sensor_"+i+"_name").textContent = h2_sensors[-1+i]
        }
    } else if (sensor_exist_a){
        document.getElementById("table").style.display = "table";
        for(i=1;i<6;i++) {
            document.getElementById("sensor_"+ i +"_name").rowSpan = "2"
        }
        document.getElementById("sensor_13").style.display = "none"
        const h2_sensors = ['MQ2', 'MQ4', 'MQ6', 'MQ7', 'MQ8']
        sensorTable(5, h2_sensors)
    } else {
        document.getElementById("table").style.display = "none";
        document.getElementById("error_text").style.display = "block";
    }
}

document.getElementById("co2_div").onclick = function() {
    const optionsToDisable = ["data2", "data3", "data4", "data5"];
    const dropdown = document.getElementById('chartSelector');
    valueData = {
        data1: "MG811",
    };
    document.getElementById("data1").textContent = "MG811"
    for (const option of dropdown.options) {
        if (optionsToDisable.includes(option.value)) {
            option.disabled = true;
        } else {
            option.disabled = false;  
        }
    }
    modal.style.display = "block";
    open_modal = "CO2"
    modal_header.innerText="CO2 (Carbon Dioxide)"
    const placeholders = ['11', '12', '13']
    const mq_sensor = {
        "MG811_CO2_1":"1",
        "MG811_CO2_2":"2"
    }

    if (sensor_exist_a){
        start = (data.data[0]["MG811_CO2_1"] + data.data[0]["MG811_CO2_2"]) / 2
        end = (data.data[data.data.length-1]["MG811_CO2_1"] + data.data[data.data.length-1]["MG811_CO2_2"]) / 2
        document.getElementById("modal_start").textContent = start.toFixed(0);
        document.getElementById("modal_end").textContent = end.toFixed(0);
        gd = [];
        dt = 0;
        for(v of data.data){
            vr = Math.round((v['MG811_CO2_1']+v['MG811_CO2_2'])/2);
            gd.push(vr);
            dt += vr;
        }
    for(i of ['MG811_CO2_1', 'MG811_CO2_2']){
            gs = []
            ds = 0;
            for(v of data.data){
                vr = Math.round(v[i]);
                gs.push(vr);
                ds += vr;
            }
            document.getElementById('1'+mq_sensor[i]+'_average').textContent = Math.round(ds/gs.length);
            document.getElementById('1'+mq_sensor[i]+'_low').textContent = Math.min(...gs)
            document.getElementById('1'+mq_sensor[i]+'_high').textContent = Math.max(...gs)
            document.getElementById('1'+mq_sensor[i]+'_average').textContent = Math.round(ds/gs.length);
            
    }
    } else{
    document.getElementById("modal_start").textContent = data.data[0]['CO2'].toFixed(0);
    document.getElementById("modal_end").textContent = data.data[data.data.length-1]['CO2'].toFixed(0);
    gd = [];
    dt = 0;
    for(v of data.data){
        vr = Math.round(v['CO2']);
        gd.push(vr);
        dt += vr;
    }
    for(i of ['MG811_CO2_1', 'MG811_CO2_2', 'MG811_CO2_3']){
        gs = []
        ds = 0;
        for(v of data.data){
            vr = Math.round(v[i]);
            gs.push(vr);
            ds += vr;
        }
        for(i=0;i<3;i++){
            document.getElementById(placeholders[0+i]+'_average').textContent = Math.round(ds/gs.length);
            document.getElementById(placeholders[0+i]+'_low').textContent = Math.min(...gs)
            document.getElementById(placeholders[0+i]+'_high').textContent = Math.max(...gs)
        }
    }
}
    document.getElementById('modal_avg').textContent = Math.round(dt/gd.length);
    document.getElementById("modal_low").textContent = Math.min(...gd)
    document.getElementById("modal_high").textContent = Math.max(...gd)
    for(i=1; i<6; i++) {
        if(i<2){
            for(j=1; j<4; j++){
            document.getElementById("sensor_"+i+j).style.display = "table-row";
            }
        } else{
            for(j=1; j<4; j++){
            document.getElementById("sensor_"+i+j).style.display = "none";
            }
        }
    }
    document.getElementById("sensor_1_name").textContent = "MG811"
    document.getElementById("sensor_13").style.display = "none";
}

document.getElementById("co_div").onclick = function() {
    const optionsToDisable = ['data3', 'data4', 'data5'];
    const dropdown = document.getElementById('chartSelector');
    valueData = {
        data1: "MQ2",
        data2: "MQ7",
    };
    document.getElementById("data1").textContent = "MQ2"
    document.getElementById("data2").textContent = "MQ7"
    for (const option of dropdown.options) {
        if (optionsToDisable.includes(option.value)) {
            option.disabled = true;
        } else {
            option.disabled = false;  
        }
    }
    modal.style.display = "block";
    modal_header.innerText="CO (Carbon Monoxide)";
    open_modal = "CO"
    const mq_sensor = {
        "MQ2_CO_1":"1",
        "MQ2_CO_2":"2",
        "MQ7_CO_1":"1",
        "MQ7_CO_2":"2",
    }
    const mq_sensor_q = {
        "MQ2_CO_1":"1",
        "MQ2_CO_2":"1",
        "MQ7_CO_1":"2",
        "MQ7_CO_2":"2",
    }
    const placeholders = ['11', '12', '13', '21', '22', '23', '31', '32', '33']
    if (sensor_exist_a){
        start = (data.data[0]["MQ2_CO_1"] + data.data[0]["MQ2_CO_2"] + data.data[0]["MQ7_CO_1"] + data.data[0]["MQ7_CO_2"]) / 4
        end = (data.data[data.data.length-1]["MQ2_CO_1"] + data.data[data.data.length-1]["MQ2_CO_2"] + data.data[data.data.length-1]["MQ7_CO_1"] + data.data[data.data.length-1]["MQ7_CO_2"]) / 4
        document.getElementById("modal_start").textContent = start.toFixed(0);
        document.getElementById("modal_end").textContent = end.toFixed(0);
        gd = [];
        dt = 0;
        for(v of data.data){
            vr = Math.round((v['MQ2_CO_1']+v['MQ2_CO_2']+v['MQ7_CO_1']+v['MQ7_CO_2'])/4);
            gd.push(vr);
            dt += vr;
        }
    for(i of ['MQ2_CO_1', 'MQ2_CO_2', 'MQ7_CO_1', 'MQ7_CO_2']){
            gs = []
            ds = 0;
            for(v of data.data){
                vr = Math.round(v[i]);
                gs.push(vr);
                ds += vr;
            }
            document.getElementById(mq_sensor_q[i]+mq_sensor[i]+'_average').textContent = Math.round(ds/gs.length);
            document.getElementById(mq_sensor_q[i]+mq_sensor[i]+'_low').textContent = Math.min(...gs)
            document.getElementById(mq_sensor_q[i]+mq_sensor[i]+'_high').textContent = Math.max(...gs)
            document.getElementById(mq_sensor_q[i]+mq_sensor[i]+'_average').textContent = Math.round(ds/gs.length);
            
    }
    } else {
    document.getElementById("modal_start").textContent = data.data[0]['CO'].toFixed(0);
    document.getElementById("modal_end").textContent = data.data[data.data.length-1]['CO'].toFixed(0);
    gd = [];
    dt = 0;
    for(v of data.data){
        vr = Math.round(v['CO']);
        gd.push(vr);
        dt += vr;
    }
    for(i of ['MQ2_CO_1', 'MQ2_CO_2', 'MQ2_CO_3', 'MQ3_CO_1', 'MQ3_CO_2', 'MQ3_CO_3', 'MQ7_CO_1', 'MQ7_CO_2', 'MQ7_CO_3']){
        gs = []
        ds = 0;
        for(v of data.data){
            vr = Math.round(v[i]);
            gs.push(vr);
            ds += vr;
        }
        for(i=0;i<9;i++){
            document.getElementById(placeholders[0+i]+'_average').textContent = Math.round(ds/gs.length);
            document.getElementById(placeholders[0+i]+'_low').textContent = Math.min(...gs)
            document.getElementById(placeholders[0+i]+'_high').textContent = Math.max(...gs)
        }
    }
}
    document.getElementById('modal_avg').textContent = Math.round(dt/gd.length);
    document.getElementById("modal_low").textContent = Math.min(...gd)
    document.getElementById("modal_high").textContent = Math.max(...gd)
    const co_sensors = ['MQ2', 'MQ7']
    for(i=1;i<3;i++) {
        document.getElementById("sensor_"+ i +"_name").rowSpan = "2"
    }
    // document.getElementById("sensor_13").style.display = "none";
    // document.getElementById("sensor_1_name").textContent = "MQ7"
    sensorTable(2, co_sensors)
}

document.getElementById("ch4_div").onclick = function() {
    const optionsToDisable = ['data4', 'data5'];
    const dropdown = document.getElementById('chartSelector');
    valueData = {
        data1: "MQ2",
        data2: "MQ4",
        data3: "MQ9",
    };
    document.getElementById("data1").textContent = "MQ2"
    document.getElementById("data2").textContent = "MQ4"
    document.getElementById("data3").textContent = "MQ9"
    for (const option of dropdown.options) {
        if (optionsToDisable.includes(option.value)) {
            option.disabled = true;
        } else {
            option.disabled = false;  
        }
    }
    modal.style.display = "block";
    modal_header.innerText="CH4 (Methane)"
    open_modal = "CH4"
    const mq_sensor = {
        "MQ2_CH4_1":"1",
        "MQ2_CH4_2":"2",
        "MQ4_CH4_1":"1",
        "MQ4_CH4_2":"2",
        "MQ9_CH4_1":"1",
        "MQ9_CH4_2":"2"
    }
    const mq_sensor_q = {
        "MQ2_CH4_1":"1",
        "MQ2_CH4_2":"1",
        "MQ4_CH4_1":"2",
        "MQ4_CH4_2":"2",
        "MQ9_CH4_1":"3",
        "MQ9_CH4_2":"3"
    }
    const placeholders = ['11', '12', '13', '21', '22', '23', '31', '32', '33', '41', '42', '43', '51', '52', '53']
    if (sensor_exist_a){
        start = (data.data[0]["MQ2_CH4_1"] + data.data[0]["MQ2_CH4_2"] + data.data[0]["MQ4_CH4_1"] + data.data[0]["MQ4_CH4_2"] + data.data[0]["MQ9_CH4_1"] + data.data[0]["MQ9_CH4_2"]) / 6
        end = (data.data[data.data.length-1]["MQ2_CH4_1"] + data.data[data.data.length-1]["MQ2_CH4_2"] + data.data[data.data.length-1]["MQ4_CH4_1"] + data.data[data.data.length-1]["MQ4_CH4_2"] + data.data[data.data.length-1]["MQ9_CH4_1"] + data.data[data.data.length-1]["MQ9_CH4_2"]) / 6
        document.getElementById("modal_start").textContent = start.toFixed(0);
        document.getElementById("modal_end").textContent = end.toFixed(0);
        gd = [];
        dt = 0;
        for(v of data.data){
            vr = Math.round((v['MQ2_CH4_1']+v['MQ2_CH4_2']+v['MQ4_CH4_1']+v['MQ4_CH4_2']+v['MQ9_CH4_1']+v['MQ9_CH4_2'])/6);
            gd.push(vr);
            dt += vr;
        }
    for(i of ['MQ2_CH4_1', 'MQ2_CH4_2','MQ4_CH4_1', 'MQ4_CH4_2','MQ9_CH4_1', 'MQ9_CH4_2']){
            gs = []
            ds = 0;
            for(v of data.data){
                vr = Math.round(v[i]);
                gs.push(vr);
                ds += vr;
            }
            document.getElementById(mq_sensor_q[i]+mq_sensor[i]+'_average').textContent = Math.round(ds/gs.length);
            document.getElementById(mq_sensor_q[i]+mq_sensor[i]+'_low').textContent = Math.min(...gs)
            document.getElementById(mq_sensor_q[i]+mq_sensor[i]+'_high').textContent = Math.max(...gs)
            document.getElementById(mq_sensor_q[i]+mq_sensor[i]+'_average').textContent = Math.round(ds/gs.length);
            
    }
    } else {
    document.getElementById("modal_start").textContent = data.data[0]['CH4'].toFixed(0);
    document.getElementById("modal_end").textContent = data.data[data.data.length-1]['CH4'].toFixed(0);
    gd = [];
    dt = 0;
    for(v of data.data){
        vr = Math.round(v['CH4']);
        gd.push(vr);
        dt += vr;
    }
    for(i of ['MQ2_CH4_1', 'MQ2_CH4_2', 'MQ2_CH4_3', 'MQ4_CH4_1', 'MQ4_CH4_2', 'MQ4_CH4_3', 'MQ6_CH4_1', 'MQ6_CH4_2', 'MQ6_CH4_3', 'MQ9_CH4_1', 'MQ9_CH4_2', 'MQ9_CH4_3', 'MQ214_CH4_1', 'MQ214_CH4_2', 'MQ214_CH4_3']){
        gs = []
        ds = 0;
        for(v of data.data){
            vr = Math.round(v[i]);
            gs.push(vr);
            ds += vr;
        }
        for(i=0;i<15;i++){
            document.getElementById(placeholders[0+i]+'_average').textContent = Math.round(ds/gs.length);
            document.getElementById(placeholders[0+i]+'_low').textContent = Math.min(...gs)
            document.getElementById(placeholders[0+i]+'_high').textContent = Math.max(...gs)
        }
    }
}
    document.getElementById('modal_avg').textContent = Math.round(dt/gd.length);
    document.getElementById("modal_low").textContent = Math.min(...gd)
    document.getElementById("modal_high").textContent = Math.max(...gd)
    const ch4_sensors = ['MQ2', 'MQ4', 'MQ9']
    if (sensor_exist){
    for(i=1; i<6; i++) {
        for(j=1; j<4; j++){
            document.getElementById("sensor_"+i+j).style.display = "table-row";
            }
        document.getElementById("sensor_"+i+"_name").textContent = ch4_sensors[-1+i]
    }
    } else if(sensor_exist_a){
        sensorTable(3, ch4_sensors)
    } else {
    document.getElementById("table").style.display = "none";
    document.getElementById("error_text").style.display = "block";
}
}

document.getElementById("oh-lpg-btn").onclick = function() {
    document.getElementById("h2-ch4").style.display = "none";
    document.getElementById("oh-lpg").style.display = "block";
    document.getElementById("h2-ch4-btn").classList.remove("active-main")
    document.getElementById("h2-ch4-btn").classList.add("inactive-main")
    document.getElementById("oh-lpg-btn").classList.remove("inactive-main")
    document.getElementById("oh-lpg-btn").classList.add("active-main")
}

document.getElementById("h2-ch4-btn").onclick = function() {
    document.getElementById("h2-ch4").style.display = "grid";
    document.getElementById("oh-lpg").style.display = "none";
    document.getElementById("h2-ch4-btn").classList.remove("inactive-main")
    document.getElementById("h2-ch4-btn").classList.add("active-main")
    document.getElementById("oh-lpg-btn").classList.remove("active-main")
    document.getElementById("oh-lpg-btn").classList.add("inactive-main")
}

document.getElementById("close-modal").onclick = function() {
    modal.style.display = "none";
    document.getElementById("sensor_details").style.display = "none";
    document.getElementById("overview").style.display = "block";
    document.getElementById("graph-btn").classList.remove("active")
    document.getElementById("overview-btn").classList.add("active")
}

window.onclick = function(event) {
    if (event.target == modal) {
    modal.style.display = "none";
}
}
