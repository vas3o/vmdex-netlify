function highlightLuau(code) {
  const escapeHtml = (str) =>
    str
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");

  const safeCode = escapeHtml(code);

  const rules = [
    { regex: /(--\[\[[\s\S]*?\]\]|--[^\n]*)/g, token: "comment" },
    { regex: /("(?:[^"\\]|\\.)*"|'(?:[^'\\]|\\.)*'|\[\[[\s\S]*?\]\])/g, token: "string" },
    { regex: /\b(0x[0-9a-fA-F]+|\d+(\.\d+)?([eE][+-]?\d+)?)\b/g, token: "number" },
    { 
      regex: /\b(and|break|do|else|elseif|end|false|for|function|if|in|local|nil|not|or|repeat|return|then|true|until|while|export|type|continue)\b/g, 
      token: "keyword" 
    },
    { 
      regex: /\b(game|workspace|script|Enum|Vector3|Vector2|CFrame|Color3|UDim2|Instance|math|string|table|task|coroutine|debug|os|typeof|type|print|warn|error|assert|require)\b/g, 
      token: "builtin" 
    },
    { regex: /\b([a-zA-Z_][a-zA-Z0-9_]*)(?=\s*\()/g, token: "function-call" },
    { regex: /(==|~=|<=|>=|\+=|-=|\*=|\/=|:=|\.\.|[+\-*\/%^#=<>])/g, token: "operator" }
  ];

  let tokens = [];
  let tokenizedCode = safeCode;

  rules.forEach(({ regex, token }) => {
    tokenizedCode = tokenizedCode.replace(regex, (match) => {
      const id = `___TOKEN_${tokens.length}___`;
      tokens.push(`<span class="luau-${token}">${match}</span>`);
      return id;
    });
  });

  tokens.forEach((spanHtml, index) => {
    tokenizedCode = tokenizedCode.replace(`___TOKEN_${index}___`, spanHtml);
  });

  return tokenizedCode;
}

document.addEventListener("DOMContentLoaded", () => {
  const codeBlocks = document.querySelectorAll("code.luau-highlight, pre.luau-highlight");
  codeBlocks.forEach((block) => {
    const rawCode = block.innerText || block.textContent;
    block.innerHTML = highlightLuau(rawCode);
  });
});
