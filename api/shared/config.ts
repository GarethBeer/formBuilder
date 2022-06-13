import { BlobServiceClient } from "@azure/storage-blob";

const StorageConnString = process.env["AZURE_STORAGE_CONNECTION_STRING"]
const storageContainerName = process.env["STORAGE_CONTAINER_NAME"];  

if (!StorageConnString) {
    throw Error("Azure Storage Connection string not found");
  }


const blobServiceClient = BlobServiceClient.fromConnectionString(StorageConnString);
const containers = {
    api: blobServiceClient.getContainerClient(storageContainerName),
    container: blobServiceClient
  };


export default containers;  