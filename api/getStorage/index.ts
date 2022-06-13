import { AzureFunction, Context, HttpRequest } from "@azure/functions"
import { storageService } from "../shared";

const httpTrigger: AzureFunction = async function (context: Context, req: HttpRequest): Promise<void> {
    context.log(`Processed message ----> ${JSON.stringify(context ) }`);
    context.req.body = context.bindings.getBlob
    await storageService.getBlob(context)
};

export default httpTrigger;

