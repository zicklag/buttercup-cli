// This import is a strange workaround to make types work with the language server and the CLI
// because of weirdness in the skypack module resolution

import buttercup from "https://cdn.skypack.dev/pin/buttercup@v6.13.1-dvYuBLgiRYrtGXpUaBM8/mode=imports,min/unoptimized/web/index.js";
export default buttercup;

buttercup.init();

