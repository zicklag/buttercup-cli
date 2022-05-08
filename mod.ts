import bcup from "./lib/buttercup.ts";

import { Command } from "https://deno.land/x/cliffy@v0.24.0/command/mod.ts";
import { Secret } from "https://deno.land/x/cliffy@v0.24.0/prompt/mod.ts";

interface Export {
  groups: ExportGroup[];
}

interface ExportGroup {
  title: string;
  groups: ExportGroup[];
  // deno-lint-ignore no-explicit-any
  entries: { [key: string]: any }[];
}

const command = await new Command()
  .name("bcup")
  .version("0.0.0")
  .description("Commandline interface for the Buttercup password manager")
  .command(
    "export",
    "Export a buttercup vault\n\
WARNING: The export an arbitrary, non-standard JSON format for now."
  )
  .arguments("<vault_file:string> <output_file:string>")
  .action(async (_, ...args) => {
    const vaultFilePath = args[0];
    const exportFilePath = args[1];
    const vaultContents = await Deno.readTextFile(vaultFilePath);
    const password: string = await Secret.prompt("Vault Password");

    const dataSourceCredentials = bcup.Credentials.fromDatasource({
      type: "file",
      content: vaultContents,
    });

    const dataSource = new bcup.TextDatasource(dataSourceCredentials);

    const loaded = await dataSource.load(
      bcup.Credentials.fromPassword(password)
    );

    const vault = await bcup.Vault.createFromHistory(loaded.history);

    const exportData: Export = { groups: [] };

    // This is a hack to get the `Group` type without importing it, so that we can keep our
    // buttercup type shims working. See `lib/buttercup.ts`.
    const sampleGroup = vault.getGroups()[0];

    const exportGroup = (group: typeof sampleGroup) => {
      const g: ExportGroup = {
        title: group.getTitle(),
        groups: [],
        entries: [],
      };

      for (const entry of group.getEntries()) {
        g.entries.push(entry.getProperties());
      }

      for (const subGroup of group.getGroups()) {
        g.groups.push(exportGroup(subGroup));
      }

      return g;
    };

    for (const group of vault.getGroups()) {
      exportData.groups.push(exportGroup(group));
    }

    await Deno.writeTextFile(exportFilePath, JSON.stringify(exportData));
  });

if (Deno.args.length == 0) {
  command.showHelp();
} else {
  command.parse(Deno.args);
}
