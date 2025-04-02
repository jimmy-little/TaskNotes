import { App, PluginSettingTab, Setting } from "obsidian";

export interface TaskNoteSettings {
  trackedFields: string[];
}

export const DEFAULT_SETTINGS: TaskNoteSettings = {
  trackedFields: ["due", "start", "completed", "recurrence"]
};

export class TaskNoteSettingsTab extends PluginSettingTab {
  plugin: any;

  constructor(app: App, plugin: any) {
    super(app, plugin);
    this.plugin = plugin;
  }

  display(): void {
    const { containerEl } = this;

    containerEl.empty();
    containerEl.createEl("h2", { text: "TaskNote Settings" });

    new Setting(containerEl)
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
