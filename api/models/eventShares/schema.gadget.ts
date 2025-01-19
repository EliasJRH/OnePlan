import type { GadgetModel } from "gadget-server";

// This file describes the schema for the "eventShares" model, go to https://oneplan.gadget.app/edit to view/edit your model in Gadget
// For more information on how to update this file http://docs.gadget.dev

export const schema: GadgetModel = {
  type: "gadget/model-schema/v1",
  storageKey: "AZeO4I3KasfZ",
  fields: {
    event: {
      type: "belongsTo",
      parent: { model: "event" },
      storageKey: "WHIBAoX7zlBu",
    },
    user: {
      type: "belongsTo",
      parent: { model: "user" },
      storageKey: "g3VuFLZIT830",
    },
  },
};
