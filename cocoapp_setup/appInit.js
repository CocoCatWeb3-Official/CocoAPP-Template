const { exec } = require('child_process');
const path = require('path');
const fs = require('fs');

// Get the absolute path of the command to be executed.
const command = path.join(__dirname, 'cococat.exe') + ' siteCreate';

// To change the current working directory to the 'init' folder.
const initPath = path.join(__dirname);


const merged_type = process.argv.slice(2)[0]; //merged_type parameter

process.chdir(initPath);

const subsiteInfoPath = "account.json"
let subsiteInfo = {} //subsiteInfo

let targetDir = ''
const sourceDir = path.resolve(__dirname, '../dist');


const publishfiles = {
  files: []
}

let filesdata = []


fs.access(subsiteInfoPath, fs.constants.F_OK, (err) => {


 if(err==null){
  fs.readFile(subsiteInfoPath, 'utf8',(err, data) => {
    if (err) {
        console.error('Error reading file:', err);
        return;
    }

    subsiteInfo = JSON.parse(data)

    const beforeDir = `data/${subsiteInfo.address}`

    if (fs.existsSync(beforeDir)) {
      deleteFilesAndDirectories([beforeDir]);
    }
  })
 }
  
  


  exec(command, (error, stdout, stderr) => {
    if (error) {
      console.error(`${error}`);
      return;
    }

    const lines = stdout.split('\n');
    const jsonData = {
        privateKey: '',
        address: ''
    };
    lines.forEach(line => {
      if (line.includes('Site private key')) {
        const privateKey = line.match(/Site private key: (.*)/)[1];
        jsonData.privateKey = privateKey.replace(/"/g, '').trim();
      } else if (line.includes('Site address')) {
        const address = line.match(/Site address: (.*)"$/)[1];
        jsonData.address = address.replace(/"/g, '').trim();
      }
    });

    fs.writeFileSync(subsiteInfoPath, JSON.stringify(jsonData, null, 2));
    

    targetDir = `./data/${jsonData.address}`
 
    if (!fs.existsSync(targetDir)) {
      fs.mkdirSync(targetDir, { recursive: true });
    }
    
    copyFiles(sourceDir, targetDir);

    const fileHierarchy = getFileHierarchy(sourceDir);
    
    writePublishfiles(fileHierarchy);

    //Delete unnecessary directories and files

    const dFiles = [
      'shadow.json',
      'groupuserkey.json',
      'pangomail',
      'data/1Lg6C1nsYKYnVwWz2FUff1EKX79ggRWCYc',
      'data/cert-rsa.pem',
      'data/key-rsa.pem',
      'data/peers.json',
      'data/sites.json',
      'data/users.json'
    ]

    deleteFilesAndDirectories(dFiles);
    
    //Modify merged_type
    if(typeof merged_type !='undefined'){
      targetDir = `./data/${jsonData.address}`
      editContent(`./data/${jsonData.address}/content.json`,merged_type)
    }

  });
 
});

function editContent(contentPath,type){
  fs.readFile(contentPath, 'utf8', (err, data) => {
    if (err) {
      console.error('Content.json failed to read:', err);
      return;
    } 
    const content = JSON.parse(data);
    content.merged_type = type; 
    const updatedContent = JSON.stringify(content, null, 2);
    fs.writeFile(contentPath, updatedContent, 'utf8', (err) => {
      if (err) {
        console.error('Failed to write merged_type in Content.json:', err);
        return;
      }
      console.log('CocoApp created successfully');
    });
   
  });
}

function copyFiles(source, target) {
  fs.readdir(source, { withFileTypes: true }, (err, files) => {
      if (err) {
          console.error('Error reading directory:', err);
          return;
      }

      files.forEach(file => {
          const sourcePath = path.join(source, file.name);
          const targetPath = path.join(target, file.name);

          if (file.isDirectory()) {
              if (!fs.existsSync(targetPath)) {
                  fs.mkdirSync(targetPath, { recursive: true });
              }
              copyFiles(sourcePath , targetPath); 
          } else {
              fs.copyFileSync(sourcePath, targetPath);
             
              
          }
      }); 
  });
}

function getFileHierarchy(folderPath, prefix = '') {

  const files = fs.readdirSync(folderPath);
  files.forEach(file => {
      const filePath = path.join(folderPath, file);
      const stats = fs.statSync(filePath);
      if (stats.isDirectory()) {

        
          getFileHierarchy(filePath,prefix+file+'/');
  
      } else {
          filesdata.push(prefix + file);
      }
  });

  return filesdata;
}


function writePublishfiles(fileHierarchy){
  for(let i =0;i<fileHierarchy.length;i++){
   
      publishfiles.files.push(fileHierarchy[i])
    
    
  }

    // Write to the file
    const jsonString = JSON.stringify(publishfiles, null, 2);
    const filePath = path.join(__dirname, targetDir, 'publishfiles.json');

    fs.writeFile(filePath, jsonString, err => {
        if (err) {
            console.error('Error writing JSON file:', err);
            return;
        }
       
    });
}

function deleteFileOrDirectory(filePath) {
  return new Promise((resolve, reject) => {
      fs.stat(filePath, (err, stats) => {
          if (err) {
              reject(err);
              return;
          }
          if (stats.isDirectory()) {
              deleteDirectory(filePath)
                  .then(resolve)
                  .catch(reject);
          } else {
              fs.unlink(filePath, (err) => {
                  if (err) {
                      reject(err);
                  } else {
                      resolve();
                  }
              });
          }
      });
  });
}



async function deleteDirectory(dirPath, depth = 0, maxDepth = 10) {
  if (depth >= maxDepth) {
      throw new Error('Maximum recursion depth reached');
  }

  const files = fs.readdirSync(dirPath);
  const promises = files.map(file => {
      const filePath = path.join(dirPath, file);
      return deleteFileOrDirectory(filePath);
  });

  await Promise.all(promises);
  fs.rmdirSync(dirPath);
}

async function deleteFilesAndDirectories(filePaths) {
  try {
      for (const filePath of filePaths) {
          await deleteFileOrDirectory(filePath);
      }
  } catch (error) {
      console.error(error);
  }
}