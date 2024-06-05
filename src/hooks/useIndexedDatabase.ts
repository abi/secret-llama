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

const deleteKeysByPattern = (objectStore: IDBObjectStore, pattern: RegExp) => {
  return new Promise((resolve, reject) => {
    const getAllKeysRequest = objectStore.getAllKeys();
    getAllKeysRequest.onsuccess = () => {
      const keys = getAllKeysRequest.result;
      const keysToDelete = keys.filter((key) => pattern.test(String(key)));
      Promise.all(
        keysToDelete.map((key) => deleteKey(objectStore, String(key)))
      )
        .then(() => resolve("All matching keys deleted successfully."))
        .catch((error) => reject("Error deleting one or more keys: " + error));
    };
    getAllKeysRequest.onerror = () => reject("Failed to retrieve keys");
  });
};

const deleteItems = (model: Model, dbName: string) => {
  return new Promise((resolve, reject) => {
    initDB(dbName)
      .then((res) => {
        if (res) {
          const objectStore = getStore(storeName);
          const regexPattern = new RegExp(
            `${MODEL_DESCRIPTIONS[model].dbName}`
          );
          deleteKeysByPattern(objectStore, regexPattern)
            .then(resolve)
            .catch(reject);
        } else {
          reject("Failed to initialize database");
        }
      })
      .catch(reject);
  });
};

const deleteConfigDB = (model: Model) => deleteItems(model, "webllm/config");
const deleteModelDB = (model: Model) => deleteItems(model, "webllm/model");
const deleteWASMDB = (model: Model) => deleteItems(model, "webllm/wasm");

export const deleteModel = (model: Model) => {
  return new Promise((resolve, reject) => {
    deleteConfigDB(model)
      .then(() => deleteModelDB(model))
      .then(() => deleteWASMDB(model))
      .then(resolve)
      .catch(reject);
  });
};
