import { RouteHandler } from "gadget-server";

/**
 * Route handler for GET event-by-user
 *
 * @type { RouteHandler } route handler - see: https://docs.gadget.dev/guides/http-routes/route-configuration#route-context
 */
const route = async ({ request, reply, api, logger, connections }) => {
  let events = await api.event.findMany({filter: {createdBy: {id: {equals: "4"}}}});
  await reply.type("application/json").send({"events":events})
}

export default route;
