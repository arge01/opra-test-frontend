const fs = require('fs');
const path = require('path');

function walk(dir) {
  let results = [];
  const list = fs.readdirSync(dir);
  list.forEach(file => {
    file = path.join(dir, file);
    const stat = fs.statSync(file);
    if (stat && stat.isDirectory()) {
      results = results.concat(walk(file));
    } else {
      if (file.endsWith('.ts')) results.push(file);
    }
  });
  return results;
}

const files = walk('src/api');
files.forEach(f => {
  let content = fs.readFileSync(f, 'utf8');
  content = content.replace(/(import|export) (.*?) from ['"](.*?)['"]/g, (match, p1, p2, p3) => {
    return `${p1} ${p2} from '${p3.replace(/\\\\/g, '/').replace(/\\/g, '/')}'`;
  });
  fs.writeFileSync(f, content);
});

function rep(f, a, b) {
  const p = 'src/api/' + f;
  if (!fs.existsSync(p)) return;
  fs.writeFileSync(p, fs.readFileSync(p, 'utf8').split(a).join(b));
}

rep('OpraTest.ts', '../api/', './api/');
['Auth', 'Product', 'Purchase', 'User'].forEach(n => {
  rep(`api/${n}Controller.ts`, '../../../../http-controller-node', '../http-controller-node');
  rep(`api/${n}Controller.ts`, './models/types/', '../models/types/');
});
rep('models/index.ts', './models/types/', './types/');
['Product', 'Purchase', 'User', 'LoginInput', 'LoginResponse'].forEach(n => {
  rep(`models/types/${n}Type.ts`, './references/', '../../references/');
});
rep('references/OpraBuiltInTypes/models/index.ts', './references/OpraBuiltInTypes/models/types/', './types/');
rep('references/OpraBuiltInTypes/models/index.ts', './references/OpraBuiltInTypes/simple-types', '../simple-types');

