// docs-highlight.js - Shiki с собственной грамматикой для Ely
import { getHighlighter } from 'shiki';

// Минимальная, но настроенная грамматика для Ely, основанная на вашем файле
const elyGrammar = {
    "scopeName": "source.ely",
    "name": "Ely",
    "patterns": [
        { "include": "#keywords" },
        { "include": "#strings" },
        { "include": "#comments" },
        { "include": "#numbers" },
        { "include": "#functions" },
        { "include": "#builtins" },
        { "include": "#punctuation" }
    ],
    "repository": {
        "keywords": {
            "patterns": [
                { "match": "\\b(public|private|static|override|async|abstract|sealed|wait|func|class|interface|impl|extends|if|else|elif|for|while|return|break|continue|switch|case|default|foreach|await|new|using|asafe|except|throw|int|flt|str|bool|void|arr|any|true|false|NULL)\\b", "name": "keyword.control.ely" },
                { "match": "\\b(this|super)\\b", "name": "variable.language.ely" }
            ]
        },
        "strings": {
            "name": "string.quoted.double.ely",
            "begin": "(f?)(\"\"\"|''')",
            "end": "\\3",
            "beginCaptures": { "1": { "name": "storage.type.fstring.ely" }, "2": { "name": "punctuation.definition.string.begin.ely" } }
        },
        "comments": {
            "name": "comment.line.double-slash.ely",
            "begin": "//",
            "end": "$"
        },
        "numbers": {
            "match": "\\b\\d+(\\.\\d+)?\\b",
            "name": "constant.numeric.ely"
        },
        "functions": {
            "match": "\\b([a-zA-Z_][a-zA-Z0-9_]*)\\s*(?=\\()",
            "captures": { "1": { "name": "entity.name.function.call.ely" } }
        },
        "builtins": {
            "match": "\\b(println|print|typeof|fields|methods|len|fileExists|fileRemove)\\b",
            "name": "support.function.ely"
        },
        "punctuation": {
            "patterns": [
                { "match": "\\(", "name": "punctuation.section.paren.begin.ely" },
                { "match": "\\)", "name": "punctuation.section.paren.end.ely" },
                { "match": "\\{", "name": "punctuation.section.brace.begin.ely" },
                { "match": "\\}", "name": "punctuation.section.brace.end.ely" },
                { "match": "\\[", "name": "punctuation.section.bracket.begin.ely" },
                { "match": "\\]", "name": "punctuation.section.bracket.end.ely" }
            ]
        }
    }
};

let highlighterInstance = null;

export async function initShiki() {
    if (highlighterInstance) return highlighterInstance;

    highlighterInstance = await getHighlighter({
        themes: ['dark-plus'],
        langs: [
            'c',
            'go',
            'cpp',
            'json',
            'javascript',
            'bash',
            'markdown',
            'python',
            {
                id: 'ely',
                scopeName: 'source.ely',
                grammar: elyGrammar,
                name: 'Ely',
                aliases: ['elylang']
            }
        ]
    });
    
    console.log('Shiki initialized with Ely language');
    return highlighterInstance;
}

export async function highlightCodeBlocks(container) {
    const highlighter = await initShiki();
    const blocks = container.querySelectorAll('pre code');
    
    for (const block of blocks) {
        let lang = 'plaintext';
        const className = block.className || '';
        const match = className.match(/language-(\w+)/);
        if (match) {
            let shortLang = match[1];
            if (shortLang === 'cpp') lang = 'cpp';
            else if (shortLang === 'js') lang = 'javascript';
            else if (shortLang === 'ely' || shortLang === 'elylang') lang = 'ely';
            else if (shortLang === 'bash') lang = 'bash';
            else if (shortLang === 'py') lang = 'python';
            else if (shortLang === 'go') lang = 'go';
            else lang = shortLang;
        }
        
        const code = block.textContent;
        let highlightedHtml;
        try {
            highlightedHtml = highlighter.codeToHtml(code, { lang, theme: 'dark-plus' });
        } catch (err) {
            console.warn(`Failed to highlight ${lang}, using plain text`, err);
            highlightedHtml = `<pre class="shiki" style="background-color:#1e1e1e"><code>${escapeHtml(code)}</code></pre>`;
        }
        
        const oldPre = block.parentNode;
        const tempDiv = document.createElement('div');
        tempDiv.innerHTML = highlightedHtml;
        const newPre = tempDiv.firstElementChild;
        oldPre.parentNode.replaceChild(newPre, oldPre);
    }
}

function escapeHtml(str) {
    if (!str) return '';
    return str.replace(/[&<>]/g, function(m) {
        if (m === '&') return '&amp;';
        if (m === '<') return '&lt;';
        if (m === '>') return '&gt;';
        return m;
    });
}