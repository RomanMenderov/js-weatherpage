module.exports = {
  presets: [
    [
      "@babel/preset-env",
      {
        targets: { node: "current" },
        // "targets": "> 0.25%, not dead",
        useBuiltIns: "entry", // alternative mode: "entry"/ "usage"
        corejs: 3, // default would be 2
      },
    ],
  ],
};
