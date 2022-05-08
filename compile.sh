#!/bin/env sh

# Switch the buttercup.ts shim file to use the version without types, because the version with types
# ( which helps for IDE support ) doesn't work when compiling due to module resolution issues.
echo 'import buttercup from "./buttercup_without_types.ts";' > lib/buttercup.ts
echo 'export default buttercup;' >> lib/buttercup.ts

rm -f bcup
deno compile --no-check=remote --output bcup mod.ts

# Switch the buttercup.ts file back to normal
echo 'import buttercup from "./buttercup_without_types.ts";' > lib/buttercup.ts
echo 'export default buttercup;' >> lib/buttercup.ts
