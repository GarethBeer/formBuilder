# AZURE STORAGE API

[[_TOC_]]

## CURRENT RESOURCES
- **Resource group:** PlaygroundRG
- **Function App:** azure-storage-api
- **API URL:** https://azure-storage-api.azurewebsites.net
- **Storage account:** poducts
- **Storage Contairer Name for blobs:** storage-api

## GET STARTED

1. Clone repo
    ```sh
    https://redOpalAzure@dev.azure.com/redOpalAzure/Playground/_git/azure-storage-api
   ```
1. NPM install dependencies

   ```sh
    npm install
   ```
1. Download Remote Settings
   ```sh
    Navigate to Azure extentnion > Resources > Subscription > Function App > Choose the Function App > Right Click on Application Settings
   ```

1. Change **AZURE_STORAGE_CONNECTION_STRING**

    ```bash
    local.settings.json
    ```
    - The **Connection string** Can be find on Storage Blade >  Access keys

1. Change **STORAGE_CONTAINER_NAME**
    ```bash
    local.settings.json
    ```
    - Your Development Storage Container name 

1. Upload Local Settings

   ```sh
    Navigate to Azure extentnion > Resources > Subscription > Function App > Choose the Function App > Right Click on Application Settings
   ```


---




## Dependencies

```bash
devDependencies: 
    "@azure/functions": "^2.0.0",
    "@types/node": "^17.0.35",
    "typescript": "^4.0.0"
```    

```bash
dependencies:
    "@azure/storage-blob": "^12.10.0",
    "dayjs": "^1.11.2"
```
---
## Local Comands
```bash
func start
```
---
## Project structure

```bash
azure-storage-api
├─ .funcignore
├─ .gitignore
├─ .vscode
├─ README.md
├─ StorageBlob-create
├─ StorageBlob-delete
├─ StorageBlob-get
├─ StorageBlob-list
├─ StorageContainer-create
├─ StorageContainer-delete
├─ StorageContainer-list
├─ host.json
├─ package-lock.json
├─ package.json
├─ shared
│  ├─ config.ts
│  ├─ index.ts
│  └─ storage-service.ts
└─ tsconfig.json
```
## Business Logic 

```bash
storage-service.ts
```

---

## Functions
```bash
  StorageBlob-create: [POST] http://localhost:7071/api/blob/{id}
```
 - Creates a new block blob, or updates the content of an existing block blob. Updating an existing block blob overwrites any existing metadata on the blob. Partial updates are not supported; the content of the existing blob is overwritten with the new content

- **id:** 2023
 - **body:**

 ```bash
[
    {
     "id": "685b6d3d-ffc8-43dc-ac93-34768bfa272e",
     "eventTime": "2022-01-05T11:01:12.802Z",
     "eventTopic": "rodevsheeventhubs.events",
     "data": {
       "path": "data:2021.Audit:576d7a29-ab68-4e9e-b15c-01010a8ac916",
       "Audit": [
                    {
                    "Id": "576d7a29-ab68-4e9e-b15c-01010a8ac916",
                    "AUDIT_PLANNED_DATE": "2023-27-05",
                    "AUDIT_LOCATION": "",
                    "AUDIT_AUDITOR": "azure@red-opal.com",
                    "AUDIT_KEY_CONTACT": "azure@red-opal.com",
                    }
                ]
           }
    }
]
```

```bash
StorageBlob-delete: [DELETE] http://localhost:7071/api/blob/:{id}
```
- **id:** 2021

```bash
StorageBlob-get: [GET] http://localhost:7071/api/blob/:{id}
```
 - **id:** 2021

```bash
StorageBlob-list: [GET] http://localhost:7071/api/blob-list
```     

```bash
StorageBlob-anyList: [GET] http://localhost:7071/api/blob-anylist/{id}
```  
 - **id:** products    
```bash
StorageContainer-create: [POST] http://localhost:7071/api/container/:{id}
```        
  - **id:** Random Name

```bash
StorageContainer-delete: [DELETE] http://localhost:7071/api/container/:{id}
```        
 - **id:** Container Name

```bash
StorageContainer-list: [GET] http://localhost:7071/api/container-list
```        

---



## TO DO

- [x] azure key vault - partial
- [ ] authLevel change to function
- [ ] function for storing images
- [ ] function for storing multiple data without overwriting previus data


