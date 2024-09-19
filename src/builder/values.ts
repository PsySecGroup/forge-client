type AnalysisResult = {
  type: string;
  value?: any;
  properties?: string[];
  arrayIndices?: (number | ((list: any[], arg: any) => any))[];
};

function analyzeData(input: any): AnalysisResult {
  if (input === null || input === undefined || typeof input === 'number' || typeof input === 'boolean') {
    return { type: typeof input, value: input };
  }

  if (typeof input === 'string') {
    // Check for regular expression pattern
    const regexMatch = /^\/(.*?)\/([gimuy]*)$/.exec(input);
    if (regexMatch) {
      const [, pattern, flags] = regexMatch;
      return {
        type: 'regexp',
        value: new RegExp(pattern, flags)
      };
    }

    // Check for object path pattern
    if (input.includes('.') || input.includes('{')) {
      const regex = /{([a-zA-Z0-9_.[\]:<>=!]+)}/;
      const matches = input.match(regex);
      if (matches) {
        const path = matches[1];
        const parts = path.split('.');

        let result: AnalysisResult = {
          type: '',
          properties: [],
          arrayIndices: []
        };

        parts.forEach((part, index) => {
          const identifierMatch = part.match(/^([a-zA-Z0-9_]+)(\[[0-9a-zA-Z:<>=!]+\])?$/);
          if (identifierMatch) {
            const identifier = identifierMatch[1];
            const arrayIndex = identifierMatch[2];

            if (index === 0) {
              result.type = identifier;
            } else {
              result.properties!.push(identifier);
            }

            if (arrayIndex) {
              const arrayFuncMatch = arrayIndex.match(/\[(find|filter):([a-zA-Z0-9_]+)=([a-zA-Z0-9_]+)\]/);
              if (arrayFuncMatch) {
                const func = arrayFuncMatch[1];
                const key = arrayFuncMatch[2];
                const value = arrayFuncMatch[3];
                
                if (func === 'find') {
                  result.arrayIndices!.push((list: any[], x: any) => list.find(e => e[key] === x));
                } else if (func === 'filter') {
                  result.arrayIndices!.push((list: any[], x: any) => list.filter(e => e[key] === x));
                }
              } else {
                const indexValue = arrayIndex.match(/\[([0-9]+)\]/);
                if (indexValue) {
                  result.arrayIndices!.push(parseInt(indexValue[1], 10));
                }
              }
            }
          }
        });

        return result;
      }
    }

    // Handle plain string
    return {
      type: 'string',
      value: input
    };
  }

  throw new Error('Input did not match expected pattern');
}

// Examples
// console.log(analyzeData('{endpoints.fetchUser}')); // { type: 'endpoints', properties: ['fetchUser'] }
// console.log(analyzeData('{user[4].name}')); // { type: 'user', arrayIndices: [4], properties: ['name'] }
// console.log(analyzeData('{user[4].tags[8].id}')); // { type: 'user', arrayIndices: [4, 8], properties: ['tags', 'id'] }
// console.log(analyzeData('{user[find:name=x]}')); // { type: 'user', arrayIndices: [(list, x) => list.find(e => e.name === x)] }
// console.log(analyzeData('/[a-zA-Z]+/gi')); // { type: 'regexp', value: /[a-zA-Z]+/gi }
// console.log(analyzeData('bob')); // { type: 'string', value: 'bob' }
// console.log(analyzeData(7)); // { type: 'number', value: 7 }
