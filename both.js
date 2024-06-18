import { exec } from 'child_process';

const startFrontend = exec('npm run start:frontend');
const startBackend = exec('npm run start:backend');

startFrontend.stdout.on('data', (data) => {
    console.log(`Frontend: ${data}`);
});

startFrontend.stderr.on('data', (data) => {
    console.error(`Frontend Error: ${data}`);
});

startBackend.stdout.on('data', (data) => {
    console.log(`Backend: ${data}`);
});

startBackend.stderr.on('data', (data) => {
    console.error(`Backend Error: ${data}`);
});
