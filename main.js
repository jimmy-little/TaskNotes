'use strict';

var obsidian = require('obsidian');

const DEFAULT_SETTINGS = {
    trackedFields: ["due", "start", "completed", "recurrence"]
};
class TaskNoteSettingsTab extends obsidian.PluginSettingTab {
    constructor(app, plugin) {
        super(app, plugin);
        this.plugin = plugin;
    }
    display() {
        const { containerEl } = this;
        containerEl.empty();
        containerEl.createEl("h2", { text: "TaskNote Settings" });
        new obsidian.Setting(containerEl)
            .setName("Tracked Fields")
            .setDesc("Comma-separated frontmatter fields to track as task metadata.")
            .addText(text => text
            .setPlaceholder("due,start,completed,recurrence")
            .setValue(this.plugin.settings.trackedFields.join(","))
            .onChange(async (value) => {
            this.plugin.settings.trackedFields = value.split(",").map(s => s.trim());
            await this.plugin.saveSettings();
        }));
    }
}

class TaskNotePlugin extends obsidian.Plugin {
    async onload() {
        console.log("Loading TaskNote Plugin...");
        await this.loadSettings();
        this.addSettingTab(new TaskNoteSettingsTab(this.app, this));
        this.registerMarkdownCodeBlockProcessor("tasknote", async (source, el, ctx) => {
            const files = this.app.vault.getMarkdownFiles();
            const lines = [];
            for (const file of files) {
                const metadata = this.app.metadataCache.getFileCache(file);
                const frontmatter = metadata?.frontmatter;
                if (frontmatter?.type === "task") {
                    const title = frontmatter.title || file.basename;
                    const done = frontmatter.completed ? true : false;
                    const due = frontmatter.due || "";
                    if (!done) {
                        lines.push(`☐ <strong>${title}</strong> (due: ${due})`);
                    }
                    else {
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

module.exports = TaskNotePlugin;
//# sourceMappingURL=main.js.map
