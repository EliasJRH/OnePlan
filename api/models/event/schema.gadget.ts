import type { GadgetModel } from "gadget-server";

// This file describes the schema for the "event" model, go to https://oneplan.gadget.app/edit to view/edit your model in Gadget
// For more information on how to update this file http://docs.gadget.dev

export const schema: GadgetModel = {
  type: "gadget/model-schema/v1",
  storageKey: "6F0iedXNcwHF",
  fields: {
    createdBy: {
      type: "belongsTo",
      parent: { model: "user" },
      storageKey: "-MajhuOOsvIu",
    },
    description: { type: "string", storageKey: "HHZOVRnuaMqk" },
    headerImage: {
      type: "file",
      allowPublicAccess: false,
      validations: { imagesOnly: true },
      storageKey: "V4cvDh9gX-NX",
    },
    isPublic: {
      type: "boolean",
      default: false,
      validations: { required: true },
      storageKey: "6EXdKIWRvYIL",
    },
    location: { type: "string", storageKey: "xpxiX1_uFUNl" },
    messages: {
      type: "hasMany",
      children: { model: "message", belongsToField: "event" },
      storageKey: "XqplMzzeDIUO",
    },
    name: { type: "string", storageKey: "K9EF0_WU8y2i" },
    tags: {
      type: "enum",
      default: [],
      acceptMultipleSelections: true,
      acceptUnlistedOptions: false,
      options: [
        "Science/Technology",
        "Music",
        "Art",
        "19+",
        "Family Friendly",
        "Sports",
      ],
      storageKey: "RAlIa-LRlmwZ",
    },
    timeEnd: {
      type: "dateTime",
      includeTime: true,
      validations: {
        run: ["api/models/event/validations/validate.js"],
      },
      storageKey: "EDekcIV26uLj",
    },
    timeStart: {
      type: "dateTime",
      includeTime: true,
      storageKey: "V-XYmz4ZsA8Y",
    },
    userShares: {
      type: "hasManyThrough",
      sibling: { model: "user", relatedField: "sharedEvents" },
      join: {
        model: "eventShares",
        belongsToSelfField: "event",
        belongsToSiblingField: "user",
      },
      storageKey: "rcHaZgoawvRp",
    },
  },
};
