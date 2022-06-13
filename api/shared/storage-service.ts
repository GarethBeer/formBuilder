import { Context } from "@azure/functions";
import containers from "./config";
const dayjs = require('dayjs')


async function getBlob({ req, res }: Context) {
    try {
        const response = await req.body
        res.status(200).json(response)
    } catch (error) {
        res.status(404).send(error)
    }
}


async function deleteBlob({ req, res }: Context) {
    const blockBlobClient = containers.api.getBlockBlobClient(`${req.params.id}`)

    try {
        await blockBlobClient.deleteIfExists()
        const response = `Blob ${req.params.id} was successfully Deleted  😎`
        res.status(200).json(response);
    } catch (error) {
        res.status(500).send(error);
    }
}

async function getBlobList({ req, res }: Context) {
    let blobData: string[] = new Array()

    try {
        for await (const blob of containers.api.listBlobsFlat()) {
            let entry = blob.name
            blobData.push(entry)
        }
        res.status(200).json(blobData)
    } catch (error) {
        res.status(404).send(error)
    }
}


async function getBlobAnyList({ req, res }: Context) {
    const containerClient = containers.container.getContainerClient(`${req.params.id}`)
    let blobData: string[] = new Array()

    try {
        for await (const blob of containerClient.listBlobsFlat()  ) {
            let entry = blob.name
            blobData.push(entry)
        }
        res.status(200).json(blobData)
    } catch (error) {
        res.status(404).send(error)
    }
}

async function createBlob({ req, res }: Context) {
    const blobName = `${req.params.id}_` + new Date().getTime()
    try {
        await containers.api.uploadBlockBlob(blobName, JSON.stringify(req.body), `${req.body}`.length)
        res.status(202).json(req.body);
    } catch (error) {
        res.status(500).send(error);
    }
}


async function createContainer({ req, res }: Context) {
    const containerName = `${req.params.id}-` + new Date().getTime()
    const containerClient = containers.container.getContainerClient(containerName);

    try {
        const createContainerResponse = await containerClient.create();
        console.log(createContainerResponse);
        const response = `Container ${containerName} was successfully created 😎`
        res.status(202).json(response);
    } catch (error) {
        res.status(500).send(error);
    }
}


async function getContainerList({ req, res }: Context) {
    let containerData: string[] = new Array()
    const containerClient = containers.container.listContainers()

    try {
        for await (const container of containerClient) {
            let entry = container.name
            containerData.push(entry)
        }
        res.status(200).json(containerData)
    } catch (error) {
        res.status(500).send(error);
    }
}


async function deleteContainer({ req, res }: Context) {
    const containerName = `${req.params.id}`

    try {
        await containers.container.deleteContainer(containerName)
        const response = `Container ${containerName} was successfully Deleted  😎`
        res.status(200).json(response)
    } catch (error) {
        res.status(500).send(error);
    }
}

export default { getBlob, deleteBlob, getBlobList, getBlobAnyList, createBlob, createContainer, getContainerList, deleteContainer }