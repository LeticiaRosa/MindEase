const { getDefaultConfig } = require("expo/metro-config");
const path = require("path");

const projectRoot = __dirname;
const workspaceRoot = path.resolve(projectRoot, "../..");

const config = getDefaultConfig(projectRoot);

// 1. Watch all workspace packages so Metro sees changes in @repo/*
config.watchFolders = [workspaceRoot];

// 2. Resolve modules from the project root first, then the workspace root
config.resolver.nodeModulesPaths = [
  path.resolve(projectRoot, "node_modules"),
  path.resolve(workspaceRoot, "node_modules"),
];

// 3. Enable package.json `exports` field resolution (Metro >= 0.81 / Expo SDK 52)
config.resolver.unstable_enablePackageExports = true;

module.exports = config;
