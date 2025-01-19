// Sets up the API client for interacting with your backend. 
// For your API reference, visit: https://docs.gadget.dev/api/oneplan
import { Client } from "@gadget-client/oneplan";

export const api = new Client({ environment: window.gadgetConfig.environment });
