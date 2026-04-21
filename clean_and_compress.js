const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const dataFile = path.join(__dirname, 'public', 'portfolio_data.json');
const assetsDir = path.join(__dirname, 'public', 'portfolio_assets');

async function main() {
    let rawData = fs.readFileSync(dataFile, 'utf-8');
    let data = JSON.parse(rawData);
    
    // Keep top 30
    const activeItems = data.slice(0, 30);
    const activeFiles = new Set(activeItems.map(item => path.basename(item.src)));
    
    // Delete unused files
    console.log("Removing unused files...");
    const allFiles = fs.readdirSync(assetsDir);
    let deletedCount = 0;
    for (const file of allFiles) {
        if (!activeFiles.has(file)) {
            fs.unlinkSync(path.join(assetsDir, file));
            deletedCount++;
        }
    }
    console.log(`Deleted ${deletedCount} unused files.`);
    
    // Compress and convert
    console.log("Compressing remaining 30 files...");
    for (let i = 0; i < activeItems.length; i++) {
        let item = activeItems[i];
        let filename = path.basename(item.src);
        let inputPath = path.join(assetsDir, filename);
        
        if (item.type === 'video') {
            let tempOutput = path.join(assetsDir, 'temp_' + filename);
            console.log(`Compressing video: ${filename}`);
            try {
                // Remove audio (-an), downscale max 720p (-vf), reduce bitrate
                execSync(`ffmpeg -y -i "${inputPath}" -vcodec libx264 -crf 28 -preset fast -vf "scale='min(720,iw)':-2" -an "${tempOutput}"`, { stdio: 'inherit' });
                fs.renameSync(tempOutput, inputPath);
            } catch (e) {
                console.error(`Failed to compress ${filename}:`, e.message);
                if (fs.existsSync(tempOutput)) fs.unlinkSync(tempOutput);
            }
        } else if (item.type === 'image') {
            let nameWithoutExt = path.parse(filename).name;
            let webpFilename = nameWithoutExt + '.webp';
            let tempOutput = path.join(assetsDir, webpFilename);
            console.log(`Converting image to webp: ${filename}`);
            try {
                // scale max 800 width, convert to webp
                execSync(`ffmpeg -y -i "${inputPath}" -vf "scale='min(800,iw)':-1" -q:v 70 "${tempOutput}"`, { stdio: 'inherit' });
                fs.unlinkSync(inputPath); // remove old image
                // update JSON data to new webp file
                item.src = `/portfolio_assets/${webpFilename}`;
            } catch (e) {
                console.error(`Failed to convert ${filename}:`, e.message);
                if (fs.existsSync(tempOutput)) fs.unlinkSync(tempOutput);
            }
        }
    }
    
    fs.writeFileSync(dataFile, JSON.stringify(activeItems, null, 2));
    console.log("Done! portfolio_data.json updated.");
}

main().catch(console.error);
