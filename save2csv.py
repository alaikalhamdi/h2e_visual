from json import load
import inquirer
from os import listdir, mkdir

chosendir = "pertamax"

questions = [
    inquirer.List(
        "file",
        message="Choose a file to convert to csv",
        choices=listdir(chosendir),
    ),
]

answers = inquirer.prompt(questions)
data = load(open(chosendir+'/'+answers['file']))

csv = ','.join(data['data'][0].keys()) + '\n'
for i in data['data']:
    csv += ','.join([str(i[k]) for k in i.keys()])
    csv += '\n'

try:
    mkdir('savescsv')
except:
    pass

f = open('savescsv/'+answers['file'][:-5] + '.csv', 'w')
f.write(csv)
f.close()
print('Saved as savescsv/'+answers['file'][:-5] + '.csv')
