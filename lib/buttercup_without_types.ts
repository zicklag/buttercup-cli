// This import is a strange workaround to make types work with the language server and the CLI
// because of weirdness in the skypack module resolution

import buttercup from "https://cdn.skypack.dev/buttercup@6.13.1/web"
export default buttercup ;

buttercup.init();

