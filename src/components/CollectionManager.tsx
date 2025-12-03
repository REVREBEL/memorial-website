/**
 * CollectionManager component handles the management of Webflow collections
 * and their field exposure settings. It provides a UI for controlling which collections
 * and fields are visible to the public API.
 */

import { useState, useEffect } from "react";
import type {
  WebflowCollection,
  WebflowCollectionField,
  WebflowCollectionSchema,
} from "../types";

/**
 * Props for the CollectionManager component
 * @interface CollectionManagerProps
 * @property {WebflowCollection[]} collections - Array of Webflow collections
 * @property {Object} initialSettings - Initial settings for collections and their fields
 * @property {Record<string, CollectionSetting>} initialSettings.collections - Collection settings keyed by collection ID
 */
interface CollectionManagerProps {
  collections: WebflowCollection[];
  initialSettings: {
    collections: Record<
      string,
      {
        id: string;
        displayName?: string;
        description?: string;
        isVisible?: boolean;
        fields: Record<
          string,
          {
            include: boolean;
            displayName?: string;
            description?: string;
          }
        >;
      }
    >;
  };
}

/**
 * CollectionManager Component
 *
 * This component provides an interface for managing Webflow collections and their field visibility.
 * It allows users to:
 * - Toggle collection visibility
 * - Set custom display names and descriptions for collections
 * - Control field-level visibility
 * - Set custom display names and descriptions for fields
 *
 * @component
 * @param {CollectionManagerProps} props - Component props
 * @returns {JSX.Element} Rendered component
 */
