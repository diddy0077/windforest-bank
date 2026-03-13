const path = require('path');
const fs = require('fs');

// CloudLinux NodeJS Selector workaround
// Create symlink to node_modules if it doesn't exist
const appDir = __dirname;
const nodeModulesLink = path.join(appDir, 'node_modules');

// Check if we're in CloudLinux environment
if (process.env. DocumentRoot) {
  // CloudLinux environment - use system node_modules
  const cloudlinuxModules = '/home/winddyrc/node_modules';
  if (!fs.existsSync(nodeModulesLink) && fs.existsSync(cloudlinuxModules)) {
    try {
      fs.symlinkSync(cloudlinuxModules, nodeModulesLink, 'dir');
    } catch (e) {
      // Ignore if symlink already exists or can't be created
    }
  }
}

const jsonServer = require("json-server");
const server = jsonServer.create();
const router = jsonServer.router(path.join(appDir, "db.json"));
const middlewares = jsonServer.defaults();

server.use(middlewares);
server.use(router);

const PORT = process.env.PORT || 3000;

server.listen(PORT, () => {
  console.log("JSON Server Running on port " + PORT);
});