const fs = require('fs');
const readline = require('readline');

async function run() {
    const logPath = 'C:\\Users\\xavie\\.gemini\\antigravity\\brain\\f343fe9f-e32f-4f36-befb-7fcf6f147365\\.system_generated\\logs\\transcript.jsonl';
    const fileStream = fs.createReadStream(logPath);
    const rl = readline.createInterface({ input: fileStream, crlfDelay: Infinity });
    
    let deletedLines = [];
    
    for await (const line of rl) {
        try {
            const log = JSON.parse(line);
            if (log.content && log.content.includes('[diff_block_start]')) {
                if (log.content.includes('-    <link rel="stylesheet" href="css/premium.css">')) {
                    // This is the diff block that ruined the file
                    let inDiff = false;
                    for (const l of log.content.split('\n')) {
                        if (l === '[diff_block_start]') {
                            inDiff = true;
                            continue;
                        }
                        if (l === '[diff_block_end]') {
                            inDiff = false;
                            break;
                        }
                        if (inDiff) {
                            if (l.startsWith('-')) {
                                deletedLines.push(l.substring(1));
                            } else if (l.startsWith(' ')) {
                                deletedLines.push(l.substring(1));
                            }
                        }
                    }
                }
            }
        } catch(e) {}
    }
    
    if (deletedLines.length > 0) {
        console.log('Found ' + deletedLines.length + ' deleted lines. Restoring...');
        // We will read current index.html, find where the block was, and insert it back.
        let currentHtml = fs.readFileSync('index.html', 'utf8');
        // The deleted block started right after `        } catch(e) {`
        // Actually the first deleted line was `            console.warn("Auth initialization failed, using guest mode.");`
        
        let targetLine = '        } catch(e) {';
        if (currentHtml.includes(targetLine)) {
            let parts = currentHtml.split(targetLine);
            let newHtml = parts[0] + targetLine + '\n' + deletedLines.join('\n') + parts[1];
            fs.writeFileSync('index.html', newHtml);
            console.log('Restored index.html');
        } else {
            console.log('Target line not found in index.html to insert block.');
        }
    } else {
        console.log('Diff block not found.');
    }
}
run();
