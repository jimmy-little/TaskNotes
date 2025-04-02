import { Plugin, TFile } from "obsidian";
import { TaskNoteSettingsTab, DEFAULT_SETTINGS, TaskNoteSettings } from "./settings";

export default class TaskNotePlugin extends Plugin {
  settings: TaskNoteSettings;

  async onload() {
    console.log("Loading TaskNote Plugin...");
    await this.loadSettings();

    this.addSettingTab(new TaskNoteSettingsTab(this.app, this));

    this.registerMarkdownCodeBlockProcessor("tasknote", async (source, el, ctx) => {
      const files = this.app.vault.getMarkdownFiles();
      const lines: string[] = [];

      for (const file of files) {
        const metadata = this.app.metadataCache.getFileCache(file);
        const frontmatter = metadata?.frontmatter;

        if (frontmatter?.type === "task") {
          const title = frontmatter.title || file.basename;
          const done = frontmatter.completed ? true : false;
          const due = frontmatter.due || "";

          if (!done) {
            lines.push(`☐ <strong>${title}</strong> (due: ${due})`);
          } else {
            lines.push(`☑ <strong>${title}</strong> (completed)`);
          }
        }
      }

      el.innerHTML = `<ul>${lines.map(line => `<li>${line}</li>`).join("\n")}</ul>`;
    });
  }

  onunload() {
    console.log("Unloading TaskNote Plugin...");
  }

  async loadSettings() {
    this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData());
  }

  async saveSettings() {
    await this.saveData(this.settings);
  }
}
