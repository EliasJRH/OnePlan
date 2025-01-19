import type { GadgetModel } from "gadget-server";

// This file describes the schema for the "user" model, go to https://oneplan.gadget.app/edit to view/edit your model in Gadget
// For more information on how to update this file http://docs.gadget.dev

export const schema: GadgetModel = {
  type: "gadget/model-schema/v1",
  storageKey: "jgNtsM2sNNs8",
  fields: {
    createdEvents: {
      type: "hasMany",
      children: { model: "event", belongsToField: "createdBy" },
      storageKey: "teddF78zl-_8",
    },
    email: {
      type: "email",
      validations: { required: true, unique: true },
      storageKey: "TC_NIkyuguip",
    },
    emailVerificationToken: {
      type: "string",
      storageKey: "IjcLYY3mR6mM",
    },
    emailVerificationTokenExpiration: {
      type: "dateTime",
      includeTime: true,
      storageKey: "LhrF5Kn20J-U",
    },
    emailVerified: {
      type: "boolean",
      default: false,
      storageKey: "r8VuceGs8Yus",
    },
    firstName: { type: "string", storageKey: "Yb5bGgz0bkkS" },
    googleImageUrl: { type: "url", storageKey: "s6XEUT-eFXlu" },
    googleProfileId: { type: "string", storageKey: "OdWQNcG7MXWt" },
    lastName: { type: "string", storageKey: "gj7pe0WUGh8Y" },
    lastSignedIn: {
      type: "dateTime",
      includeTime: true,
      storageKey: "0fK3fK3riSuN",
    },
    messages: {
      type: "hasMany",
      children: { model: "message", belongsToField: "user" },
      storageKey: "iQVtMEhAKvfb",
    },
    password: {
      type: "password",
      validations: { strongPassword: true },
      storageKey: "YEtSdl7dyqaV",
    },
    phoneNumber: {
      type: "string",
      validations: {
        regex: [
          "^(\\+\\d{1,2}\\s)?\\(?\\d{3}\\)?[\\s.-]\\d{3}[\\s.-]\\d{4}$",
        ],
      },
      storageKey: "DicDt3UOqAPQ",
    },
    resetPasswordToken: {
      type: "string",
      storageKey: "Ib57ZypbmXu1",
    },
    resetPasswordTokenExpiration: {
      type: "dateTime",
      includeTime: true,
      storageKey: "N4NC4unMdSNm",
    },
    roles: {
      type: "roleList",
      default: ["unauthenticated"],
      storageKey: "ob1PXVkFq5Hh",
    },
    sharedEvents: {
      type: "hasManyThrough",
      sibling: { model: "event", relatedField: "userShares" },
      join: {
        model: "eventShares",
        belongsToSelfField: "user",
        belongsToSiblingField: "event",
      },
      storageKey: "65YBKArF4gJh",
    },
  },
};
