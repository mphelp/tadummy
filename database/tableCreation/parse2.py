#!/usr/bin/python3

newfile = 'dorm.csv'

with open('dorm.data') as readf:
    with open(newfile, 'w') as writef:
        for line in readf:
            line = line.rstrip()
            hall = [d.strip() for d in line.split('\t')][0]
            print(hall)
            try:
                hall = hall.split('.svg')[1]
            except:
                try:
                    hall = hall.split('.png')[1]
                except:
                    print('Invalid file type!')
            print(hall)
            hall = hall.split('[')[0].strip()
            print(hall)
            writef.write(hall)
            writef.write('\n')
