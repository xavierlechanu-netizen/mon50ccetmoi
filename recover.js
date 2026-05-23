const fs = require('fs');
const readline = require('readline');

async function run() {
    const logPath = 'C:\\Users\\xavie\\.gemini\\antigravity\\brain\\f343fe9f-e32f-4f36-befb-7fcf6f147365\\.system_generated\\logs\\transcript.jsonl';
    const fileStream = fs.createReadStream(logPath);
    const rl = readline.createInterface({ input: fileStream, crlfDelay: Infinity });
    
    let bestHtml = null;
    let maxLen = 0;
    
    for await (const line of rl) {
        try {
            const log = JSON.parse(line);
            
            // Check in tool_calls
            if (log.tool_calls) {
                for (const call of log.tool_calls) {
                    if (call.name === 'default_api:write_to_file') {
                        const args = JSON.parse(call.arguments);
                        if (args.TargetFile && args.TargetFile.endsWith('index.html')) {
                            if (args.CodeContent && args.CodeContent.length > maxLen) {
                                bestHtml = args.CodeContent;
                                maxLen = bestHtml.length;
                            }
                        }
                    }
                }
            }
            
            // Also check for view_file output in case we read it earlier
            if (log.content && log.content.includes('<body style="margin:0; padding:0;')) {
                // Not ideal, but might be an option
            }
        } catch(e) {}
    }
    
    if (bestHtml) {
        console.log('Restoring index.html, size: ' + bestHtml.length);
        fs.writeFileSync('index.html', bestHtml);
    } else {
        console.log('Not found in write_to_file logs. Let me check the diffs.');
    }
}
run();
