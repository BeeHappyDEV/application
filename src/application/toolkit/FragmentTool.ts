import fs from 'fs';
import path from 'path';

// @ts-ignore
export function Code ({file, lines, language}) {
    const filePath = path.resolve (process.cwd (), file);
    const content = fs.readFileSync (filePath, 'utf-8');
    const allLines = content.split ('\n');

    let lineRange = [0, allLines.length];
    if (lines) {
        lineRange = lines.split ('-').map (Number);
        if (lineRange.length === 1) lineRange[1] = lineRange[0];
    }

    const snippet = allLines.slice (lineRange[0] - 1, lineRange[1]).join ('\n');

    return (
        '<pre><code className={`language-${language}`}>' + snippet+ '</code></pre>'
    );
}