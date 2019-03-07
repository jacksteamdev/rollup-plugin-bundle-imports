var stringCode = "(function () {\n\t'use strict';\n\n\tconst b = 'B';\n\n\tconsole.log('c');\n\n\tconsole.log(b);\n\n}());\n";

const add = (x, y) => {
  return x + y
};

console.log(stringCode);

export { add };
