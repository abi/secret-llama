import { Model, MODEL_DESCRIPTIONS } from "../models";

let request: IDBOpenDBRequest;
let db: IDBDatabase;
let version = 1;
let storeName = "urls";

export const initDB = (dbName: string): Promise<boolean> => {
  return new Promise((resolve) => {
    // open the connection
    request = indexedDB.open(dbName);

    request.onupgradeneeded = () => {
      db = request.result;
    };

    request.onsuccess = () => {
      db = request.result;
      version = db.version;
      console.log("request.onsuccess - initDB", version);
      resolve(true);
    };

    request.onerror = () => {
      console.log("Error in initDB");
      resolve(false);
    };
  });
};

const getStore = (storeName: string) => {
  const transaction = db.transaction([storeName], "readwrite");
  const objectStore = transaction.objectStore(storeName);
  return objectStore;
};

const deleteKey = (objectStore: IDBObjectStore, key: string) => {
  return new Promise((resolve, reject) => {
    const request = objectStore.delete(key);
    request.onsuccess = () => resolve("Deleted key");
    request.onerror = () => reject(request.error);
  });
};

export const deleteConfig = (model: Model) => {
  return new Promise((resolve, reject) => {
    // Initialize the database
    initDB("webllm/config")
      .then((res) => {
        console.log("res", res);
        if (res) {
          const objectStore = getStore(storeName);
          // Perform the key deletion
          deleteKey(
            objectStore,
            `https://huggingface.co/mlc-ai/${MODEL_DESCRIPTIONS[model].dbName}-MLC/resolve/main/mlc-chat-config.json`
          )
            .then((result) => {
              console.log(result);
              resolve("Config deleted successfully.");
            })
            .catch((error) => {
              reject("Failed to delete config: " + error);
            });
        } else {
          reject("Failed to initialize database");
        }
      })
      .catch((error) => {
        reject("Database initialization failed: " + error);
      });
  });
};

export const deleteModel = (model: Model) => {
  return new Promise((resolve, reject) => {
    initDB("webllm/model").then((res) => {
      if (res) {
        const objectStore = getStore(storeName);

        const getAllKeysRequest = objectStore.getAllKeys();
        getAllKeysRequest.onsuccess = () => {
          const keys = getAllKeysRequest.result;
          const shardPattern = new RegExp(`${MODEL_DESCRIPTIONS[model].dbName}`);

          const keysToDelete = keys.filter((key) =>
            shardPattern.test(String(key))
          );

          Promise.all(
            keysToDelete.map((key) => deleteKey(objectStore, String(key)))
          )
            .then(() => resolve("All matching keys deleted successfully."))
            .catch((error) => {
              console.error("Error deleting one or more keys: ", error);
              reject("Failed to delete one or more keys");
            });
        };
        getAllKeysRequest.onerror = () => {
          reject("Failed to retrieve keys");
        };
        const request = objectStore.delete(
          `https://huggingface.co/mlc-ai/${MODEL_DESCRIPTIONS[model].dbName}-MLC/resolve/main/ndarray-cache.json`
        );
        request.onsuccess = () => {
          resolve(request.result);
        };

        request.onerror = () => {
          console.log("Error fetching keys: ", request.error);
          reject("Failed to fetch keys");
        };
      } else {
        reject("Failed to initialize database");
      }
    });
  });
};

export const deleteWASM = (model: Model) => {
  return new Promise((resolve, reject) => {
    // Ensure the database is open and available
    if (!db) {
      reject("Database not initialized");
      return;
    }

    initDB("webllm/wasm").then((res) => {
      if (res) {
        const objectStore = getStore(storeName);
        const request = objectStore.delete(
          `https://raw.githubusercontent.com/mlc-ai/binary-mlc-llm-libs/main/web-llm-models/v0_2_34/${MODEL_DESCRIPTIONS[model].dbName}-ctx1k-webgpu.wasm`
        );
        request.onsuccess = () => {
          resolve(request.result);
        };

        request.onerror = () => {
          console.log("Error fetching keys: ", request.error);
          reject("Failed to fetch keys");
        };
      }
    });
  });
};
