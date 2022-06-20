import { AzureFunction, Context, HttpRequest } from "@azure/functions"
import { storageService } from "../shared";

const httpTrigger: AzureFunction = async function (context: Context, req: HttpRequest): Promise<void> {


  context.req.body = context.bindings.getStorage;
    await storageService.getBlob(context)
};

export default httpTrigger;

