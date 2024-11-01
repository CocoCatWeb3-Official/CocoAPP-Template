const { exec } = require('child_process');
const path = require('path');
const fs = require('fs');

// Get the absolute path of the command to be executed.


// To change the current working directory to the 'init' folder.
const initPath = path.join(__dirname);

process.chdir(initPath);


const subsiteInfoPath = "account.json"
let subsiteInfo = {} //subsiteInfo

let targetDir = ''
const sourceDir = path.resolve(__dirname, '../dist');

const maxFileSize = 1024 * 1024;

const errorFile = []

function checkFileSize(filePath) {

  console.log('checkFileSize',filePath)
  const stats = fs.statSync(filePath);

  if (stats.isFile() && stats.size > maxFileSize) {
    errorFile.push(`${filePath}`)
  } else if (stats.isDirectory()) {
    const files = fs.readdirSync(filePath);
    files.forEach(file => {
      const subFilePath = path.join(filePath, file);
      checkFileSize(subFilePath); 
    });
  }
}


fs.access(subsiteInfoPath, fs.constants.F_OK, (err) => {
  if (err) {
      console.error(`${err}`);
      return;
  }

  fs.readFile(subsiteInfoPath, 'utf8', (err, data) => {
    if (err) {
        console.error('Error reading file:', err);
        return;
    }

      subsiteInfo = JSON.parse(data)
      targetDir = `./data/${subsiteInfo.address}`
      console.log(targetDir)

      fs.readdir(targetDir, (err, files) => {
        if (err) {
          console.error('Failed to read folder:', err);
          return;
        }
      
        files.forEach(file => {
          const filePath = path.join(targetDir, file);
          checkFileSize(filePath);
          
        });

        if(errorFile.length>0){
          return console.error(`Single file size exceeds 1M:\n${errorFile.join(',\n')}`)
        }
  
        const command = path.join(__dirname, 'cococat.exe') + ' siteSign' + ` ${subsiteInfo.address}` + ` ${subsiteInfo.privateKey}`;
        exec(command, (error, stdout, stderr) => {
          if (error) {
            console.error(`${error}`);
            return;
          }
          console.log(`CocoApp successfully signed`)
        })

      });

     
  });
})