const path = require('path');
const { getDefaultConfig } = require('expo/metro-config');

/** @type {import('expo/metro-config').MetroConfig} */
const config = getDefaultConfig(__dirname);

const blockList = [
  new RegExp(`${path.resolve(__dirname, 'api').replace(/[/\\]/g, '[/\\\\]')}[/\\\\].*`),
  new RegExp(`${path.resolve(__dirname, 'server').replace(/[/\\]/g, '[/\\\\]')}[/\\\\].*`),
];
const previous = config.resolver.blockList;
config.resolver.blockList = previous
  ? [previous, ...blockList].flat()
  : blockList;

module.exports = config;
