import { AzureFunction, Context, HttpRequest } from "@azure/functions"
import { storageService } from "../shared";

const httpTrigger: AzureFunction = async function (context: Context, req: HttpRequest): Promise<void> {
    await storageService.getContainerList(context)
};

export default httpTrigger;