export default function CollectionManager({
  collections,
  initialSettings,
}: CollectionManagerProps) {
  console.log("CollectionManager rendered with props:", {
    collections,
    initialSettings,
  });

  const [settings, setSettings] = useState(() => {
    // Initialize settings with empty field objects for all collections
    const initializedSettings = {
      collections: { ...initialSettings.collections },
    };

    // Ensure each collection has a fields object
    collections.forEach((collection) => {
      if (!initializedSettings.collections[collection.id]) {
        initializedSettings.collections[collection.id] = {
          id: collection.id,
          isVisible: false,
          fields: {},
        };
      } else if (!initializedSettings.collections[collection.id].fields) {
        initializedSettings.collections[collection.id].fields = {};
      }
    });

    return initializedSettings;
  });

  // State for the currently selected collection (for modal)
  const [selectedCollection, setSelectedCollection] = useState<string | null>(
    null
  );

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Log when component mounts or collections prop changes
  useEffect(() => {
    console.log("Component mounted or collections changed:", collections);
  }, [collections]);

  // Register a custom event for external save triggers (e.g., from Astro page)
  useEffect(() => {
    const event = new CustomEvent("collection-manager-mounted", {
      detail: {
        /**
         * Save handler for external triggers
         * @returns {Promise<{success: boolean, error?: string}>}
         */
        handleSave: async () => {
          setIsSaving(true);
          setError(null);

          try {
            const response = await fetch(
              `${import.meta.env.BASE_URL}/api/admin/save-exposure-settings`,
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

            const result = (await response.json()) as {
              success: boolean;
              error?: string;
            };
            if (!result.success) {
              throw new Error(result.error || "Failed to save settings");
            }

            setIsModalOpen(false);
            return result;
          } catch (error) {
            console.error("Error saving settings:", error);
            setError("Failed to save settings. Please try again.");
            throw error;
          } finally {
            setIsSaving(false);
          }
        },
      },
    });
    window.dispatchEvent(event);
  }, [settings]);

  /**
   * Handler for clicking a collection card. Opens the modal and sets the selected collection.
   * @param collectionId - The ID of the collection to configure
   */
  const handleCollectionClick = (collectionId: string) => {
    console.log("Collection clicked:", collectionId);
    console.log("Current state before click:", {
      selectedCollection,
      isModalOpen,
      searchTerm,
      error,
    });

    setSelectedCollection(collectionId);
    setIsModalOpen(true);
    setSearchTerm("");
    setError(null);

    console.log("State updates triggered");
  };

  /**
   * Toggle the inclusion of a field for the selected collection
   * @param fieldId - The ID of the field to toggle
   */
  const handleFieldToggle = (fieldId: string) => {
    if (!selectedCollection) return;
    console.log("Toggling field:", fieldId);

    setSettings((prev) => {
      const newSettings = {
        collections: {
          ...prev.collections,
          [selectedCollection]: {
            ...prev.collections[selectedCollection],
            fields: {
              ...prev.collections[selectedCollection]?.fields,
              [fieldId]: {
                ...prev.collections[selectedCollection]?.fields[fieldId],
                include:
                  !prev.collections[selectedCollection]?.fields[fieldId]
                    ?.include,
              },
            },
          },
        },
      };
      console.log("Updated settings:", newSettings);
      return newSettings;
    });
  };

  /**
   * Update the description for a field in the selected collection
   * @param fieldId - The ID of the field
   * @param description - The new description
   */
  const handleFieldDescriptionChange = (
    fieldId: string,
    description: string
  ) => {
    if (!selectedCollection) return;

    setSettings((prev) => ({
      collections: {
        ...prev.collections,
        [selectedCollection]: {
          ...prev.collections[selectedCollection],
          fields: {
            ...prev.collections[selectedCollection]?.fields,
            [fieldId]: {
              ...prev.collections[selectedCollection]?.fields[fieldId],
              description,
            },
          },
        },
      },
    }));
  };

  /**
   * Update the display name for a field in the selected collection
   * @param fieldId - The ID of the field
   * @param displayName - The new display name
   */
  const handleFieldDisplayNameChange = (
    fieldId: string,
    displayName: string
  ) => {
    if (!selectedCollection) return;

    setSettings((prev) => ({
      collections: {
        ...prev.collections,
        [selectedCollection]: {
          ...prev.collections[selectedCollection],
          fields: {
            ...prev.collections[selectedCollection]?.fields,
            [fieldId]: {
              ...prev.collections[selectedCollection]?.fields[fieldId],
              displayName,
            },
          },
        },
      },
    }));
  };

  /**
   * Save handler for the modal's Save button
   */
  const handleSave = async () => {
    try {
      setIsSaving(true);
      setError(null);

      const response = await fetch(
        `${import.meta.env.BASE_URL}/api/admin/save-exposure-settings`,
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

      setIsModalOpen(false);
    } catch (error) {
      console.error("Error saving settings:", error);
      setError("Failed to save settings. Please try again.");
    } finally {
      setIsSaving(false);
    }
  };

  /**
   * Toggle the visibility of a collection in the main list
   * @param collectionId - The ID of the collection
   */
  const handleCollectionVisibilityToggle = (collectionId: string) => {
    setSettings((prev) => ({
      collections: {
        ...prev.collections,
        [collectionId]: {
          ...prev.collections[collectionId],
          isVisible: !prev.collections[collectionId]?.isVisible,
        },
      },
    }));
  };

  // Filter fields in the modal based on the search term
  const filteredFields = collections
    .find((c) => c.id === selectedCollection)
    ?.fields.filter(
      (field) =>
        field.displayName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        field.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        field.type.toLowerCase().includes(searchTerm.toLowerCase())
    );

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Collection Manager</h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {collections.map((collection) => {
          const collectionSettings = settings.collections[collection.id] || {
            id: collection.id,
            isVisible: false,
            fields: {},
          };

          const exposedFieldsCount = Object.values(
            collectionSettings.fields || {}
          ).filter((f) => f?.include).length;

          return (
            <div
              key={collection.id}
              className="card bg-base-100 shadow-xl hover:shadow-2xl transition-shadow"
            >
              <div className="card-body">
                <div className="flex justify-between items-start">
                  <h2 className="card-title">
                    {collection.displayName || collection.name}
                  </h2>
                  <input
                    type="checkbox"
                    className="toggle toggle-primary"
                    checked={collectionSettings.isVisible || false}
                    onChange={(e) => {
                      e.stopPropagation();
                      handleCollectionVisibilityToggle(collection.id);
                    }}
                  />
                </div>
                <p className="text-sm opacity-70">
                  {collection.itemCount} items
                </p>
                <p className="text-sm opacity-70">
                  {exposedFieldsCount} fields exposed
                </p>
                <div className="card-actions justify-end mt-4">
                  <button
                    className="btn btn-primary btn-sm"
                    onClick={() => handleCollectionClick(collection.id)}
                  >
                    Configure Fields
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {isModalOpen && selectedCollection && (
        <div className="modal modal-open">
          <div className="modal-box w-11/12 max-w-5xl">
            <h3 className="font-bold text-lg mb-4">
              {collections.find((c) => c.id === selectedCollection)
                ?.displayName || "Collection Fields"}
            </h3>

            {error && (
              <div className="alert alert-error mb-4">
                <div className="flex-1">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    className="w-6 h-6 mx-2 stroke-current"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636"
                    ></path>
                  </svg>
                  <label>{error}</label>
                </div>
              </div>
            )}

            {isLoading ? (
              <div className="flex justify-center items-center p-8">
                <div className="loading loading-spinner loading-lg"></div>
              </div>
            ) : (
              (() => {
                const collection = collections.find(
                  (c) => c.id === selectedCollection
                );
                if (!collection) {
                  return (
                    <div className="alert alert-error mb-4">
                      <label>Collection not found.</label>
                    </div>
                  );
                }
                // Filter fields in the modal based on the search term
                const filteredFields = collection.fields.filter(
                  (field) =>
                    field.displayName
                      .toLowerCase()
                      .includes(searchTerm.toLowerCase()) ||
                    field.name
                      .toLowerCase()
                      .includes(searchTerm.toLowerCase()) ||
                    field.type.toLowerCase().includes(searchTerm.toLowerCase())
                );
                return (
                  <>
                    <div className="form-control w-full mb-4">
                      <input
                        type="text"
                        placeholder="Search fields..."
                        className="input input-bordered w-full"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                      />
                    </div>
                    <div className="overflow-y-auto max-h-[60vh]">
                      <table className="table w-full">
                        <thead>
                          <tr>
                            <th>Field</th>
                            <th>Type</th>
                            <th>Custom Display Name</th>
                            <th>Description</th>
                            <th>Visible</th>
                          </tr>
                        </thead>
                        <tbody>
                          {filteredFields.map((field) => (
                            <tr key={field.id}>
                              <td className="whitespace-nowrap">
                                {field.displayName || field.name}
                              </td>
                              <td className="whitespace-nowrap">
                                {field.type}
                              </td>
                              <td>
                                <input
                                  type="text"
                                  className="input input-bordered input-sm w-full"
                                  value={
                                    settings.collections[selectedCollection]
                                      ?.fields[field.id]?.displayName || ""
                                  }
                                  onChange={(e) =>
                                    handleFieldDisplayNameChange(
                                      field.id,
                                      e.target.value
                                    )
                                  }
                                  placeholder="Custom display name"
                                />
                              </td>
                              <td>
                                <input
                                  type="text"
                                  className="input input-bordered input-sm w-full"
                                  value={
                                    settings.collections[selectedCollection]
                                      ?.fields[field.id]?.description || ""
                                  }
                                  onChange={(e) =>
                                    handleFieldDescriptionChange(
                                      field.id,
                                      e.target.value
                                    )
                                  }
                                  placeholder="Field description"
                                />
                              </td>
                              <td>
                                <input
                                  type="checkbox"
                                  className="toggle toggle-primary"
                                  checked={
                                    settings.collections[selectedCollection]
                                      ?.fields[field.id]?.include || false
                                  }
                                  onChange={() => handleFieldToggle(field.id)}
                                />
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </>
                );
              })()
            )}

            <div className="modal-action">
              <button
                className="btn"
                onClick={() => setIsModalOpen(false)}
                disabled={isSaving || isLoading}
              >
                Cancel
              </button>
              <button
                className={`btn btn-primary ${isSaving ? "loading" : ""}`}
                onClick={handleSave}
                disabled={isSaving || isLoading || !!error}
              >
                {isSaving ? "Saving..." : "Save Changes"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
