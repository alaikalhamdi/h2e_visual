from flask import Flask, send_from_directory, request
from flask_cors import CORS
from random import random
from serial import Serial
from datetime import datetime
from threading import Thread
import json
import os
import subprocess

app = Flask('H2E')
CORS(app)

try:
    ser = Serial('/dev/ttyUSB0')
except:
    try: 
        ser = Serial('/dev/ttyUSB1')
    except:
        print('No serial port found. (/dev/ttyUSB0 | /dev/ttyUSB1)\nUsing random data')
        ser = None
        
last_received = str()

if type(ser) == Serial:
    def receiving(ser: Serial):
        global last_received

        buffer_string = ''
        while True:
            buffer_string = buffer_string + ser.read(ser.inWaiting()).decode()
            if '\n' in buffer_string:
                lines = buffer_string.split('\n')
                last_received = lines[-2]
                last_received = last_received[:-2] + ",\"t\":" + str(round(datetime.now().timestamp() * 1000)) + "}"
                # last_received['MQ4_CH4_1'] = 0.31
                last_received = json.loads(last_received)
                # last_received['t'] = round(datetime.now().timestamp() * 1000)
                buffer_string = lines[-1]

else:
    def receiving(ser):
        while True:
            global last_received
            last_received = {k:round(random()*100) for k in ['DHT22_H', 'DHT22_T',
                                                             'MQ2_H2_1', 'MQ2_H2_2',
                                                             'MQ2_CH4_1', 'MQ2_CH4_2',
                                                             'MQ2_CO_1', 'MQ2_CO_2',
                                                             'MQ4_CH4_1', 'MQ4_CH4_2', 
                                                             'MQ4_H2_1', 'MQ4_H2_2',
                                                             'MQ6_H2_1', 'MQ6_H2_2', 
                                                             'MQ7_H2_1', 'MQ7_H2_2', 
                                                             'MQ7_CO_1', 'MQ7_CO_2', 
                                                             'MQ8_H2_1', 'MQ8_H2_2', 
                                                             'MQ9_CH4_1', 'MQ9_CH4_2', 
                                                             'MQ214_CH4_1', 'MQ214_CH4_2',
                                                             'MG811_CO2_1', 'MG811_CO2_2',
                                                             "MQ3_C6H6_1","MQ3_C6H6_2",
                                                             "MQ2_C3H8_1","MQ2_C3H8_2",
                                                             "MQ3_OH_1","MQ3_OH_2",
                                                             "MQ2_LPG_1","MQ2_LPG_2",
                                                             'Thermocouple_1', 'Thermocouple_2', 'Thermocouple_3', 'Thermocouple_4', 'Thermocouple_5', 'Thermocouple_6', 'Thermocouple_7',
                                                            ]}
            last_received['t'] = round(datetime.now().timestamp() * 1000)
            last_received['Thermocouple_1'] = round(random()*1024)
            last_received['Thermocouple_2'] = round(random()*1024)
            last_received['Thermocouple_3'] = round(random()*1024)
            last_received['Thermocouple_4'] = round(random()*1024)
            last_received['Thermocouple_5'] = round(random()*1024)
            last_received['Thermocouple_6'] = round(random()*1024)
            last_received['Thermocouple_7'] = round(random()*1024)

Thread(target=receiving, args=(ser,)).start()

record_data = False
pause = False
recorded_data = []

@app.route('/')
def index():
    print('a')
    return open('index.html').read()

@app.route('calibrate')
def touch_calibrate():
    script_path = "/path/to/your/script.sh"

    try:
        result = subprocess.run(["bash", script_path], check=True, text=True, capture_output=True)
        result = "Script output:" + result.stdout
        print(result)
        return 'ok'
    except subprocess.CalledProcessError as e:
        print("Error:", e.stderr)
        return e.stderr , 500

@app.route('/view')
def view():
    return open('dataviewer.html').read()

@app.route('/view/<path:path>')
def viewfile(path):
    return open('dataviewer_file.html').read().replace(r'{{filename}}', path)

@app.route('/data')
def data():
    global last_received
    if record_data:
        if not pause:
            print("Recording")
            recorded_data.append(last_received)
    return last_received
    
@app.route('/assets/<path:path>')
def assets(path):
    return send_from_directory('assets', path)

@app.route('/record/start')
def record_start():
    global record_data
    record_data = True
    return 'ok'

@app.route('/record/pause')
def record_pause():
    global pause 
    pause = True
    print(pause)
    return 'ok'

@app.route('/record/resume')
def record_resume():
    global pause 
    pause = False
    print(pause)
    return 'ok'

@app.route('/record/stop')
def record_stop():
    global record_data, recorded_data
    if not record_data:
        return 'ok'
    fn = request.args['name'] + '.json'
    if '/' in fn:
        return '', 400
    try:
        os.mkdir('saves')
    except:
        pass
    dirfs = os.listdir('saves')
    num = 1
    while fn in dirfs:
        fn = request.args['name'] + f'_{num}' + '.json'
        num += 1
    recorded_data = {'time_finished': datetime.now().timestamp() * 1000, 'data': recorded_data}
    f = open('saves/' + fn, 'w')
    f.write(json.dumps(recorded_data))
    f.close()
    recorded_data = []
    return fn

@app.route('/f/names')
def file_names():
    if 'saves' not in os.listdir():
        return '{}'
    return json.dumps({i:os.stat('saves/'+i)for i in os.listdir('saves')})

@app.route('/f/get')
def file_get():
    if request.args['fn'] in os.listdir('saves'):
        return open('saves/'+request.args['fn']).read()
    else:
        return '', 404

@app.route('/f/del')
def file_del():
    if request.args['fn'] in os.listdir('saves'):
        os.remove('saves/'+request.args['fn'])
        return '', 200
    else:
        return '', 404

app.run(port=80)
