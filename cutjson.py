import json
from inquirer import prompt, List, Text
from os import listdir

def cut_json(input_filename, output_filename):
    try:
        with open(input_filename, 'r') as file:
            data = json.load(file)[data]

        data['your_array_key'] = data['your_array_key'][:50]

        with open(output_filename, 'w') as file:
            json.dump(data, file, indent=4)
        
        print(f"JSON data limited to 50 entries and saved to {output_filename}")
    except Exception as e:
        print(f"An error occurred: {str(e)}")

questions = [
    List('input_filename', message='Select the input JSON file:',
         choices=listdir("hi"), carousel=True),
    Text('output_filename', message='Name the output file:')
]

answers = prompt(questions)

cut_json(answers['input_filename'], answers['output_filename'])
