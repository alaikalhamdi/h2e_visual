from json import load
import inquirer
from os import listdir, mkdir

chosendir = "pertalite"

questions = [
    inquirer.Checkbox(
        "files",
        message="Choose files to convert to CSV",
        choices=listdir(chosendir),
    ),
]

answers = inquirer.prompt(questions)
selected_files = answers['files']

try:
    mkdir('savescsv')
except FileExistsError:
    pass

for selected_file in selected_files:
    data = load(open(chosendir+'/'+selected_file))

    csv = ','.join(data['data'][0].keys()) + '\n'
    for i in data['data']:
        csv += ','.join([str(i[k]) for k in i.keys()])
        csv += '\n'

    f = open('savescsv/'+selected_file[:-5] + '.csv', 'w')
    f.write(csv)
    f.close()
    print('Saved as savescsv/'+selected_file[:-5] + '.csv')
