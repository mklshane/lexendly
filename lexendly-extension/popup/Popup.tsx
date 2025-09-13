import { useState, useEffect } from "react";
import { Settings } from "../src/types/settings";

export default function Popup() {
  const [settings, setSettings] = useState<Settings>({
    font: "Arial",
    fontSize: 16,
    bgColor: "#fdf6e3",
  });

  useEffect(() => {
    chrome.storage.sync.get("settings", (data) => {
      if (data.settings) setSettings(data.settings);
    });
  }, []);

  const saveSettings = () => {
    chrome.storage.sync.set({ settings });
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      if (tabs[0].id) {
        chrome.scripting.executeScript({
          target: { tabId: tabs[0].id },
          func: applySettings,
          args: [settings],
        });
      }
    });
  };

  return (
    <div className="p-3 w-64 font-sans">
      <h3 className="font-bold mb-2">Dyslexia Settings</h3>

      <label className="block mb-2">
        Font:
        <select
          value={settings.font}
          onChange={(e) => setSettings({ ...settings, font: e.target.value })}
          className="w-full mt-1"
        >
          <option value="OpenDyslexic">OpenDyslexic</option>
          <option value="Lexend">Lexend</option>
          <option value="Arial">Arial</option>
        </select>
      </label>

      <label className="block mb-2">
        Font Size:
        <input
          type="number"
          value={settings.fontSize}
          min={12}
          max={48}
          onChange={(e) =>
            setSettings({ ...settings, fontSize: Number(e.target.value) })
          }
          className="w-full mt-1"
        />
      </label>

      <label className="block mb-2">
        Background Color:
        <input
          type="color"
          value={settings.bgColor}
          onChange={(e) =>
            setSettings({ ...settings, bgColor: e.target.value })
          }
          className="w-full mt-1"
        />
      </label>

      <button
        onClick={saveSettings}
        className="bg-blue-600 text-white px-3 py-1 rounded mt-3 w-full"
      >
        Apply
      </button>
    </div>
  );
}

function applySettings(settings: Settings) {
  document.body.style.fontFamily = settings.font;
  document.body.style.fontSize = settings.fontSize + "px";
  document.body.style.backgroundColor = settings.bgColor;
}
