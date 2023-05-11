import * as Project from './src'
import * as Test from './tst/test';

const action = process.argv[2];

switch(action){
    case 'server':
        Project.Server.boot();
        break;
    case 'test':
        Test.invoke();
        break;
}
