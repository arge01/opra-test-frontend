const fs = require('fs');

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
