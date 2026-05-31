const fs = require('fs');
const path = require('path');

function walk(dir) {
  let results = [];
  if (!fs.existsSync(dir)) return results;
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

function rep(dir, f, a, b) {
  const p = `src/api/${dir}/${f}`;
  if (!fs.existsSync(p)) return;
  fs.writeFileSync(p, fs.readFileSync(p, 'utf8').split(a).join(b));
}

['products', 'cargo'].forEach(dir => {
  rep(dir, 'OpraTest.ts', '../api/', './api/');
  rep(dir, 'OpraCargo.ts', '../api/', './api/');
  ['Auth', 'Product', 'Purchase', 'User', 'Shipment'].forEach(n => {
    rep(dir, `api/${n}Controller.ts`, '../../../../http-controller-node', '../http-controller-node');
    rep(dir, `api/${n}Controller.ts`, './models/types/', '../models/types/');
    rep(dir, `api/${n}Controller.ts`, './models/enums/', '../models/enums/');
  });
  rep(dir, 'models/index.ts', './models/types/', './types/');
  rep(dir, 'models/index.ts', './models/enums/', './enums/');
  ['Product', 'Purchase', 'User', 'LoginInput', 'LoginResponse', 'Shipment'].forEach(n => {
    rep(dir, `models/types/${n}Type.ts`, './references/', '../../references/');
    rep(dir, `models/types/${n}Type.ts`, './models/types/', './');
    rep(dir, `models/types/${n}Type.ts`, './models/enums/', '../enums/');
  });
  rep(dir, 'references/OpraBuiltInTypes/models/index.ts', './references/OpraBuiltInTypes/models/types/', './types/');
  rep(dir, 'references/OpraBuiltInTypes/models/index.ts', './references/OpraBuiltInTypes/simple-types', '../simple-types');
});

