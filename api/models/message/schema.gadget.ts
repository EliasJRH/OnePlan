import type { GadgetModel } from "gadget-server";

// This file describes the schema for the "message" model, go to https://oneplan.gadget.app/edit to view/edit your model in Gadget
// For more information on how to update this file http://docs.gadget.dev

export const schema: GadgetModel = {
  type: "gadget/model-schema/v1",
  storageKey: "TKP5arnc8kqU",
  fields: {
    content: {
      type: "string",
      validations: { required: true },
      storageKey: "TKP5arnc8kqU-content",
    },
    event: {
      type: "belongsTo",
      parent: { model: "event" },
      storageKey: "e4omZmfSRKcw",
    },
    user: {
      type: "belongsTo",
      parent: { model: "user" },
      storageKey: "pBfh7RVRbHk-",
    },
  },
};
