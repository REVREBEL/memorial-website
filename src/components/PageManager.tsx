import { useState } from "react";
import type { WebflowPage } from "../types";

interface PageConfig {
  isVisible: boolean;
  displayName?: string;
  description?: string;
  isOptional?: boolean;
}

interface PageManagerProps {
  pages: WebflowPage[];
  initialSettings?: Record<string, PageConfig>;
}

export default function PageManager({
  pages,
  initialSettings,
}: PageManagerProps) {
  const [settings, setSettings] = useState<Record<string, PageConfig>>(() => {
    // Merge all pages with any existing settings
    const merged: Record<string, PageConfig> = {};
    for (const page of pages) {
      merged[page.id] =
        initialSettings && initialSettings[page.id]
          ? initialSettings[page.id]
          : {
              isVisible: true,
              displayName: page.title,
              description: "",
              isOptional: false,
            };
    }
    return merged;
  });

  const [isSaving, setIsSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);

  const handleSave = async () => {
    setIsSaving(true);
    setSaveError(null);

    try {
      const response = await fetch(
        `${import.meta.env.BASE_URL}/api/admin/save-page-settings`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(settings),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to save settings");
      }

      // Dispatch custom event for toast notification
      window.dispatchEvent(
        new CustomEvent("toast", {
          detail: { message: "Settings saved successfully", type: "success" },
        })
      );
    } catch (error) {
      setSaveError(error instanceof Error ? error.message : "Failed to save");
      window.dispatchEvent(
        new CustomEvent("toast", {
          detail: {
            message: error instanceof Error ? error.message : "Failed to save",
            type: "error",
          },
        })
      );
    } finally {
      setIsSaving(false);
    }
  };

  const updatePageSetting = (pageId: string, updates: Partial<PageConfig>) => {
    setSettings((prev) => ({
      ...prev,
      [pageId]: {
        ...prev[pageId],
        ...updates,
      },
    }));
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-xl font-semibold text-base-content">
            Page Settings
          </h2>
          <p className="text-sm text-base-content/70 mt-1">
            Configure which pages appear in your documentation and how they are
            organized.
          </p>
        </div>
        <button
          onClick={handleSave}
          disabled={isSaving}
          className={`btn btn-primary ${isSaving ? "loading" : ""}`}
        >
          {isSaving ? "Saving..." : "Save Changes"}
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="table w-full">
          <thead>
            <tr>
              <th>Page Title</th>
              <th className="w-48">
                <div className="flex items-center gap-2">
                  <span>Settings</span>
                  <div
                    className="tooltip tooltip-right"
                    data-tip="Control page visibility and organization"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      className="w-4 h-4 stroke-current opacity-50"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                      ></path>
                    </svg>
                  </div>
                </div>
              </th>
            </tr>
          </thead>
          <tbody>
            {pages.map((page) => (
              <tr key={page.id} className="hover">
                <td className="font-medium">{page.title}</td>
                <td>
                  <div className="flex items-center gap-6">
                    <label className="label cursor-pointer gap-2">
                      <span className="label-text">Visible</span>
                      <input
                        type="checkbox"
                        checked={settings[page.id]?.isVisible ?? true}
                        onChange={(e) =>
                          updatePageSetting(page.id, {
                            isVisible: e.target.checked,
                          })
                        }
                        className="checkbox checkbox-primary checkbox-sm"
                      />
                    </label>
                    <label className="label cursor-pointer gap-2">
                      <span className="label-text">Optional</span>
                      <input
                        type="checkbox"
                        checked={settings[page.id]?.isOptional ?? false}
                        onChange={(e) =>
                          updatePageSetting(page.id, {
                            isOptional: e.target.checked,
                          })
                        }
                        className="checkbox checkbox-secondary checkbox-sm"
                      />
                    </label>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-6 p-4 bg-base-200 rounded-lg">
        <h3 className="font-medium mb-2">About these settings:</h3>
        <ul className="list-disc list-inside space-y-1 text-sm text-base-content/70">
          <li>
            <strong>Visible:</strong> When checked, the page will appear in your
            documentation
          </li>
          <li>
            <strong>Optional:</strong> When checked, the page will be listed
            under "Optional Pages" in your documentation
          </li>
        </ul>
      </div>
    </div>
  );
}
