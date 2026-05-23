const fs = require('fs');
const readline = require('readline');

async function run() {
    const logPath = 'C:\\Users\\xavie\\.gemini\\antigravity\\brain\\f343fe9f-e32f-4f36-befb-7fcf6f147365\\.system_generated\\logs\\transcript.jsonl';
    const fileStream = fs.createReadStream(logPath);
    const rl = readline.createInterface({ input: fileStream, crlfDelay: Infinity });
    
    let bestHtml = '';
    let found = false;
    
    for await (const line of rl) {
        try {
            const log = JSON.parse(line);
            if (log.type === 'TOOL_RESPONSE' && log.content && log.content.includes('<body')) {
                // If this is a response from view_file or run_command showing index.html
                if (log.content.includes('<title>mon50ccetmoi</title>')) {
                    // Extract the content from the log. It might have line numbers like "1: <!DOCTYPE html>"
                    let htmlLines = [];
                    let lines = log.content.split('\n');
                    let inCode = false;
                    for(let l of lines) {
                        if (l.match(/^\d+:\s/)) {
                            htmlLines.push(l.replace(/^\d+:\s/, ''));
                        } else if (htmlLines.length > 0 && !l.includes('The above content shows the entire')) {
                            // If it doesn't have line numbers but we started parsing, it might be a continuation or we might just stop.
                        }
                    }
                    if (htmlLines.length > 500) {
                        bestHtml = htmlLines.join('\n');
                        found = true;
                    }
                }
            }
        } catch(e) {}
    }
    
    if (found && bestHtml) {
        console.log('Restored from view_file! Size: ' + bestHtml.length);
        fs.writeFileSync('index.html', bestHtml);
    } else {
        console.log('Not found in view_file.');
    }
}
run();
