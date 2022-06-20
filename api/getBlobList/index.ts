import { AzureFunction, Context, HttpRequest } from "@azure/functions"
import { storageService } from "../shared";

const httpTrigger: AzureFunction = async function (context: Context, req: HttpRequest): Promise<void> {
    await storageService.getBlobAnyList(context)
};

export default httpTrigger;
